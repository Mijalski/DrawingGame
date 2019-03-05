using System;
using System.Collections.Generic;
using System.Text;
using DAL.Model;

namespace DAL.Interface
{
    public interface IRoom
    {
        Room AddNewRoom(UserAccount userAccount);
        Room GetRoomByKeyCode(string keyCode);
        Room GetRoomForOwner(string keyCode, UserAccount userAccount);
    }
}
