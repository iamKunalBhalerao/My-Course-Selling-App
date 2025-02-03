const { Router } = require("express");
const z = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../db");
const { userAuth } = require("../auth/UserAuth");
const { JWT_USER_PASSWORD } = require("../config");

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
      error: parseUserBodyWithSuccess.error.errors,
    });
  }

  try {
    const hashedUserPassword = await bcrypt.hash(password, 5);
    await UserModel.create({
      email: email,
      password: hashedUserPassword,
      firstName: firstName,
      lastName: lastName,
    });

    res.status(200).json({
      message: "You are Signed Up as a User 👏",
    });
    return;
  } catch (e) {
    res.status(403).json({
      message: "User Alredy Exists 🤬",
    });
    return;
  }
});
UserRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({
    email: email,
  });

  if (!user) {
    res.status(403).json({
      message: "User Not Found 🤬",
    });
  }

  const compareUserPassword = await bcrypt.compare(password, user.password);

  if (compareUserPassword) {
    const token = jwt.sign({ id: user._id }, JWT_USER_PASSWORD);
    res.status(200).json({
      token,
    });
  } else {
    res.status(403).json({
      message: "Invalid Credentials",
    });
  }
});
UserRouter.post("/purchase", userAuth, (req, res) => {});

module.exports = {
  UserRouter,
};
