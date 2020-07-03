$(window).on('load', function(){
    currentLocation();
    checkLocalStorage();
});

var APIKey = "0ef0104b53c2f937b6b825321c28b694";
var APIKeyOpenCage = "28182598852d48bf820fcdaa144f5781";
var lat;
var lon;
var cityHistory = localStorage.getItem("cityhistory");
if (cityHistory === null) {
    cityHistory = [];

}
else {
    console.log(cityHistory);
    cityHistory = JSON.parse(cityHistory);
for (let index = 0; index < cityHistory.length; index++) {
    let city = cityHistory[index];
    $("#cityhistory").prepend(`<li class="list-group-item">${city}</li>`);
    
}
}
var d = new Date();
var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";
var n = weekday[d.getDay()];
console.log(n);

document.getElementById("btn").addEventListener("click", query);
// adding a clear history button
$("#btn2").on("click", function(){
    window.localStorage.clear();
    location.reload();


});
function query() {
    document.getElementById("weatherresponse").style.display = "";
    var city = document.getElementById("citysearch").value;
    cityHistory.push(city);
    localStorage.setItem("cityhistory", JSON.stringify(cityHistory));
    $("#cityhistory").prepend(`<li class="list-group-item">${city}</li>`);
    var queryURLLatLng = "https://api.opencagedata.com/geocode/v1/json?q=" + city + "&key=" + APIKeyOpenCage;
    $.ajax({
        url: queryURLLatLng,
        method: "GET"
    })
        .then(function (response) {
            console.log(queryURLLatLng);
            console.log(response);
            lat = response.results[0].geometry.lat;
            lon = response.results[0].geometry.lng;
            var queryURLUV = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;
            $.ajax({
                url: queryURLUV,
                method: "GET"
            })
                .then(function (response) {
                    console.log(queryURLUV);
                    console.log(response);
                    $(".UV").html("UV Index: " + response.value);
                        // can't seem to get the UV index to show the ACTUAL UV index, it's show an arbitrary number
                });
        });
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;
    console.log(city);

    $.ajax({
        url: queryURL,
        method: "GET"
    })

        .then(function (response) {
            // Log queryURL
            console.log(queryURL);
            // Log object response
            console.log(response);

            // Transfer content to HTML
            $(".city").html("<h1>" + response.name + " Weather Details</h1>");

            $(".temp").text("Temperature (F): " + response.main.temp);
            $(".humidity").text("Humidity: " + response.main.humidity);
            $(".wind").text("Wind Speed: " + response.wind.speed);
            $("#day").text(n);
            $("h3").text("5-Day Forecast for " + city);
            console.log("Wind Speed: " + response.wind.speed);
            console.log("Humidity: " + response.main.humidity);
            console.log("Temperature (F): " + response.main.temp);
        });

    var queryURLFive = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + APIKey;
    $.ajax({
        url: queryURLFive,
        method: "GET"
    })

        .then(function (response) {
            console.log(queryURLFive);
            console.log(response);
            $(".card-title1").text(weekday[(d.getDay() + 1) % 7]);
            $(".card-title2").text(weekday[(d.getDay() + 2) % 7]);
            $(".card-title3").text(weekday[(d.getDay() + 3) % 7]);
            $(".card-title4").text(weekday[(d.getDay() + 4) % 7]);
            $(".card-title5").text(weekday[(d.getDay() + 5) % 7]);

            $("#icon1").attr("src", "partly cloudy.png");
            $("#temp1").text("Temperature (F): " + response.list[0].main.temp);
            $("#hum1").text("Humidity: " + response.list[0].main.humidity);

            $("#icon2").attr("src", "partly cloudy.png");
            $("#temp2").text("Temperature (F): " + response.list[1].main.temp);
            $("#hum2").text("Humidity: " + response.list[1].main.humidity);

            $("#icon3").attr("src", "partly cloudy.png");
            $("#temp3").text("Temperature (F): " + response.list[2].main.temp);
            $("#hum3").text("Humidity: " + response.list[2].main.humidity);

            $("#icon4").attr("src", "partly cloudy.png");
            $("#temp4").text("Temperature (F): " + response.list[3].main.temp);
            $("#hum4").text("Humidity: " + response.list[3].main.humidity);

            $("#icon5").attr("src", "partly cloudy.png");
            $("#temp5").text("Temperature (F): " + response.list[4].main.temp);
            $("#hum5").text("Humidity: " + response.list[4].main.humidity);

        });
}

