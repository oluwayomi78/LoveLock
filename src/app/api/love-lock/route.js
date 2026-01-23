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
        const query = searchParams.get("search"); 

        await mongoose.connect(process.env.MONGODB_URI);

        if (id) {
            if (!sender) return NextResponse.json({ error: "Sender name required" }, { status: 401 });
            const lock = await LoveLock.findById(id);
            if (!lock) return NextResponse.json({ error: "Not found" }, { status: 404 });

            if (lock.sender.toLowerCase().trim() !== sender.toLowerCase().trim()) {
                return NextResponse.json({ error: "Invalid sender name" }, { status: 401 });
            }
            return NextResponse.json(lock);
        }

        let filter = {};
        if (query) {
            filter = { 
                $or: [
                    { message: { $regex: query, $options: "i" } },
                    { sender: { $regex: query, $options: "i" } }
                ] 
            };
        }

        const locks = await LoveLock.find(filter).sort({ createdAt: -1 });
        return NextResponse.json(locks);

    } catch (error) {
        console.error("Love lock error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}