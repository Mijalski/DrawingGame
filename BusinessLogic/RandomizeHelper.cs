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

        public static Random Instance { get { return threadLocal.Value; } }

        //Methods to use:
        public static int GetRandomValue(int maxValue, int minValue = 1)
        {
            return RandomizeHelper.Instance.Next(minValue, maxValue);
        }
        
        public static string GetRandomString(int length)
        {
            var random = RandomizeHelper.Instance;
            var chars = Enumerable.Range(0, length)
                .Select(x => pool[random.Next(0, pool.Length)]);
            return new string(chars.ToArray());
        }
    }
}