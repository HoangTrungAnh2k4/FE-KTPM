export type UserRole = 'ADMIN' | 'STUDENT' | 'INSTRUCTOR';

export type ListUser = {
    id: number;
    fullName: string;
    email: string;
    roles: UserRole[];
    active: boolean;
};
