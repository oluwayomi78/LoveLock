"use client";

import { useState, useEffect } from 'react';

const LoveLockPage = () => {
    const [sender, setSender] = useState('');
    const [message, setMessage] = useState('');
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedSong, setSelectedSong] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(false);

    const [createdLock, setCreatedLock] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const searchSongs = async () => {
            if (query.length < 3) { setResults([]); return; }
            setIsSearching(true);
            try {
                const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=5`);
                const data = await response.json();
                setResults(data.results || []);
            } catch (error) { console.error(error); } finally { setIsSearching(false); }
        };
        const timer = setTimeout(searchSongs, 500);
        return () => clearTimeout(timer);
    }, [query]);

    const handleLockHeart = async () => {
        if (!sender || !message || !selectedSong) {
            alert("All fields are required!");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/love-lock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sender,
                    message,
                    song: {
                        title: selectedSong.trackName,
                        artist: selectedSong.artistName,
                        url: selectedSong.previewUrl,
                        cover: selectedSong.artworkUrl100,
                    },
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to create Love Lock");
            }

            if (data.success) {
                setCreatedLock(data);
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        const shareUrl = `${window.location.origin}/lock/${createdLock.id}`;
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (createdLock) {
        const shareUrl = `${window.location.origin}/lock/${createdLock.id}`;
        const shareMessage = encodeURIComponent(`I locked a secret message for you here: ${shareUrl}`);

        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#1e010a] p-4 font-sans">
                <div className="w-full max-w-md bg-[#500724]/80 backdrop-blur-md rounded-[40px] p-10 text-center shadow-2xl border border-pink-500/20">
                    <div className="text-6xl mb-6 drop-shadow-lg">🔒💖</div>
                    <h2 className="text-3xl font-bold text-pink-200 mb-2">Heart Locked!</h2>
                    <p className="text-pink-300/70 mb-8 text-sm px-4">
                        Your lock is ready. Use the buttons below to send it to your person.
                    </p>

                    <div className="bg-[#3d041a] rounded-2xl p-4 mb-8 border border-pink-900/50 flex items-center justify-between gap-2 overflow-hidden">
                        <span className="text-pink-100 text-[10px] font-mono truncate">{shareUrl}</span>
                        <button
                            onClick={copyToClipboard}
                            className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-lg text-[10px] font-bold uppercase shrink-0"
                        >
                            {copied ? "Copied" : "Copy"}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <a
                            href={`https://wa.me/?text=${shareMessage}`}
                            target="_blank"
                            className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:scale-[1.02] py-4 rounded-full font-bold text-white uppercase tracking-wider text-xs transition-all"
                        >
                            Share to WhatsApp
                        </a>

                        <a
                            href={`https://twitter.com/intent/tweet?text=${shareMessage}`}
                            target="_blank"
                            className="flex items-center justify-center gap-3 w-full bg-black hover:scale-[1.02] py-4 rounded-full font-bold text-white uppercase tracking-wider text-xs transition-all"
                        >
                            Post on Twitter / X
                        </a>

                        <button
                            onClick={copyToClipboard}
                            className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-[#69C9D0] via-[#EE1D52] to-[#010101] hover:scale-[1.02] py-4 rounded-full font-bold text-white uppercase tracking-wider text-xs transition-all"
                        >
                            <span>{copied ? "Link Copied ✅" : "Copy for TikTok"}</span>
                        </button>
                    </div>

                    <button
                        onClick={() => {
                            setCreatedLock(null);
                            setSender('');
                            setMessage('');
                            setSelectedSong(null);
                            setQuery('');
                            setResults([]);
                        }}
                        className="mt-8 text-pink-300/30 text-[10px] font-bold hover:text-pink-300 uppercase tracking-widest"
                    >
                        Create Another Lock
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-[#831843] via-[#4c0519] to-[#1e010a] p-4">
            <div className="w-full max-w-md bg-[#500724]/80 backdrop-blur-md rounded-[40px] p-8 shadow-[0_0_50px_rgba(236,72,153,0.3)] border border-white/5">
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-bold text-pink-200 tracking-tight drop-shadow-[0_0_10px_rgba(244,114,182,0.8)]">
                        Create <br /> Love Lock
                    </h1>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-pink-300/80 uppercase tracking-widest ml-1">Sender Name (THE KEY)</label>
                        <input
                            type="text"
                            value={sender}
                            onChange={(e) => setSender(e.target.value)}
                            placeholder="Who is sending this?"
                            className="w-full bg-[#3d041a]/50 border border-pink-900/30 rounded-2xl px-5 py-4 text-sm text-pink-100 placeholder:text-pink-300/30 focus:outline-none focus:border-pink-500/50 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-pink-300/80 uppercase tracking-widest ml-1">Secret Message</label>
                        <textarea
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write your feelings..."
                            className="w-full bg-[#3d041a]/50 border border-pink-900/30 rounded-2xl px-5 py-4 text-sm text-pink-100 placeholder:text-pink-300/30 focus:outline-none focus:border-pink-500/50 transition-all resize-none"
                        />
                    </div>

                    <div className="space-y-2 relative">
                        <label className="text-[10px] font-bold text-pink-300/80 uppercase tracking-widest ml-1">Attach a Song</label>
                        {!selectedSong ? (
                            <>
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search song..."
                                    className="w-full bg-[#3d041a]/50 border border-pink-900/30 rounded-2xl px-5 py-4 text-sm text-pink-100 placeholder:text-pink-300/30 focus:outline-none focus:border-pink-500/50 transition-all"
                                />
                                {results.length > 0 && (
                                    <div className="absolute z-20 w-full mt-2 bg-[#500724] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl max-h-60 overflow-y-auto">
                                        {results.map((song) => (
                                            <button
                                                key={song.trackId}
                                                onClick={() => { setSelectedSong(song); setQuery(''); setResults([]); }}
                                                className="w-full flex items-center gap-3 p-3 hover:bg-pink-500/20 text-left border-b border-white/5 last:border-0"
                                            >
                                                <img src={song.artworkUrl100} alt="cover" className="w-10 h-10 rounded-lg" />
                                                <div className="overflow-hidden">
                                                    <p className="text-pink-100 text-sm font-bold truncate">{song.trackName}</p>
                                                    <p className="text-pink-300/60 text-xs truncate">{song.artistName}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex items-center justify-between bg-pink-500/20 border border-pink-500/40 p-3 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <img src={selectedSong.artworkUrl100} alt="cover" className="w-10 h-10 rounded-lg" />
                                    <div>
                                        <p className="text-pink-100 text-sm font-bold">{selectedSong.trackName}</p>
                                        <p className="text-pink-300/60 text-xs">{selectedSong.artistName}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedSong(null)} className="text-pink-300/50 hover:text-pink-100 p-2 text-xs font-bold">Change</button>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleLockHeart}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-300 hover:to-pink-400 py-4 rounded-full font-bold text-[#500724] uppercase tracking-wider text-sm shadow-lg transform active:scale-[0.98] transition-all mt-4 disabled:opacity-50"
                    >
                        {loading ? 'Locking...' : 'Lock My Heart'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoveLockPage;