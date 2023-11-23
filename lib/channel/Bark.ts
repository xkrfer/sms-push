import { z } from "zod";
import { BaseChannel } from "./Base";
import { ChannelType } from "./type";
import pushoo from "pushoo";

export class Bark extends BaseChannel {
  readonly type = ChannelType.Bark;

  static getSchema() {
    return z.object({
      token: z
        .string({
          required_error: "please input bot token",
        })
        .min(1, {
          message: "please input bot token",
        }),
      url: z.string().optional(),
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
        name: "url",
        label: "URL",
        placeholder: "to open when click notification",
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
    return pushoo("bark", {
      token: sms.token,
      title: data.title,
      content: data.content,
      options: {
        bark: {
          ...body,
        },
      },
    });
  }
}
