
/* Retrieves our photo settings, clock settings, and the next photo to display. */
const getRandomPhoto = () => {

    $.ajax({
        dataType: "json",
        url: "/SlideShow/GetRandomPhoto"
    }).done((data) => {

        console.log(data);
        showWeather = data.showWeather;
        weatherApiKey = data.weatherApiKey;
        weatherApiUrl = data.weatherApiUrl;

        // Black or blured background
        if (data.blurBackground == true) {
            console.log('Blurring background');
            // Dynamically set our background-image property for the blur filter. This is a hack as we cannot set this in CSS if url is not kown beforehand.
            var styleElem = document.head.appendChild(document.createElement("style"));
            styleElem.innerHTML = ".blur-background:before {background-image: url('" + data.imagePath + "');}";
        }
        else {
            console.log("setting back background.");
            $('#background-container').removeClass("blur-background").addClass("black-background");
        }

        // Create the new image
        var image = new Image();
        image.src = data.imagePath;
        image.id = 'photo';
        document.getElementById('photo-container').innerHTML = "";
        document.getElementById('photo-container').appendChild(image);

        // Resize the image
        image.onload = () => {
            resizeImage()
        }

        // Show or hide clock
        if (data.showClock == true) {
            console.log("Displaying clock");
            document.getElementById('clock').className = '';
        }
        else {
            document.getElementById('clock').className = 'hide';
        }

        // Call this function again based on configured image duration setting
        setTimeout(getRandomPhoto, data.imageDuration * 1000);
    })
}

/* Retrieves our weather settings. If showWeather, calls getWeatherData */
const updateWeather = () => {
    console.log('Getting weather settings...');
    $.ajax({
        dataType: "json",
        url: "/SlideShow/GetWeatherSettings",
        success: function (data) {
            console.log("Retrieved weather settings:")
            console.log(data);
            if (data.showWeather == true) {
                console.log("showWeather is true");
                document.getElementById('weather-container').className = '';
                getWeatherData(data.weatherApiUrl);
            }
            else {
                console.log("showWeather is false");
                document.getElementById('weather-container').className = 'hide';
            }
        }
    });
}

/* Retrieves our weather data from the weather API */
const getWeatherData = (weatherApiUrl) => {
    $.ajax({
        dataType: "json",
        url: weatherApiUrl
    }).done((data) => {
        console.log(data);
        document.getElementById('weather-temp').textContent = Math.round(data.main.temp) + '°F'
        document.getElementById('weather-condition-icon').src = 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png'
    });
}

// Resizes our image to fit the window
const resizeImage = () => {
    let naturalImageHeight = document.getElementById('photo').naturalHeight;
    let naturalImageWidth = document.getElementById('photo').naturalWidth;
    console.log(`Image Height: ${naturalImageHeight}. Image Width: ${naturalImageWidth}`)

    // Landscape image
    if (parseInt(naturalImageWidth) > parseInt(naturalImageHeight)) { 
        // If our picture is taller than our display, set the image height. Else, set the with
        if ((naturalImageWidth / naturalImageHeight) < (window.innerWidth / window.innerHeight)) {
            document.getElementById('photo').setAttribute('style', 'height:' + window.innerHeight + 'px')
            console.log('Landscape - Picture would be taller than display. Setting image height.')
        } else {
            console.log('Landscape - Setting image width.')
            // Need to center the image's height in the window.
            let resizeRatio = window.innerWidth / naturalImageWidth
            let newHeight = resizeRatio * naturalImageHeight // Calculate what our new height would be

            // Center our image vertically
            let paddingTop = ((window.innerHeight - newHeight) / 2)
            document.getElementById('photo').setAttribute('style', 'width:' + window.innerWidth + 'px; padding-top:' + paddingTop + 'px;')
        }
    }

    // Portrat image
    else { 
        //If for some reason our display is more narrow than that of picture, set picture with. 
        if ((naturalImageWidth / naturalImageHeight) > (window.innerWidth / window.innerHeight)) {
            document.getElementById('photo').setAttribute('style', 'width:' + window.innerWidth + 'px')
        } else { // Set picture height
            console.log(`setting image height`)
            document.getElementById('photo').setAttribute('style', 'height:' + window.innerHeight + 'px')
        }
    }
}

// Update weather every 30 minutes
setInterval(() => {
    getWeather();
}, 1800000)

// Update clock every 5 seconds
setInterval(() => {
    console.log("updating clock...");
    let d = new Date();

    //Format date 
    let days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Dec']
    let date = days[d.getDay()] + ' ' + months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear().toString().substring(2)

    //Format Time
    let hours = d.getHours();
    let minutes = d.getMinutes()
    let timeofday = '';
    let timestr = ''
    if (hours > 12) {
        timeofday = 'PM'
        hours -= 12
    } else {
        timeofday = 'AM'
    }
    if (minutes < 10) {
        timestr = hours + ':0' + minutes
    } else {
        timestr = hours + ':' + minutes
    }

    // Update clock
    document.getElementById('time').textContent = timestr
    document.getElementById('time-of-day').textContent = timeofday;
    document.getElementById('date').textContent = date;
}, 5000);

// Initial load
$(document).ready(function () {
    getRandomPhoto();
    updateWeather();
});
