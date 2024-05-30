const multer = require("multer");
module.exports = (app) => {
  const upload = multer({ storage: multer.memoryStorage() });
  const results = require("../controller/searchResults.controller.js");
  var router = require("express").Router();
    router.post("/getSearchResults", results.searchFiles);

  app.use("/api/searchResults", router);
};
