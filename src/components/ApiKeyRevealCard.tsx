"use client";

import { useState } from "react";
import { Check, Clipboard, Eye, EyeOff, Terminal } from "lucide-react";

type ApiKeyRevealCardProps = {
  keyValue: string | null;
  description: string;
  environment: string;
  project: string;
  dateCreated: string;
};

const ApiKeyRevealCard = ({
  keyValue,
  description,
  environment,
  project,
  dateCreated,
}: ApiKeyRevealCardProps) => {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const maskedValue = keyValue ? "ey" + "*".repeat(6) : null;
  const displayValue = keyValue
    ? revealed
      ? keyValue
      : maskedValue
    : null;

  const handleCopy = async () => {
    if (!keyValue) return;
    await navigator.clipboard.writeText(`JUNO_API_KEY=${keyValue}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = keyValue
    ? [
        {
          num: 1,
          content: (
            <span className="text-slate-500">
              # Juno SDK Configuration — {project} ({environment})
            </span>
          ),
        },
        {
          num: 2,
          content: (
            <span className="text-slate-500">
              # Created: {dateCreated} | {description}
            </span>
          ),
        },
        { num: 3, content: null },
        {
          num: 4,
          content: (
            <>
              <span className="text-[#9cdcfe]">JUNO_API_KEY</span>
              <span className="text-slate-400">=</span>
              <span className="text-[#ce9178]">{displayValue}</span>
            </>
          ),
        },
        {
          num: 5,
          content: (
            <>
              <span className="text-[#9cdcfe]">JUNO_BASE_URL</span>
              <span className="text-slate-400">=</span>
              <span className="text-[#ce9178]">https://api.juno.dev</span>
            </>
          ),
        },
        { num: 6, content: null },
        {
          num: 7,
          content: (
            <span className="text-slate-500">
              # Do not commit this file to version control
            </span>
          ),
        },
        {
          num: 8,
          content: (
            <span className="text-slate-500">
              # Add .env.local to your .gitignore
            </span>
          ),
        },
      ]
    : [];

  return (
    <div className="bg-black border-2 border-slate-800 rounded-[6px] shadow-[0px_0px_8px_0px_white] px-[10px] py-[12px] flex flex-col gap-[10px] h-full">
      {/* Card Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-[30px] font-semibold text-white leading-[30px] tracking-[-1px]">
          API Key Details
        </h2>
        <p className="text-sm text-gray-400">
          Paste the line below into your project&apos;s environment variables
          file
        </p>
      </div>

      {/* Code Block Area */}
      <div className="flex flex-col flex-1">
        {keyValue ? (
          <div className="bg-slate-800 rounded-[4px] w-full flex flex-col flex-1">
            {/* Code block header */}
            <div className="flex items-center justify-between px-[6px] py-[8px] border-b border-gray-400">
              {/* Left: terminal icon + filename */}
              <div className="flex items-center gap-[6px]">
                <Terminal className="w-5 h-5 text-slate-500 shrink-0" />
                <span className="font-mono font-semibold text-[14px] text-slate-500 leading-5">
                  .env.local
                </span>
              </div>
              {/* Right: eye + copy */}
              <div className="flex items-center h-[22px]">
                <button
                  onClick={() => setRevealed(!revealed)}
                  className="text-slate-400 hover:text-slate-200 transition-colors p-1"
                  title={revealed ? "Hide key" : "Reveal key"}
                >
                  {revealed ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                <div className="w-px h-[18px] bg-gray-400 mx-1" />
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-[7px] px-[10px] py-[2px] text-white hover:text-slate-200 transition-colors"
                  title="Copy key to clipboard"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Clipboard className="w-4 h-4" />
                  )}
                  <span className="font-mono font-semibold text-[14px] leading-5">
                    {copied ? "Copied!" : "Copy"}
                  </span>
                </button>
              </div>
            </div>
            {/* Code content */}
            <div className="flex flex-col py-[4px] flex-1">
              {lines.map((line) => (
                <div
                  key={line.num}
                  className={`flex font-mono font-semibold text-[14px] leading-6 min-h-[24px] ${line.num === 4 ? "bg-slate-700/30" : ""}`}
                >
                  <span className="w-[32px] text-right pr-2 text-slate-600 shrink-0 select-none">
                    {line.num}
                  </span>
                  <span className="pl-1">
                    {line.content ?? "\u00A0"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-center flex-1">
            <Terminal className="w-8 h-8 text-slate-600" />
            <p className="text-slate-500 text-sm">No API key created yet.</p>
            <p className="text-slate-600 text-xs">
              Fill in the form and click &quot;Create API Key&quot; to generate
              one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiKeyRevealCard;
