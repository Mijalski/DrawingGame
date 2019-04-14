using BusinessLogic.Manager;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BusinessLogicTests
{
    [TestClass]
    public class RandomizeHelperTests
    {
        [TestMethod]
        public void GetRandomValueTest()
        {
            var maxMinValueZero = RandomizeHelper.GetRandomValue(0);
            Assert.AreEqual(maxMinValueZero, 0);
        }

        [TestMethod]
        public void GetRandomStringTest()
        {
            for (int i = 0; i < 5; i++)
            {
                var randomString = RandomizeHelper.GetRandomString(i);
                Assert.AreEqual(randomString.Length, i);
            }
        }
    }
}
