using System;
using System.Collections.Generic;
using System.Text;
using DAL.Model;

namespace DAL.Interface
{
    public interface IRoomConnection
    {
        void AddToRoom(string keyCode, string connectionId, string userName, bool isMaster = false);
        RoomConnection GetForConnection(string connectionId);
        RoomConnection GetMaster(string keyCode);
    }
}
