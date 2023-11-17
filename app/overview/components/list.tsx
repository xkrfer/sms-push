import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { authOptions, prisma } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { getServerSession } from "next-auth";
import ButtonGroup from "./button-group";

async function getLogs(params: {
  p: string; // page
  q: string; // query
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session?.user?.id as string;
  const p = parseInt(params.p) || 1;
  const total = await prisma.log.count({
    where: {
      userId,
      body: {
        contains: params.q || "",
      },
    },
  });
  // 在log中查询数据，并从logDetail中获取数据
  const logs = await prisma.log.findMany({
    where: {
      userId,
      body: {
        contains: params.q || "",
      },
    },
    skip: (p - 1) * 10,
    take: 10,
    select: {
      id: true,
      created: true,
      body: true,
      smsName: true,
      info: {
        select: {
          status: true,
          message: true,
          botName: true,
          created: true,
        },
      },
    },
    orderBy: {
      created: "desc",
    },
  });

  return {
    list: logs.map((log) => {
      const { info, created, ...rest } = log;
      return {
        ...rest,
        created: formatDate(created),
        info: info.map((item) => ({
          ...item,
          created: formatDate(item.created),
        })),
      };
    }),
    total,
    page: p,
  };
}

export default async function List({
  searchParams,
}: {
  searchParams: { q: string; p: string };
}) {
  const logs = await getLogs(searchParams);
  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Created</TableHead>
              <TableHead className="w-[100px]">SMS Name</TableHead>
              <TableHead className="w-[100px]">Body</TableHead>
              <TableHead className="w-[100px]">Fail Count</TableHead>
              <TableHead className="w-[100px]">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.list.length ? (
              logs.list.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.created}</TableCell>
                  <TableCell>{log.smsName}</TableCell>
                  <TableCell>{log.body}</TableCell>
                  <TableCell>
                    {log.info.filter((item) => item.status === 0).length}
                  </TableCell>
                  <TableCell>{log.info.length}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={12} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* 上一页，下一页，总数 */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {logs.page} of {Math.ceil(logs.total / 10)}
        </div>
        <ButtonGroup logs={logs} />
      </div>
    </div>
  );
}
