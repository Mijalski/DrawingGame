using System;
using System.Collections.Generic;
using System.Text;
using DAL.Model;

namespace DAL.Interface
{
    public interface IRoom
    {
        void AddNewRoom(Room room);
        Room GetRoom(string keyCode);
    }
}
