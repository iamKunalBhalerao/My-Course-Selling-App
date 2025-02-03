const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");

const { UserRouter } = require("./routes/user");
const { AdminRouter } = require("./routes/admin");
const { CourseRouter } = require("./routes/course");

const app = express();
app.use(express.json());

app.use("/api/v1/user", UserRouter);
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/course", CourseRouter);

function main() {
  mongoose.connect(process.env.MONGO_URL);
  app.listen(3000, () => {
    console.log("server is on PORT:3000");
  });
}
main();
