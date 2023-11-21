import { z } from "zod";
import { BaseChannel } from "./Base";
import { ChannelType } from "./type";
import pushoo from "pushoo";

export class Feishu extends BaseChannel {
  readonly type = ChannelType.Feishu;

  static getSchema() {
    return z.object({
      token: z
        .string({
          required_error: "please input bot token",
        })
        .min(1, {
          message: "please input bot token",
        }),
    });
  }

  static getOptions() {
    return [
      {
        name: "token",
        label: "Bot Token",
        defaultValue: "",
      },
    ];
  }

  static sendMessage(
    sms: {
      body: string;
      token: string;
      id: number;
      name: string;
      type: string;
    },
    data: Record<string, any>
  ) {
    return pushoo("feishu", {
      token: sms.token,
      title: data.title,
      content: data.content,
    });
  }
}
