import { NextResponse } from "next/server";
import mongoose from "mongoose";

const LoveLockSchema = new mongoose.Schema(
    {
        sender: { type: String, required: true },
        message: { type: String, required: true },
        song: {
            title: String,
            artist: String,
            url: String,
            cover: String,
        },
    },
    { timestamps: true }
);

const LoveLock = mongoose.models.LoveLock || mongoose.model("LoveLock", LoveLockSchema);

export async function POST(req) {
    try {
        const body = await req.json();
        await mongoose.connect(process.env.MONGODB_URI);
        const saved = await LoveLock.create(body);

        console.log("Love Lock saved with ID:", saved._id.toString());
        return NextResponse.json({
            success: true,
            id: saved._id.toString(),
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to save Love Lock" },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const sender = searchParams.get("sender");

        console.log("GET /api/love-lock called, ID:", id, "Sender:", sender);

        if (!id) {
            return NextResponse.json({ error: "ID required" }, { status: 400 });
        }

        if (!sender) {
            return NextResponse.json(
                { error: "Sender name required" },
                { status: 401 }
            );
        }

        await mongoose.connect(process.env.MONGODB_URI);
        const lock = await LoveLock.findById(id);

        if (!lock) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        if (
            lock.sender.toLowerCase().trim() !==
            sender.toLowerCase().trim()
        ) {
            return NextResponse.json(
                { error: "Invalid sender name" },
                { status: 401 }
            );
        }

        return NextResponse.json(lock);

    } catch (error) {
        console.error("Love lock error:", error);
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}
