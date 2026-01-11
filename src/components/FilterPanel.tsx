"use client";

import { useState, useEffect } from "react";
import { useInquiryStore } from "@/store/inquiryStore";
import debounce from "lodash.debounce";

export default function FilterPanel() {
    const { filters, setFilters } = useInquiryStore();

    const [clientName, setClientName] = useState(filters.clientName);
    const [minValue, setMinValue] = useState(filters.minValue || 0);
    const [dateFrom, setDateFrom] = useState(filters.dateFrom || "");
    const [dateTo, setDateTo] = useState(filters.dateTo || "");

    const updateClientName = debounce((value: string) => {
        setFilters({ clientName: value });
    }, 300);

    useEffect(() => {
        updateClientName(clientName);
    }, [clientName]);

    const handleMinValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setMinValue(value);
        setFilters({ minValue: value });
    };

    const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDateFrom(value);
        setFilters({ dateFrom: value });
    };

    const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDateTo(value);
        setFilters({ dateTo: value });
    };

    const clearFilters = () => {
        setClientName("");
        setMinValue(0);
        setDateFrom("");
        setDateTo("");
        setFilters({ clientName: "", minValue: 0, dateFrom: "", dateTo: "" });
    };

    const activeCount = [
        clientName,
        minValue > 0 ? minValue : null,
        dateFrom,
        dateTo,
    ].filter(Boolean).length;

    return (
        <div className="bg-gray-50 p-4 rounded shadow mb-4 flex flex-col md:flex-row gap-4 items-end">
            <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                    Client Name
                </label>
                <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="border rounded p-1"
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                    Min Value (CHF)
                </label>
                <input
                    type="number"
                    value={minValue}
                    onChange={handleMinValueChange}
                    className="border rounded p-1 w-24"
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Date From</label>
                <input
                    type="date"
                    value={dateFrom}
                    onChange={handleDateFromChange}
                    className="border rounded p-1"
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Date To</label>
                <input
                    type="date"
                    value={dateTo}
                    onChange={handleDateToChange}
                    className="border rounded p-1"
                />
            </div>

            <button
                onClick={clearFilters}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
                Clear ({activeCount})
            </button>
        </div>
    );
}
