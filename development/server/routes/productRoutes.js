const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
} = require("../controller/product/productController");
const { isAuthenticated, restrictTo } = require("../middleware/middlewareAuth");

const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/products/:id").get(getProductById);

router
  .route("/products")
  .post(isAuthenticated, restrictTo("artist", "vendor", "admin"), createProduct);

router
  .route("/products/:id")
  .put(isAuthenticated, restrictTo("artist", "vendor", "admin"), updateProduct)
  .delete(isAuthenticated, restrictTo("artist", "vendor", "admin"), deleteProduct);

router
  .route("/products/me")
  .get(isAuthenticated, restrictTo("artist", "vendor", "admin"), getMyProducts);

module.exports = router;
