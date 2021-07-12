const swaggerOptions = {
  definition: {
    info: {
      title: "API with nodeJS and MySQL",
    },
  },
  apis: ["./src/routes/**/*.js"],
};

module.exports = swaggerOptions;
