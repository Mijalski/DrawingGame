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

        public async Task AddToGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            await Clients.Group(groupName).SendAsync("RecieveNewPlayerJoin", $"{Context.ConnectionId} has joined the group {groupName}.");
        }

        public async Task CreateNewGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            await Clients.Group(groupName).SendAsync("RoomStarted", $"Group created {groupName}.");
        }

        public async Task StartRound(string groupName)
        {
            await Clients.Group(groupName).SendAsync("StartRound");
        }

        public async Task RequestAnsewer(string clientId)
        {
            await Clients.User(clientId).SendAsync("RecieveAnswer", _answers.GetRandomAnswer(false).Text);
        }
    }
}
