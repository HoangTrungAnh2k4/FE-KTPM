// store/userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'Administrator' | 'Instructor' | 'Student';

type User = {
    id: string;
    email: string;
    name: string;
    role: UserRole;
};

type State = {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
};

export const useUserStore = create<State>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            logout: () => set({ user: null }),
        }),
        {
            name: 'user-storage',
        }
    )
);
