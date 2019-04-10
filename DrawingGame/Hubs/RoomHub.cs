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
        private readonly IRoomConnection _roomConnections;
        private readonly IRoom _rooms;   
        
        public RoomHub(IAnswer answers, IRoomConnection roomConnections, IRoom rooms)
        {
            _answers = answers;
            _roomConnections = roomConnections;
            _rooms = rooms;
        }

        public async Task AddToGroup(string groupName, string userName)
        {
            var connectionId = Context.ConnectionId;

            await Groups.AddToGroupAsync(connectionId, groupName); //todo move to confirm player login - to add to group only once confirmed

            _roomConnections.AddToRoom(groupName, connectionId, userName);

            await Clients.Group(groupName).SendAsync("RecieveNewPlayerMaster", connectionId, userName);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var roomConnection = _roomConnections.GetForConnection(Context.ConnectionId);
            var room = roomConnection.Room;

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, room.KeyCode);

            var masterConnectionId = _roomConnections.GetMaster(room.KeyCode).ConnectionId;

            if (masterConnectionId == Context.ConnectionId)
            {
                _rooms.SetGameEnded(room);
            }
            else
            {
                await Clients.Client(masterConnectionId).SendAsync("PlayerDisconnected", Context.ConnectionId);
            }
        }

        public async Task ConfirmPlayerLogin(string connectionId, string lightColor, string darkColor)
        {
            await Clients.Client(connectionId).SendAsync("ConfirmPlayerJoin", lightColor, darkColor);
        }

        public async Task CreateNewGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            _roomConnections.AddToRoom(groupName, Context.ConnectionId, "master", true);

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
            await Clients.Client(connectionId).SendAsync("GetDrawing", Context.ConnectionId);
        }
        
        public async Task SendDrawing(string connectionId, string answer, int[] clickX, int[] clickY, bool[] clickDrag, bool[] colorToggle, float canvasWidth, float canvasHeight)
        {
            await Clients.Client(connectionId).SendAsync("RecieveDrawing", Context.ConnectionId, answer, clickX, clickY, clickDrag, colorToggle, canvasWidth, canvasHeight);
        }

        public async Task StartVoting(string groupName)
        {
            await Clients.Group(groupName).SendAsync("StartVoting", Context.ConnectionId);
        } 

        public async Task SubmitAnswer(string connectionId, string userName, string answer)
        {
            await Clients.Client(connectionId).SendAsync("GetAnswer", Context.ConnectionId, userName, answer);
        }

        public async Task GuessCorrectAnswer(string groupName, string[] answers)
        {
            await Clients.Group(groupName).SendAsync("GuessCorrectAnswer", answers);
        }

        public async Task VoteAnswer(string connectionId, string userName, int buttonId)
        {
            await Clients.Client(connectionId).SendAsync("GetVote", Context.ConnectionId, userName, buttonId);
        }

        public async Task FinishVoting(string groupName)
        {
            await Clients.Group(groupName).SendAsync("VotingFinished");
        } 

        public async Task FinishAnswering(string groupName)
        {
            await Clients.Group(groupName).SendAsync("AnsweringFinished");
        } 

    }
}

