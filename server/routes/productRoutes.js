import express from "express"
import { upload } from "../config/multer.js";
import userAuth from "../middleware/userAuth.js";
import { createProduct, getAllProducts, deleteProducts, createReview } from "../controllers/productController.js";


const productRouter = express.Router();

productRouter.post("/create-product", upload.array("images", 10), createProduct)
productRouter.get("/get-all-products/:id", getAllProducts)
productRouter.post("/delete-shop-product/:id", deleteProducts)
productRouter.post("/create-new-review", userAuth, createReview)

export default productRouter