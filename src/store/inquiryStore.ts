import { create } from "zustand";
import { Inquiry } from "@/types/inquiry";

interface InquiryState {
    inquiries: Inquiry[];
    loading: boolean;
    fetchInquiries: () => Promise<void>;
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
}));
