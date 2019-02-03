using DAL.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DAL;
using DAL.Model;
using Microsoft.EntityFrameworkCore;

namespace BusinessLogic.Manager
{
    public class RoomManager : IRoom
    {
        const string pool = "abcdefghijklmnopqrstuvwxyz0123456789";
        private DatabaseContext context;

        public RoomManager(DatabaseContext _context)
        {
            context = _context;
        }

        public Room AddNewRoom(UserAccount userAccount)
        {
            var room = new Room()
            {
                GameEnded = false,
                KeyCode = RandomString(6),
                Owner = userAccount,
                PlayerCount = 0,
                StartDateTime = DateTime.Now
            };

            context.Add(room);
            context.SaveChanges();

            return room;
        }

        public Room GetRoomByKeyCode(string keyCode)
        {
            return context.Rooms.Single(_ => _.KeyCode == keyCode);
        }

        public Room GetRoomByUserId(string id)
        {
            //to do mark all others as to delte

            return context.Rooms.Include(_ => _.Owner).FirstOrDefault(_ => _.Owner.Id == id);
        }

        private static string RandomString(int length)
        {
            Random random = new Random();
            const string pool = "abcdefghijklmnopqrstuvwxyz0123456789";
            var chars = Enumerable.Range(0, length)
                .Select(x => pool[random.Next(0, pool.Length)]);
            return new string(chars.ToArray());
        }
    }
}
