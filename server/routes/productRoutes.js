import express from "express"
import { upload } from "../config/multer.js";
import userAuth from "../middleware/userAuth.js";
import { createProduct, getShopProducts, deleteProducts, createReview, getAllProducts } from "../controllers/productController.js";


const productRouter = express.Router();

productRouter.post("/create-product", upload.array("images", 10), createProduct)
productRouter.get("/get-shop-products/:id", getShopProducts)
productRouter.get("/get-all-products", getAllProducts)
productRouter.post("/delete-shop-product/:id", deleteProducts)
productRouter.post("/create-new-review", userAuth, createReview)

export default productRouter