"use client";

import { Inquiry, InquiryPhase } from "@/types/inquiry";
import InquiryCard from "./InquiryCard";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { useInquiryStore } from "@/store/inquiryStore";

interface Props {
    phase: string;
    inquiries: Inquiry[];
}

export default function KanbanColumn({ phase, inquiries }: Props) {
    const { moveInquiry } = useInquiryStore();

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;
        const [newPhase] = over.id.toString().split(":");
        moveInquiry(active.id.toString(), newPhase as InquiryPhase);
    };

    const count = inquiries.length;
    const totalValue = inquiries.reduce((sum, i) => sum + i.potentialValue, 0);

    return (
        <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div
                id={phase}
                className="flex-1 bg-gray-100 p-3 rounded space-y-3 min-w-[250px]"
            >
                <div className="font-bold mb-2">
                    {phase} ({count}) — CHF {totalValue}
                </div>
                {inquiries.map((i) => (
                    <div key={i.id} id={i.id}>
                        <InquiryCard inquiry={i} />
                    </div>
                ))}
            </div>
        </DndContext>
    );
}
