using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using DAL.Interface;
using DAL.Model;
using Microsoft.AspNetCore.Mvc;
using DrawingGame.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace DrawingGame.Controllers
{
    public class HomeController : Controller
    {
        private readonly IRoom _rooms;

        public HomeController(IRoom rooms)
        {
            _rooms = rooms;
        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult About()
        {
            ViewData["Message"] = "O grze";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Kontakt";

            return View();
        }
        
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [Authorize]
        public IActionResult CreateRoom()
        {
            return RedirectToAction("Master", "Room");
        }
        
        public IActionResult JoinRoom(string keyCode,string userName)
        {
            return RedirectToAction("Index", "Room", new {keyCode, userName});
        }
    }
}
