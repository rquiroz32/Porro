/*# 06 Server-Side APIs: Weather Dashboard

Developers are often tasked with retrieving data from another application's API and using it in the context of their own. Third-party APIs allow developers to access their data and functionality by making requests with specific parameters to a URL. Your challenge is to build a weather dashboard that will run in the browser and feature dynamically updated HTML and CSS.

Use the [OpenWeather API](https://openweathermap.org/api) to retrieve weather data for cities. The documentation includes a section called "How to start" that will provide basic setup and usage instructions. Use `localStorage` to store any persistent data.

## User Story

```
Build a weather dashoard 
```

## Acceptance Criteria

```
Provide the user the ability to search for a city.

- Search bar that on click provides:

    - Show the current and future conditions for that city.
    - Present the city name, the date, an icon representation of weather conditions, the temperature, 
    the humidity the wind speed, and the UV index (the color should indicate whether the conditions 
    are favorable, moderate, or severe)
Add that city to the search history.
Show the 5-day forecast that displays the date, an icon representation of weather conditions, 
the temperature, and the humidity.
Clicking on a city in the search history present the current and future conditions for that city.
Save search history to local storage and when loading the page present the last searched city forecast
```

The following image demonstrates the application functionality:

![weather dashboard demo](./Assets/06-server-side-apis-homework-demo.png)

## Review

You are required to submit the following for review:

* The URL of the deployed application.

* The URL of the GitHub repository. Give the repository a unique name and include a README describing the project.

- - -
F© 2019 Trilogy Education Services, a 2U, Inc. brand. All Rights Reserved.
 */
////////// ASSIGNMENT CODE///////////
var apiKey = '5d3e08b832df233deba9815eee424c26'
var selectedCity
var searchBtn = $("#searchBtn")
var currentDate = moment().format("MM[/]DD[/]YYYY")



// doc ready function
$(document).ready(function () {
    console.log("js load success")



    ////// function to populate main weather section
    function mainWeather() {
        //building the query url based on the value of the searched city with Imperial Units
        var queryURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + $("#selectedCity").val().trim() + '&appid=' + apiKey + '&units=imperial'
           // Get Weather and Populate sections
           $.ajax({
            url: queryURL,
            method: "GET",
            error: function (err) {
                console.error("Ajax error in request: " + JSON.stringify(err, null, 2))
                alert("Please type in a valid city name");
            }
        }).then(function (response) {
            $('#cityName').text(selectedCity + '  ' + currentDate)
            //$("#temp").text("Temperature: " + response.main.temp)
            $("#temp").text("Temperature: " + response.main.temp + '\xB0F')
            $("#humidity").text("Humidity: " + response.main.humidity + '%')
            $("#windSpeed").text("Wind Speed: " + response.wind.speed + 'MPH')
          
            
            console.log(response);

            //THIS IS WHERE THE UV INDEX AJAX CALL WILL GO 
            //$.ajax({}).then(function(){});

            //THIS IS WHERE THE 5-DAY FORECAST WILL GO

        }) //closes ajax call

    }




    //////ON CLICK OF SEARCH///////////
    searchBtn.on("click", function (event) {
        // don't clear out the input
        event.preventDefault();
        selectedCity = $("#selectedCity").val().trim()

        //check if there's a value, if not alert and ask for one
        if (selectedCity === '' || selectedCity === null || selectedCity === undefined) {
            alert("Please enter in the name of a city")
        }//closes if statement


        ////////// BUILD OUT RECENT SEARCH LIST
        var recentSearch = $("<li>").text(selectedCity)
        recentSearch.attr("class", "list-group-item")
        $("#recentSearchList").prepend(recentSearch)




        


        mainWeather();



    }); // closes on click of search













}); // closes document ready function