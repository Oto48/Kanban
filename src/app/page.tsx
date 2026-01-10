"use client";

import { useEffect } from "react";
import { useInquiryStore } from "@/store/inquiryStore";

export default function Home() {
    const { inquiries, fetchInquiries, loading } = useInquiryStore();

    useEffect(() => {
        fetchInquiries();
    }, [fetchInquiries]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6 space-y-2">
            {inquiries.map((i) => (
                <div key={i.id} className="border p-3 rounded">
                    <div className="font-semibold">{i.clientName}</div>
                    <div>{i.phase}</div>
                    <div>CHF {i.potentialValue}</div>
                </div>
            ))}
        </div>
    );
}
