const app = require("./app");
const cors = require("cors");

var corsOptions = {
  origin: "*",
  optionssuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("200");
});

app.listen(app.get("port"), () => {
  console.log(`app listen http://localhost:${app.get("port")}`);
});
