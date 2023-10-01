
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    lat = String(position.coords.latitude);
    lon = String(position.coords.longitude);
    sendLocationToServer(lat, lon);
  });
}

function sendLocationToServer(lat, lon) {
  fetch("/location", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lat: lat, lon: lon }),
  })
    .then((response) => response.json())
    .then((data) => {
      currentWeatherInfo(data);
      hourlyWeatherInfo(data.hourly);
      dailyWeatherInfo(data.daily);
    //   for(var i = 0; i < data.hourly.length; i++){
    //       var time = getTime(data.hourly[i].dt);
    //       console.log(time);
    //   }
    //   getHourlyData(data.hourly);
    });
}

function getDate(dt) {
    const date = new Date(dt * 1000);
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    
    const currentDate = month + " " + day;
    
    return currentDate;
}

function getTime(dt){
    const date = new Date(dt * 1000);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";

    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    const currentTime = hours + ":" + minutes + " " + ampm;

    return currentTime;
}

function currentWeatherInfo(data){
    var timezone = data.location.split("/");
    var location = timezone[1];
    const currentDate = getDate(data.current.dt) + ", " + getTime(data.current.dt);

    $("#location").text(location);
    $("#currentDate").text(currentDate);
    //   $("#latitude").text("Latitude: " + data.latitude);
    //   $("#longitude").text("Longitude: " + data.longitude);
    $("#weather").html(
      `<img class="weather-icon" src="https://openweathermap.org/img/wn/${
        data.current.weather[0].icon
      }@2x.png"> ${Math.round(data.current.temp * 10) / 10} °C`
    );
}

function hourlyWeatherInfo(data){
    var nth = 1;

    for (var i = 0; i < 24; i++) {
      let time = getTime(data[i].dt);
      let number = time[1] == ":" ? time[0] : time[0] + time[1];
      
      if (!(number % 3)) {
        getHourlyData(data[i], nth);
        nth++;
      }
    }

}

function getHourlyData(data, nth_hour){
    var time = getTime(data.dt);

    $("#hour" + nth_hour + " .time").text(time);
    $("#hour" + nth_hour + " .icon").html(`<img class="weather-icon" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">`);
    $("#hour" + nth_hour + " .temperature").text(`${Math.round(data.temp * 10) / 10} °C`);
    $("#hour" + nth_hour + " .description").text(data.weather[0].description);
}

function dailyWeatherInfo(data){
    const numDays = 8;

    for(let i = 0; i < numDays; i++){
        getDailyData(data[i], i);
    }
}

function getDailyData(data, nth){
    var date = getDate(data.dt);
    var weekday = new Date(data.dt * 1000).getDay();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    $("#day" + nth + " .date").text(days[weekday]);
    $("#day" + nth + " .icon").html(`<img class="weather-icon" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">`)
    $("#day" + nth + " .temperature").text(`${Math.round(data.temp.min * 10) / 10} / ${Math.round(data.temp.max * 10) / 10} °C`);
    $("#day" + nth + " .description").text(data.weather[0].description);
}





// const infowindow = new google.maps.InfoWindow();

// function initMap() {
//   const map = new google.maps.Map(document.getElementById("map"), {
//     zoom: 13,
//     center: { lat: 43.7840668, lng: -79.428115 },
//   });

//   window.addEventListener('resize', function() {
//     console.log("working")
//     var center = map.getCenter();
//     google.maps.event.trigger(map, 'resize');
//     map.setCenter(center);
// });


//   marker = new google.maps.Marker({
//     map,
//     draggable: true,
//     animation: google.maps.Animation.DROP,
//     position: { lat: 43.7840668, lng: -79.428115 },
//   });
//   marker.addListener("click", toggleBounce);
//   marker.addListener("click", () => {
//     infowindow.setContent("Home");
//     infowindow.open({
//         anchor: marker,
//         map,
//     })
//   });
// }

// function toggleBounce() {
//   if (marker.getAnimation() !== null) {
//     marker.setAnimation(null);
//   } else {
//     marker.setAnimation(google.maps.Animation.BOUNCE);
//   }
// }


// fetch('/location', {
//     method: 'POST',
//     headers: {
//         "Content-Type": "application/json"
//     },
//     redirect: "follow",
//     body: JSON.stringify({ lat, lon })
// })
// .then(response => response.json())
// .then(data => {
//     $("p:eq(0)").text("Latitude: " + data.lat);
//     $("p:eq(1)").text("Longitude: " + data.lon);
// });

// var getIP = "http://ip-api.com/json/";
// $.getJSON(getIP).done(function (location) {
//   console.log(location);
// });
