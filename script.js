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



// doc ready function
$(document).ready(function () {
    console.log("js load success, doc is ready")


    ////////// ASSIGNMENT CODE///////////

    var apiKey = '5d3e08b832df233deba9815eee424c26'
    var selectedCity
    var searchBtn = $("#searchBtn")
    var currentDate = moment().format("MM[/]DD[/]YYYY")
    var searchHistoryArray = []

    var cityLat
    var cityLong

    var emptyTest = []
    var newEmptyTest = []

    if (localStorage.getItem("searchHistory")) {
        console.log("render searchHistory function called")
        renderSearchHistory();
    }






    ////// function to populate main weather section
    function mainWeather() {
        //building the query url based on the value of the searched city with Imperial Units
        var queryURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + selectedCity + '&appid=' + apiKey + '&units=imperial'

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
            $("#temp").text("Temperature: " + response.main.temp + '\xB0F')
            $("#humidity").text("Humidity: " + response.main.humidity + '%')
            $("#windSpeed").text("Wind Speed: " + response.wind.speed + 'MPH')
            cityLat = response.coord.lat
            cityLong = response.coord.lon

            console.log(response);



            var uvIndexUrl = 'https://api.openweathermap.org/data/2.5/uvi?lat=' + cityLat + '&lon=' + cityLong + '&appid=' + apiKey
            //THIS IS WHERE THE UV INDEX AJAX CALL WILL GO 
            $.ajax({
                url: uvIndexUrl,
                method: "GET"

            }).then(function (response) {
                console.log('the next line is the uv index response')
                console.log(response)
                $("#uvIndex").text("UV Index: " + response.value)

            });





        }) //closes ajax call


        fiveDayForecast();


    } // closes main weather function


    function fiveDayForecast() {

        //THIS IS WHERE THE 5-DAY FORECAST WILL GO
        var fiveDayUrl = 'http://api.openweathermap.org/data/2.5/forecast?q=' + selectedCity + '&appid=' + apiKey

        $.ajax({
            url: fiveDayUrl,
            method: "GET"

        }).then(function (response) {
            console.log("the next line is the 5 day forecast response")
            console.log(response)
            for (i = 0; i < response.list.length; i++) {

                emptyTest.push(response.list[i].dt_txt)



                // if (response.list[i].dt_txt.splice(11) === '12:00:00') {
                //            console.log("this is the noon forecast for a certain day")


                //     emptyTest.push(response.list.dt_txt)
                //     console.log("the type of emptyTest is " +typeof(emptyTest) + ' and the value is' + emptyTest)
                //     //newEmptyTest.push(emptyTest[i].splice(11))

                //    // if (response.list.dt_txt.splice(11) === '12:00:00') {
                //      //   console.log("this is the noon forecast for a certain day")

                //     //}

                console.log(emptyTest)




            }// closes for loop in 5-day forecast
        }); // closes ajax for 5 day forecast




    };// closes five day forecast function




    function renderSearchHistory() {

        if (localStorage.getItem("searchHistory")) {

            searchHistoryArray = JSON.parse(localStorage.getItem("searchHistory"))

            for (var i = 0; i < searchHistoryArray.length; i++) {
                console.log("search history array value is: " + searchHistoryArray[i])
                var recentSearch = $("<li>").text(searchHistoryArray[i])
                recentSearch.attr("class", "recentCity list-group-item")
                $("#recentSearchList").prepend(recentSearch)

            }

        }
    }


    function searchHistory() {

        ////////// BUILD OUT RECENT SEARCH LIST
        var recentSearch = $("<li>").text(selectedCity)
        recentSearch.attr("class", "recentCity list-group-item")
        $("#recentSearchList").prepend(recentSearch)
        searchHistoryArray.push(selectedCity)
        localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArray))


    }


    //////ON CLICK OF SEARCH///////////
    searchBtn.on("click", function (event) {
        // don't clear out the input
        event.preventDefault();

        selectedCity = $("#selectedCity").val().trim()

        //check if there's a value, if not alert and ask for one
        if (!selectedCity) {
            alert("Please enter in the name of a city")
            return
        }//closes if statement




        console.log("saerch history function called on click")
        searchHistory();





        ////// POPULATE MAIN WEATHER SECTION
        mainWeather();


    }); // closes on click of search


    /////// ON CLICK OF RECENT SEARCHES//////////
    $("#recentSearchList").on("click", function (event) {
        // TO DO FIGURE OUT HOW TO DO THIS IN JQUERY SHOULD SOMEHOW BE WITH $(this) but it wasn't working -__-   )
        selectedCity = event.target.innerText
        console.log("the value of this is " + temp)
        mainWeather();


    });// closes on click of recent searches



    /*TO DO:
 
    1). Check if there's an existing locally stored search, if so prepend them in order, AND PRESENT THE LAST SEARCHED CITY FORECAST WHEN THE PAGE IS FIRST LOADED
        DONE
    2). Figure out the other two api calls

    3). Should dynamically prepend each of the weather days in 5 day forecast to section below
    4). need to figure out the icons
    5). need to figure out how to incrememnt in moment.js (or maybe just get it from the api event who knows)
    6). need to color code the UV index portion
    7). NEED TO ADD AN ICON NEXT TO THE H1 PORTION
    8). FIX SEARCH BUTTON SO IT'S POSITION IS ABSOLUTE COMPARED TO THE SEARCH BAR
    10). Need to cap recent searches at 10. (nice to have).
 
    */











}); // closes document ready function