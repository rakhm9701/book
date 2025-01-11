import {
  Order,
  OrderInQuary,
  OrderItemInput,
  OrderUpdateInput,
} from "../libs/types/order";
import { Member } from "../libs/types/member";
import OrderModel from "../schema/Order.model";
import OrderItemModel from "../schema/OrderItem.model";
import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { Message, HttpCode } from "../libs/Errors";
import { ObjectId } from "mongoose";
import { OrderStatus } from "../libs/enums/order.enum";
import MemberService from "./Members.service";

class OrderServise {
  private readonly orderModel;
  private readonly orderItemModel;
  private readonly memberServise;

  constructor() {
    this.orderModel = OrderModel;
    this.orderItemModel = OrderItemModel;
    this.memberServise = new MemberService();
  }

  // createOrder
  public async createOrder(
    member: Member,
    input: OrderItemInput[]
  ): Promise<Order> {
    console.log("input:", input);

    const memberId = shapeIntoMongooseObjectId(member._id);
    const amount = input.reduce((accumulater: number, item: OrderItemInput) => {
      return accumulater + item.itemPrice * item.itemQuantity;
    }, 0);

    const delivery = amount < 100 ? 5 : 0;

    try {
      const newOrder: Order = await this.orderModel.create({
        orderTotal: amount + delivery,
        orderDelivery: delivery,
        memberId: memberId,
      });

      console.log("OrderId:", newOrder._id);
      const orderId = newOrder._id;
      await this.recordOrderItem(orderId, input);

      return newOrder;
    } catch (err) {
      console.log("Error, model:createOrder:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  // recordOrderItem
  private async recordOrderItem(
    orderId: ObjectId,
    input: OrderItemInput[]
  ): Promise<void> {
    const promisedList = input.map(async (item: OrderItemInput) => {
      item.orderId = orderId;
      item.productId = shapeIntoMongooseObjectId(item.productId);

      await this.orderItemModel.create(item);
      return "INSERTED";
    });

    console.log("promiseList", promisedList);
    const orderItemStep = await Promise.all(promisedList);
    console.log("orderItemStep", orderItemStep);
  }

  // getMyOrders
  public async getMyOrders(
    member: Member,
    inquery: OrderInQuary
  ): Promise<Order[]> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const matches = { memberId: memberId, orderStatus: inquery.orderStatus };
    const result = await this.orderModel
      .aggregate([
        { $match: matches },
        { $sort: { updatedAt: -1 } },
        { $skip: (inquery.page - 1) * inquery.limit },
        { $limit: inquery.limit },
        {
          $lookup: {
            from: "orderItems",
            localField: "_id",
            foreignField: "orderId",
            as: "orderItems",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "orderItems.productId",
            foreignField: "_id",
            as: "productData",
          },
        },
      ])
      .exec();
    console.log("result", result);
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  // updateOrder
  public async updateOrder(
    member: Member,
    input: OrderUpdateInput
  ): Promise<Order> {
    const memberId = shapeIntoMongooseObjectId(member._id),
      orderId = shapeIntoMongooseObjectId(input.orderId),
      orderStatus = input.orderStatus;

    const result = await this.orderModel
      .findByIdAndUpdate(
        {
          memberId: memberId,
          _id: orderId,
        },
        { orderStatus: orderStatus },
        { new: true }
      )
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

    if (orderStatus === OrderStatus.PROCESS) {
      await this.memberServise.addUserPoint(member, 1);
    }
    return result;
  }
}

export default OrderServise;
