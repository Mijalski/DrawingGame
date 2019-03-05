using System;
using System.Linq;

namespace BusinessLogic.Manager
{
    public class RandomizeHelper
    {
        const string pool = "abcdefghijklmnopqrstuvwxyz0123456789";

        public static int GetRandomValue(int maxValue, int minValue = 0)
        {
            Random rand = new Random();
            return rand.Next(minValue, maxValue);
        }
        
        public static string GetRandomString(int length)
        {
            Random random = new Random();
            var chars = Enumerable.Range(0, length)
                .Select(x => pool[random.Next(0, pool.Length)]);
            return new string(chars.ToArray());
        }
    }
}