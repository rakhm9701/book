import express, { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import ProductService from "../models/Product.service";
import { ProductInput, ProductInquery } from "../libs/types/product";
import { AdminRequest, ExtendedRequest } from "../libs/types/member";
import { ProductCollection } from "../libs/enums/product.enum";
import { shapeIntoMongooseObjectId } from "../libs/config";

const productService = new ProductService();
const productController: T = {};
//** SPA**/
//getProducts
productController.getProducts = async (req: Request, res: Response) => {
  try {
    console.log("getProducts");
    const { page, limit, order, productCollection, search } = req.query;
    const inquery: ProductInquery = {
      order: String(order),
      page: Number(page),
      limit: Number(limit),
    };

    if (productCollection) {
      inquery.productCollection = productCollection as ProductCollection;
    }
    if (search) inquery.search = String(search);

    const result = await productService.getProducts(inquery);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getProducts:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// getProduct
productController.getProduct = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("getProduct");

    const { id } = req.params;
    const memberId = req.member?._id ?? null,
      result = await productService.getProduct(memberId, id);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("getProduct", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

//likeProduct
productController.likeProduct = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("likeProduct");

    const productId = shapeIntoMongooseObjectId(req.params.id);
    
    const memberId = shapeIntoMongooseObjectId(req.member);

    const result = await productService.likeProduct(memberId, productId);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, likeProduct:", err);
  }
};

//** SSR **/
// getAllProducts
productController.getAllProducts = async (req: Request, res: Response) => {
  try {
    console.log("getAllProducts");
    const data = await productService.getAllProducts();

    res.render("products", { products: data });
  } catch (err) {
    console.log("Error, getAllProducts:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// createNewProduct
productController.createNewProduct = async (
  req: AdminRequest,
  res: Response
) => {
  try {
    console.log("createNewProduct");
    console.log("req.body:", req.body);

    if (!req.files?.length)
      throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);

    const data: ProductInput = req.body;
    data.productImages = req.files?.map((ele) => {
      return ele.path.replace(/\\/g, "/");
    });

    await productService.createNewProduct(data);
    res.send(
      `<script> alert("Successful creation"); window.location.replace("/admin/product/all") </script>`
    );
  } catch (err) {
    console.log("Error, createNewProduct:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETING_WENT_WRONG;
    res.send(
      `<script> alert("${message}"); window.location.replace("/admin/product/all") </script>`
    );
  }
};

// updateChoosenProduct
productController.updateChoosenProduct = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("updateChoosenProduct");
    const id = req.params.id;
    console.log("id:", id);

    const result = await productService.updateChoosenProduct(id, req.body);

    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    console.log("Error, updateChoosenProduct:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default productController;
