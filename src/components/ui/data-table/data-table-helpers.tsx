import type { Column, ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";
import { Button } from "../button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Switch } from "../switch";

export function createHeaderColumn<TData>(
  title: string
): ColumnDef<TData>["header"] {
  return ({ column }) => (
    <DataTableColumnHeader column={column} title={title} />
  );
}

export function createActionColumn<TData>(
  Component: ({ row }: { row: Row<TData> }) => React.ReactNode
): ColumnDef<TData> {
  return {
    id: "actions",
    header: "",
    enablePinning: true,
    size: 40,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant={"ghost"}>
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end">
            <Component row={row} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };
}

export function getCommonPinningStyles<TData>({
  column,
}: {
  column: Column<TData>;
}): React.CSSProperties {
  const pinnedColumnWidth = 40;
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right");

  return {
    boxShadow: isLastLeftPinnedColumn
      ? "-4px 0 4px -4px var(--border) inset"
      : isFirstRightPinnedColumn
        ? "4px 0 4px -4px var(--border) inset"
        : undefined,
    textAlign: isPinned && isFirstRightPinnedColumn ? "right" : undefined,
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    opacity: isPinned ? 0.97 : 1,
    position: isPinned ? "sticky" : "relative",
    zIndex: isPinned ? 1 : 0,
    // Force fixed width for pinned columns, let others auto-size
    width: isPinned ? `${pinnedColumnWidth}px` : "auto",
    minWidth: isPinned ? `${pinnedColumnWidth}px` : undefined,
    maxWidth: isPinned ? `${pinnedColumnWidth}px` : undefined,
    flexShrink: isPinned ? 0 : undefined,
    flexGrow: isPinned ? 0 : undefined,
    padding: isPinned ? 4 : undefined,
  };
}

export function createBooleanColumn<TData>({
  accessorKey,
  title,
  onToggle,
}: {
  accessorKey: keyof TData;
  title: string;
  onToggle?: (rowData: TData, value: boolean) => void;
}): ColumnDef<TData> {
  return {
    accessorKey: accessorKey as string,
    header: createHeaderColumn(title),
    cell: ({ row }) => {
      const value = row.getValue(accessorKey as string) as boolean;
      return (
        <Switch
          checked={value}
          onCheckedChange={(checked) => onToggle?.(row.original, checked)}
        />
      );
    },
  };
}
