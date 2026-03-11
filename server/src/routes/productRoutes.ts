const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Rotas públicas
router.get("/", productController.listProducts);
router.get("/:id", productController.getProductById);

// Rotas privadas - Admin
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;