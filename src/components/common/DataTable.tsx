import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Spinner } from "@/components/Spinner";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  header: React.ReactNode;
  cell: (item: T) => React.ReactNode;
  /** Clase aplicada tanto al TableHead como al TableCell (p. ej. "text-right") */
  className?: string;
  /** Clase extra solo para el TableHead si quieres distinta alineación arriba */
  headerClassName?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowKey: (item: T) => string;
  pageSize?: number;
  isLoading?: boolean;
  /** Texto o nodo mostrado en una fila única cuando `data` está vacío (ignorado si isLoading) */
  emptyMessage?: React.ReactNode;
  /** Si está presente, cada fila es clickable y propaga el item al handler */
  onRowClick?: (item: T) => void;
  /** Permite devolver clases dinámicas por fila (p. ej. resaltar las no leídas) */
  rowClassName?: (item: T) => string | undefined;
  className?: string;
}

/**
 * Construye el conjunto de páginas visibles alrededor de la página actual.
 * Para hasta 7 páginas se muestran todas; en caso contrario se intercalan
 * elipsis a los lados.
 */
function buildPageWindow(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "...")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("...");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push("...");
  pages.push(total);
  return pages;
}

export function DataTable<T>({
  columns,
  data,
  getRowKey,
  pageSize = 10,
  isLoading,
  emptyMessage = "No data available",
  onRowClick,
  rowClassName,
  className,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Si quedamos fuera de rango (p. ej. tras filtrar y reducir los resultados),
  // retroceder a la última página válida. No forzamos vuelta a página 1 si
  // simplemente los datos se refrescaron sin cambiar el total.
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  const pageWindow = useMemo(
    () => buildPageWindow(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const colCount = columns.length;
  const rangeStart = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(col.className, col.headerClassName)}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={colCount} className="py-10 text-center">
                  <Spinner size="md" color="text-primary" />
                </TableCell>
              </TableRow>
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={colCount}
                  className="py-10 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((item) => {
                const extraClass = rowClassName?.(item);
                const clickable = !!onRowClick;
                return (
                  <TableRow
                    key={getRowKey(item)}
                    className={cn(clickable && "cursor-pointer", extraClass)}
                    onClick={clickable ? () => onRowClick(item) : undefined}
                    role={clickable ? "button" : undefined}
                  >
                    {columns.map((col) => (
                      <TableCell key={col.key} className={col.className}>
                        {col.cell(item)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {totalItems > pageSize && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {rangeStart}-{rangeEnd} of {totalItems}
          </span>
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  aria-disabled={currentPage === 1}
                  className={cn(
                    currentPage === 1 && "pointer-events-none opacity-50"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                />
              </PaginationItem>
              {pageWindow.map((p, idx) =>
                p === "..." ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={p === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(p);
                      }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  aria-disabled={currentPage === totalPages}
                  className={cn(
                    currentPage === totalPages && "pointer-events-none opacity-50"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

export default DataTable;
