module.exports = (sequelize, Sequelize) => {
  const File = sequelize.define("file", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: Sequelize.STRING,
    },
    lastName: {
      type: Sequelize.STRING,
    },
    location: {
      type: Sequelize.STRING,
    },
    currentTitle: {
      type: Sequelize.STRING,
    },
    desiredJobTitle: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    phone: {
      type: Sequelize.STRING,
    },
    salaryPerHour: {
      type: Sequelize.STRING,
    },
    salaryPerMonth: {
      type: Sequelize.STRING,
    },
    salaryPerAnnum: {
      type: Sequelize.STRING,
    },
    salaryMin: {
      type: Sequelize.STRING,
    },
    salaryMax: {
      type: Sequelize.STRING,
    },
    lookingFor: {
      type: Sequelize.STRING,
    },
    fileName: {
      type: Sequelize.STRING,
    },
    fileType: {
      type: Sequelize.STRING,
    },
    fileSize: {
      type: Sequelize.STRING,
    },
    data: {
      type: Sequelize.BLOB("long"),
    },
  });
  return File;
};
