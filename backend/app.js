const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const stuffRoutes = require("./routes/stuff");
const userRoutes = require("./routes/user");
// Helmet : help secure Express applications by setting various headers HTTP
const helmet = require("helmet");
mongoose
  .connect(
    "mongodb+srv://SauceAdmin:ZJCQgbc72uNszal5@cluster0.ik8wu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Successful connection to mongodb!"))
  .catch(() => console.log("Connection to mongodb failed !"));

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "127.0.0.1", "localhost"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/sauces", stuffRoutes);
app.use("/api/auth", userRoutes);
module.exports = app;
