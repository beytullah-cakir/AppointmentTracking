using RandevuTakip.DTOs;

namespace RandevuTakip.Services
{
    public interface IAppointmentService
    {
        Task CompleteTask(int appointment);
        Task<bool> CreateAppointmentAsync(AppointmentDto dto, string userId);
    }
}
