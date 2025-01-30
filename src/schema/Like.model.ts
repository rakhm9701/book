import mongoose, { Schema } from "mongoose";
import { LikeGroup } from "../libs/enums/like.enum";

const likeSchema = new Schema(
  {
    likeGroup: {
      type: String,
      enum: LikeGroup,
      required: true,
    },
    memberId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Member",
    },

    viewRefId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("like", likeSchema);
