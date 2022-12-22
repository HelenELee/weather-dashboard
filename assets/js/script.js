//var requestUrl = 'https://api.github.com/repos/twitter/Chill/issues?per_page=5';
const API_KEY = '81348d0b3ffba2f05730148b0118da15';
let submitEl = document.getElementById("main-button");
let clearButtonEl = document.getElementById("clear-button");
let newButtonsEL = document.getElementById("new-buttons");
var cityDetailsEL = document.getElementById("city-details");
let weatherContainerEL = document.getElementById("weather-container");

//var requestUrl_weather = 'https://api.openweathermap.org/data/2.5/forecast?lat=-31.9558964&lon=115.8605801&appid=81348d0b3ffba2f05730148b0118da15&units=metric&exclude=current,minutely,hourly,alerts';

function callAPI(cityValue){
    
    let city_name = (cityValue != null) ? cityValue : $('#city-name').val();
    //let country_name = (countryValue != null) ? countryValue : $('#country-name').val();
    //let combined = (country_name != '') ? city_name + "," + country_name : city_name;
    
    let limit = "1";
    let lat ='';
    let lon = '';
    //let requestUrl_LatLon = `http://api.openweathermap.org/geo/1.0/direct?q=${city_name},${country_code}&limit=${limit}&appid=${API_KEY}`;
    let requestUrl_LatLon = `http://api.openweathermap.org/geo/1.0/direct?q=${city_name}&limit=${limit}&appid=${API_KEY}`;
    
    console.log("LATLON = " + requestUrl_LatLon);

    fetch(requestUrl_LatLon)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
          //  console.log(data);

            if (data.length > 0) {
                lat = data[0].lat;
                lon = data[0].lon;
              //  console.log('lat = ' + lat);
             //   console.log('lon = ' + lon);
                var requestUrl_Weather = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=81348d0b3ffba2f05730148b0118da15&units=metric&exclude=current,minutely,hourly,alerts`;
                console.log("WEATHER = " + requestUrl_Weather);
            }
            return fetch(requestUrl_Weather);
            
        })
        .then(function(response) {
            //let data = response.json();
            //console.log(data);
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            displayWeather(city_name, data.list);
        })
        //.catch(error => {
        //    throw(error);
        //}
        .catch(function(error){
            alert("City was not found. Please try again.");
            removeButton(city_name.toProperCase());
            //throw(error);
        }
        );

}

function displayWeather(cityValue, weatherList) {
    
    let startDay = dayjs().set('hour', 12).set('minute', 59).set('second', 59).unix();
   // console.log("formatted startDay- " +dayjs.unix(startDay).format('MMM D, YYYY, hh:mm:ss a'));
    let tomorrowDay = dayjs().add(1, 'day').unix();
    //console.log("formatted tomorrowDay- " +dayjs.unix(tomorrowDay).format('MMM D, YYYY, hh:mm:ss a'));
    let endDay = dayjs().add(6, 'day').unix();
    //console.log("formatted endDay- " +dayjs.unix(endDay).format('MMM D, YYYY, hh:mm:ss a'));
    let displayedTodays = false;
    
    removeAllChildren(weatherContainerEL);

    for (var i = 0; i < weatherList.length; i++) {
        //console.log("current date" + weatherList[i].dt.format('MMM D, YYYY, hh:mm:ss a'));
        
        console.log("Processing : "+ dayjs.unix(weatherList[i].dt).format('MMM D, YYYY, hh:mm:ss a') + " / " + weatherList[i].main.temp);
        if (weatherList[i].dt < tomorrowDay && !displayedTodays) {
            createTodaysWeather(cityValue, weatherList[i]);
            displayedTodays = true;
        }else if (weatherList[i].dt > startDay && weatherList[i].dt <= endDay) {
            if (weatherList[i].dt_txt.slice(11, 13) == "09") {
                createWeatherCard(weatherList[i]);
            }
        }
        
      }
      
}

function removeAllChildren(elem){
    while (elem.lastElementChild) {
        elem.removeChild(elem.lastElementChild);
    }
}

function createTodaysWeather(cityValue, weatherObj) {
   
    //console.log("createTodaysWeather");

    removeAllChildren(cityDetailsEL);
    
    let thisDay = dayjs.unix(weatherObj.dt).format('MMM D, YYYY');
    let iconcode = weatherObj.weather[0].icon;
    let iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

    
    let cityName = document.createElement("h2");
    //cityName.setAttribute("display", "inline");
    cityName.appendChild(document.createTextNode(cityValue.toProperCase() + " (" + thisDay + ")"));
    cityDetailsEL.appendChild(cityName);
    let imgValue = document.createElement("img");
    imgValue.setAttribute("src", iconurl);
    //imgValue.setAttribute("display", "inline");
    cityDetailsEL.appendChild(imgValue);
    let temp = document.createElement("h3");
    temp.appendChild(document.createTextNode("Temp: " + weatherObj.main.temp));
    

    cityDetailsEL.appendChild(temp);
    
    let wind = document.createElement("h3");
    wind.appendChild(document.createTextNode("Wind: " + weatherObj.wind.speed));
    cityDetailsEL.appendChild(wind);

    let humidity = document.createElement("h3");
    humidity.appendChild(document.createTextNode("Humidity: " + weatherObj.main.humidity));
    cityDetailsEL.appendChild(humidity);

}

function createWeatherCard(weatherObj) {
    console.log("inside createWeatherCard");
    //removeAllChildren(weatherContainerEL);
   // for (let i = 0; i< 5; i++){
    let weatherCard = document.createElement("div");
    weatherCard.classList.add("weather-card");
    let dateValue = document.createElement("h2");
    let imgValue = document.createElement("img");
    let temp = document.createElement("h3");
    let wind = document.createElement("h3");
    let humidity = document.createElement("h3");

    let thisDay = dayjs.unix(weatherObj.dt).format('MMM D, YYYY');
   
    dateValue.appendChild(document.createTextNode(thisDay));

    let iconcode = weatherObj.weather[0].icon;
    let iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
    imgValue.setAttribute("src", iconurl);

    temp.appendChild(document.createTextNode("Temp: " + weatherObj.main.temp));
    wind.appendChild(document.createTextNode("Wind: " + weatherObj.wind.speed));
    humidity.appendChild(document.createTextNode("Humidity: " + weatherObj.main.humidity));

    weatherCard.appendChild(dateValue);
    weatherCard.appendChild(imgValue);
    weatherCard.appendChild(temp);
    weatherCard.appendChild(wind);
    weatherCard.appendChild(humidity);

    weatherContainerEL.appendChild(weatherCard);
    //}
    
}

function validateFields(fieldName){
    let fieldValue = $("#" + fieldName).val();
    if (fieldValue === "") {
        return false;
    }
    return true;
}

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

function saveNewCity(cityValue){
    
    //get array of stored cities
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    console.log("proper case = " + cityValue.toProperCase());
    //create object from current city
    var currentCity = {
    city: cityValue.toProperCase()
    
   }  
  
   //check if this is the first city we are saving
   if (storedCities == null){
     storedCities = [currentCity];
   } else {
    //already have saved scores so push current onto array
     storedCities.push(currentCity) ;
     
  }
   //save all cities to local storage again - including current city
   localStorage.setItem("cities", JSON.stringify(storedCities));
   
}

function printStorage() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    if (storedCities != null) {
        console.log("***** Storage *******");
        for (let i=0; i<storedCities.length; i++){
            console.log(storedCities[i].city  );
        }
    }
}

function createNewButton(cityValue) {
    var newButton = document.createElement("button");
    newButton.appendChild(document.createTextNode(cityValue.toProperCase() ));
    newButton.setAttribute("class", "previous-search");
    newButton.setAttribute("data-city", cityValue.toProperCase());
   // newButton.setAttribute("data-country", countryValue);
    newButtonsEL.appendChild(newButton); 
    
}

function removeButton(cityValue) {
    let buttonSelector = `[data-city="${cityValue}"]`;
    console.log(buttonSelector);
    $(buttonSelector).remove()
    

}

function createAllButtons() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    if (storedCities != null) {
        console.log("***** Storage *******");
        for (let i=0; i<storedCities.length; i++){
            //console.log(storedCities[i].city + "/" + storedCities[i].country );
            createNewButton(storedCities[i].city);
        }
    }
}

function inStorage(cityValue) {
   // alert('Check storage');
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    if (storedCities == null) {
        console.log("storage empty");
        return false;
    }

    for (let i=0; i<storedCities.length; i++){
        if (storedCities[i].city === cityValue.toProperCase() ) {
            console.log("found city in storage");
            return true;
        } 
    }
    console.log("NOT in storage");
    return false;
}

function submitButtonHandler (event){
   // alert('submit button handler');
    event.preventDefault();
    let cityValue = $("#city-name").val();
   // let countryValue = $("#country-name").val();
    if (validateFields("city-name")) {
       // alert('check storage');
       
        if (!inStorage(cityValue)) {
            createNewButton(cityValue);
            saveNewCity(cityValue);
        }
        callAPI();
       // printStorage();
        $('#city-name').val("");
       // $('#country-name').val("");
    } else {
        alert("Please enter a city name.");
    }
}

  //clear all values 
  function clearStorageHandler(event) {
    console.log('clear storage');
    event.preventDefault();
    localStorage.clear("cities");
    //reprint values to screen
    
  }

function allButtonsHandler(event) {
    event.preventDefault();
    
    let currentButton = event.target;
    let cityValue = currentButton.getAttribute("data-city");
   // let countryValue = currentButton.getAttribute("data-country")
    console.log("allButtonsHandler" + " / " + cityValue);
    callAPI(cityValue);
}

submitEl.addEventListener('click', submitButtonHandler);
newButtonsEL.addEventListener('click', allButtonsHandler);
//clearButtonEl.addEventListener('click', clearStorageHandler);

// Autocomplete widget
$(function () {
    var cityNames = [
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

  //localStorage.clear();
    printStorage();

  createAllButtons();

  //removeButton('Xxx');
  localStorage.clear("cities");

  
 
  
  