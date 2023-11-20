"use client";

import * as React from "react";
import AddForm from "./add-form";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { deleteBot, getList } from "./api";
import { getChannelName } from "@/lib/channel/type";
import Confirm from "@/components/confirm";
import { toast } from "@/components/ui/use-toast";
import EditForm from "./edit-form";

type PickBot = {
  id: number;
  name: string;
  token: string;
  type: string;
  created: string;
  updated: string;
}

export default function List() {
  const [data, setData] = React.useState<PickBot[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const columns: ColumnDef<PickBot>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <div>{getChannelName(Number(row.getValue("type")))}</div>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "token",
      header: "Token",
      cell: ({ row }) => <div>{row.getValue("token")}</div>,
    },
    {
      accessorKey: "rule",
      header: "Rule",
      cell: ({ row }) => <div>{row.getValue("rule")}</div>,
    },
    {
      accessorKey: 'created',
      header: "Created",
      cell: ({ row }) => <div>{row.getValue("created")}</div>,
    },
    {
      accessorKey: 'updated',
      header: "Updated",
      cell: ({ row }) => <div>{row.getValue("updated")}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
            <EditForm id={row.getValue("id")} type={row.getValue("type")} onSuccess={() => {
                    queryList();
            }}/>
            <Confirm
              onAction={() => {
                deleteBot(row.getValue("id"))
                  .then(() => {
                    toast({
                      title: "Success",
                      description: "Bot deleted",
                      variant: "success",
                    });
                    queryList();
                  })
                  .catch((err) => {
                    toast({
                      title: "Error",
                      description: err?.message || "Failed",
                      variant: "destructive",
                    });
                  });
              }}
            >
              <Button variant="ghost">Delete</Button>
            </Confirm>
          </div>
        );
      },
    },
  ];
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const queryList = async () => {
    const response = await getList();
    setData(response);
  };

  React.useEffect(() => {
    queryList();
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <div></div>
        {/* <Input
          placeholder="Filter bot name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm mr-6"
        /> */}
        <div className="flex justify-end flex-1">
          <AddForm
            onSuccess={() => {
              queryList();
            }}
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isActionColumn = header.id === "actions";
                  return (
                    <TableHead
                      key={header.id}
                      className={cn({
                        "w-1/12": isActionColumn,
                        "text-center": isActionColumn,
                      })}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
