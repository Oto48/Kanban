"use client";

import { useEffect } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { useInquiryStore } from "@/store/inquiryStore";
import KanbanColumn from "@/components/KanbanColumn";
import InquiryDetailModal from "@/components/InquiryDetailModal";
import { InquiryPhase } from "@/types/inquiry";

export default function Home() {
    const { inquiries, fetchInquiries, moveInquiry, loading } =
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

            <InquiryDetailModal />
        </DndContext>
    );
}
