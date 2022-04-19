using Microsoft.AspNetCore.Mvc;

namespace DigitalPhotoFrame.Controllers
{
    public class SlideShowController : Controller
    {
        private readonly IConfiguration _config;
        public SlideShowController(IConfiguration configuration)
        {
            _config = configuration;
        }

        public JsonResult GetRandomPhoto()
        {
            string[] files = Directory.GetFiles("wwwroot\\photos");

            Random rand = new Random();
            int nextImageIndex = rand.Next(0, files.Length);
            string imagePath = files[nextImageIndex].Replace("wwwroot", "").Replace("\\", "/");

            var data = new
            {
                //Clock settings
                showClock = _config.GetValue<bool>("AppSettings:showClock"),

                //Photo settings
                imageDuration = _config.GetValue<Int32>("AppSettings:imageDuration"),
                blurBackground = _config.GetValue<bool>("AppSettings:blurBackground"),

                //Image
                imagePath = imagePath
            };
            return Json(data);
        }

        public JsonResult GetWeatherSettings()
        {
            var data = new
            {
                showWeather = _config.GetValue<bool>("AppSettings:showWeather"),
                weatherApiUrl = _config.GetValue<string>("AppSettings:weatherApiURL"),
            };
            return Json(data);
        }
    }
}
