using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace RandevuTakip.Models
{
    public class User : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;

        public ICollection<Place> Places { get; set; } = new List<Place>();

        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    }
}
