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
var historyContainer = document.getElementById('unlist');

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
                switch (wCon) {
                    case '01d':
                        weatherIcon.innerHTML = `<img src='./assets/images/Sunny.png' style = 'height: 8vh'/>`;
                        break;
                    case '02d':
                        weatherIcon.innerHTML = `<img src='./assets/images/PartlyCloudyDay.png' style = 'height: 8vh'/>`;
                        break;
                    case '03d':
                        weatherIcon.innerHTML = `<img src='./assets/images/Cloudy.png' style = 'height: 8vh'/>`;
                        break;
                    case '04d':
                        weatherIcon.innerHTML = `<img src='./assets/images/Overcast.png' style = 'height: 8vh'/>`;
                        break;
                    case '09d':
                        weatherIcon.innerHTML = `<img src='./assets/images/HeavyRain.png' style = 'height: 8vh'/>`;
                        break;
                    case '10d':
                        weatherIcon.innerHTML = `<img src='./assets/images/IsoRainSwrsDay.png' style = 'height: 8vh'/>`;
                        break;
                    case '11d':
                        weatherIcon.innerHTML = `<img src='./assets/images/CloudRainThunder.png' style = 'height: 8vh'/>`;
                        break;
                    case '13d':
                        weatherIcon.innerHTML = `<img src='./assets/images/HeavySnow.png' style = 'height: 8vh'/>`;
                        break;
                    case '50d':
                        weatherIcon.innerHTML = `<img src='./assets/images/Mist.png' style = 'height: 8vh'/>`;
                        break;
                    case '01n':
                        weatherIcon.innerHTML = `<img src='./assets/images/Clear.png' style = 'height: 8vh'/>`;
                        break;
                    case '02n':
                        weatherIcon.innerHTML = `<img src='./assets/images/PartlyCloudyNight.png' style = 'height: 8vh'/>`;
                        break;
                    case '03n':
                        weatherIcon.innerHTML = `<img src='./assets/images/Overcast.png' style = 'height: 8vh'/>`;
                        break;
                    case '04n':
                        weatherIcon.innerHTML = `<img src='./assets/images/PartlyCloudyNight.png' style = 'height: 8vh'/>`;
                        break;
                    case '09n':
                        weatherIcon.innerHTML = `<img src='./assets/images/ModRainSwrsNight.png' style = 'height: 8vh'/>`;
                        break;
                    case '10n':
                        weatherIcon.innerHTML = `<img src='./assets/images/ModRainSwrsNight.png' style = 'height: 8vh'/>`;
                        break;
                    case '11n':
                        weatherIcon.innerHTML = `<img src='./assets/images/PartCloudRainThunderNight.png' style = 'height: 8vh'/>`;
                        break;
                    case '13n':
                        weatherIcon.innerHTML = `<img src='./assets/images/HeavySnow.png' style = 'height: 8vh'/>`;
                        break;
                    case '50n':
                        weatherIcon.innerHTML = `<img src='./assets/images/Mist.png' style = 'height: 8vh'/>`;
                        break;
                    default:
                        break;
                }
                //  ./assets/images/ to show custom fonts is ultimate goal ^^^ naming conventions at openweathermap.org

                wind.textContent = 'Wind: ' + Math.floor(data.wind.speed * 2.237) + 'mph';
                moisture.textContent = 'Humidity: ' + data.main.humidity + '%';

                // exposure
                var raysAPI = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lattitude + '&lon=' + longitude + '&exclude=minutely,hourly' + '&appid=' + APIkey + '&cnt=1';
                
                // API retrieval and application of data to DOM
                fetch(raysAPI)
                .then(function (response) {
                    if (response.ok) {
                        response.json().then(function (data) {
                            console.log(data);

                            exposure.classList.remove('bg-success', 'bg-warning', 'bg-danger');

                            exposure.textContent = 'UV Exposure: ' + data.daily[0].uvi;
                            if (data.daily[0].uvi < 2 ) {
                                exposure.classList.add('bg-success');
                            } else if (data.daily[0].uvi >= 3 && data.daily[0].uvi < 7) {
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
                                    cardsM.textContent = "Humidity: " + data.daily[index].humidity+ "%";
                                    

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
    historyContainer.innerHTML = '';

    displayHistory();
}

function displayHistory(){
    console.log(previousSearches);

    for (let i = 0; i < previousSearches.length; i++) {
        var listItem = document.createElement('button');
        listItem.classList.add('btn', 'btn-light', 'btn-sm', 'mx-1', 'my-1', 'd-block');
        listItem.addEventListener('click', function(event) {
            retrieveWeather(event.target.textContent);
        });
        listItem.textContent = previousSearches[i];
        historyContainer.appendChild(listItem);

    }
}

displayHistory();

deletePrev.addEventListener("click", clearHistory);

function clearHistory(){
    localStorage.removeItem('search-history');
    previousSearches = [];
    historyContainer.innerHTML = '';
}


// TODO
// display icons https://openweathermap.org/weather-conditions