using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RandevuTakip.Models
{
    public class Appointment
    {
        public int Id { get; set; }

        [Required] public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required] public DateTime StartTime { get; set; }

        [Required] public DateTime EndTime { get; set; }

        public bool IsSMSSent { get; set; }

        public string UserID { get; set; } = string.Empty;

        [ForeignKey("UserID")]
        public User User { get; set; } = null!;

        [Required] public int PlaceId { get; set; }

        [ForeignKey("PlaceId")] public Place Place { get; set; } = null!;
    }
}
