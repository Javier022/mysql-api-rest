const app = require("./app");

app.get("/", (req, res) => {
  res.send("200");
});

app.listen(app.get("port"), () => {
  console.log(`app listen http://localhost:${app.get("port")}`);
});
