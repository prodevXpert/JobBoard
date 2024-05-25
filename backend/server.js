const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 5001;
app.use(bodyParser.json());
app.use(cors());

// set models and db connection using sequelize
const db = require("./app/models");
db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//  console.log("Drop and re-sync db.");
// });
// basic route to test the server
app.get("/", (req, res) => {
  res.send(`<h2>Server is running and live</h2>`);
});

// set routes
require("./app/routes/files.routes")(app);
app.listen(port, () => {
  console.log(
    `Server started on port ${port} at ${new Date().toLocaleString()} and can be accessed at http://localhost:${port}`
  );
});
