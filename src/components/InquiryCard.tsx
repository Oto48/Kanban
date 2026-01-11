import { useDraggable } from "@dnd-kit/core";
import { Inquiry } from "@/types/inquiry";

interface Props {
    inquiry: Inquiry;
}

export default function InquiryCard({ inquiry }: Props) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: inquiry.id,
    });

    const style = {
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
    };

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
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
