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
            label: "Markdown",
            value: "markdown",
          },
        ],
      },
    ];
  }

  static getHookUrl(token: string) {
    return `https://open.larksuite.com/open-apis/bot/v2/hook/${token}`;
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
    const { token } = sms;
    const body = JSON.parse(sms.body);
    const { msg_type } = body;
    if (msg_type === "text") {
      return this.sendTextMessage(token, data);
    } else if (msg_type === "markdown") {
      return this.sendMarkdownMessage(token, data);
    }
  }

  static sendTextMessage(token: string, data: Record<string, any>) {
    const { title, content } = data;
    const url = this.getHookUrl(token);
    const body = {
      msg_type: "text",
      content: {
        text: `${title}\n${content}`,
      },
    };
    return fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  static sendMarkdownMessage(token: string, data: Record<string, any>) {
    const { title, content } = data;
    const url = this.getHookUrl(token);
    const body = {
      msg_type: "interactive",
      card: {
        elements: [
          {
            tag: "div",
            text: {
              content,
              tag: "lark_md",
            },
          },
        ],
        header: {
          title: {
            content: title,
            tag: "plain_text",
          },
        },
      },
    };
    return fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
