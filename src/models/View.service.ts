import Errors, {HttpCode, Message} from "../libs/Errors";
import { View, ViewInput } from "../libs/types/view";
import ViewModel from "../schema/View.model";


class ViewService {
  private readonly viewModel;

  constructor() {
    this.viewModel = ViewModel;
  }

  // checkViewExistence
  public async checkViewExistence(input: ViewInput): Promise<View> {
    const { memberId, viewRefId } = input;
    return await this.viewModel
      .findOne({ memberId: memberId, viewRefId: viewRefId })
      .exec();
  }

  // insertMemberView
  public async insertMemberView(input: ViewInput): Promise<View> {
    try {
      return await this.viewModel.create(input);
    } catch (err) {
      console.log("ERROR, model:insertMemberView:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }
}

export default ViewService;