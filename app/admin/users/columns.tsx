'use client';

export type UserRole = 'ADMIN' | 'STUDENT' | 'INSTRUCTOR';

import { Button } from '@/components/UI/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from '@/components/UI/dropdown-menu';
import { ListUser } from '@/lib/adminUsers';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

const statusLabel = (status?: string, active?: boolean) => {
    if (status) return status;
    return active ? 'ACTIVE' : 'INACTIVE';
};

export const buildColumns = (
    onToggleStatus: (userId: number) => void | Promise<void>,
    onUpdateRole: (userId: number, role: UserRole) => void | Promise<void>,
    onDelete: (userId: number) => void | Promise<void>,
    allowedRoles: UserRole[] = ['ADMIN', 'INSTRUCTOR', 'STUDENT'],
): ColumnDef<ListUser>[] => [
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
        cell: ({ row }) => {
            const value = statusLabel(row.original.status, row.original.active);
            const isActive = value === 'ACTIVE';
            return (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    {value}
                </span>
            );
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const user = row.original;
            const value = statusLabel(user.status, user.active);
            const isActive = value === 'ACTIVE';

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-0 w-8 h-8 hover:cursor-pointer">
                            <span className="sr-only">Open actions</span>
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onToggleStatus(user.id)}>
                            {isActive ? 'Deactivate' : 'Activate'}
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Update role</DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <DropdownMenuRadioGroup
                                    value={user.roles?.[0] || ''}
                                    onValueChange={(value) => onUpdateRole(user.id, value as UserRole)}
                                >
                                    {allowedRoles.map((role) => (
                                        <DropdownMenuRadioItem key={role} value={role}>
                                            {role}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuItem onClick={() => onDelete(user.id)} className="text-red-600 focus:text-red-700">
                            Delete account
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
