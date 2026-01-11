"use client";

import { Inquiry } from "@/types/inquiry";
import InquiryCard from "./InquiryCard";
import { useDroppable } from "@dnd-kit/core";

interface Props {
    phase: string;
    inquiries: Inquiry[];
}

export default function KanbanColumn({ phase, inquiries }: Props) {
    const { setNodeRef } = useDroppable({ id: phase });

    const totalValue = inquiries.reduce((sum, i) => sum + i.potentialValue, 0);

    return (
        <div
            ref={setNodeRef}
            className="flex-1 bg-gray-100 p-3 rounded space-y-3 min-w-[250px]"
        >
            <div className="font-bold mb-2">
                {phase} ({inquiries.length}) — CHF {totalValue}
            </div>

            {inquiries.map((i) => (
                <InquiryCard key={i.id} inquiry={i} />
            ))}
        </div>
    );
}
