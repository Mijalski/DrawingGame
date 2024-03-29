﻿using DAL.Interface;
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
                KeyCode = RandomizeHelper.GetRandomString(6),
                Owner = userAccount,
                StartDateTime = DateTime.Now
            };

            context.Add(room);
            context.SaveChanges();

            return room;
        }

        public Room GetRoomByKeyCode(string keyCode)
        {
            return string.IsNullOrEmpty(keyCode) ? 
                null :
                context.Rooms.SingleOrDefault(_ => _.KeyCode == keyCode.Replace(" ", string.Empty));
        }
        
        public Room GetRoomForOwner(string keyCode, UserAccount userAccount)
        {
            return context.Rooms.Include(_ => _.Owner).Single(_ => _.KeyCode == keyCode && _.Owner == userAccount);
        }

        public void SetGameEnded(Room room)
        {
            context.Rooms.Single(_ => _ == room).GameEnded = true;
            context.SaveChanges();
        }
        
    }
}
