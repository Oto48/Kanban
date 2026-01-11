import { create } from "zustand";
import { Inquiry, InquiryPhase } from "@/types/inquiry";

interface InquiryFilters {
    clientName: string;
    minValue: number;
    dateFrom: string;
    dateTo: string;
}

interface InquiryState {
    inquiries: Inquiry[];
    loading: boolean;
    selectedInquiry: Inquiry | null;
    filters: InquiryFilters;

    fetchInquiries: () => Promise<void>;
    moveInquiry: (id: string, newPhase: InquiryPhase) => Promise<void>;
    selectInquiry: (inquiry: Inquiry) => void;
    closeInquiry: () => void;
    setFilters: (filters: Partial<InquiryFilters>) => void;
}

export const useInquiryStore = create<InquiryState>((set) => ({
    inquiries: [],
    loading: false,
    selectedInquiry: null,
    filters: {
        clientName: "",
        minValue: 0,
        dateFrom: "",
        dateTo: "",
    },

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

    moveInquiry: async (id, newPhase) => {
        set((state) => ({
            inquiries: state.inquiries.map((i) =>
                i.id === id ? { ...i, phase: newPhase } : i
            ),
        }));

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

    selectInquiry: (inquiry) => set({ selectedInquiry: inquiry }),
    closeInquiry: () => set({ selectedInquiry: null }),

    setFilters: (newFilters) =>
        set((state) => ({
            filters: { ...state.filters, ...newFilters },
        })),
}));
