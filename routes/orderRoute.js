const express = require("express");
const { newOrder, getSingleOrder, myOrders, getAllOrders, deleteOrder, updateOrder } = require("../controllers/orderController");
const { isAuthancticate, authorizeRole } = require("../middleware/auth");

const router = express.Router();

router.route("/order/new").post(isAuthancticate,newOrder);
router.route("/order/:id").get(isAuthancticate, getSingleOrder);

router.route("/orders/me").get(isAuthancticate, myOrders);

//admin
router.route("/admin/orders").get(isAuthancticate, authorizeRole("admin"),getAllOrders);
router.route("/admin/orders/:id").put(isAuthancticate, authorizeRole("admin"),updateOrder).delete(isAuthancticate, authorizeRole("admin"),deleteOrder);

module.exports=router;