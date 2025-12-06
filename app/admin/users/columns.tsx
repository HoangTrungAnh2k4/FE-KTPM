'use client';

export type UserRole = 'ADMIN' | 'STUDENT' | 'INSTRUCTOR';

import { Button } from '@/components/UI/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/UI/dropdown-menu';
import { ListUser } from '@/lib/adminUsers';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

export const columns: ColumnDef<ListUser>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'fullName',
        header: 'Full Name',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'roles',
        header: 'Roles',
        cell: ({ getValue }) => {
            const roles = getValue() as UserRole[];
            return roles?.join(', ') || '-';
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
    },
    {
        accessorKey: 'actions',
        header: 'Actions',
        cell: () => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-0 w-8 h-8 hover:cursor-pointer">
                            <span className="sr-only">Mở menu</span>
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                        <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                        <DropdownMenuItem>Xóa</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
