using Hangfire;
using Microsoft.EntityFrameworkCore;
using RandevuTakip.Data;
using RandevuTakip.DTOs;
using RandevuTakip.Models;

namespace RandevuTakip.Services
{
    public class AppointmentService(AppDbContext context): IAppointmentService
    {
        private readonly AppDbContext _context = context;

        public async Task CompleteTask(int id)
        {
            var item = await _context.Appointments.FindAsync(id);

            if (item == null) return;

            item.IsSMSSent = true;
            await _context.SaveChangesAsync();
        }

        public async Task<bool> CreateAppointmentAsync(AppointmentDto dto, string userId)
        {
            if (dto.EndTime <= dto.StartTime) return false;

            using var transaction = await _context.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);

            try
            {
                var isBusy = await _context.Appointments.AnyAsync(a =>
            a.PlaceId == dto.PlaceId &&
            dto.StartTime < a.EndTime && dto.EndTime > a.StartTime);    

                if (isBusy) return false;

                var newItem = new Appointment
                {
                    Title = dto.Title,
                    Description = dto.Description,
                    StartTime = dto.StartTime,
                    EndTime = dto.EndTime,
                    PlaceId = dto.PlaceId,
                    UserID = userId,
                    IsSMSSent = false,
                };

                _context.Appointments.Add(newItem);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // Hangfire planlaması
                var delay = newItem.EndTime - DateTime.Now;
                if (delay.TotalSeconds > 0)
                    BackgroundJob.Schedule<IAppointmentService>(s => s.CompleteTask(newItem.Id), delay);

                return true;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}
