# Weather Dashboard

## Description
The weather dashboard allows users to enter a city name and get a five day weather forecast for that city as well as the current forecast for the city. Weather details are retrieved from http://api.openweathermap.org using an API call.

The weather app was developed using a combination of HTML, CSS and Javascript, JQuery, Day.js, Google Fonts and API calls.

Noteworthy features are:
* Use of fetch to fetch resources asynchronously across the network
* Use of Day.js to format date/time and compare dates
* Dynamic creation and removal of HTML elements using javascript
* Event listeners and delegation
* Use of local storage

The main challenges were using the API and extracting the correct data from it.

## User Criteria
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly

## Acceptance Criteria
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city

## Installation

N/A

## Usage

Please read the comments in script.js file to see the explanation of how the code works. Enter a city in the "Search for a city" input box. There is an "auto complete/helper" for Australian cities. Click the "Submit" button to search for the weather forecast. The current and 5 day forecast will be displayed on the right hand side of the screen. 

Your chosen city will be added as a button below the Submit button and you can use this new "city" button to initiate a new weather forecast search.

Below is a screenshot of the webpage. 

![Image](./assets/images/weather-dashboard.png?raw=true "Screenshot")



[To view the work day scheduler webpage click here.](https://helenelee.github.io/weather-dashboard/)


## Credits

Would like to thank the instructors at UWA Bootcamp. 
Weather details are retrieved from http://api.openweathermap.org using an API call.

## License

Please refer to the license in the repo - MIT License

## How to Contribute

As this is a learning challenge for me I would appreciate any feedback, or ideas for improvement.

[Send feedback](mailto:helenelee3@outlook.com)
