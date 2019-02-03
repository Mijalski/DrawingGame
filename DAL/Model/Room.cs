using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DAL.Model
{
    public class Room
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string KeyCode { get; set; }
        
        [Required]
        public DateTime StartDateTime { get; set; }

        [Required]
        public int PlayerCount { get; set; }

        [Required]
        public bool GameEnded { get; set; }
        
        [Required]
        public UserAccount Owner { get; set; }

    }
}
