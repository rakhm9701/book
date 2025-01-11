import express from "express";
const routerAdmin = express.Router();
import ShopController from "./controllers/shop.controller";
import productController from "./controllers/product.controller";
import makeUploader from "./libs/utils/uploader";

/** Shop  */
routerAdmin.get("/", ShopController.goHome);
routerAdmin
  .get("/login", ShopController.getLogin)
  .post("/login", ShopController.processLogin);
routerAdmin
  .get("/signup", ShopController.getSignup)
  .post(
    "/signup",
    makeUploader("members").single("memberImage"),
    ShopController.processSignup
  );
routerAdmin.get("/logout", ShopController.logout);
routerAdmin.get("/check-me", ShopController.checkAuthSession);

/** Product */
routerAdmin.get(
  "/product/all",
  ShopController.verifyShop,
  productController.getAllProducts
);
routerAdmin.post(
  "/product/create",
  ShopController.verifyShop,
  makeUploader("products").array("productImages", 5),
  productController.createNewProduct
);
routerAdmin.post(
  "/product/:id",
  ShopController.verifyShop,
  productController.updateChoosenProduct
);

/** User */
routerAdmin.get(
  "/user/all",
  ShopController.verifyShop,
  ShopController.getUsers
);

routerAdmin.post(
  "/user/edit",
  ShopController.verifyShop,
  ShopController.updateChosenUser
);

export default routerAdmin;
