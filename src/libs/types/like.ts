import { ObjectId } from "mongoose";
import { LikeGroup } from "../enums/like.enum";

export interface Like {
  _id: ObjectId;
  LikeGroup: LikeGroup;
  memberId: ObjectId;
  likeRefId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface LikeInput {
  memberId: ObjectId;
  likeRefId: ObjectId;
  likeGroup: LikeGroup;
}
