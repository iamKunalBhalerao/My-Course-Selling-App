const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
});

const AdminSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
});

const CourseSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  courseId: ObjectId,
});

const PurchaseSchema = new Schema({
  userId: ObjectId,
  courseId: ObjectId,
});

const UserModel = model("users", UserSchema);
const AdminModel = model("users", AdminSchema);
const CourseModel = model("users", CourseSchema);
const PurchaseModel = model("users", PurchaseSchema);

module.exports = {
  UserModel,
  AdminModel,
  CourseModel,
  PurchaseModel,
};
