"use client";

import React, { memo, useMemo } from "react";
import { Inquiry } from "@/types/inquiry";
import { useInquiryStore } from "@/store/inquiryStore";
import { useDraggable } from "@dnd-kit/core";
import { formatDistanceToNow } from "date-fns";

interface Props {
    inquiry: Inquiry;
}

function InquiryCardComponent({ inquiry }: Props) {
    const { selectInquiry } = useInquiryStore();

    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({
            id: inquiry.id,
        });

    const style = transform
        ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
        : undefined;

    const relativeDate = useMemo(
        () =>
            formatDistanceToNow(new Date(inquiry.eventDate), {
                addSuffix: true,
            }),
        [inquiry.eventDate]
    );

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`inquiry-card border rounded p-3 bg-white cursor-pointer shadow-sm transition-transform duration-50
    ${
        isDragging
            ? "shadow-lg scale-105 z-10"
            : "hover:shadow-md hover:-translate-y-1"
    }
    ${inquiry.potentialValue > 50000 ? "border-red-400" : "border-transparent"}
  `}
            onClick={() => selectInquiry(inquiry)}
        >
            <div
                {...listeners}
                {...attributes}
                className="cursor-move text-xs text-gray-400 mb-1 select-none"
                onClick={(e) => e.stopPropagation()}
            >
                Drag
            </div>

            <div className="font-semibold text-lg">{inquiry.clientName}</div>
            <div className="text-sm text-gray-600">
                Event: {inquiry.eventDate} ({relativeDate})
            </div>
            <div className="text-sm text-gray-600">
                Guests: {inquiry.guestCount}
            </div>
            <div className="text-sm">
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

export default memo(InquiryCardComponent);
