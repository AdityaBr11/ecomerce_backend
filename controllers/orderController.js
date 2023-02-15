const Product = require("../models/productModels");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncerror = require("../middleware/catchAsyncerror");
const Order = require("../models/orderModels");

exports.newOrder = catchAsyncerror(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).send({
    success: true,
    order,
  });
});

// get Single Order
exports.getSingleOrder = catchAsyncerror(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  ); //this method finds us the user from its id

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  res.status(200).send({
    success: true,
    order,
  });
});

// get logged in user  Orders
exports.myOrders = catchAsyncerror(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).send({
    success: true,
    orders,
  });
});

// Get All orders -admin
exports.getAllOrders = catchAsyncerror(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  res.status(200).send({
    success: true,
    orders,
    totalAmount,
  });
});

// Update Order Status -admin
exports.updateOrder = catchAsyncerror(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  order.orderItems.forEach(async (o) => {
    await updateStock(o.product, o.quantity);
  });

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save();
  res.status(200).send({
    success: true,
  });
});

//this fntn is to update the product stock
async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.Stock = product.Stock - quantity;

  await product.save({ validateBeforeSave: false });
}

// delete Order -- Admin
exports.deleteOrder = catchAsyncerror(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  await order.remove();

  res.status(200).send({
    success: true,
  });
});
