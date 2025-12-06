// store/userStore.ts
import { create } from 'zustand';

type User = {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'STUDENT' | 'INSTRUCTOR';
};

type State = {
    user: User | null;
    setUser: (user: User | null) => void;
};

export const useUserStore = create<State>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
}));
