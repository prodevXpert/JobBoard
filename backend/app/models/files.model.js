module.exports = (sequelize, Sequelize) => {
  const File = sequelize.define("file", {
    name: {
      type: Sequelize.STRING,
    },
    type: {
      type: Sequelize.STRING,
    },
    // size: {
    //   type: Sequelize.STRING,
    // },
    data: {
      type: Sequelize.BLOB("long"),
    },
  });
  return File;
};
 