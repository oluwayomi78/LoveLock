"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function MessageFeed() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [passcode, setPasscode] = useState("");
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [error, setError] = useState("");

    const CORRECT_PASSCODE = process.env.NEXT_PUBLIC_PASSWORD_MESSAGE_FEED ;

    const handleUnlock = (e) => {
        e.preventDefault();
        if (passcode === CORRECT_PASSCODE) {
            setIsUnlocked(true);
            setError("");
        } else {
            setError("Incorrect passcode. Try again.");
        }
    };

    const fetchMessages = async (query = "") => {
        setLoading(true);
        try {
            const endpoint = query
                ? `/api/love-lock?search=${encodeURIComponent(query)}`
                : "/api/love-lock";

            const response = await fetch(endpoint);
            const data = await response.json();

            if (Array.isArray(data)) {
                setMessages(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isUnlocked) {
            const delayDebounceFn = setTimeout(() => {
                fetchMessages(searchTerm);
            }, 300);
            return () => clearTimeout(delayDebounceFn);
        }
    }, [searchTerm, isUnlocked]);

    if (!isUnlocked) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-pink-100 w-full max-w-sm text-center">
                    <div className="text-4xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-pink-600 mb-4">Locked Wall</h2>
                    <form onSubmit={handleUnlock} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Enter passcode"
                            className="w-full p-3 rounded-xl border-2 border-pink-50 focus:border-pink-300 outline-none text-center text-lg tracking-widest"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                        />
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                        <button className="w-full bg-pink-500 text-white py-3 rounded-xl font-bold hover:bg-pink-600 transition-colors">
                            Unlock Feed
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-pink-600">💖 Love Lock Wall</h2>
                <button onClick={() => setIsUnlocked(false)} className="text-xs text-gray-400 underline">Lock</button>
            </div>

            <div className="relative mb-8">
                <input
                    type="text"
                    placeholder="Search #hashtags or names..."
                    className="w-full p-4 pl-12 rounded-2xl border-2 border-pink-100 focus:border-pink-400 outline-none transition-all shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute left-4 top-4">🔍</span>
            </div>

            {loading ? (
                <div className="text-center py-10 text-pink-500 animate-pulse">Loading...</div>
            ) : (
                <div className="flex flex-col gap-4">
                    {messages.map((msg) => (
                        <div key={msg._id} className="bg-white p-5 rounded-2xl shadow-sm border border-pink-50">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-pink-500">@{msg.sender}</span>
                                <span className="text-[10px] text-gray-400">
                                    {new Date(msg.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-700 italic">{msg.message}</p>
                            {msg.song?.title && (
                                <div className="mt-4 flex items-center gap-3 bg-pink-50/50 p-2 rounded-xl">
                                    <Image src={msg.song.cover || "/api/placeholder/48/48"} alt="Cover" width={48} height={48} className="rounded-lg object-cover" />
                                    <div className="overflow-hidden">
                                        <p className="text-xs font-bold truncate">{msg.song.title}</p>
                                        <p className="text-[10px] text-gray-500 truncate">{msg.song.artist}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}