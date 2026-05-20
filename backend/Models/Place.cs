using System.ComponentModel.DataAnnotations;

namespace RandevuTakip.Models
{
    public class Place
    {
        public int Id { get; set; }

        [Required] public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }
        [Required] public string Address { get; set; } = string.Empty;

        [Required] public string Category { get; set; } = string.Empty;

        [Required] public string Phone { get; set; } = string.Empty;

        public double Rating { get; set; }

        public string UserID { get; set; } = string.Empty;

        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    }
}
