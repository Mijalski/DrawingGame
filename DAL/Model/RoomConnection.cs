using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DAL.Model
{
    public class RoomConnection
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        
        [Required]
        public Room Room { get; set; }
        
        [Required]
        public string ConnectionId { get; set; }

        [Required]
        public string UserName { get; set; }

        [Required]
        public bool IsMaster { get; set; }
    }
}
