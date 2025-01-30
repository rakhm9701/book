import { LikeInput, Like } from "../libs/types/like";
import LikeModel from "../schema/Like.model";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/common";

class LikeService {
  private readonly likeModel;

  constructor() {
    this.likeModel = LikeModel;
  }

  public async checkLikeExistence(input: LikeInput): Promise<Like> {
    const { memberId, likeRefId } = input;
    return await this.likeModel
      .findOne({ memberId: memberId, likeRefId: likeRefId })
      .exec();
  }

  public async insertMemberView(input: LikeInput): Promise<Like> {
    try {
      const result = await this.checkLikeExistence(input);
      if (result) {
        return await this.likeModel.remove(input);
      } else {
        return await this.likeModel.create(input);
      }
    } catch (err) {
      console.log("ERROR, model:insertMemberLike:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async toggleLike(input: LikeInput): Promise<number> {
    const search: T = { memberId: input.memberId, likeRefId: input.likeRefId },
      exist = await this.likeModel.findOne(search).exec();
    let modifier = 1;

    if (exist) {
      await this.likeModel.findOneAndDelete(search).exec();
      modifier = -1;
    } else {
      try {
        await this.likeModel.create(input);
        modifier = 1;
      } catch (err) {
        console.log("ERROR, model:toggleLike:", err);
        throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
      }
    }
    return modifier;
  }

  //   public async toggleLike(input: LikeInput): Promise<number> {
  //     const search: T = { memberId: input.memberId, likeRefId: input.likeRefId },
  //       exist = await this.likeModel.findOne(search).exec();
  //     let modifier = 1;

  //     if (exist) {
  //       await this.likeModel.findOneAndDelete(search).exec();
  //       modifier = -1;
  //     } else {
  //       try {
  //         await this.likeModel.create(input);
  //         modifier = 1;
  //       } catch (err) {
  //         console.log("Error, Service.mode:", err.message);
  //         throw new BadRequestException(Message.CREATE_FAILED);
  //       }
  //     }
  //     console.log(`- Like modifier ${modifier} -`);
  //     return modifier;
  //   }
}

export default LikeService;
