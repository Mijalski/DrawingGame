using DAL.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DAL;
using DAL.Model;

namespace BusinessLogic.Manager
{
    public class RoomManager : IRoom
    {
        private DatabaseContext context;

        public RoomManager(DatabaseContext _context)
        {
            context = _context;
        }

        public void AddNewRoom(Room room)
        {
            context.Add(room);
            context.SaveChanges();
        }

        public Room GetRoom(string keyCode)
        {
            return context.Rooms.Single(_ => _.KeyCode == keyCode);
        }
    }
}
