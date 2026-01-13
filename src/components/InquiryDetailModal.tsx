"use client";

import { useInquiryStore } from "@/store/inquiryStore";
import { InquiryPhase } from "@/types/inquiry";
import { format } from "date-fns";

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

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "PPP 'at' h:mm a");
        } catch {
            return dateString;
        }
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

                <h2 className="text-xl font-bold mb-4">
                    {selectedInquiry.clientName}
                </h2>

                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="font-medium">Contact Person:</span>
                        <span>{selectedInquiry.contactPerson}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="font-medium">Event Type:</span>
                        <span>{selectedInquiry.eventType}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="font-medium">Event Date:</span>
                        <span>{selectedInquiry.eventDate}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="font-medium">Number of Guests:</span>
                        <span>{selectedInquiry.guestCount}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="font-medium">Potential Value:</span>
                        <span
                            className={`font-semibold ${
                                selectedInquiry.potentialValue > 50000
                                    ? "text-red-600"
                                    : "text-green-600"
                            }`}
                        >
                            CHF{" "}
                            {selectedInquiry.potentialValue.toLocaleString()}
                        </span>
                    </div>

                    <div className="flex justify-between items-start">
                        <span className="font-medium">Associated Hotels:</span>
                        <span className="text-right">
                            {selectedInquiry.hotels.map((hotel, index) => (
                                <div key={index}>• {hotel}</div>
                            ))}
                        </span>
                    </div>

                    <div className="flex justify-between items-start">
                        <span className="font-medium">Notes:</span>
                        <span className="text-right max-w-xs">
                            {selectedInquiry.notes}
                        </span>
                    </div>
                </div>

                <div className="mt-6 mb-4">
                    <label className="block mb-2 font-semibold">Phase:</label>
                    <select
                        value={selectedInquiry.phase}
                        onChange={handlePhaseChange}
                        className="border rounded p-2 w-full focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    >
                        {phases.map((phase) => (
                            <option key={phase} value={phase}>
                                {phase
                                    .split("_")
                                    .map(
                                        (word) =>
                                            word.charAt(0).toUpperCase() +
                                            word.slice(1)
                                    )
                                    .join(" ")}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="text-sm text-gray-500 space-y-1 pt-4 border-t">
                    <div>
                        <span className="font-medium">Created:</span>{" "}
                        {formatDate(selectedInquiry.createdAt)}
                    </div>
                    <div>
                        <span className="font-medium">Last Updated:</span>{" "}
                        {formatDate(selectedInquiry.updatedAt)}
                    </div>
                </div>
            </div>
        </div>
    );
}
