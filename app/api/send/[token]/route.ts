import { prisma } from "@/lib/auth";
import { pushMessage } from "@/lib/push";

async function checkSMS(token: string) {
  // 拿到该token对应的sms
  const sms = await prisma.sMS.findFirst({
    where: {
      token,
    },
  });
  return sms;
}

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  const sms = await checkSMS(params.token);
  if (!sms)
    return new Response(
      JSON.stringify({
        status: "error",
        message: "sms not exist",
      }),
      {
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      }
    );
  // 获取当前请求的searchParams，转换成json
  const searchParams = new URL(request.url).searchParams;
  const body = {};
  searchParams.forEach((value, key) => {
    // @ts-ignore
    body[key] = value;
  });
  await pushMessage({
    sms,
    body,
  });
  return new Response(
    JSON.stringify({
      status: "ok",
      message: "success",
    }),
    {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    }
  );
}

export async function POST(
  request: Request,
  { params }: { params: { token: string } }
) {
  const sms = await checkSMS(params.token);
  if (!sms)
    return new Response(
      JSON.stringify({
        status: "error",
        message: "sms not exist",
      }),
      {
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      }
    );
  const body = await request.json();
  await pushMessage({
    sms,
    body,
  });
  return new Response(
    JSON.stringify({
      status: "ok",
      message: "success",
    }),
    {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    }
  );
}
