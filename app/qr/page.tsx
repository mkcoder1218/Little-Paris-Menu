"use client";

import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { ArrowLeft, Download, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function QRGenerator() {
  const [url, setUrl] = useState("https://example.com");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setUrl(window.location.origin);
    }
  }, []);

  const handleDownload = () => {
    const canvas = document.getElementById("qr-code-canvas") as HTMLCanvasElement;
    if (canvas) {
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "menu-qr-code.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen p-6 pt-12 flex flex-col items-center">
      <header className="w-full flex items-center gap-4 mb-8">
        <Link href="/" className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-200" />
        </Link>
        <h1 className="text-xl font-bold text-white">QR Code Generator</h1>
      </header>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-3xl shadow-2xl mb-8"
      >
        <QRCodeCanvas
          id="qr-code-canvas"
          value={url}
          size={200}
          level="H"
          includeMargin={true}
        />
      </motion.div>

      <div className="w-full max-w-sm space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-slate-400 ml-1">Menu URL</label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download QR Code
        </button>
      </div>
    </div>
  );
}
