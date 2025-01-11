import { ProductStatus } from "../libs/enums/product.enum";
import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Errors";
import {
  Product,
  ProductInput,
  ProductInquery,
  ProductUpdateInput,
} from "../libs/types/product";
import ProductModel from "../schema/Product.model";
import { T } from "../libs/types/common";
import { ObjectId } from "mongoose";
import ViewService from "./View.service";
import { ViewInput } from "../libs/types/view";
import { ViewGroup } from "../libs/enums/view.enum";

class ProductService {
  private readonly productModel;
  public viewService;

  constructor() {
    this.productModel = ProductModel;
    this.viewService = new ViewService();
  }

  //** SPA**/
  // getProducts 11111111
  public async getProducts(inquery: ProductInquery): Promise<Product[]> {
    const match: T = { productStatus: ProductStatus.PROCESS };

    if (inquery.productCollection)
      match.productCollection = inquery.productCollection;
    if (inquery.search) {
      match.productName = { $regex: new RegExp(inquery.search, "i") };
    }

    const sort: T =
      inquery.order === "productPrice"
        ? { [inquery.order]: 1 }
        : { [inquery.order]: -1 };

    const result = await this.productModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        { $skip: (inquery.page * 1 - 1) * inquery.limit }, // 3
        { $limit: inquery.limit * 1 }, // 3
      ])
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  // getProduct 2222222
  public async getProduct(
    memberId: ObjectId | null,
    id: string
  ): Promise<Product> {
    const productId = shapeIntoMongooseObjectId(id);

    let result = await this.productModel
      .findOne({ _id: productId, productStatus: ProductStatus.PROCESS })
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    if (memberId) {
      // check view log exist
      const input: ViewInput = {
        memberId: memberId,
        viewRefId: productId,
        viewGroup: ViewGroup.PRODUCT,
      };
      const existView = await this.viewService.checkViewExistence(input);
      console.log("exist:", !!existView);

      if (!existView) {
        // insert view log
        console.log("Planning to insert new view");
        await this.viewService.insertMemberView(input);

        // incress target view
        result = await this.productModel
          .findByIdAndUpdate(
            productId,
            { $inc: { productViews: +1 } },
            { new: true }
          )
          .exec();
      }
    }

    return result;
  }

  //** SSR**/
  // updateChoosenProduct
  public async getAllProducts(): Promise<Product[]> {
    const result = await this.productModel.find().exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  // createNewProduct
  public async createNewProduct(input: ProductInput): Promise<Product> {
    try {
      return await this.productModel.create(input);
    } catch (err) {
      console.log("Errors, model: createNewProduct:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  // updateChoosenProduct
  public async updateChoosenProduct(
    id: string,
    input: ProductUpdateInput
  ): Promise<Product> {
    // string => ObjectId
    id = shapeIntoMongooseObjectId(id);
    const result = await this.productModel
      .findOneAndUpdate({ _id: id }, input, { new: true })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

    return result;
  }
}

export default ProductService;
