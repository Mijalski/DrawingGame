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
    public class AnswerManager : IAnswer
    {
        private DatabaseContext context;

        public AnswerManager(DatabaseContext _context)
        {
            context = _context;
        }

        public Answer GetRandomAnswer(bool appropriate)
        {
            var answers = context.Answers.ToList();
            return answers.Find(_ => _.Id == RandomizeHelper.GetRandomValue(answers.Count));
        }
    }
}
