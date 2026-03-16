"use client";

import { useState } from "react";

export default function SynopsisText({ text }: { text: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  return (
    <div className="flex flex-col items-start gap-1">
      <p
        className={`text-sm text-white/70 leading-relaxed transition-all duration-300 ${
          isExpanded ? "" : "line-clamp-4"
        }`}
      >
        {text}
      </p>
      {text.length > 150 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-purple-400 hover:text-purple-300 mt-1 transition-colors uppercase tracking-wider"
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
}