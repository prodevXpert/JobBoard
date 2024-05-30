const db = require("../models");
const File = db.File;
const sequelize = db.sequelize;
const { Op } = require("sequelize");

// Create and Save a new File
exports.createFile = (req, res) => {
  const { originalname, buffer } = req.file;
  console.log("file", req.file);
  const {
    firstName,
    lastName,
    location,
    currentTitle,
    desiredJobTitle,
    email,
    phone,
    salaryPerHour,
    salaryPerMonth,
    salaryPerAnnum,
    salaryMin,
    salaryMax,
    lookingFor,
    fileType,
    fileSize,
  } = req.body;

  const file = {
    fileName: originalname,
    fileType,
    fileSize,
    firstName,
    lastName,
    location,
    currentTitle,
    desiredJobTitle,
    email,
    phone,
    salaryPerHour,
    salaryPerMonth,
    salaryPerAnnum,
    salaryMin,
    salaryMax,
    lookingFor,
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
};
// Search All File
const parseSearchString = (str) => {
  // Remove enclosing parentheses
  if (str.startsWith("(") && str.endsWith(")")) {
    str = str.slice(1, -1);
  }

  const terms = str.split(" AND ").map((term) => term.trim());
  const query = [];

  terms.forEach((term) => {
    const orTerms = term
      .split(" OR ")
      .map((orTerm) => orTerm.trim().replace(/"/g, ""));
    if (orTerms.length > 1) {
      query.push({
        [Op.or]: orTerms.map((t) => ({
          [Op.or]: [
            { currentTitle: { [Op.like]: `%${t}%` } },
            { desiredJobTitle: { [Op.like]: `%${t}%` } },
            { location: { [Op.like]: `%${t}%` } },
            { firstName: { [Op.like]: `%${t}%` } },
            { lastName: { [Op.like]: `%${t}%` } },
            { email: { [Op.like]: `%${t}%` } },
            { phone: { [Op.like]: `%${t}%` } },
            { fileType: { [Op.like]: `%${t}%` } },
            { salaryPerHour: { [Op.like]: `%${t}%` } },
            { salaryPerMonth: { [Op.like]: `%${t}%` } },
            { salaryPerAnnum: { [Op.like]: `%${t}%` } },
            { salaryMin: { [Op.like]: `%${t}%` } },
            { salaryMax: { [Op.like]: `%${t}%` } },
            { lookingFor: { [Op.like]: `%${t}%` } },
          ],
        })),
      });
    } else {
      const t = term.replace(/"/g, "");
      query.push({
        [Op.or]: [
          { currentTitle: { [Op.like]: `%${t}%` } },
          { desiredJobTitle: { [Op.like]: `%${t}%` } },
          { location: { [Op.like]: `%${t}%` } },
          { firstName: { [Op.like]: `%${t}%` } },
          { lastName: { [Op.like]: `%${t}%` } },
          { email: { [Op.like]: `%${t}%` } },
          { phone: { [Op.like]: `%${t}%` } },
          { fileType: { [Op.like]: `%${t}%` } },
          { salaryPerHour: { [Op.like]: `%${t}%` } },
          { salaryPerMonth: { [Op.like]: `%${t}%` } },
          { salaryPerAnnum: { [Op.like]: `%${t}%` } },
          { salaryMin: { [Op.like]: `%${t}%` } },
          { salaryMax: { [Op.like]: `%${t}%` } },
          { lookingFor: { [Op.like]: `%${t}%` } },
        ],
      });
    }
  });

  return query;
};

// Controller to handle search request
exports.searchFiles = async (req, res) => {
  try {
    const { searchString } = req.body;
    let queryConditions = [];
    // Parse the search string into a Sequelize query
    if (searchString) {
      queryConditions = parseSearchString(searchString);
    }

    // Build the Sequelize query
    const files = await File.findAll({
      where: {
        [Op.and]: queryConditions,
      },
    });
    const mappedFiles = files.map((file) => ({
      id: file.dataValues.id,
      fileName: file.dataValues.fileName,
      fileType: file.dataValues.fileType,
      fileSize: file.dataValues.fileSize,
      // Convert file data to base64 string
      data: file.dataValues.data.toString("base64"),
      // Add other fields you want to include
      firstName: file.dataValues.firstName,
      lastName: file.dataValues.lastName,
      currentTitle : file.dataValues.currentTitle,
      desiredJobTitle : file.dataValues.desiredJobTitle,
      salaryMin : file.dataValues.salaryMin,
      lookingFor : file.dataValues.lookingFor,
      updatedAt : file.dataValues.updatedAt,
      // Add more fields as needed
    }));

    // Send the mapped files array as the response
    res.json(mappedFiles);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Retrieve all Files from the database.
exports.getAllUploadedFiles = async (req, res) => {
  try {
    const files = await File.findAll();
    console.log("files", files);

    // Map files to desired format with file data in base64 string format
    const mappedFiles = files.map((file) => ({
      id: file.dataValues.id,
      fileName: file.dataValues.fileName,
      fileType: file.dataValues.fileType,
      fileSize: file.dataValues.fileSize,
      // Convert file data to base64 string
      data: file.dataValues.data.toString("base64"),
      // Add other fields you want to include
      firstName: file.dataValues.firstName,
      lastName: file.dataValues.lastName,
      // Add more fields as needed
    }));

    // Send the mapped files array as the response
    res.json(mappedFiles);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Find a single File with an id
exports.findOne = async (req, res) => {
  const { id } = req.body;

  try {
    const file = await File.findByPk(id);
    if (file) {
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + file.fileName
      );
      res.send(file);
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
