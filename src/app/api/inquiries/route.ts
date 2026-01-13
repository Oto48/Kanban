import { NextResponse } from "next/server";
import { inquiries } from "@/data/inquiries";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const clientName = searchParams.get("clientName");
    const minValue = searchParams.get("minValue");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    let result = inquiries;

    if (clientName) {
        result = result.filter((i) =>
            i.clientName.toLowerCase().includes(clientName.toLowerCase())
        );
    }

    if (minValue) {
        result = result.filter((i) => i.potentialValue >= Number(minValue));
    }

    if (dateFrom) {
        const fromDate = new Date(dateFrom);
        result = result.filter((i) => new Date(i.eventDate) >= fromDate);
    }

    if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        result = result.filter((i) => new Date(i.eventDate) <= toDate);
    }

    await new Promise((res) => setTimeout(res, 500));

    return NextResponse.json(result);
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, phase } = body;

        if (!id || !phase) {
            return NextResponse.json(
                { error: "Missing id or phase" },
                { status: 400 }
            );
        }

        const inquiry = inquiries.find((i) => i.id === id);
        if (!inquiry) {
            return NextResponse.json(
                { error: "Inquiry not found" },
                { status: 404 }
            );
        }

        const validPhases = [
            "new",
            "sent_to_hotels",
            "offers_received",
            "completed",
        ];
        if (!validPhases.includes(phase)) {
            return NextResponse.json(
                { error: "Invalid phase" },
                { status: 400 }
            );
        }

        inquiry.phase = phase;
        inquiry.updatedAt = new Date().toISOString();

        await new Promise((res) => setTimeout(res, 500));

        return NextResponse.json(inquiry);
    } catch (error) {
        return NextResponse.json(
            { error: "Invalid request body" },
            { status: 400 }
        );
    }
}
