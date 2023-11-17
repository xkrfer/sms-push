export enum ChannelType {
  Telegram = 1,
  Dingtalk,
  Wechat,
  Webhook,
  Lark,
}

// getChannelType

export function getChannelName(type: ChannelType) {
  switch (type) {
    case ChannelType.Telegram:
      return "Telegram";
    case ChannelType.Dingtalk:
      return "Dingtalk";
    case ChannelType.Wechat:
      return "Wechat";
    case ChannelType.Webhook:
      return "Webhook";
    case ChannelType.Lark:
      return "Lark";
    default:
      return "Unknown";
  }
}

export function getValidChannelTypes() {
  return [ChannelType.Telegram];
}
