"use client";

import { useEffect } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { useInquiryStore } from "@/store/inquiryStore";
import KanbanColumn from "@/components/KanbanColumn";
import InquiryDetailModal from "@/components/InquiryDetailModal";
import { InquiryPhase } from "@/types/inquiry";
import FilterPanel from "@/components/FilterPanel";

export default function Page() {
    const { inquiries, fetchInquiries, moveInquiry, loading, filters } =
        useInquiryStore();

    useEffect(() => {
        fetchInquiries();
    }, [fetchInquiries]);

    if (loading) return <div className="p-6">Loading...</div>;

    const phases: InquiryPhase[] = [
        "new",
        "sent_to_hotels",
        "offers_received",
        "completed",
    ];

    const filteredInquiries = inquiries.filter((i) => {
        const { clientName, minValue, dateFrom, dateTo } = filters;

        const matchesClient = clientName
            ? i.clientName.toLowerCase().includes(clientName.toLowerCase())
            : true;

        const matchesValue = minValue ? i.potentialValue >= minValue : true;

        const matchesDateFrom = dateFrom ? i.eventDate >= dateFrom : true;
        const matchesDateTo = dateTo ? i.eventDate <= dateTo : true;

        return (
            matchesClient && matchesValue && matchesDateFrom && matchesDateTo
        );
    });

    const grouped: Record<InquiryPhase, typeof inquiries> = {
        new: [],
        sent_to_hotels: [],
        offers_received: [],
        completed: [],
    };
    phases.forEach((phase) => {
        grouped[phase] = filteredInquiries.filter((i) => i.phase === phase);
    });

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const newPhase = over.id as InquiryPhase;
        moveInquiry(active.id.toString(), newPhase);
    };

    return (
        <>
            <FilterPanel />

            <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="p-6 flex gap-4 overflow-x-auto">
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
        </>
    );
}
