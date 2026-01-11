"use client";

import { Inquiry } from "@/types/inquiry";
import { useInquiryStore } from "@/store/inquiryStore";
import { useDraggable } from "@dnd-kit/core";

interface Props {
    inquiry: Inquiry;
}

export default function InquiryCard({ inquiry }: Props) {
    const { selectInquiry } = useInquiryStore();

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: inquiry.id,
    });

    const style = transform
        ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
        : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="border p-3 rounded shadow-sm bg-white cursor-pointer"
            onClick={() => selectInquiry(inquiry)}
        >
            <div
                {...listeners}
                {...attributes}
                className="cursor-move text-xs text-gray-400 mb-1"
                onClick={(e) => e.stopPropagation()}
            >
                Drag
            </div>

            <div className="font-semibold">{inquiry.clientName}</div>
            <div>Event: {inquiry.eventDate}</div>
            <div>Guests: {inquiry.guestCount}</div>
            <div>
                Value:{" "}
                <span
                    className={
                        inquiry.potentialValue > 50000
                            ? "font-bold text-red-600"
                            : ""
                    }
                >
                    CHF {inquiry.potentialValue}
                </span>
            </div>
        </div>
    );
}
