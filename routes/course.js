const { Router } = require("express");
const { CourseModel } = require("../db");
const { userAuth } = require("../auth/UserAuth");

const CourseRouter = Router();

CourseRouter.post("/purchase", userAuth, (req, res) => {});
CourseRouter.get("/preview", (req, res) => {});

module.exports = {
  CourseRouter,
};
