const { Router } = require("express");
const z = require("zod");
const bcrypt = require("bcrypt");
const { UserModel } = require("../db");

const UserRouter = Router();

UserRouter.post("/signup", async (req, res) => {
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

  const parseUserBodyWithSuccess = requireBody.safeParse(req.body);

  if (!parseUserBodyWithSuccess.success) {
    res.status(403).json({
      message: "Invalid Email or Password 😡",
    });
  }

  const hashedPassword = bcrypt.hash(password, 5);

  try {
    await UserModel.create({
      email: email,
      passsword: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });

    res.status(200).json({
      message: "You are Signed Up 👏",
    });
  } catch (e) {
    res.status(403).json({
      message: "User Alredy Exists 🤬",
    });
  }
});
UserRouter.post("/signin", (req, res) => {});
UserRouter.post("/purchase", (req, res) => {});

module.exports = {
  UserRouter,
};
