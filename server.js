// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Require Express to run server and routes
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static("website"));

// Setup Server
const port = 3000;

const server = app.listen(port, listening);

function listening() {
  console.log(`listening to port ${port}`);
}

app.get("/view-data", (req, res) => {
  // Error handling incase of no data to show
  const hasNoDataToShow = Object.entries(projectData).length === 0;

  if (hasNoDataToShow) {
    return res.status(404).send("No data to show");
  }

  // Send back
  return res.status(200).send(projectData);
});

app.post("/update-data", (req, res) => {
  // Error handling in-case of wrong data sent
  const hasNoPayloadToSave = Object.entries(req.body).length === 0;

  if (hasNoPayloadToSave) {
    return res.status(400).send("Request payload had an issue, try again!");
  }

  // update local project data with user entered values
  projectData["temperature"] = req.body.temperature;
  projectData["date"] = req.body.date;
  projectData["feeling"] = req.body.feeling;

  // Send back updated projectData values
  return res.status(200).send(projectData);
});
