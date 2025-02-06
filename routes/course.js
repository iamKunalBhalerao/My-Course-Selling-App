const { Router } = require("express");
const { CourseModel, PurchaseModel } = require("../db");
const { userAuth } = require("../auth/UserAuth");

const CourseRouter = Router();

CourseRouter.post("/purchase", userAuth, async (req, res) => {
  const userId = req.userId;
  const courseId = req.body.courseId;

  await PurchaseModel.create({
    userId,
    courseId,
  });

  res.status(200).json({
    message: "You Have SUccessfully Bought the Course 🙏😍💕",
  });
});

CourseRouter.get("/preview", async (req, res) => {
  const courses = await CourseModel.find({});

  res.status(200).json({
    courses,
  });
});

module.exports = {
  CourseRouter,
};
