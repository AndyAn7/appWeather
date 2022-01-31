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
let previousSearches = JSON.parse(localStorage.getItem('recent')) || [];
var deletePrev = document.querySelector('#clear-btn');
var container = document.querySelector('#card-container');
/* https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=5490ec2aa2dd516ff7e09f6aff3cf7c0 */