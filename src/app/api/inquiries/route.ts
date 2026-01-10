import { NextResponse } from "next/server";
import { inquiries } from "@/data/inquiries";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const clientName = searchParams.get("clientName");
    const minValue = searchParams.get("minValue");

    let result = inquiries;

    if (clientName) {
        result = result.filter((i) =>
            i.clientName.toLowerCase().includes(clientName.toLowerCase())
        );
    }

    if (minValue) {
        result = result.filter((i) => i.potentialValue >= Number(minValue));
    }

    // simulate network delay
    await new Promise((res) => setTimeout(res, 500));

    return NextResponse.json(result);
}

export async function PATCH(request: Request) {
    const body = await request.json();
    const { id, phase } = body;

    const inquiry = inquiries.find((i) => i.id === id);
    if (!inquiry)
        return NextResponse.json({ error: "Not found" }, { status: 404 });

    inquiry.phase = phase;
    inquiry.updatedAt = new Date().toISOString();

    await new Promise((res) => setTimeout(res, 500));
    return NextResponse.json(inquiry);
}
