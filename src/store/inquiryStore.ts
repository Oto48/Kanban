import { create } from "zustand";
import { Inquiry, InquiryPhase } from "@/types/inquiry";

interface InquiryState {
    inquiries: Inquiry[];
    loading: boolean;
    fetchInquiries: () => Promise<void>;
    moveInquiry: (id: string, newPhase: InquiryPhase) => Promise<void>;
}

export const useInquiryStore = create<InquiryState>((set) => ({
    inquiries: [],
    loading: false,

    fetchInquiries: async () => {
        set({ loading: true });
        try {
            const res = await fetch("/api/inquiries");
            const data: Inquiry[] = await res.json();
            set({ inquiries: data });
        } catch (err) {
            console.error(err);
        } finally {
            set({ loading: false });
        }
    },

    moveInquiry: async (id: string, newPhase: InquiryPhase) => {
        set((state) => ({
            inquiries: state.inquiries.map((i) =>
                i.id === id ? { ...i, phase: newPhase } : i
            ),
        }));

        // PATCH API
        try {
            await fetch("/api/inquiries", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, phase: newPhase }),
            });
        } catch (err) {
            console.error(err);
        }
    },
}));
