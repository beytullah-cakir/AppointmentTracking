using System.ComponentModel.DataAnnotations;
using System.Globalization;

namespace RandevuTakip.DTOs
{
    public class AppointmentDto
    {
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        [Required] public int PlaceId { get; set; }


    }
}
