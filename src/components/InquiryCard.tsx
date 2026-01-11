"use client";

import { Inquiry } from "@/types/inquiry";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface Props {
    inquiry: Inquiry;
}

export default function InquiryCard({ inquiry }: Props) {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({
            id: inquiry.id,
        });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="border p-3 rounded shadow-sm bg-white cursor-grab"
        >
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
