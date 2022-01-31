// global variables
var form = document.querySelector('#form');
var cityInterest = document.querySelector('#city');
var button = document.querySelector('#btn-div')
var summary = document.querySelector('#summary');
var temp = document.querySelector('#temp');
var wind = document.querySelector('#wind');
var moisture = document.querySelector('#moisture');
var exposure = document.querySelector('#rays');
var currentDay = document.querySelector('#date');
var weatherIcon = document.querySelector('#weatherIcon');
var container = document.querySelector('#card-container');
let previousSearches = JSON.parse(localStorage.getItem('recent')) || [];
var deletePrev = document.querySelector('#clear-btn');
console.log(previousSearches);

// current moment
var now = moment();
currentDay.textContent = (now.format("dddd, MMMM Do YYYY"));

// retrieval function for weather calls
function retrieveWeather (city) {
    container.innerHTML = "";
    var APIkey = "5490ec2aa2dd516ff7e09f6aff3cf7c0";
    console.log(city);

    // initial call for coordinates of city
    var apiRequest = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + APIkey;

    fetch(apiRequest)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);

                var lattitude = data.coord.lat;
                var longitude = data.coord.lon;
                console.log(lattitude);
                console.log(longitude);
            })
        }
    })
}
retrieveWeather()