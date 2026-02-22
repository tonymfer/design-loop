"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Copy, Download, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportPreviewProps {
  markdown: string;
  projectName: string;
}

export function ReportPreview({ markdown, projectName }: ReportPreviewProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = markdown;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [markdown]);

  const handleDownload = useCallback(() => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>design-loop report — ${projectName}</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  background: #0a0a0a; color: #e5e5e5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  line-height: 1.6; padding: 40px 20px;
}
.container { max-width: 720px; margin: 0 auto; }
pre {
  background: #111111; border: 1px solid #262626; border-radius: 8px;
  padding: 24px; overflow-x: auto; font-size: 13px; line-height: 1.7;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  white-space: pre-wrap; word-break: break-word;
}
h1, h2, h3 { color: #fafaf9; margin: 24px 0 12px; }
h1 { font-size: 24px; } h2 { font-size: 18px; } h3 { font-size: 15px; }
.footer {
  text-align: center; margin-top: 48px; padding-top: 24px;
  border-top: 1px solid #262626; font-size: 12px; color: #737373;
}
.footer a { color: #06b6d4; text-decoration: none; }
</style>
</head>
<body>
<div class="container">
<pre>${markdown.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
<div class="footer">
  Polished with <a href="https://github.com/tonymfer/design-loop">design-loop</a>
</div>
</div>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `design-loop-report-${projectName.toLowerCase().replace(/\s+/g, "-")}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  }, [markdown, projectName]);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] overflow-hidden">
      {/* Toggle header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-[var(--surface)]"
      >
        <span className="font-mono text-xs text-[var(--text-secondary)]">
          View Export Report
        </span>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" />
        </motion.div>
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-[var(--border)]">
              {/* Report content */}
              <div className="max-h-80 overflow-y-auto report-scroll">
                <pre className="px-4 py-3 font-mono text-[11px] leading-relaxed text-[var(--text-secondary)] whitespace-pre-wrap">
                  {markdown}
                </pre>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 border-t border-[var(--border)] px-4 py-3">
                <button
                  onClick={handleCopy}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-[11px] transition-all",
                    copied
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[color-mix(in_srgb,var(--accent),transparent_60%)] hover:text-[var(--text-primary)]"
                  )}
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Copied" : "Copy Markdown"}
                </button>
                <button
                  onClick={handleDownload}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-[11px] transition-all",
                    downloaded
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[color-mix(in_srgb,var(--accent),transparent_60%)] hover:text-[var(--text-primary)]"
                  )}
                >
                  {downloaded ? <Check className="h-3 w-3" /> : <Download className="h-3 w-3" />}
                  {downloaded ? "Downloaded" : "Download HTML"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
