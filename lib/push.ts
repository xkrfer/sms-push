import { SMS } from "@prisma/client";
import { prisma } from "./auth";
import { ChannelBox } from "./channel/Box";

interface Log {
  id: number; // bot id
  name: string; // bot name
  message: string;
}

export async function pushMessage(data: {
  sms: SMS;
  body: Record<string, any>;
}) {
  const { sms, body } = data;
  const { id, rule } = sms;

  const isHit = hitRule(rule, body.title, body.content);
  console.log(`sms ${sms.name} hit rule ${isHit}, rule: ${rule}`);

  if (!isHit) return;
  // 根据id获取bots
  const bots = await prisma.botSMS.findMany({
    where: {
      smsId: id,
    },
    select: {
      botId: true,
    },
  });
  // 根据bots获取bot
  const botList = await prisma.bot.findMany({
    where: {
      id: {
        in: bots.map((bot) => bot.botId),
      },
    },
    select: {
      type: true,
      token: true,
      body: true,
      id: true,
      name: true,
      rule: true,
    },
  });
  console.log(
    "bots",
    botList.map((bot) => bot.name)
  );
  if (!botList.length) return;
  const res = await sendMessage(botList, body);
  await recordLog(sms, JSON.stringify(body), res.successList, res.errorList);
}

function sendMessage(
  botList: {
    body: string;
    token: string;
    id: number;
    name: string;
    type: string;
    rule: string | null;
  }[],
  body: Record<string, any>
) {
  // 统计
  const successList: Log[] = [];
  const errorList: Log[] = [];
  return new Promise<{
    successList: Log[];
    errorList: Log[];
  }>((resolve) => {
    Promise.allSettled(
      botList.map((bot) => {
        const box = new ChannelBox(bot.type);
        if (!box.type) {
          errorList.push({
            id: bot.id,
            name: bot.name,
            message: "not support",
          });
          return;
        }

        const isHit = hitRule(bot.rule, body.title, body.content);
        if (!isHit) {
          errorList.push({
            id: bot.id,
            name: bot.name,
            message: "rule not hit",
          });
          return;
        }
        console.log("bot", bot, body);
        return box
          .sendMessage(bot, body)
          .then(() => {
            successList.push({
              id: bot.id,
              name: bot.name,
              message: "success",
            });
          })
          .catch((e) => {
            errorList.push({
              id: bot.id,
              name: bot.name,
              message: e.message,
            });
          });
      })
    ).finally(() => {
      resolve({
        successList,
        errorList,
      });
    });
  });
}

async function recordLog(
  sms: SMS,
  body: string,
  successList: Log[],
  errorList: Log[]
) {
  const success = successList.map((item) => {
    return {
      botId: item.id,
      botName: item.name,
      message: item.message,
      status: 1,
    };
  });

  const error = errorList.map((item) => {
    return {
      botId: item.id,
      botName: item.name,
      message: item.message,
      status: 0,
    };
  });

  await prisma.log.create({
    data: {
      smsId: sms.id,
      smsName: sms.name,
      body,
      userId: sms.userId,
      info: {
        create: [...success, ...error].map((item) => {
          return {
            ...item,
            userId: sms.userId,
          };
        }),
      },
    },
  });
}

function hitRule(reg: string | null, title: string, content: string) {
  // 判断是不是正则
  if (reg === null || reg === undefined || reg === "") return true;
  const regex = new RegExp(reg);
  return regex.test(title) || regex.test(content);
}
