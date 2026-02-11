"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { termsContent } from "./terms-content";

export default function Home() {
  const [agreed, setAgreed] = useState(false);
  const [declinePos, setDeclinePos] = useState<{ top: string; left: string } | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const declineRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const runAway = useCallback(() => {
    if (!declineRef.current) return;
    setIsRunning(true);

    const btn = declineRef.current.getBoundingClientRect();
    const padding = 16;

    const maxX = window.innerWidth - btn.width - padding;
    const maxY = window.innerHeight - btn.height - padding;

    const newX = Math.max(padding, Math.random() * maxX);
    const newY = Math.max(padding, Math.random() * maxY);

    setDeclinePos({ top: `${newY}px`, left: `${newX}px` });

    setTimeout(() => setIsRunning(false), 200);
  }, []);

  // Reset decline position on window resize
  useEffect(() => {
    const handleResize = () => setDeclinePos(null);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (agreed) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <video
          className="max-h-screen max-w-full"
          src="/video/DevilKaRR.mp4"
          autoPlay
          loop
          playsInline
          controls
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
      {/* Overlay backdrop */}
      <div className="fixed inset-0 bg-black/60 z-10" />

      {/* T&C Modal */}
      <div
        ref={containerRef}
        className="relative z-20 bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border-2 border-pink-300"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-100 to-pink-200 px-6 py-4 rounded-t-lg border-b border-pink-200">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800 font-serif">
            TERMS OF ENDEARMENT AGREEMENT
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Document No. 14022026-LOVE &bull; Effective Immediately &bull; Non-Negotiable
          </p>
        </div>

        {/* Greeting */}
        <div className="px-6 pt-4 pb-2">
          <p className="text-sm text-gray-700 font-serif italic">
            Dear Piggies,
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Please carefully read the following Terms of Endearment before proceeding.
            By clicking &ldquo;I Agree&rdquo;, you acknowledge that you have read, understood,
            and accepted all terms and conditions herein.
          </p>
        </div>

        {/* Scrollable T&C content */}
        <div className="flex-1 overflow-y-auto px-6 py-3 terms-scroll min-h-0">
          <div
            className="text-xs sm:text-sm text-gray-700 font-serif leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: termsContent }}
          />
        </div>

        {/* Checkbox + Buttons */}
        <div className="border-t border-pink-200 px-6 py-4 bg-pink-50/50 rounded-b-lg relative">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:justify-end">
            <button
              onClick={() => setAgreed(true)}
              className="w-full sm:w-auto px-8 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-md transition-colors text-sm cursor-pointer shadow-md hover:shadow-lg"
            >
              I Agree &hearts;
            </button>

            <button
              ref={declineRef}
              onMouseEnter={runAway}
              onTouchStart={runAway}
              onClick={runAway}
              className="w-full sm:w-auto px-8 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-600 font-semibold rounded-md text-sm cursor-pointer transition-all duration-200"
              style={
                declinePos
                  ? {
                      position: "fixed",
                      top: declinePos.top,
                      left: declinePos.left,
                      width: "auto",
                      zIndex: 100,
                    }
                  : {}
              }
            >
              Decline
            </button>
          </div>

          <p className="text-[10px] text-gray-400 mt-3 text-center">
            &copy; 2026 Piggie&apos;s Pages. All rights reserved. No piggies were harmed in the making of this agreement.
          </p>
        </div>
      </div>
    </div>
  );
}
