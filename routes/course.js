const { Router } = require("express");
const { CourseModel } = require("../db");

const CourseRouter = Router();

CourseRouter.post("/signup", (req, res) => {});
CourseRouter.post("/signin", (req, res) => {});
CourseRouter.post("/purchase", (req, res) => {});

module.exports = {
  CourseRouter,
};
