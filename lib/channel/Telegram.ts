import { BaseChannel } from "./Base";
import { ChannelType } from "./type";
import { z } from "zod";
import pushoo from "pushoo";

export class Telegram extends BaseChannel {
  readonly type = ChannelType.Telegram;

  static getSchema() {
    return z.object({
      token: z
        .string({
          required_error: "please input bot token",
        })
        .min(1, {
          message: "please input bot token",
        }),
      chat_id: z
        .string({
          required_error: "please input chat id",
        })
        .min(1, {
          message: "please input chat id",
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
      {
        name: "chat_id",
        label: "Chat ID",
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
    const body = JSON.parse(sms.body);
    const token = `${sms.token}#${body.chat_id}`;
    console.log("telegram body", body);

    return pushoo("telegram", {
      token,
      title: data.title,
      content: data.content,
    });
  }
}
