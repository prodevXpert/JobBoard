const db = require("../models");
const File = db.File;

// Create and Save a new File
exports.createFile = (req, res) => {
  const { originalname, mimetype, buffer } = req.file;
  const file = {
    name: originalname,
    type: mimetype,
    data: buffer,
  };

  File.create(file)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the File.",
      });
    });
  // // Validate request
  // if (!req.body.name || !req.body.type || !req.body.data) {
  //   return res.status(400).send({
  //     message: "Content can not be empty!",
  //   });
  // }

  // // Create a File
  // const file = {
  //   name: req.body.name,
  //   type: req.body.type,
  //   data: req.body.data,
  // };

  // // Save File in the database
  // File.create(file)
  //   .then((data) => {
  //     res.send(data);
  //   })
  //   .catch((err) => {
  //     res.status(500).send({
  //       message: err.message || "Some error occurred while creating the File.",
  //     });
  //   });
};

// Retrieve all Files from the database.
exports.getAllUploadedFiles = (req, res) => {
  File.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving files.",
      });
    });
};

// Find a single File with an id
exports.findOne = async (req, res) => {
  const { id } = req.body;

  try {
    const file = await File.findByPk(id);
    if (file) {
      res.setHeader("Content-Disposition", "attachment; filename=" + file.name);
      res.send(file.data);
    } else {
      res.status(404).send("File not found");
    }
  } catch (error) {
    res.status(500).send("Error retrieving file");
  }
};

// Update a File by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  File.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "File was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update File with id=${id}. Maybe File was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating File with id=" + id,
      });
    });
};

// Delete a File with the specified id in the request
exports.deleteFile = (req, res) => {
  const id = req.params.id;

  File.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "File was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete File with id=${id}. Maybe File was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete File with id=" + id,
      });
    });
};

// Delete all Files from the database.
exports.deleteAll = (req, res) => {
  File.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Files were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all files.",
      });
    });
};
