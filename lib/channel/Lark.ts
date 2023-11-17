import { BaseChannel } from "./Base";
import { ChannelType } from "./type";
import { z } from "zod";

export class Lark extends BaseChannel {
  readonly type = ChannelType.Lark;

  static getSchema() {
    return z.object({
      token: z
        .string({
          required_error: "please input bot token",
        })
        .min(1, {
          message: "please input bot token",
        }),
      msg_type: z
        .string({
          required_error: "please select message type",
        })
        .min(1, {
          message: "please input message type",
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
        name: "msg_type",
        label: "Message Type",
        defaultValue: "text",
        options: [
          {
            label: "Text",
            value: "text",
          },
          {
            label: "Post",
            value: "post",
          },
          {
            label: "Image",
            value: "image",
          },
          {
            label: "Share Chat",
            value: "share_chat",
          },
          {
            label: "Interactive",
            value: "interactive",
          },
        ],
      },
    ];
  }

  static sendMessage(
    token: {
      body: string;
      token: string;
      id: number;
      name: string;
      type: string;
    },
    data: Record<string, any>
  ) {
    console.log("lark");
  }
}
