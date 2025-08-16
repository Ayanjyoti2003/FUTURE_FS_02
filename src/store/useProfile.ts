"use client";

import { create } from "zustand";
import { auth } from "@/lib/firebaseClient";

type Profile = {
    userId: string;
    name: string;
    photo: string;
};

type ProfileState = {
    profile: Profile | null;
    loading: boolean;
    fetchProfile: () => Promise<void>;
    updateProfile: (data: Partial<Profile>) => Promise<void>;
};

export const useProfile = create<ProfileState>((set) => ({
    profile: null,
    loading: false,

    fetchProfile: async () => {
        const user = auth.currentUser;
        if (!user) return;

        const token = await user.getIdToken();

        set({ loading: true });
        const res = await fetch("/api/profile", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.ok) {
            const data = await res.json();
            set({ profile: data, loading: false });
        } else {
            set({ loading: false });
        }
    },

    updateProfile: async (data) => {
        const user = auth.currentUser;
        if (!user) return;

        const token = await user.getIdToken();

        const res = await fetch("/api/profile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            await useProfile.getState().fetchProfile(); // refresh after save
        }
    },
}));
