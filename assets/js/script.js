// global variables
var form = document.querySelector('#form');
var cityInterest = document.querySelector('#city');
var cityButton = document.querySelector('#requestButton');
var button = document.querySelector('#btn-div')
var summary = document.querySelector('#summary');
var temp = document.querySelector('#temp');
var wind = document.querySelector('#wind');
var moisture = document.querySelector('#moisture');
var exposure = document.querySelector('#rays');
var currentDay = document.querySelector('#date');
var weatherIcon = document.querySelector('#weatherIcon');
var container = document.querySelector('#card-container');
let previousSearches = JSON.parse(localStorage.getItem('search-history')) || [];
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
                weatherIcon.innerHTML = `<img src='http://openweathermap.org/img/w/${wCon}.png' style = 'height: 8vh'/>`;
                //  ./assets/images/ to show custom fonts is ultimate goal ^^^ naming conventions at openweathermap.org
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

                            // loop to populate forecast
                            for (let index = 0; index < 5; index++) {
                
                                var cards = document.createElement('div');
                                    cards.className = "col bg-dark text-white rounded mx-2 mb-3 pb-2";
                                    container.append(cards);

                                var cardsD = document.createElement('h5');
                                    cardsD.className = "mt-3 mb-0";
                                    let nextDay  = moment().add([index],'days');
                                    cardsD.textContent = (nextDay.format("L"));            

                                var cardsT = document.createElement('p');
                                    cardsT.classList.add("card-text");
                                    cardsT.textContent = "Temp: " + Math.floor((data.daily[index].temp.day - 273.15) * 1.8 + 32) + "°F";
                                
                                var cardsW = document.createElement('p');
                                    cardsW.classList.add("card-text");
                                    cardsW.textContent = "Wind: " + Math.floor(data.daily[index].wind_speed * 2.237) + "mph";
                            
                                var cardsM = document.createElement('p');
                                    cardsM.classList.add("card-text");
                                    cardsM.textContent = "Wind: " + data.daily[index].humidity+ "%";
                                    

                                    cards.append(cardsD, cardsT, cardsW, cardsM);
                            }
                            
                        })
                    }
                })
            })
        }
    })
};

// event listener of user input
cityButton.addEventListener("click", chosenCityF);

// render city's weather
function chosenCityF(event) {event.preventDefault();
    var cityRetrieved = cityInterest.value.trim();
    console.log(cityRetrieved);
    retrieveWeather(cityRetrieved);
    previousSearches.push(cityRetrieved);
    localStorage.setItem('search-history', JSON.stringify(previousSearches));
}