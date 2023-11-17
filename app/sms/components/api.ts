"use server";

import { authOptions, prisma } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { nanoid } from "nanoid";

export async function getBots() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("no login");
  // 只返回id和name
  const bots = await prisma.bot.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      created: "desc",
    },
    select: {
      id: true,
      name: true,
    },
  });

  return bots;
}

export async function addSubmit(data: { name: string; bots: number[] }) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("no login");
  // 新增一条sms记录，同时新增多条smsBot记录
  const isExist = await prisma.sMS.findFirst({
    where: {
      name: data.name,
    },
  });
  if (isExist) throw new Error("sms name is exist");
  const userId = session.user.id;
  const sms = await prisma.sMS.create({
    data: {
      name: data.name,
      userId,
      token: nanoid(32),
    },
  });
  // 更新smsBot
  const smsBots = data.bots.map((botId) => {
    return prisma.botSMS.create({
      data: {
        botId,
        smsId: sms.id,
      },
    });
  });

  await Promise.all(smsBots);
}

export async function getList() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("no login");
  const smsList = await prisma.sMS.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      created: "desc",
    },
    select: {
      id: true,
      name: true,
      token: true,
      created: true,
      updated: true,
    },
  });

  return smsList.map((sms) => {
    const { id, name, token, created, updated } = sms;
    return {
      id,
      name,
      token,
      created: formatDate(created),
      updated: formatDate(updated),
    };
  });
}

export async function getBotsById(id: number) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("no login");
  // 只返回id
  const bots = await prisma.botSMS.findMany({
    where: {
      smsId: id,
    },
    select: {
      botId: true,
    },
  });
  return bots.map((bot) => bot.botId);
}

export async function deleteSMS(id: number) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("no login");
  await prisma.botSMS.deleteMany({
    where: {
      smsId: id,
    },
  });

  await prisma.sMS.delete({
    where: {
      id,
    },
  });
}

export async function updateSubmit(data: {
  id: number;
  name: string;
  bots: number[];
}) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("no login");
  // 更新sms
  await prisma.sMS.update({
    where: {
      id: data.id,
    },
    data: {
      name: data.name,
    },
  });
  // 获取当前sms的bots
  const currentBots = await prisma.botSMS.findMany({
    where: {
      smsId: data.id,
    },
  });
  // 获取需要删除的bot
  const deleteBots = currentBots.filter((bot) => {
    return !data.bots.includes(bot.botId);
  });
  // 获取需要新增的bot
  const addBots = data.bots.filter((bot) => {
    return !currentBots.map((item) => item.botId).includes(bot);
  });
  // 删除bot
  const deleteBot = deleteBots.map((bot) => {
    return prisma.botSMS.deleteMany({
      where: {
        botId: bot.botId,
        smsId: data.id,
      },
    });
  });
  // 新增bot
  const addBot = addBots.map((botId) => {
    return prisma.botSMS.create({
      data: {
        botId,
        smsId: data.id,
      },
    });
  });

  await Promise.all([...deleteBot, ...addBot]);
}
