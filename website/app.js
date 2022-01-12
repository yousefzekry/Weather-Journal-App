/* Global Variables */
const APP_API_HOSTNAME = "http://localhost:3000";

const OPEN_WEATHER_API_HOSTNAME = "https://api.openweathermap.org";

// Personal API Key for OpenWeatherMap API
const OPEN_WEATHER_API_KEY = "9d907bca78b86a1c74f90311e510099f";

// elements for form field
const zipCodeField = document.getElementById("zip");
const feelingsTextArea = document.getElementById("feelings");
const generateButton = document.getElementById("generate");

// Elements of View area
const dateViewField = document.getElementById("date");
const temperatureViewField = document.getElementById("temp");
const feelingViewField = document.getElementById("content");

// Event listener to add function to existing HTML DOM element
generateButton.addEventListener(
  "click",
  saveAndFetchCachedUserDataOnButtonClick
);

/* Function called by event listener */
function saveAndFetchCachedUserDataOnButtonClick() {
  if (zipCodeField.value === "") {
    alert("Please enter a zip code first");
    return;
  }

  return onGenerateButtonClick().then(updateUIwithCachedServerData);
}

/* Function to GET Web API Data*/
async function fetchWeatherByZipCode(zipCode = "") {
  const requestURL = `${OPEN_WEATHER_API_HOSTNAME}/data/2.5/forecast?zip=${zipCode}&appid=${OPEN_WEATHER_API_KEY}&units=metric`;

  const response = await fetch(requestURL);

  if (!response.ok) {
    throw new Error(response.text);
  }

  const fetchedWeatherData = await response.json();

  return {
    city: fetchedWeatherData.city.name,
    country: fetchedWeatherData.city.country,
    temperature: fetchedWeatherData.list[0].main.temp,
  };
}

/* Function to POST data */
async function saveUserEnteredDataToLocalServer(payload = {}) {
  const requestURL = `${APP_API_HOSTNAME}/update-data`;

  const response = await fetch(requestURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(response.text);
  }

  const updateDataEndpointResponse = await response.json();

  return updateDataEndpointResponse;
}

/* Function to GET Project Data */
async function getCachedUserEnteredDataFromLocalServer() {
  const requestURL = `${APP_API_HOSTNAME}/view-data`;

  const response = await fetch(requestURL);

  if (!response.ok) {
    throw new Error(response.text);
  }

  const cachedUserData = await response.json();

  return cachedUserData;
}

/* On Click, it will fire two calls for weather api and local endpoint on server to save the user entered data */
async function onGenerateButtonClick() {
  try {
    const userEnteredZipCode = zipCodeField.value;

    const fetchedWeatherDataForZipCode = await fetchWeatherByZipCode(
      userEnteredZipCode
    );

    // Create a new date instance dynamically with JS
    let d = new Date();
    const currentSubmissionDate =
      d.getMonth() + "." + d.getDate() + "." + d.getFullYear();
    const userEnteredFeeling = feelingsTextArea.value;

    // Prepare Data to be saved on BE
    const payload = {
      temperature: fetchedWeatherDataForZipCode.temperature,
      date: currentSubmissionDate,
      feeling: userEnteredFeeling,
    };

    return saveUserEnteredDataToLocalServer(payload);
  } catch (error) {
    console.log(error);
    alert(
      "Couldn't show data, Something wrong happened on getting cached data"
    );
  }
}

/* UI manipulation to update HTML with fethed cached user data */
async function updateUIwithCachedServerData() {
  try {
    const cachedUserData = await getCachedUserEnteredDataFromLocalServer();

    dateViewField.innerHTML = cachedUserData.date;
    temperatureViewField.innerHTML = cachedUserData.temperature;
    feelingViewField.innerHTML = cachedUserData.feeling;
  } catch (error) {
    alert(
      "Couldn't show data, Something wrong happened on getting cached data"
    );
  }
}
