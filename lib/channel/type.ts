export enum ChannelType {
  Telegram = 1,
  Dingtalk,
  Wechat,
  Webhook,
  Lark,
  Feishu,
}

// getChannelType

export function getChannelName(type: ChannelType) {
  switch (type) {
    case ChannelType.Telegram:
      return "Telegram";
    case ChannelType.Dingtalk:
      return "DingTalk";
    case ChannelType.Wechat:
      return "Wechat";
    case ChannelType.Webhook:
      return "Webhook";
    case ChannelType.Lark:
      return "Lark";
    case ChannelType.Feishu:
      return "Feishu";
    default:
      return "Unknown";
  }
}

export function getValidChannelTypes() {
  return [
    ChannelType.Telegram,
    ChannelType.Lark,
    ChannelType.Feishu,
    ChannelType.Dingtalk,
  ];
}
