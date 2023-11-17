import { ChannelType } from "./type";

export abstract class BaseChannel {
  abstract readonly type: ChannelType;
}
