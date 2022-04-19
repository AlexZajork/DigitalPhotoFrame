using Microsoft.AspNetCore.Mvc;

namespace DigitalPhotoFrame.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return Redirect("~/Index.html");
        }
    }
}
