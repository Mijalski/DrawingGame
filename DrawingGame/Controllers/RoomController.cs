﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DAL.Interface;
using DAL.Model;
using DrawingGame.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace DrawingGame.Controllers
{
    public class RoomController : Controller
    {
        private readonly IRoom _rooms;
        private readonly IUserAccount _users;
        private readonly UserManager<UserAccount> _userManager;
        private Task<UserAccount> GetCurrentUserAsync() => _userManager.GetUserAsync(HttpContext.User);

        public RoomController(IUserAccount users, IRoom rooms, UserManager<UserAccount> userManager)
        {
            _userManager = userManager;
            _users = users;
            _rooms = rooms;
        }
        
        public IActionResult Index(string keyCode, string userName)
        {
            var room = _rooms.GetRoomByKeyCode(keyCode);
            if (room != null)
            {
                var model = new RoomModel()
                {
                    RoomCode = room.KeyCode,
                    UserName = userName
                };

                return View(model);
            }
            else
            {
                return RedirectToAction("Error", "Home");
            }
        }
        
        [Authorize]
        public async Task<IActionResult> Master()
        {
            var user = await GetCurrentUserAsync();

            //var room = string.IsNullOrEmpty(existingKeyCode) ?  _rooms.AddNewRoom(user) : _rooms.GetRoomForOwner(existingKeyCode, user);
            var room = _rooms.AddNewRoom(user);
            
            var model = new RoomModel()
            {
                RoomCode = room.KeyCode
            };
            
            return View(model);
        }
    }
}