"use client";

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
                const res = await fetch(`/api/love-lock?id=${id}`);
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

    if (loading) return (
        <div className="min-h-screen w-full bg-[#1e010a] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-500"></div>
        </div>
    );

    if (error || !lock) return (
        <div className="min-h-screen w-full bg-[#1e010a] flex items-center justify-center text-pink-200">
            <p>Lock not found or invalid link. 💔</p>
        </div>
    );

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#1e010a] p-6 text-center">
            <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-700">

                <div className="text-6xl drop-shadow-[0_0_15px_rgba(236,72,153,1)] animate-bounce">
                    💖
                </div>

                <div className="space-y-2">
                    <h1 className="text-pink-300/50 uppercase tracking-[0.3em] text-[10px] font-bold">
                        A Secret Message From
                    </h1>
                    <p className="text-4xl font-bold text-pink-100 tracking-tight">
                        {lock.sender}
                    </p>
                </div>

                <div className="bg-[#500724]/60 backdrop-blur-md p-8 rounded-[40px] border border-pink-500/20 shadow-2xl">
                    <p className="text-pink-100 text-lg italic leading-relaxed">
                        {lock.message}
                    </p>
                </div>

                {lock.song && (
                    <div className="bg-white/5 p-5 rounded-3xl flex flex-col items-center gap-4 border border-white/5 shadow-inner">
                        <Image
                            src={lock.song.cover}
                            alt="Album Art"
                            width={100}
                            height={100}
                            unoptimized={true} 
                            className="w-20 h-20 rounded-2xl shadow-lg border border-pink-500/20"
                        />
                        <div className="text-center w-full">
                            <p className="text-pink-100 font-bold text-sm">{lock.song.title}</p>
                            <p className="text-pink-300/50 text-xs mb-3">{lock.song.artist}</p>

                            <audio
                                controls
                                src={lock.song.url}
                                className="h-8 w-full scale-90 opacity-80 hover:opacity-100 transition-opacity"
                            />
                        </div>
                    </div>
                )}

                
            </div>
        </div>
    );
};

export default ViewLock;