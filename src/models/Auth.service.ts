import Errors, { HttpCode, Message } from "../libs/Errors";
import { AUTH_TIMER, shapeIntoMongooseObjectId } from "../libs/config";
import { Member } from "../libs/types/member";
import jwt from "jsonwebtoken";

class AuthService {
  private readonly secretToken;
  memberModel: any;
  constructor() {
    this.secretToken = process.env.SECRET_TOKEN as string;
  }

  //   createToken
  public async createToken(payload: Member): Promise<string> {
    return new Promise((resolve, reject) => {
      const duration = `${AUTH_TIMER}h`;
      jwt.sign(
        payload,
        this.secretToken,
        {
          expiresIn: duration,
        },
        (err, token) => {
          if (err)
            reject(
              new Errors(HttpCode.UNAUTHORIZED, Message.TOKEN_CREATION_FAILED)
            );
          else resolve(token as string);
        }
      );
    });
  }

  // // login
  // public async login(identifier: string, password: string): Promise<Member> {
  //   const user = await this.memberModel
  //     .findOne(
  //       this.memberModel.memberNick === identifier ||
  //         (this.memberModel.memberPassword === identifier && this.memberModel)
  //           .memberPassword
  //     )
  //     .exec();
  //   return user;
  // }

  //   checkAuth
  public async checkAuth(token: string): Promise<Member> {
    const result: Member = (await jwt.verify(
      token,
      this.secretToken
    )) as Member;
    console.log(`--- [AUTH] memberNick: ${result.memberNick} ---`);
    return result;
  }
}

export default AuthService;
