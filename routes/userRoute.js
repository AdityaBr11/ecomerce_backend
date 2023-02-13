const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  getUserDetails,
  changePassword,
  profileUpdate,
  getAllUsers,
  getSingleUsers,
  userRoleUpdate,
  deleteUser,
} = require("../controllers/userController");
const { isAuthancticate, authorizeRole } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(logout);

router.route("/profile").get(isAuthancticate, getUserDetails);

router.route("/password/update").put(isAuthancticate, changePassword);

router.route("/profile/update").put(isAuthancticate, profileUpdate);

router
  .route("/admin/users")
  .get(isAuthancticate, authorizeRole("admin"), getAllUsers);

router
  .route("/admin/user/:id")
  .get(isAuthancticate, authorizeRole("admin"), getSingleUsers)
  .put(isAuthancticate, authorizeRole("admin"), userRoleUpdate)
  .delete(isAuthancticate, authorizeRole("admin"), deleteUser)

module.exports = router;
