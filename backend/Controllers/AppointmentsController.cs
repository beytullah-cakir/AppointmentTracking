using Hangfire;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RandevuTakip.Data;
using RandevuTakip.DTOs;
using RandevuTakip.Models;
using RandevuTakip.Services;
using System.Security.Claims;

namespace RandevuTakip.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentsController(AppDbContext context,IAppointmentService appoServices) : ControllerBase
    {
        private readonly AppDbContext _context = context;
        private readonly IAppointmentService _appoServices = appoServices;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var list = await _context.Appointments.Where(x => x.UserID == userId).ToListAsync();
            return Ok(list);
        }


        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AppointmentDto appointment)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId is null) return Unauthorized();

            var place = await _context.Places.AnyAsync(x => x.Id == appointment.PlaceId);
            if (!place) return BadRequest("Place not found");

            var result = await _appoServices.CreateAppointmentAsync(appointment, userId);

            if (!result) return BadRequest("seçilen saatlerde mekan dolu");

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var item = await _context.Appointments.FirstOrDefaultAsync(x => x.Id == id && x.UserID == userId);
            if (item == null) return NotFound();

            _context.Appointments.Remove(item);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
