"use client";

import { useInquiryStore } from "@/store/inquiryStore";
import { InquiryPhase } from "@/types/inquiry";

export default function InquiryDetailModal() {
    const { selectedInquiry, closeInquiry, moveInquiry } = useInquiryStore();

    if (!selectedInquiry) return null;

    const phases: InquiryPhase[] = [
        "new",
        "sent_to_hotels",
        "offers_received",
        "completed",
    ];

    const handlePhaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPhase = e.target.value as InquiryPhase;
        moveInquiry(selectedInquiry.id, newPhase);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
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

                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Phase:</label>
                    <select
                        value={selectedInquiry.phase}
                        onChange={handlePhaseChange}
                        className="border rounded p-1 w-full"
                    >
                        {phases.map((phase) => (
                            <option key={phase} value={phase}>
                                {phase}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="text-sm text-gray-500">
                    Created: {selectedInquiry.createdAt} <br />
                    Updated: {selectedInquiry.updatedAt}
                </div>
            </div>
        </div>
    );
}
