const { Router } = require("express");
const { UserModel } = require("../db");

const UserRouter = Router();

UserRouter.post("/signup", (req, res) => {});
UserRouter.post("/signin", (req, res) => {});
UserRouter.post("/purchase", (req, res) => {});

module.exports = {
  UserRouter,
};
