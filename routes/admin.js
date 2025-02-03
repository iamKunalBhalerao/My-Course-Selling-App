const { Router } = require("express");
const { AdminModel } = require("../db");

const AdminRouter = Router();

AdminRouter.post("/signup", (req, res) => {});
AdminRouter.post("/signin", (req, res) => {});
AdminRouter.post("/purchase", (req, res) => {});

module.exports = {
  AdminRouter,
};
