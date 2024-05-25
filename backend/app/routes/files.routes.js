const multer = require("multer");
module.exports = (app) => {
  const upload = multer({ storage: multer.memoryStorage() });
  const files = require("../controller/files.controller.js");
  var router = require("express").Router();
  router.post("/createFile", upload.single("file"), files.createFile);
  router.post("/deleteFile", files.deleteFile);
  router.post("/getAllUploadedFiles", files.getAllUploadedFiles);
  router.post("/findOne", files.findOne);

  app.use("/api/files", router);
};
