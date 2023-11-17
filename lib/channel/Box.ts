import { Telegram } from "./Telegram";
import { Lark } from "./Lark";
import { ChannelType } from "./type";

export class ChannelBox {
  type?: ChannelType;
  constructor(type: string) {
    switch (type) {
      case ChannelType.Telegram + "":
        this.type = ChannelType.Telegram;
        break;
      case ChannelType.Lark + "":
        this.type = ChannelType.Lark;
        break;
      default:
        break;
    }
  }

  getChannel() {
    switch (this.type) {
      case ChannelType.Telegram:
        return Telegram;
      case ChannelType.Lark:
        return Lark;
      default:
        throw new Error("not ChannelBox");
    }
  }

  getSchema() {
    return this.getChannel().getSchema();
  }

  getOptions() {
    return this.getChannel().getOptions();
  }

  async sendMessage(
    sms: {
      body: string;
      token: string;
      id: number;
      name: string;
      type: string;
    },
    data: Record<string, any>
  ) {
    return this.getChannel().sendMessage(sms, data);
  }
}
