"use server";
import { authOptions, prisma } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { getServerSession } from "next-auth";

export async function getList() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("no login");
  const bots = await prisma.bot.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      created: "desc",
    },
    select: {
      id: true,
      type: true,
      name: true,
      token: true,
      created: true,
      updated: true,
    },
  });
  return bots.map((bot) => {
    const { id, type, name, token, created, updated } = bot;
    return {
      id,
      type,
      name,
      token,
      created: formatDate(created),
      updated: formatDate(updated),
    };
  });
}

export async function addSubmit(data: Record<string, any>) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("no login");
  const { type, name, token, ...rest } = data;
  const body = JSON.stringify(rest);
  // 判断是否已经存在
  const bot = await prisma.bot.findFirst({
    where: {
      name,
    },
  });
  if (bot) throw new Error("bot name is exist");
  // 创建新的bot
  await prisma.bot.create({
    data: {
      type,
      name,
      token,
      body,
      userId: session.user.id,
    },
  });
}

// 删除bot
export async function deleteBot(id: number) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("no login");
  // 检查该id是否被绑定了

  const count = await prisma.botSMS.count({
    where: {
      botId: id,
    },
  });
  if (count > 0) throw new Error("bot is used, please delete sms first");
  await prisma.bot.delete({
    where: {
      id,
    },
  });
}

export async function getBotById(id: number) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("no login");
  const bot = await prisma.bot.findUnique({
    where: {
      id,
    },
  });
  if (!bot) throw new Error("bot not found");
  const { type, name, token, body } = bot;
  return {
    id,
    type,
    name,
    token,
    body: JSON.parse(body),
  };
}

export async function updateSubmit(data: {
  id: number;
  type: string;
  name: string;
  token: string;
  body: Record<string, any>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("no login");
  const { id, type, name, token, body } = data;
  const bot = await prisma.bot.findUnique({
    where: {
      id,
    },
  });
  if (!bot) throw new Error("bot not found");
  await prisma.bot.update({
    where: {
      id,
    },
    data: {
      type,
      name,
      token,
      body: JSON.stringify(body),
    },
  });
}
