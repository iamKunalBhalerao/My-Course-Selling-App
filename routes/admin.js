const { Router } = require("express");
const { AdminModel, CourseModel } = require("../db");
const bcrypt = require("bcrypt");
const z = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminAuth } = require("../auth/AdminAuth");

const AdminRouter = Router();

AdminRouter.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const requireBody = z.object({
    email: z.string().min(3).max(100).email(),
    firstName: z.string().min(3).max(100),
    lastName: z.string().min(3).max(100),
    password: z
      .string()
      .min(3)
      .max(100)
      .refine((value) => /[A-Z]/.test(value), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((value) => /[a-z]/.test(value), {
        message: "Password must contain at least one lowercase letter",
      })
      .refine((value) => /\d/.test(value), {
        message: "Password must contain at least one digit",
      })
      .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
        message: "Password must contain at least one special character",
      }),
  });

  const parseAdminBodySuccess = requireBody.safeParse(req.body);

  if (!parseAdminBodySuccess) {
    res.status(403).json({
      message: "Invalid Email or Password 🤬",
    });
  }

  try {
    const hashedAdminPassword = await bcrypt.hash(password, 5);

    await AdminModel.create({
      email: email,
      password: hashedAdminPassword,
      firstName: firstName,
      lastName: lastName,
    });

    res.status(200).json({
      message: "You are Signed Up as Admin 👏",
    });
  } catch (e) {
    res.status(403).json({
      message: "User Alredy Exists 🤬",
    });
  }
});
AdminRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const admin = await AdminModel.findOne({
    email: email,
  });

  if (!admin) {
    res.status(403).json({
      message: "User Not Found 🤬",
    });
  }

  const compareAdminPassword = await bcrypt.compare(password, admin.password);

  if (compareAdminPassword) {
    const token = jwt.sign({ id: admin._id }, JWT_ADMIN_PASSWORD);
    res.status(200).json({
      token,
    });
  } else {
    res.status(403).json({
      message: "Invalid Credentials",
    });
  }
});

AdminRouter.post("/create-course", adminAuth, async (req, res) => {
  const userId = req.userId;
  const { title, description, price, imageUrl } = req.body;

  try {
    const course = await CourseModel.create({
      title: title,
      description: description,
      price: price,
      imageUrl: imageUrl,
      creatorId: userId,
    });

    res.status(200).json({
      message: "Course Created Successfully",
      courseId: course._id,
    });
  } catch (e) {
    res.status(200).json({
      message: "Invalid Credentials",
    });
  }
});

AdminRouter.put("/update-course", adminAuth, async (req, res) => {
  const userId = req.userId;
  const { title, description, price, imageUrl, courseId } = req.body;

  try {
    const course = await CourseModel.updateOne(
      {
        _id: courseId,
        creatorId: userId,
      },
      {
        title: title,
        description: description,
        price: price,
        imageUrl: imageUrl,
      }
    );

    res.status(200).json({
      message: "Course Updated Successfully 👏",
      courseId: course._id,
      courseData: course,
    });
  } catch (e) {
    res.status(403).json({
      message: "Credentials Incorrect 🤬",
    });
  }
});

AdminRouter.delete("/delete-course", adminAuth, async (req, res) => {
  const userId = req.userId;
  const { courseId } = req.body;

  try {
    const course = await CourseModel.deleteOne({
      _id: courseId,
      creatorId: userId,
    });

    res.status(200).json({
      message: "Course Deleted Successfully 👏",
      courseId: course._id,
      courseData: course,
    });
  } catch (e) {
    res.status(403).json({
      message: "Credentials Incorrect 🤬",
    });
  }
});

AdminRouter.get("/course-bulk", adminAuth, async (req, res) => {
  const adminId = req.userId;

  try {
    const courses = await CourseModel.find({
      creatorId: adminId,
    });

    res.status(200).json({
      message: "Your Courses: ",
      courseData: courses,
    });
  } catch (e) {
    res.status(403).json({
      message: "Something Went Wrong 🤬",
    });
  }
});

module.exports = {
  AdminRouter,
};
