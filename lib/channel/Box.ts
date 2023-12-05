import { Telegram } from "./Telegram";
import { Lark } from "./Lark";
import { ChannelType } from "./type";
import { Feishu } from "./Feishu";
import { Dingtalk } from "./DingTalk";
import { Bark } from "./Bark";
import { Wecom } from "./Wecom";

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
      case ChannelType.Feishu + "":
        this.type = ChannelType.Feishu;
        break;
      case ChannelType.Dingtalk + "":
        this.type = ChannelType.Dingtalk;
        break;
      case ChannelType.Bark + "":
        this.type = ChannelType.Bark;
        break;
      case ChannelType.Wecom + "":
        this.type = ChannelType.Wecom;
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
      case ChannelType.Feishu:
        return Feishu;
      case ChannelType.Dingtalk:
        return Dingtalk;
      case ChannelType.Bark:
        return Bark;
      case ChannelType.Wecom:
        return Wecom;
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
