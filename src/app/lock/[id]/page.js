"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

const ViewLock = () => {
    const { id } = useParams();
    const [lock, setLock] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchLock = async () => {
            try {
                const res = await fetch(`/api/love-lock?id=${id}`, {
                    cache: "no-store",
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error);

                setLock(data);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchLock();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-[#1e010a] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-500"></div>
            </div>
        );
    }

    if (error || !lock) {
        return (
            <div className="min-h-screen w-full bg-[#1e010a] flex items-center justify-center text-pink-200">
                <p>Lock not found or invalid link 💔</p>
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
