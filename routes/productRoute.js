const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
  createProductReview,
  getAllProductReview,
  deleteProductReview,
} = require("../controllers/productController");
const { isAuthancticate, authorizeRole } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProducts);
router
  .route("/admin/product/new")
  .post(isAuthancticate, authorizeRole("admin"), createProduct);
router
  .route("/admin/product/:id")
  .put(isAuthancticate, authorizeRole("admin"), updateProduct)
  .delete(isAuthancticate, authorizeRole("admin"), deleteProduct);

router.route("/product/:id").get(getSingleProduct);

router.route("/product/review").put(isAuthancticate,createProductReview);

router.route("/review").get(getAllProductReview).delete(isAuthancticate,deleteProductReview)

module.exports = router;
