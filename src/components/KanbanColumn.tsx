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

    const highValueCount = inquiries.filter(
        (i) => i.potentialValue > 50000
    ).length;

    return (
        <div
            ref={setNodeRef}
            className={`flex-1 rounded min-w-[250px] shadow-sm hover:shadow-md transition-all
                ${
                    highValueCount > 0
                        ? "border-2 border-red-400"
                        : "border border-transparent"
                }
            `}
        >
            <div className="bg-gray-200 rounded-t px-3 py-2 font-bold text-gray-800 flex justify-between items-center">
                <span className="capitalize">{phase.replace(/_/g, " ")}</span>
                <span className="text-sm text-gray-600">
                    {inquiries.length} | CHF {totalValue}
                    {highValueCount > 0 && (
                        <span className="ml-2 text-red-600 font-semibold">
                            ⚡ {highValueCount}
                        </span>
                    )}
                </span>
            </div>

            <div className="p-3 space-y-3">
                {inquiries.map((i) => (
                    <InquiryCard key={i.id} inquiry={i} />
                ))}
            </div>
        </div>
    );
}
