// store/userStore.ts
import { create } from 'zustand';

export type User = {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'STUDENT' | 'INSTRUCTOR';
    avatar: string;
};

type State = {
    user: User | null;
    setUser: (user: User | null) => void;
};

export const useUserStore = create<State>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
}));
