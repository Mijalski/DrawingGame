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
    public class RoomConnectionManager : IRoomConnection
    {
        private DatabaseContext context;

        public RoomConnectionManager(DatabaseContext _context)
        {
            context = _context;
        }

        public void AddToRoom(string keyCode, string connectionId, string userName, bool isMaster = false)
        {
            var room = context.Rooms.Single(_ => _.KeyCode == keyCode);

            var roomConnection = new RoomConnection()
            {
                Room = room,
                ConnectionId = connectionId,
                UserName = userName,
                IsMaster = isMaster
            };

            context.Add(roomConnection);
            context.SaveChanges();
        }

        public RoomConnection GetForConnection(string connectionId)
        {
            return context.RoomConnections.Include(_ => _.Room).Single(_ => _.ConnectionId == connectionId);
        }

        public RoomConnection GetMaster(string keyCode)
        {
            return context.RoomConnections.Include(_ => _.Room).Single(_ => _.Room.KeyCode == keyCode && _.IsMaster);
        }
    }
}
