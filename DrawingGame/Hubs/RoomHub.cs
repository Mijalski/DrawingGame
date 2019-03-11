using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Timers;
using System.Web;
using DAL.Interface;
using Microsoft.AspNetCore.SignalR;

namespace DrawingGame.Hubs
{
    public class RoomHub : Hub
    {
        private readonly IAnswer _answers;

        public RoomHub(IAnswer answers)
        {
            _answers = answers;
        }

        public async Task AddToGroup(string groupName, string userName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            await Clients.Group(groupName).SendAsync("RecieveNewPlayerMaster", Context.ConnectionId, userName);
        }
        
        public async Task ConfirmPlayerLogin(string connectionId, int gameState)
        {
            await Clients.Client(connectionId).SendAsync("ConfirmPlayerJoin", gameState,Context.ConnectionId);
        }

        public async Task CreateNewGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            await Clients.Group(groupName).SendAsync("RoomStarted", groupName);
        }

        public async Task StartRound(string groupName)
        {
            await Clients.Group(groupName).SendAsync("StartRound");
        }

        public async Task RequestAnswer()
        {
            var a = _answers.GetRandomAnswer(false).Text;
            await Clients.Client(Context.ConnectionId).SendAsync("RecieveAnswer", a);
        }
        
        public async Task ReadyDrawing(string groupName, string userName)
        {
            await Clients.Group(groupName).SendAsync("ReadyDrawing", Context.ConnectionId, userName);
        }

        public async Task GetDrawing(string connectionId)
        {
            await Clients.Client(connectionId).SendAsync("GetDrawing");
        }
        
        public async Task SendDrawing(string connectionId, string answer, int[] clickX, int[] clickY, bool[] clickDrag)
        {
            await Clients.Client(connectionId).SendAsync("RecieveDrawing", answer, clickX, clickY, clickDrag);
        }
    }
}
