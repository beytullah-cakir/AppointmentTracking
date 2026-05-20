using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RandevuTakip.Data;
using RandevuTakip.DTOs;
using RandevuTakip.Models;
using System.Security.Claims;

namespace RandevuTakip.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PlaceController(AppDbContext context) : ControllerBase
    {
        private readonly AppDbContext _context = context;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var list = await _context.Places.Where(x => x.UserID == userId).ToListAsync();
            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var userId= User.FindFirstValue(ClaimTypes.NameIdentifier);
            var item = await _context.Places.Where(x => x.UserID == userId && x.Id == id).FirstOrDefaultAsync();
            if(item is null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Create(PlaceDto place)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var newItem = new Place
            {
                Address = place.Address,
                Category = place.Category,
                Description = place.Description,
                Name = place.Name,
                Phone = place.Phone,
                UserID= userId
            };

            await _context.Places.AddAsync(newItem);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId=User.FindFirstValue(ClaimTypes.NameIdentifier);
            var item = await _context.Places.FirstOrDefaultAsync(x => x.UserID == userId && x.Id==id);

            if(item==null) return NotFound();

            _context.Places.Remove(item);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
