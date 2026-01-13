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
    error: string | null;

    fetchInquiries: (filters?: Partial<InquiryFilters>) => Promise<void>;
    moveInquiry: (id: string, newPhase: InquiryPhase) => Promise<void>;
    selectInquiry: (inquiry: Inquiry) => void;
    closeInquiry: () => void;
    setFilters: (filters: Partial<InquiryFilters>) => void;
    clearError: () => void;
}

export const useInquiryStore = create<InquiryState>((set, get) => ({
    inquiries: [],
    loading: false,
    selectedInquiry: null,
    filters: {
        clientName: "",
        minValue: 0,
        dateFrom: "",
        dateTo: "",
    },
    error: null,

    fetchInquiries: async (filterOverrides?: Partial<InquiryFilters>) => {
        set({ loading: true, error: null });

        try {
            const currentFilters = get().filters;
            const filtersToUse = filterOverrides
                ? { ...currentFilters, ...filterOverrides }
                : currentFilters;

            const params = new URLSearchParams();

            if (filtersToUse.clientName) {
                params.set("clientName", filtersToUse.clientName);
            }

            if (filtersToUse.minValue && filtersToUse.minValue > 0) {
                params.set("minValue", filtersToUse.minValue.toString());
            }

            if (filtersToUse.dateFrom) {
                params.set("dateFrom", filtersToUse.dateFrom);
            }

            if (filtersToUse.dateTo) {
                params.set("dateTo", filtersToUse.dateTo);
            }

            if (typeof window !== "undefined") {
                const queryString = params.toString();
                const newUrl = queryString
                    ? `${window.location.pathname}?${queryString}`
                    : window.location.pathname;

                window.history.pushState({}, "", newUrl);
            }

            const res = await fetch(`/api/inquiries?${params.toString()}`);

            if (!res.ok) {
                throw new Error(`Failed to fetch inquiries: ${res.status}`);
            }

            const data: Inquiry[] = await res.json();

            set({
                inquiries: data,
                filters: filtersToUse,
                loading: false,
                error: null,
            });
        } catch (err) {
            console.error("Failed to fetch inquiries:", err);
            set({
                loading: false,
                error:
                    err instanceof Error
                        ? err.message
                        : "An error occurred while fetching inquiries",
            });
        }
    },

    moveInquiry: async (id, newPhase) => {
        const previousState = get().inquiries;
        const inquiryToUpdate = previousState.find((i) => i.id === id);

        if (!inquiryToUpdate) return;

        set((state) => ({
            inquiries: state.inquiries.map((i) =>
                i.id === id ? { ...i, phase: newPhase } : i
            ),
        }));

        try {
            const res = await fetch("/api/inquiries", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, phase: newPhase }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to update inquiry");
            }

            const updatedInquiry = await res.json();

            set((state) => ({
                inquiries: state.inquiries.map((i) =>
                    i.id === id ? updatedInquiry : i
                ),
                error: null,
            }));
        } catch (err) {
            console.error("Failed to update inquiry phase:", err);

            set({
                inquiries: previousState,
                error:
                    err instanceof Error
                        ? err.message
                        : "Failed to update inquiry phase",
            });
        }
    },

    selectInquiry: (inquiry) => set({ selectedInquiry: inquiry }),

    closeInquiry: () => set({ selectedInquiry: null }),

    setFilters: (newFilters) => {
        const currentFilters = get().filters;
        const hasChanged = Object.keys(newFilters).some(
            (key) =>
                currentFilters[key as keyof InquiryFilters] !==
                newFilters[key as keyof InquiryFilters]
        );

        if (!hasChanged) return;

        set((state) => ({
            filters: { ...state.filters, ...newFilters },
            error: null,
        }));

        get().fetchInquiries();
    },

    clearError: () => set({ error: null }),
}));
