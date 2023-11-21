import { z } from "zod";
import { BaseChannel } from "./Base";
import { ChannelType } from "./type";
import pushoo from "pushoo";

export class Dingtalk extends BaseChannel {
  readonly type = ChannelType.Dingtalk;

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
            label: "Markdown",
            value: "markdown",
          },
        ],
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
    return pushoo("dingtalk", {
      token: sms.token,
      title: data.title,
      content: data.content,
      options: {
        dingtalk: {
          msgtype: body.msg_type,
        },
      },
    });
  }
}
