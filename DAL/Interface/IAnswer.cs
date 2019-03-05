using System;
using System.Collections.Generic;
using System.Text;
using DAL.Model;

namespace DAL.Interface
{
    public interface IAnswer
    {
        Answer GetRandomAnswer(bool appropriate);
    }
}
