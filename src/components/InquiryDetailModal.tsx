"use client";

import { useInquiryStore } from "@/store/inquiryStore";

export default function InquiryDetailModal() {
    const { selectedInquiry, closeInquiry } = useInquiryStore();

    if (!selectedInquiry) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 cursor-pointer"
                    onClick={closeInquiry}
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold mb-2">
                    {selectedInquiry.clientName}
                </h2>

                <div className="mb-2">
                    Contact: {selectedInquiry.contactPerson}
                </div>
                <div className="mb-2">Event: {selectedInquiry.eventType}</div>
                <div className="mb-2">Date: {selectedInquiry.eventDate}</div>
                <div className="mb-2">Guests: {selectedInquiry.guestCount}</div>
                <div className="mb-2">
                    Value: CHF {selectedInquiry.potentialValue}
                </div>

                <div className="mb-2">
                    Hotels: {selectedInquiry.hotels.join(", ")}
                </div>

                <div className="mb-2">Notes: {selectedInquiry.notes}</div>

                <div className="text-sm text-gray-500">
                    Created: {selectedInquiry.createdAt} <br />
                    Updated: {selectedInquiry.updatedAt}
                </div>
            </div>
        </div>
    );
}
