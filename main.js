/////////////////////////////////////////////////
/////////////////////////////////////////////////
//
//
// App to get current weather based on location!
//
//
/////////////////////////////////////////////////
/////////////////////////////////////////////////

// Grabbing the elements we need from the DOM up here so we can use them later

const leftPanel = document.getElementById("left");
const searchButton = document.getElementById("getWeatherBtn");
const locationInput = document.getElementById("location");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
//
// Our second API call function, this time getting specific weather data
// using the Lat/Lon from getLocation()
//
/////////////////////////////////////////////////
/////////////////////////////////////////////////

async function getWeatherData() {

    // Fetching our array with the Latitude/Longitude from the user input location
    userLoc = await getLocation();

    // Making API request with our desired info, and using template literals to pass the latitude and longitude from our new array userLoc
    const weatherFetch = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${userLoc[0]}&longitude=${userLoc[1]}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=GMT&forecast_days=1`,
        {
            headers: {
                Accept: "application/json",
            },
        }
    );

    // Interpreting the promise as json and storing it as a variable
    const data = await weatherFetch.json();

    // Send that data packet over to displayWeatherData()
    return data;
}

/////////////////////////////////////////////////
/////////////////////////////////////////////////
//
// Orchestrator Function that grabs all the data from the other functions
// then creates new elements to show that data on the page.
//
/////////////////////////////////////////////////
/////////////////////////////////////////////////

async function displayWeatherData() {
    // Assigning the fetched data OBJECT/PROMISE to the variable weatherData
    const weatherData = await getWeatherData();

    // Declaring some variables from the API that we can use easily
    const weatherCodeResult = weatherData.daily.weathercode;
    const tempHighResult = weatherData.daily.temperature_2m_max;
    const tempLowResult = weatherData.daily.temperature_2m_min;
    // We get the max temp of the day and the min temp of the day, then find the average to determine today's temp
    const tempAverage = Math.floor(
        (Number(tempLowResult) + Number(tempHighResult)) / 2
    );

    // Creating the HTML elements through the DOM, making a <p> tag then adding our desired output into that, then appending them to the parent node (in this case, leftChild)
    leftPanel.innerHTML = null;
    const weatherCodeContainer = document.createElement(`img`);

    // Checking weatherCodeResult against the supplied table of results to determine which image to use
    if (weatherCodeResult == 0) {
        weatherCodeContainer.src = "./images/clear.webp";
    } else if (weatherCodeResult < 45) {
        weatherCodeContainer.src = "./images/cloudy.webp";
    } else if (weatherCodeResult < 51) {
        weatherCodeContainer.src = "./images/fog.webp";
    } else if (weatherCodeResult < 61) {
        weatherCodeContainer.src = "./images/drizzle.png";
    } else if (weatherCodeResult < 71) {
        weatherCodeContainer.src = "./images/lightrain.png";
    } else if (weatherCodeResult < 80) {
        weatherCodeContainer.src = "./images/snow.webp";
    } else if (weatherCodeResult < 95) {
        weatherCodeContainer.src = "./images/heavyrain.png";
    } else if (weatherCodeResult < 100) {
        weatherCodeContainer.src = "./images/lightning.webp";
    } else {
        weatherCodeContainer.src = "./images/cloudy.webp";
    }
    leftPanel.appendChild(weatherCodeContainer);

    // Declaring a new var as a created element so we can push data to the page via DOM
    const tempContainer = document.createElement(`p`);
    tempContainer.textContent = `Today: ${tempAverage}${weatherData.daily_units.temperature_2m_max}`;
    leftPanel.appendChild(tempContainer);
}

/////////////////////////////////////////////////
/////////////////////////////////////////////////
//
// Function to find the Latitude and Longitude of the Country/Postcode/Address entered
//
/////////////////////////////////////////////////
/////////////////////////////////////////////////

async function getLocation() {
    let userLocation = locationInput.value; // userLocation is now the text entered into the web form
    let sanitisedLocation = userLocation.replace(/ /gi, "+"); // We need to sanitise the input to remove any spaces and replace them with '+', as that's what the API expects
    let coords = await fetch(
        `https://geocode.maps.co/search?q=${sanitisedLocation}`,
        {
            headers: {
                Accept: "application/json",
            },
        }
    );

    data = await coords.json();
    // console.log(data)
    if (data.length === 0) { // If the location isn't valid, the api returns an empty array, so data.length === 0 checks for that
        alert(`Invalid Location!\nPlease check your input and try again!`)
    }

    let userLoc = []; // Creating our own array to push latitude and longitude, so we can return it easily
    let userLat = parseFloat(data[0].lat).toFixed(2); // Lat/Lon can have a lot of decimals, best to make sure we only have up to 2
    let userLon = parseFloat(data[0].lon).toFixed(2);
    
    // Pushing the lat and lon from the API call into our empty array
    userLoc.push(userLat, userLon);
    console.log(userLoc)

    // Returning our array
    return userLoc;
}

// Create Event listener for searchButton click to get date from weather api

searchButton.addEventListener("click", displayWeatherData);

// This is literally just telling the input box that if someone presses enter, trigger the click event on searchButton!
locationInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        searchButton.click();
    }
});