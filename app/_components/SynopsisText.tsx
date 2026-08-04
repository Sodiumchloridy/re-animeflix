"use client";

import { useState } from "react";

export default function SynopsisText({ text }: { text: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  // Clean raw HTML tags if AniList returned HTML descriptions like <br> or <i>
  const sanitizedText = text.replace(/<[^>]*>?/gm, "");

  return (
    <div className="flex flex-col items-start space-y-1">
      <p
        className={`text-xs sm:text-sm text-zinc-300 leading-relaxed transition-all duration-300 ${
          isExpanded ? "" : "line-clamp-4"
        }`}
      >
        {sanitizedText}
      </p>
      {sanitizedText.length > 180 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-bold text-purple-400 hover:text-purple-300 pt-1 transition-colors uppercase tracking-wider focus:outline-none focus:underline"
        >
          {isExpanded ? "Show Less" : "Read Full Synopsis"}
        </button>
      )}
    </div>
  );
}