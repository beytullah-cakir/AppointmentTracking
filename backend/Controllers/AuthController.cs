using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using RandevuTakip.DTOs;
using RandevuTakip.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RandevuTakip.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(UserManager<User> usermanager,IConfiguration conf) : ControllerBase
    {
        private readonly UserManager<User> _userManager=usermanager;
        private readonly IConfiguration _configuration=conf;
        

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto register)
        {
            var existingUser = await _userManager.FindByEmailAsync(register.Email);
            if(existingUser!=null) return BadRequest("Bu email zaten kayıtlı");
            var user = new User
            {
                UserName = register.Email,
                Email = register.Email,
                FullName = register.FullName
            };
            var result = await _userManager.CreateAsync(user, register.Password);

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);

        }

        [HttpPost("login")]

        public async Task<IActionResult> Login(LoginDto login)
        {
            var user = await _userManager.FindByEmailAsync(login.Email);
            if (user == null) return Unauthorized("Email hatalı");

            var password = await _userManager.CheckPasswordAsync(user, login.Password);
            if (!password) return Unauthorized("Parola hatalı");

            var token= GenerateJwtToken(user);
            return Ok(new { token });

        }

        private string GenerateJwtToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // Token içine kullanıcının Id'sini ve ismini gömüyoruz
            var claims = new[] {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email!),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("FullName", user.FullName)    
            };

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddHours(3), // 3 saat geçerli olsun
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }



    }
}
