'use client';

import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/UI/pagination';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/UI/table';
import { useState } from 'react';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    // controlled pagination
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    currentPage,
    totalPages,
    onPageChange,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true, // Tell TanStack Table we're handling pagination ourselves
        state: {
            sorting,
        },
    });

    return (
        <div className="pb-6">
            <div className="border rounded-md overflow-hidden">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {typeof currentPage !== 'number' ? (
                <Pagination className="mt-6">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#" isActive>
                                2
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            ) : (
                // Controlled pagination UI
                <Pagination className="mt-6">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const p = currentPage as number;
                                    const cb = onPageChange;
                                    if (p > 1 && cb) cb(p - 1);
                                }}
                                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                            />
                        </PaginationItem>
                        {(() => {
                            const total = totalPages || 1;
                            const current = currentPage || 1;
                            const pages: (number | string)[] = [];

                            // Always show first page
                            pages.push(1);

                            if (total <= 7) {
                                // Show all pages if total <= 7
                                for (let i = 2; i <= total; i++) {
                                    pages.push(i);
                                }
                            } else {
                                // Show smart pagination
                                if (current <= 3) {
                                    pages.push(2, 3, 4, '...', total);
                                } else if (current >= total - 2) {
                                    pages.push('...', total - 3, total - 2, total - 1, total);
                                } else {
                                    pages.push('...', current - 1, current, current + 1, '...', total);
                                }
                            }

                            return pages.map((p, idx) => {
                                if (p === '...') {
                                    return (
                                        <PaginationItem key={`ellipsis-${idx}`}>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    );
                                }
                                const pageNum = p as number;
                                const isActive = pageNum === current;
                                return (
                                    <PaginationItem key={pageNum}>
                                        <PaginationLink
                                            href="#"
                                            isActive={isActive}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const cb = onPageChange;
                                                if (cb) cb(pageNum);
                                            }}
                                        >
                                            {pageNum}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            });
                        })()}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const p = currentPage as number;
                                    const tp = totalPages as number;
                                    const cb = onPageChange;
                                    if (p < tp && cb) cb(p + 1);
                                }}
                                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}
