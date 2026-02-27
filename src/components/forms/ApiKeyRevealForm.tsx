"use client";

import {
  Check,
  Clipboard,
  Eye,
  EyeOff,
  Terminal,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";

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
  const displayValue = keyValue ? (revealed ? keyValue : maskedValue) : null;

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
            <span className="text-[#6a9955]">
              # Juno SDK Configuration — {project} ({environment})
            </span>
          ),
        },
        {
          num: 2,
          content: (
            <span className="text-[#6a9955]">
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
              <span className="text-[#ce9178]">http://localhost:8888</span>
            </>
          ),
        },
        { num: 6, content: null },
        {
          num: 7,
          content: (
            <span className="text-[#6a9955]">
              # Do not commit this file to version control
            </span>
          ),
        },
        {
          num: 8,
          content: (
            <span className="text-[#6a9955]">
              # Add .env.local to your .gitignore
            </span>
          ),
        },
      ]
    : [];

  return (
    <Card className="h-full">
      <div className="p-6">
        <CardTitle>
          <h2 className="text-2xl mb-1">API Key Details</h2>
        </CardTitle>
        <CardDescription>
          Paste the line below into your project&apos;s environment variables
          file.
        </CardDescription>
      </div>

      <CardContent>
        {/* Code Block Area */}
        <div>
          {keyValue ? (
            <div className="flex flex-col gap-3 items-center">
              {/* Code editor */}
              <div className="bg-[#1e1e1e] rounded-lg max-w-[500px] w-full">
                {/* Code block header */}
                <div className="flex justify-between p-2 bg-[#252526] rounded-t-lg border-b border-[#3c3c3c]">
                  {/* Left: traffic lights + terminal icon + filename */}
                  <div className="flex items-center gap-1">
                    {/* macOS traffic lights */}
                    <div className="flex items-center gap-[6px] mr-1">
                      <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                      <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                      <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                    </div>
                    <Terminal className="size-5 text-slate-500" />
                    <span className="font-mono font-semibold text-sm text-slate-500">
                      .env.local
                    </span>
                  </div>
                  {/* Right: eye + copy */}
                  <div className="flex items-center h-6">
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
                    <div className="w-px h-6 bg-[#3c3c3c] mx-1" />
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-2 py-1 text-white hover:text-slate-200 transition-colors"
                      title="Copy key to clipboard"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Clipboard className="w-4 h-4" />
                      )}
                      <span className="font-mono font-semibold text-sm">
                        {copied ? "Copied!" : "Copy"}
                      </span>
                    </button>
                  </div>
                </div>
                {/* Code content */}
                <div className="flex flex-col py-2 overflow-x-auto">
                  {lines.map((line) => (
                    <div
                      key={line.num}
                      className={`flex font-mono font-semibold text-sm min-h-6 whitespace-nowrap ${line.num === 4 ? "bg-[#2a2d2e]" : ""}`}
                    >
                      <span className="w-8 text-right pr-2 text-[#858585]">
                        {line.num}
                      </span>
                      <span className="pl-1">{line.content ?? "\u00A0"}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-2 max-w-[500px] w-full bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2">
                <TriangleAlert className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-yellow-500 text-sm font-medium">
                  Warning: You will not be able to view your API key again after
                  leaving this page. Please copy it now.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-center flex-1">
              <Terminal className="w-8 h-8 text-slate-600" />
              <p className="text-slate-500 text-sm">No API key created yet.</p>
              <p className="text-slate-600 text-xs">
                Fill in the form and click &quot;Create API Key&quot; to
                generate one.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyRevealCard;
