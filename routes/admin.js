const { Router } = require("express");
const { AdminModel } = require("../db");
const bcrypt = require("bcrypt");
const z = require("zod");

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

    try {
      const hashedAdminPassword = bcrypt.hash(password, 5);

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
  }
});
AdminRouter.post("/signin", (req, res) => {});
AdminRouter.post("/purchase", (req, res) => {});

module.exports = {
  AdminRouter,
};
