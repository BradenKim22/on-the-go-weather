// api key
var APIKey = 'ae3f9720c1cb23e1ea3a1e1465073962';
// HTML doms interaction
var searchInput = document.querySelector('#search-bar');
var searchButton = document.getElementById('search-btn');
var searchResults = document.getElementById('results');
var searchHistory = document.getElementById('history');

// Search History you will find later in the code for local storage and history
const history = [];

for (i = 0; i < 12; i++) {
    var startHistory = localStorage.getItem('on-the-go-weather'+i);
    if (startHistory !== null) {
        history.push(startHistory);
        // creates button for html
        var buttonEl = document.createElement('button');
        // adds the click to each button
        buttonEl.addEventListener('click', getHistoryResults);
        // adds the name to the button
        buttonEl.innerHTML = startHistory;
        // displays the button under the searchHistory on the html
        searchHistory.append(buttonEl);
    };
};

// Function Call API of Search City
function searchCity(event) {
    event.preventDefault();
    // input from the user becomes a variable
    var cityName = searchInput.value.trim();
    // any input from the user will go through
    if(cityName){
        // call APIs and get Results
        currentResults(cityName);
        forecastResults(cityName);
        // did not enter anything and is alerted
    } else {
        alert('Please Insert a City..');
    };
};

// Function Get Main Data from Weather API
function currentResults(city) {
    // url for the api call
    let apiWeather = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;
    // api call to the servers and responds with parsing and sending it to the next funciton.
    fetch(apiWeather)
    .then(response => response.json())
    .then(function (data) {
        weatherResults(data)
    });
};

// Get Results from the previous called API data
function weatherResults(results) {
    // invalid city for their data.
    if(results.cod == '404') {
        alert("Please try another City.")
        // valid city for their data.
    } else {
        console.log(results);
        // clear up any past results here..
        searchResults.innerHTML = '';

        // Add a short lag to see changes better as a user
        setTimeout(() => {
            // get their data city name so it looks nice. Want to do the country too
            const searchedCity = results.name;
            // Current Time and formated nicely.
            const currentDate = dayjs().format();
            var theDay = dayjs(currentDate).format('dddd');
            var theDate = dayjs(currentDate).format('MM/DD');
            
            // Add Location Div and Date to html
            var divEl = document.createElement('div');
            var h3El = document.createElement('h3');
            searchResults.appendChild(divEl).setAttribute('id', 'city');
            h3El.innerHTML = searchedCity + " (" + theDay + ' ' + theDate + ")";
            divEl.appendChild(h3El);
            
            // Add Weather Icon Here
            var iconOne = document.createElement('img');
            icon1 = results.weather[0].icon;
            iconOne.src = "http://openweathermap.org/img/wn/" + icon1 + "@2x.png";
            divEl.appendChild(iconOne);
            
            // Add Current Temp
            var tempOne = document.createElement('p');
            tempOne.innerHTML = "Temp: " + results.main.temp.toFixed(1) + "°F";
            divEl.appendChild(tempOne);
            
            // Wind
            var windOne = document.createElement('p');
            windOne.innerHTML = "Wind: " + results.wind.speed.toFixed(1) + "mph";
            divEl.appendChild(windOne);
            
            // Humidity
            var humidityOne = document.createElement('p');
            humidityOne.innerHTML = "Humidity: " + results.main.humidity + "%";
            divEl.appendChild(humidityOne);
            
            // Add Five Day Forecast Title to HTML
            var fiveDayTitle = document.createElement('h3');
            fiveDayTitle.setAttribute('id', 'five-title');
            fiveDayTitle.innerHTML = "5 Day Forecast";
            searchResults.appendChild(fiveDayTitle);
            
            // Add to Search History
            setHistory(searchedCity);

        }, 50);
        
    };
};

// forecast results for the next 5 days
function forecastResults(city) {
    // url for the api call
    let apiWeather = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + APIKey;
    // api call to the servers and responds with parsing and sending it to the next funciton.
    fetch(apiWeather)
    .then(response => response.json())
    .then(function (data) {
        weatherFive(data)
    });
};

// Captures the next five days and sends them into html.
function weatherFive(results) {
    var fiveDayResults = document.createElement('div');
    searchResults.appendChild(fiveDayResults).setAttribute('id', 'five-day');

    var day = [0, 8, 16, 24, 32];

    // Add 5 ahead and their weather report in seperate divs loop.
    for(var i = 0; i < day.length; i++) {
        var divElements = document.createElement('div');
        fiveDayResults.appendChild(divElements);
        // Date Title
        var theDays = results.list[day[i]].dt_txt;
        var h4Elements = document.createElement('h4');
        h4Elements.innerHTML = dayjs(theDays).format('dddd') + " " + dayjs(theDays).format('MM/DD');
        divElements.appendChild(h4Elements);

        // Images here for Icon..
        var iconFive = document.createElement('img');
        let iconFi = results.list[day[i]].weather[0].icon;
        iconFive.src = "http://openweathermap.org/img/wn/" + iconFi + "@2x.png";
        divElements.appendChild(iconFive);

        // Temp
        var daysTemp = document.createElement('p');
        daysTemp.innerHTML = "Temp: " + results.list[day[i]].main.temp.toFixed(1) + "°F";
        divElements.appendChild(daysTemp);

        // Wind
        var daysWind = document.createElement('p');
        daysWind.innerHTML = "Wind: " + results.list[day[i]].wind.speed.toFixed(1) + "mph";
        divElements.appendChild(daysWind);

        // Humidity
        var daysHumidity = document.createElement('p');
        daysHumidity.innerHTML = "Humidity: " + results.list[day[i]].main.humidity + "%";
        divElements.appendChild(daysHumidity);
    };
};

// Add to local storage in a fun way I came up with out of nowhere.. I bet there is a much cleaner / easier way lol I just like this atm cause it came out from my brain.
function setHistory(searchedCity) {
    // if it was searched already.. it will take it out of the array and put it at the beginning
    if(history.includes(searchedCity)) {
        // finds the index of the city in the array
        index = history.indexOf(searchedCity);
        // deletes the city in the array
        history.splice(index, 1);
        // adds the city to the beginning of the array
        history.splice(0, 0, searchedCity);
        // if it wasn't searched already then it will be added into the array at the beginning.
    } else if (history.length > 11) {
        // deletes the last city in the array so that when it adds the most recent, the array/localstorage/history wont be above 12.
        history.pop();
        // adds the city to the beginning of the array
        history.splice(0, 0, searchedCity);
    } else {
        // adds the city to the beginning array if none of the other if statements apply.
        history.splice(0, 0, searchedCity);
    };

    // Clears last search history buttons and creates new ones from local storage.
    searchHistory.innerHTML = '';
    
    // Set the local storage to each of the index's city name in the array of the history without going over 12.
    for (i = 0; i < history.length; i++) {
        localStorage.setItem('on-the-go-weather'+i, history[i]);
    };

    // setTimeout(() => {
    getLocal();
    // }, 10);
};


function getLocal() {
    // Add Search History Button from local storage..
    for (i = 0; i < 12; i++) {
        // gets value from local storage
        var cityStored = localStorage.getItem('on-the-go-weather'+i);
        // if there is less than 12 from localStorage it will ignore the null values
        if (cityStored !== null) {
            // creates button for html
            var buttonEl = document.createElement('button');
            // adds the click to each button
            buttonEl.addEventListener('click', getHistoryResults);
            // adds the name to the button
            buttonEl.innerHTML = cityStored;
            // displays the button under the searchHistory on the html
            searchHistory.append(buttonEl);
        };
    };
};


// Add Function to research the Search History button
function getHistoryResults() {
    citySearched = this.innerHTML;
    currentResults(citySearched);
    forecastResults(citySearched);
};

// Add Event Listener for Search
searchButton.addEventListener('click', searchCity);