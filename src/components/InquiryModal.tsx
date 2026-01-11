"use client";

import { useInquiryStore } from "@/store/inquiryStore";

export default function InquiryModal() {
    const { selectedInquiry, closeInquiry } = useInquiryStore();
    if (!selectedInquiry) return null;

    const i = selectedInquiry;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded w-[400px] space-y-2">
                <h2 className="font-bold text-lg">{i.clientName}</h2>
                <div>Contact: {i.contactPerson}</div>
                <div>Event: {i.eventType}</div>
                <div>Date: {i.eventDate}</div>
                <div>Guests: {i.guestCount}</div>
                <div>Value: CHF {i.potentialValue}</div>
                <div>Hotels: {i.hotels.join(", ")}</div>
                <div>Notes: {i.notes}</div>

                <button
                    onClick={closeInquiry}
                    className="mt-4 px-3 py-1 bg-gray-200 rounded"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
