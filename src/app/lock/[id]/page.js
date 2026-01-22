"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

const ViewLock = () => {
    const { id } = useParams();

    const [lock, setLock] = useState(null);
    const [senderInput, setSenderInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [unlocked, setUnlocked] = useState(false);

    const fetchLock = async () => {
        try {
            setLoading(true);
            setError(false);

            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            const res = await fetch(
                `${baseUrl}/api/love-lock?id=${id}&sender=${encodeURIComponent(senderInput)}`,
                { cache: "no-store" }
            );

            const data = await res.json();

            if (!res.ok || !data._id) {
                setError(true);
                return;
            }

            setLock(data);
            setUnlocked(true);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    if (!unlocked) {
        return (
            <div className="min-h-screen w-full bg-[#1e010a] flex items-center justify-center p-6">
                <div className="bg-[#500724]/60 p-8 rounded-3xl w-full max-w-sm text-center space-y-5">
                    <div className="text-5xl">🔒</div>

                    <h2 className="text-pink-200 text-lg font-semibold">
                        Who sent this Love Lock?
                    </h2>

                    <input
                        type="text"
                        placeholder="Enter sender's name"
                        value={senderInput}
                        onChange={(e) => setSenderInput(e.target.value)}
                        className="w-full p-3 rounded-xl bg-black/40 text-pink-100 outline-none border border-pink-500/30"
                    />

                    {error && (
                        <p className="text-red-400 text-sm">
                            Wrong name 💔 Try again
                        </p>
                    )}

                    <button
                        onClick={() => senderInput && fetchLock()}
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold disabled:opacity-50"
                    >
                        {loading ? "Unlocking..." : "Unlock 💖"}
                    </button>
                </div>
            </div>
        );
    }

    if (loading || !lock) {
        return (
            <div className="min-h-screen w-full bg-[#1e010a] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#1e010a] p-6 text-center">
            <div className="max-w-md w-full space-y-8">
                <div className="text-6xl animate-bounce">💖</div>

                <div>
                    <h1 className="text-pink-300/50 uppercase tracking-widest text-[10px]">
                        A Secret Message From
                    </h1>
                    <p className="text-4xl font-bold text-pink-100">
                        {lock.sender}
                    </p>
                </div>

                <div className="bg-[#500724]/60 p-8 rounded-[40px] border border-pink-500/20">
                    <p className="text-pink-100 italic">{lock.message}</p>
                </div>

                {lock.song && (
                    <div className="bg-white/5 p-5 rounded-3xl">
                        <Image
                            src={lock.song.cover}
                            alt="Album Art"
                            width={100}
                            height={100}
                            unoptimized
                            className="mx-auto rounded-xl"
                        />
                        <p className="text-pink-100 mt-3">{lock.song.title}</p>
                        <p className="text-pink-300/50 text-xs">{lock.song.artist}</p>
                        <audio controls src={lock.song.url} className="w-full mt-2" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewLock;
