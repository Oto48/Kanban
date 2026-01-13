"use client";

import { useEffect, useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { useInquiryStore } from "@/store/inquiryStore";
import KanbanColumn from "@/components/KanbanColumn";
import InquiryDetailModal from "@/components/InquiryDetailModal";
import { InquiryPhase } from "@/types/inquiry";
import FilterPanel from "@/components/FilterPanel";

export default function Page() {
    const {
        inquiries,
        fetchInquiries,
        moveInquiry,
        loading,
        error,
        clearError,
    } = useInquiryStore();

    const [hasInitialized, setHasInitialized] = useState(false);

    useEffect(() => {
        if (hasInitialized) return;

        const loadInitialData = async () => {
            if (typeof window !== "undefined") {
                const urlParams = new URLSearchParams(window.location.search);

                const initialFilters = {
                    clientName: urlParams.get("clientName") || "",
                    minValue: Number(urlParams.get("minValue") || "0"),
                    dateFrom: urlParams.get("dateFrom") || "",
                    dateTo: urlParams.get("dateTo") || "",
                };

                await fetchInquiries(initialFilters);
            } else {
                await fetchInquiries();
            }
            setHasInitialized(true);
        };

        loadInitialData();
    }, [fetchInquiries, hasInitialized]);

    if (error && !loading) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-red-800 font-semibold">
                                Error
                            </h3>
                            <p className="text-red-600 mt-1">{error}</p>
                        </div>
                        <button
                            onClick={clearError}
                            className="text-red-600 hover:text-red-800"
                        >
                            ✕
                        </button>
                    </div>
                    <button
                        onClick={() => fetchInquiries()}
                        className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (loading && !hasInitialized) {
        return (
            <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <div className="text-gray-600">Loading inquiries...</div>
            </div>
        );
    }

    const phases: InquiryPhase[] = [
        "new",
        "sent_to_hotels",
        "offers_received",
        "completed",
    ];

    const grouped: Record<InquiryPhase, typeof inquiries> = {
        new: [],
        sent_to_hotels: [],
        offers_received: [],
        completed: [],
    };

    phases.forEach((phase) => {
        grouped[phase] = inquiries.filter((i) => i.phase === phase);
    });

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const newPhase = over.id as InquiryPhase;
        moveInquiry(active.id.toString(), newPhase);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-4 md:p-6">
                <FilterPanel />

                {loading && (
                    <div className="mb-4 p-3 bg-blue-50 rounded flex items-center gap-3">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-blue-700 text-sm">
                            Updating...
                        </span>
                    </div>
                )}

                <DndContext
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {phases.map((phase) => (
                            <KanbanColumn
                                key={phase}
                                phase={phase}
                                inquiries={grouped[phase]}
                            />
                        ))}
                    </div>
                </DndContext>

                <InquiryDetailModal />
            </div>
        </div>
    );
}
