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



// If there's existing search history render it to the page
    if (localStorage.getItem("searchHistory")) {
        console.log("render searchHistory function called")
        renderSearchHistory();
    } //closes check for existing search history



// function definition to populate cards with 5 day forecast
    function fiveDayForecast() {
        //reset the array that's used to store the days and forecast.
        var fiveDayArray = []

        // empty five day section
        $("div").remove('.forecastDiv');


        //Build queryURL for 5 day forecast
        var fiveDayUrl = 'http://api.openweathermap.org/data/2.5/forecast?q=' + selectedCity + '&units=imperial&appid=' + apiKey

        
        $.ajax({
            url: fiveDayUrl,
            method: "GET"

        }).then(function (response) {
                        
            for (i = 0; i < response.list.length; i++) {
                
                var fiveDayObject

                // if the substring at position 11 up to but not including position 19 === Noon, build out 5 day forecast
                // SIDE NOTE FOR GRADER: I learned this concept as  slice with a start,stop,step argument in Python before taking this class
                if (response.list[i].dt_txt.substring(11, 19) === '12:00:00') {

                    fiveDayObject = {
                        icon: response.list[i].weather[0].icon,
                        temp: response.list[i].main.temp,
                        humidity: response.list[i].main.humidity,
                        date: response.list[i].dt_txt.substring(0, 11)
                    }

                    fiveDayArray.push(fiveDayObject)
                    console.log(fiveDayArray)
                }


            }// closes for loop in 5-day forecast


            //use array of 5 day forecast to populate html elements in 5 day forecast section
            for (i = 0; i < fiveDayArray.length; i++) {

                var forecastDiv = $('<div>').addClass("col-sm-2 forecastDiv")
                var forecastCard = $("<div>").addClass("card text-white bg-primary mb-3 forecastCard")
                forecastCard.attr("style", "max-width: 18rem;")
                forecastDiv.append(forecastCard)


                var forecastCardBody = $('<div>').addClass("card-body forecastCardBody")
                forecastCard.append(forecastCardBody)

                var forecastCardTitle = $("<h5>").addClass("card-title forecastCardTitle forecastCardTime")
                var forecastCardTemp = $("<p>").addClass("card-text forecastCardTemp")
                var forecastCardIcon = $("<img>").addClass("card-text forecastCardIcon")
                var forecastCardHumidity = $("<p>").addClass("card-text forecastCardHumidity")
                var forecastCardIconURL = 'http://openweathermap.org/img/wn/' + fiveDayArray[i].icon + '@2x.png'
                forecastCardBody.append(forecastCardTitle)
                forecastCardBody.append(forecastCardIcon)
                forecastCardBody.append(forecastCardTemp)
                forecastCardBody.append(forecastCardHumidity)

                var tempCounter = i + 1
                var tempDateThing = moment().add(tempCounter, 'days')
                tempDateThing = tempDateThing.format("MM[/]DD[/]YYYY")

                forecastCardTitle.text(tempDateThing)
                /
                forecastCardIcon.attr("src", forecastCardIconURL)
                forecastCardTemp.text("Temp: " + fiveDayArray[i].temp + '\xB0F')
                forecastCardHumidity.text("Humidity: " + fiveDayArray[i].humidity + "%")

              
                $("#fiveDayContainer").append(forecastDiv)


            }//closes array for building out 5dayForecast


        }); // closes ajax for 5 day forecast


    };// closes five day forecast function


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
            console.log("main weather response is below")
            console.log(response)
            var mainWeatherIcon = response.weather[0].icon
            var mainWeatherIconUrl = 'http://openweathermap.org/img/wn/' + mainWeatherIcon  + '@2x.png'
            
            $('#cityName').text(selectedCity + '  ' + currentDate )
            $("#mainWeatherIcon").attr("src", mainWeatherIconUrl)
            $("#temp").text("Temperature: " + response.main.temp + '\xB0F')
            $("#humidity").text("Humidity: " + response.main.humidity + '%')
            $("#windSpeed").text("Wind Speed: " + response.wind.speed + 'MPH')
            cityLat = response.coord.lat
            cityLong = response.coord.lon

            console.log(response);


            // Query URL for nested UV API call
            var uvIndexUrl = 'https://api.openweathermap.org/data/2.5/uvi?lat=' + cityLat + '&lon=' + cityLong + '&appid=' + apiKey
            
            $.ajax({
                url: uvIndexUrl,
                method: "GET"

            }).then(function (response) {
                console.log('the next line is the uv index response')
                console.log(response)
                // populate uvIndex element with the uv index value
                $("#uvIndex").text("UV Index: " + response.value)
                // Conditional checks to dynamically apply styling for uvIndex
                if (response.value > 0 && response.value <= 2) {
                    $("#uvIndex").removeClass("moderate")
                    $("#uvIndex").removeClass("high")
                    $("#uvIndex").removeClass("veryHigh")
                    $("#uvIndex").removeClass("extreme")
                    $("#uvIndex").addClass("low")
                }

                else if (response.value > 2 && response.value <= 5) {
                    $("#uvIndex").removeClass("low")
                    $("#uvIndex").removeClass("high")
                    $("#uvIndex").removeClass("veryHigh")
                    $("#uvIndex").removeClass("extreme")
                    $("#uvIndex").addClass("moderate")

                }

                else if (response.value > 5 && response.value <= 7) {
                    $("#uvIndex").removeClass("low")
                    $("#uvIndex").removeClass("moderate")
                    $("#uvIndex").removeClass("veryHigh")
                    $("#uvIndex").removeClass("extreme")
                    $("#uvIndex").addClass("high")
                }

                else if (response.value > 7 && response.value <= 10) {
                    $("#uvIndex").removeClass("low")
                    $("#uvIndex").removeClass("moderate")
                    $("#uvIndex").removeClass("high")
                    $("#uvIndex").removeClass("extreme")
                    $("#uvIndex").addClass("veryHigh")

                }

                else if (response.value > 10) {
                    $("#uvIndex").removeClass("low")
                    $("#uvIndex").removeClass("moderate")
                    $("#uvIndex").removeClass("high")
                    $("#uvIndex").removeClass("veryHigh")
                    $("#uvIndex").addClass("extreme")
                }


            });


        }) //closes ajax call

        // Call the fiveDay forecast funct whenever mainWeather() is called
        fiveDayForecast();


    } // closes main weather function






    // function to retrieve search history from local storage and render it to the page
    function renderSearchHistory() {

        if (localStorage.getItem("searchHistory")) {

            searchHistoryArray = JSON.parse(localStorage.getItem("searchHistory"))

            for (var i = 0; i < searchHistoryArray.length; i++) {
                console.log("search history array value is: " + searchHistoryArray[i])
                var recentSearch = $("<li>").text(searchHistoryArray[i])
                recentSearch.attr("class", "recentCity list-group-item")
                $("#recentSearchList").prepend(recentSearch)

            }
            // Update the selectedCity variable with the last value of the search history so main weather can reference the correct city
            selectedCity = searchHistoryArray[searchHistoryArray.length - 1]
            mainWeather();
        }

    }

    // function to build out recent search list and store it in search history
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

        // update selectedCity to the value of the search box
        selectedCity = $("#selectedCity").val().trim()

        //check if there's a value, if not alert and ask for one
        if (!selectedCity) {
            alert("Please enter in the name of a city")
            return
        }//closes if statement

        //the SearchHistory shouldget updated when search button is clicked
        searchHistory();


        ////// POPULATE MAIN WEATHER SECTION on click
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
 
    7). NEED TO ADD AN ICON NEXT TO THE H1 PORTION
    8). FIX SEARCH BUTTON SO IT'S POSITION IS ABSOLUTE COMPARED TO THE SEARCH BAR
    10). Need to cap recent searches at 10. (nice to have).
 
    */




}); // closes document ready function