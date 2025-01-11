import { ExtendedRequest } from "../libs/types/member";
import { T } from "../libs/types/common";
import Errors, { HttpCode, Message } from "../libs/Errors";
import OrderModel from "../schema/Order.model";
import OrderServise from "../models/Order.service";
import { Response } from "express";
import { OrderInQuary, OrderUpdateInput } from "../libs/types/order";
import { OrderStatus } from "../libs/enums/order.enum";

const orderController: T = {};
const orderServise = new OrderServise();

// createOrder
orderController.createOrder = async (req: ExtendedRequest, res: Response) => {
  try {
    console.error("createOrder");

    const result = await orderServise.createOrder(req.member, req.body);

    res.status(HttpCode.CREATED).json(result);
  } catch (err) {
    console.error("createOrder", err);
    throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
  }
};


// getMyOrders
orderController.getMyOrders = async (req: ExtendedRequest, res: Response) => {
  try {
    console.error("getMyOrders");

    const { page, limit, orderStatus } = req.query;
    const inquery: OrderInQuary = {
      page: Number(page),
      limit: Number(limit),
      orderStatus: orderStatus as OrderStatus,
    };

    console.log("inquery", inquery);

    const result = await orderServise.getMyOrders(req.member, inquery);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.error("getMyOrders", err);
    throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
  }
};

// updateOrder
orderController.updateOrder = async (req: ExtendedRequest, res: Response) => {
  try {
    console.error("updateOrder");

    const input: OrderUpdateInput = req.body;
    console.log("javob1:", input);
    const result = await orderServise.updateOrder(req.member, input);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.error("updateOrder", err);
    throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
  }
};

export default orderController;

