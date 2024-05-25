// set postgresql database credentials
module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "devxpert",
    DB: "documents",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}