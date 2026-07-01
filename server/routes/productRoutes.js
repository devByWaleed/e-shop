import express from "express"
import { upload } from "../config/multer.js";
import { createProduct, getAllProducts, deleteProducts } from "../controllers/productController.js";


const productRouter = express.Router();

productRouter.post("/create-product", upload.array("images", 10), createProduct)
productRouter.get("/get-all-products/:id", getAllProducts)
productRouter.post("/delete-shop-product/:id", deleteProducts)

export default productRouter