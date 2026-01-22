"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const ViewLock = () => {
    const { id } = useParams();
    const [lock, setLock] = useState(null);
    const [senderInput, setSenderInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [unlocked, setUnlocked] = useState(false);
    const [displayedMessage, setDisplayedMessage] = useState("");

    useEffect(() => {
        if (unlocked && lock?.message && displayedMessage.length < lock.message.length) {
            const timeout = setTimeout(() => {
                setDisplayedMessage(lock.message.slice(0, displayedMessage.length + 1));
            }, 40);
            return () => clearTimeout(timeout);
        }
    }, [unlocked, lock, displayedMessage]);

    const fetchLock = async () => {
        try {
            setLoading(true);
            setError(false);
            const res = await fetch(
                `/api/love-lock?id=${id}&sender=${encodeURIComponent(senderInput)}`,
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
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const Background = () => (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0f0106]">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-pink-900/10 blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-rose-900/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            
            {unlocked && (
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(15)].map((_, i) => (
                        <div 
                            key={i}
                            className="absolute text-pink-500/20 animate-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `110%`,
                                fontSize: `${Math.random() * 20 + 15}px`,
                                animationDuration: `${Math.random() * 15 + 10}s`,
                                animationDelay: `${Math.random() * 10}s`
                            }}
                        >
                            ❤️
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    if (!unlocked) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center p-6 relative">
                <Background />
                <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] w-full max-w-sm text-center shadow-2xl animate-in fade-in zoom-in duration-500">
                    <div className="text-6xl mb-6 animate-bounce">🔒</div>
                    <h2 className="text-white text-2xl font-light mb-2">Unlock your <span className="text-pink-400 font-semibold">Message</span></h2>
                    <p className="text-pink-200/40 text-sm mb-8 italic font-light tracking-wide">Enter the sender's name to open</p>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Who sent this?"
                            value={senderInput}
                            onChange={(e) => setSenderInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && senderInput && fetchLock()}
                            className="w-full px-5 py-4 rounded-2xl bg-black/40 text-pink-50 outline-none border border-white/5 focus:border-pink-500/40 transition-all text-center placeholder:text-white/10"
                        />
                        {error && <p className="text-rose-400 text-xs animate-shake">That name is not correct 💔</p>}
                        <button
                            onClick={() => senderInput && fetchLock()}
                            disabled={loading}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 text-white font-bold shadow-lg shadow-pink-900/40 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? "Unlocking..." : "Unlock 💖"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 relative">
            <Background />
            <div className="max-w-md w-full space-y-8 flex flex-col items-center">
                
                <div className="text-center animate-in fade-in zoom-in duration-1000">
                    <div className="text-7xl mb-4 drop-shadow-[0_0_20px_rgba(236,72,153,0.4)]">💖</div>
                    <h1 className="text-pink-400 uppercase tracking-[0.4em] text-[10px] font-bold mb-2">A Secret Note From</h1>
                    <p className="text-5xl font-serif italic text-white tracking-tight">{lock.sender}</p>
                </div>

                <div className="w-full relative group animate-in slide-in-from-bottom-10 duration-1000">
                    <div className="absolute -inset-1 bg-gradient-to-r from-pink-600/20 to-rose-600/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" />
                    
                    <div className="relative bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden min-h-[200px] flex items-center justify-center p-10 md:p-12">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
                        
                        <div className="max-w-full">
                            <p className="text-pink-50 text-xl md:text-2xl leading-relaxed font-serif italic text-center whitespace-pre-wrap break-words">
                                <span className="text-pink-500/40 text-4xl mr-1 inline-block h-0">“</span>
                                {displayedMessage}
                                <span className="text-pink-500/40 text-4xl ml-1 inline-block h-0">”</span>
                                
                                {displayedMessage.length < (lock?.message?.length || 0) && (
                                    <span className="inline-block w-[2px] h-6 bg-pink-500 ml-1 translate-y-1 animate-pulse" />
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {lock.song && (
                    <div className="w-full bg-black/40 backdrop-blur-xl p-4 rounded-[2.5rem] border border-white/5 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-700 fill-mode-both">
                        <div className="relative h-20 w-20 flex-shrink-0">
                            <Image src={lock.song.cover} alt="Song Art" fill unoptimized className="rounded-2xl object-cover shadow-lg" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">{lock.song.title}</p>
                            <p className="text-pink-400/70 text-sm truncate mb-2">{lock.song.artist}</p>
                            <audio autoPlay controls src={lock.song.url} className="h-8 w-full brightness-75 contrast-125" />
                        </div>
                    </div>
                )}
                
                <div className="w-full pt-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1000 fill-mode-both">
                    <Link 
                        href="/create" 
                        className="group relative flex items-center justify-center w-full py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-[0.98] overflow-hidden"
                    >
                        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                        <span className="text-pink-100 font-medium tracking-wide flex items-center gap-2">
                            Send your own <span className="text-lg">✨</span>
                        </span>
                    </Link>

                    <button 
                        onClick={() => window.location.reload()}
                        className="w-full text-pink-200/20 hover:text-pink-200/50 text-[10px] transition-colors uppercase tracking-[0.3em] font-medium"
                    >
                        Close Message
                    </button>
                </div>
                <p className="mt-8 text-pink-200/10 text-[10px] tracking-[0.2em] uppercase font-medium animate-pulse">
                    Created by Precious
                </p>
            </div>

            <style jsx global>{`
                @keyframes float {
                    0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
                    10% { opacity: 0.4; }
                    90% { opacity: 0.4; }
                    100% { transform: translateY(-120vh) rotate(360deg); opacity: 0; }
                }
                .animate-float {
                    animation: float linear infinite;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-8px); }
                    75% { transform: translateX(8px); }
                }
                .animate-shake {
                    animation: shake 0.2s ease-in-out 0s 2;
                }
                audio::-webkit-media-controls-enclosure {
                    background-color: rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                }
            `}</style>
        </div>
    );
};

export default ViewLock;