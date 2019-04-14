using System;
using System.Linq;
using System.Threading;

namespace BusinessLogic.Manager
{
    public class RandomizeHelper
    {
        const string pool = "abcdefghijklmnopqrstuvwxyz0123456789";
        
        private static int seed;

        private static ThreadLocal<Random> threadLocal = new ThreadLocal<Random>
            (() => new Random(Interlocked.Increment(ref seed)));
        
        static RandomizeHelper()
        {
            seed = Environment.TickCount;
        }

        public static Random Instance => threadLocal.Value;

        //Methods to use:
        public static int GetRandomValue(int maxValue, int minValue = 0)
        {
            return Instance.Next(minValue, maxValue);
        }
        
        public static string GetRandomString(int length)
        {
            var chars = Enumerable.Range(0, length)
                .Select(x => pool[Instance.Next(0, pool.Length)]);

            return new string(chars.ToArray());
        }
    }
}