using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using Microsoft.AspNetCore.Identity;

namespace DAL.Model
{
    public class UserAccount : IdentityUser
    {
        [Required]
        public string FistName { get; set; }

        [Required]
        public string LastName { get; set; }
        
        [Required]
        public bool IsAdmin { get; set; }
    }
}
