import { z } from "zod";
import { BaseChannel } from "./Base";
import { ChannelType } from "./type";
import pushoo from "pushoo";

export class Wecom extends BaseChannel {
  readonly type = ChannelType.Wecom;

  static getSchema() {
    return z.object({
      id: z
        .string({
          required_error: "please input company id",
        })
        .min(1, {
          message: "please input company id",
        }),
      agentid: z
        .string({
          required_error: "please input agentid",
        })
        .min(1, {
          message: "please input agentid",
        }),
      token: z
        .string({
          required_error: "please input secret",
        })
        .min(1, {
          message: "please input secret",
        }),
    });
  }

  static getOptions() {
    return [
      {
        name: "id",
        label: "Company ID",
        defaultValue: "",
      },
      {
        name: "agentid",
        label: "Agent ID",
        defaultValue: "",
      },
      {
        name: "token",
        label: "Secret",
        defaultValue: "",
      },
    ];
  }

  static sendMessage(
    sms: {
      body: string;
      id: number;
      name: string;
      type: string;
      token: string;
    },
    data: Record<string, any>
  ) {
    const body = JSON.parse(sms.body);
    return pushoo("wecom", {
      token: `${body.id}#${sms.token}#${body.agentid}`,
      title: data.title,
      content: data.content,
    });
  }
}
