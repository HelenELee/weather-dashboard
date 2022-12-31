//get access to main elements
const API_KEY = '81348d0b3ffba2f05730148b0118da15';
let submitEl = document.getElementById("main-button");
//let clearButtonEl = document.getElementById("clear-button");
let newButtonsEL = document.getElementById("new-buttons");
let cityDetailsEL = document.getElementById("city-details");
let weatherContainerEL = document.getElementById("weather-container");
//let tempValue = `Temp: ${temp_value} C`;
//let windValue = `Wind: ${wind_value} MPH`;
//let humidityValue = `Humidity: ${humid_value} %`;

//get weather details
function callAPI(cityValue){
    //set city_name - this function may be called by entering city name in input field (get value from field)
    //or may be called by clickng a previous search button (city value passed as parameter)
    let city_name = (cityValue != null) ? cityValue : $('#city-name').val();   
    //only return one value in API search
    let limit = "1";
    let lat ='';
    let lon = '';
    //create API url by plugging in values to javascript template literal
    let requestUrl_LatLon = `http://api.openweathermap.org/geo/1.0/direct?q=${city_name}&limit=${limit}&appid=${API_KEY}`;
    
    //console.log("LATLON = " + requestUrl_LatLon);

    fetch(requestUrl_LatLon) // call API to get lat and lon
        .then(function (response) {
            //convert to JSON
            return response.json();
        })
        .then(function (data) {
             if (data.length > 0) {
                lat = data[0].lat;
                lon = data[0].lon;
                //create API url by plugging in lat/lon to javascript template literal
                var requestUrl_Weather = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=81348d0b3ffba2f05730148b0118da15&units=metric&exclude=current,minutely,hourly,alerts`;
                //console.log("WEATHER = " + requestUrl_Weather);
            }
            return fetch(requestUrl_Weather); //call API
            
        })
        .then(function(response) {
            //convert to JSON
            return response.json();
        })
        .then(function(data) {
            //console.log(data);
            //display values retrieved from APIs
            displayWeather(city_name, data.list);
        })
        .catch(function(error){
            //no city found, tell user
            alert("City was not found. Please try again.");
            //remove "previous search" button
            removeButton(city_name.toProperCase());
        }
        );

}

function displayWeather(cityValue, weatherList) {
    //set up dates
    let startDay = dayjs().set('hour', 12).set('minute', 59).set('second', 59).unix();
    let tomorrowDay = dayjs().add(1, 'day').unix();
    let endDay = dayjs().add(6, 'day').unix();
    let displayedTodays = false;
    //remove previous values
    removeAllChildren(weatherContainerEL);

    //loop through all values returned from API call
    for (let i = 0; i < weatherList.length; i++) {        
        //console.log("Processing : "+ dayjs.unix(weatherList[i].dt).format('MMM D, YYYY, hh:mm:ss a') + " / " + weatherList[i].main.temp);
        //check values are in correct date range
        if (weatherList[i].dt < tomorrowDay && !displayedTodays) {
            //found todays weather details so print
            createTodaysWeather(cityValue, weatherList[i]);
            //set boolean to true so you dont print todays details again
            displayedTodays = true;
        }else if (weatherList[i].dt > startDay && weatherList[i].dt <= endDay) {
            //details within date range
            if (weatherList[i].dt_txt.slice(11, 13) == "09") {
                //return the same time slot value for each day
                //create 5 weather forcasts
                createWeatherCard(weatherList[i]);
            }
        }
        
      } 
}

//helper function to remove children elements
function removeAllChildren(elem){
    while (elem.lastElementChild) {
        elem.removeChild(elem.lastElementChild);
    }
}

function createTodaysWeather(cityValue, weatherObj) {
   //remove previous results
    removeAllChildren(cityDetailsEL);
    //get icon details
    let iconcode = weatherObj.weather[0].icon;
    let iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
    //add city and date
    let thisDay = dayjs.unix(weatherObj.dt).format('MMM D, YYYY');
    
    let cityName = document.createElement("h2");
    cityName.appendChild(document.createTextNode(cityValue.toProperCase() + " (" + thisDay + ")"));
    cityDetailsEL.appendChild(cityName);
    //add image
    let imgValue = document.createElement("img");
    imgValue.setAttribute("src", iconurl);
    cityDetailsEL.appendChild(imgValue);
    //add temp
    let temp = document.createElement("h3");
    temp.appendChild(document.createTextNode("Temp: " + weatherObj.main.temp + " °C"));
    cityDetailsEL.appendChild(temp);
    //add wind speed
    let wind = document.createElement("h3");
    wind.appendChild(document.createTextNode("Wind: " + weatherObj.wind.speed + " MPH"));
    cityDetailsEL.appendChild(wind);
    //add humidity
    let humidity = document.createElement("h3");
    humidity.appendChild(document.createTextNode("Humidity: " + weatherObj.main.humidity + " %"));
    cityDetailsEL.appendChild(humidity);

}

function createWeatherCard(weatherObj) { 
    //create 1 weather forcast
    
    //create elements and add relevent details
    let weatherCard = document.createElement("div");
    weatherCard.classList.add("weather-card");
    let dateValue = document.createElement("h2");
    let imgValue = document.createElement("img");
    let temp = document.createElement("h3");
    let wind = document.createElement("h3");
    let humidity = document.createElement("h3");

    let thisDay = dayjs.unix(weatherObj.dt).format('MMM D, YYYY');
   
    dateValue.appendChild(document.createTextNode(thisDay));
    //get icon details
    let iconcode = weatherObj.weather[0].icon;
    let iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
    imgValue.setAttribute("src", iconurl);

    temp.appendChild(document.createTextNode("Temp: " + weatherObj.main.temp + " °C"));
    wind.appendChild(document.createTextNode("Wind: " + weatherObj.wind.speed + " MPH"));
    humidity.appendChild(document.createTextNode("Humidity: " + weatherObj.main.humidity + " %"));

    weatherCard.appendChild(dateValue);
    weatherCard.appendChild(imgValue);
    weatherCard.appendChild(temp);
    weatherCard.appendChild(wind);
    weatherCard.appendChild(humidity);

    weatherContainerEL.appendChild(weatherCard);    
}

function validateFields(fieldName){
    //check value was added to field 
    let fieldValue = $("#" + fieldName).val();
    if (fieldValue === "") {
        return false;
    }
    return true;
}

//helper function to convert text to propercase
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

function saveNewCity(cityValue){
    
    //get array of stored cities
    var storedCities = JSON.parse(localStorage.getItem("cities"));
  
    //create object from current city
    var currentCity = {
    city: cityValue.toProperCase()
   }  
  
   //check if this is the first city we are saving
   if (storedCities == null){
     storedCities = [currentCity];
   } else {
    //already have saved city so push current onto array
     storedCities.push(currentCity) ;
     
  }
   //save all cities to local storage again - including current city
   //convert to text before storing
   localStorage.setItem("cities", JSON.stringify(storedCities));
   
}

//helper function to check whats in storage
function printStorage() {
    let storedCities = JSON.parse(localStorage.getItem("cities"));
    if (storedCities != null) {
        for (let i=0; i<storedCities.length; i++){
            console.log(storedCities[i].city  );
        }
    }
}

//create button with previous search details - quick way to call search again
function createNewButton(cityValue) {
    let newButton = document.createElement("button");
    newButton.appendChild(document.createTextNode(cityValue.toProperCase() ));
    newButton.setAttribute("class", "previous-search");
    newButton.setAttribute("data-city", cityValue.toProperCase());
    newButtonsEL.appendChild(newButton); 
}

//helper function - remove button if details not found in API
function removeButton(cityValue) {
    let buttonSelector = `[data-city="${cityValue}"]`;
   
    $(buttonSelector).remove()
}
//create buttons based on stored value
function createAllButtons() {
    let storedCities = JSON.parse(localStorage.getItem("cities"));
    if (storedCities != null) {
        for (let i=0; i<storedCities.length; i++){
            createNewButton(storedCities[i].city);
        }
    }
}
//check if city value is in storage or not
function inStorage(cityValue) {
    let storedCities = JSON.parse(localStorage.getItem("cities"));
    if (storedCities == null) {
        return false;
    }

    for (let i=0; i<storedCities.length; i++){
        if (storedCities[i].city === cityValue.toProperCase() ) {
            return true;
        } 
    }
    return false;
}
//function called when submit button clicked
function submitButtonHandler (event){
    event.preventDefault();
    let cityValue = $("#city-name").val();
   
    if (validateFields("city-name")) {
       //check if its already in storage - dont add again if  it is
        if (!inStorage(cityValue)) {
            createNewButton(cityValue);
            saveNewCity(cityValue);
        }
        callAPI();
       
        $('#city-name').val("");
    } else {
        // no city added - tell user
        alert("Please enter a city name.");
    }
}

  //helper function - clear values from storage 
  function clearStorageHandler(event) {
    event.preventDefault();
    localStorage.clear("cities");    
  }

//called when any "previous" search button is clicked
function allButtonsHandler(event) {
    event.preventDefault();
    
    let currentButton = event.target;
    //find out which city was clicked
    let cityValue = currentButton.getAttribute("data-city");
    //call API again with the value
    callAPI(cityValue);
}

submitEl.addEventListener('click', submitButtonHandler);
newButtonsEL.addEventListener('click', allButtonsHandler);

//auto complete for australian cities

$(function () {
    let cityNames = [
      'Perth',
      'Sydney',
      'Melbourne',
      'Adelaide',
      'Darwin',
      'Brisbane',
      'Canberra',
    ];
    $('#city-name').autocomplete({
      source: cityNames,
    });
  });


  createAllButtons();


  
 
  
  