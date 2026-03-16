export default function Loading() {
    return (
        <main className="w-full flex flex-col items-center justify-center min-h-[70vh] gap-6 animate-in fade-in duration-700">
            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(168,85,247,0.2)]">
                {/* Outer spinning ring */}
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500 border-r-pink-500 animate-spin"></div>
            </div>
        </main>
    );
}
