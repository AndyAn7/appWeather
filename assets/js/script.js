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
currentDay.textContent = (now.format('dddd, MMMM Do YYYY'));

// retrieval function for weather calls
function retrieveWeather (city) {
    container.innerHTML = '';
    var APIkey = '5490ec2aa2dd516ff7e09f6aff3cf7c0';
    console.log(city);

    // initial call for coordinates of city
    var apiRequest = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + APIkey;

    fetch(apiRequest)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                
                // lattitude/longitude
                var lattitude = data.coord.lat;
                var longitude = data.coord.lon;
                console.log(lattitude);
                console.log(longitude);
                
                // forecast values
                currentDay.textContent = now.format('dddd, MMMM Do YYYY') + ' in ' + data.name;
                summary.textContent = 'Summary: Currently, ' + data.name + ' is experiencing ' + data.weather[0].description + '.';
                temp.textContent = 'Temperature: ' + Math.floor ((data.main.temp - 273.15) * 1.8 +32) + '°F';
                var wCon = data.weather[0].icon;
                weatherIcon.innerHTML = `<img src='http://openweathermap.org/img/w/${wCon}.png' style = 'height: 25vh'/>`;
                wind.textContent = 'Wind: ' + Math.floor(data.wind.speed * 2.237) + 'mph';
                moisture.textContent = 'Humidity: ' + data.main.humidity + '%';

                // exposure
                var raysAPI = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lattitude + '&lon=' + longitude + '&exclude=minutely,hourly' + '&appid=' + APIkey + '&cnt=1';
                
                // API retrieval and application of data to DOM element
                fetch(raysAPI)
                .then(function (response) {
                    if (response.ok) {
                        response.json().then(function (data) {
                            console.log(data);

                            exposure.textContent = 'UV Exposure: ' + data.daily[0].uvi;
                            if (data.daily[0].uvi < 2 ) {
                                exposure.classList.add('bg-success');
                            } else if (data.daily[0].uvi >= 3 && data.current.uvi < 7) {
                                exposure.classList.add('bg-warning');
                            } else if(data.daily[0].uvi >= 8) {
                                exposure.classList.add('bg-danger');
                            }
                        })
                    }
                })
            })
        }
    })
}
retrieveWeather('philadelphia')