using System.ComponentModel.DataAnnotations;

namespace RandevuTakip.DTOs
{
    public class PlaceDto
    {
        [Required] public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }
        [Required] public string Address { get; set; } = string.Empty;

        [Required] public string Category { get; set; } = string.Empty;

        [Required] public string Phone { get; set; } = string.Empty;
    }
}
