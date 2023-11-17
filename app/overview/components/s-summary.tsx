import { getServerSession } from "next-auth";
import CardData from "./card-data";
import { authOptions, prisma } from "@/lib/auth";

async function getSummary() {

  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }  

  const userId = session?.user?.id as string
  //  从数据库中获取数据， logDetail表中的数据
  const totalMessages = await prisma.logDetail.count({
    where: {
      userId
    },
  });
  const todayMessages = await prisma.logDetail.count({
    where: {
      created: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
      userId
    },
  });
  const todayFailedMessages = await prisma.logDetail.count({
    where: {
      created: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
      status: {
        equals: 0,
      },
      userId
    },
  });

  const thisWeekMessages = await prisma.logDetail.count({
    where: {
      created: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
      userId
    },
  });

  return {
    totalMessages,
    todayMessages,
    todayFailedMessages,
    thisWeekMessages,
  };
}

export default async function Summary() {
  const {
    totalMessages,
    todayMessages,
    todayFailedMessages,
    thisWeekMessages,
  } = await getSummary();
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[
        // 今日成功发送的消息
        {
          title: "Today's Sent Messages",
          description: "Total sent messages today",
          value: todayMessages.toString(),
        },
        // 今日失败的消息
        {
          title: "Today's Failed Messages",
          description: "Total failed messages today",
          value: todayFailedMessages.toString(),
        },
        // 本周发送的消息总数
        {
          title: "This Week's Sent Messages By Bot",
          description: "Total sent messages this week",
          value: thisWeekMessages.toString(),
        },
        // 历史消息总数
        {
          title: "Total Messages",
          description: "Total messages",
          value: totalMessages.toString(),
        },
      ].map((item) => {
        return <CardData key={item.title} {...item} />;
      })}
    </div>
  );
}
