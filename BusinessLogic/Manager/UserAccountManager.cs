using DAL.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DAL;
using DAL.Model;

namespace BusinessLogic.Manager
{
    public class UserAccountManager : IUserAccount
    {
        private DatabaseContext context;

        public UserAccountManager(DatabaseContext _context)
        {
            context = _context;
        }
        
    }
}
