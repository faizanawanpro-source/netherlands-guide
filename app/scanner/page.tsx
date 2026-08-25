"use client";

import Link from "next/link";
import { useRef, useState } from "react";

export default function ScannerPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  function selectFile() {
    inputRef.current?.click();
  }

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);
    setResult("");
    setError("");

    if (selectedFile.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setPreview(imageUrl);
    } else {
      setPreview("");
    }
  }

  async function scanLetter() {
    if (!file) {
      setError("Please upload a letter first.");
      return;
    }

    setScanning(true);
    setError("");
    setResult("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/scan-letter", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Scanning is currently unavailable."
        );
      }

      setResult(
        data.text ||
          data.result ||
          "The letter was successfully uploaded."
      );
    } catch (err) {
      console.error("Scanner error:", err);

      setResult(
        "Your letter has been uploaded. AI letter analysis will be available when the AI service is connected."
      );
    } finally {
      setScanning(false);
    }
  }

  function removeFile() {
    setFile(null);
    setPreview("");
    setResult("");
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* NAVIGATION */}

      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center px-5 py-4">

          {/* HOME ON LEFT */}

          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl px-3 py-2 font-bold transition hover:bg-slate-100"
          >
            <span className="text-xl">←</span>

            <div>
              <p className="font-black">
                Home
              </p>

              <p className="hidden text-xs font-normal text-slate-500 sm:block">
                Netherlands Guide
              </p>
            </div>
          </Link>

        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-5 py-10">

        {/* HERO */}

        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-8 text-white shadow-xl sm:p-10">

          <div className="text-5xl">
            📄
          </div>

          <h1 className="mt-5 text-3xl font-black sm:text-5xl">
            Scan a Letter
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-white/90 sm:text-lg">
            Take a photo or upload a Dutch letter. Netherlands
            Guide will help you understand what it says and what
            you may need to do.
          </p>

        </section>

        {/* SCANNER */}

        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <input
            ref={inputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {!file ? (

            <button
              type="button"
              onClick={selectFile}
              className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50 px-6 py-16 text-center transition hover:border-purple-400 hover:bg-purple-100"
            >

              <div className="text-6xl">
                📷
              </div>

              <h2 className="mt-5 text-xl font-black text-purple-950">
                Upload your letter
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Take a photo or choose an image/PDF
              </p>

              <span className="mt-6 rounded-xl bg-purple-600 px-6 py-3 font-black text-white">
                Choose file
              </span>

            </button>

          ) : (

            <div>

              {/* IMAGE PREVIEW */}

              {preview ? (

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">

                  <img
                    src={preview}
                    alt="Uploaded letter"
                    className="max-h-[550px] w-full object-contain"
                  />

                </div>

              ) : (

                <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center">

                  <div className="text-6xl">
                    📄
                  </div>

                  <p className="mt-4 font-black">
                    PDF uploaded
                  </p>

                </div>

              )}

              {/* FILE NAME */}

              <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-4">

                <div className="min-w-0">

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Selected file
                  </p>

                  <p className="mt-1 truncate text-sm font-bold">
                    {file.name}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  className="ml-4 rounded-lg px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>

              </div>

              {/* ACTIONS */}

              <div className="mt-5 grid gap-3 sm:grid-cols-2">

                <button
                  type="button"
                  onClick={selectFile}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-4 font-black transition hover:bg-slate-50"
                >
                  📷 Choose another
                </button>

                <button
                  type="button"
                  onClick={scanLetter}
                  disabled={scanning}
                  className="rounded-xl bg-purple-600 px-5 py-4 font-black text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {scanning
                    ? "🔄 Processing..."
                    : "🤖 Scan with AI"}
                </button>

              </div>

            </div>

          )}

        </section>

        {/* ERROR */}

        {error && (

          <section className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-bold text-red-700">
            ⚠️ {error}
          </section>

        )}

        {/* RESULT */}

        {result && (

          <section className="mt-6 rounded-[2rem] border border-green-200 bg-green-50 p-7 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                🤖
              </div>

              <div>

                <p className="text-xs font-black uppercase tracking-wider text-green-600">
                  Netherlands Guide AI
                </p>

                <h2 className="text-xl font-black text-green-950">
                  Letter explanation
                </h2>

              </div>

            </div>

            <p className="mt-5 whitespace-pre-wrap leading-8 text-green-950">
              {result}
            </p>

          </section>

        )}

        {/* HOW IT WORKS */}

        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <p className="text-sm font-black uppercase tracking-wider text-purple-600">
            How it works
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Understand Dutch letters more easily
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">

            <div className="rounded-2xl bg-purple-50 p-5">

              <div className="text-3xl">
                📷
              </div>

              <h3 className="mt-3 font-black">
                1. Upload
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Take a photo or upload the letter you received.
              </p>

            </div>

            <div className="rounded-2xl bg-blue-50 p-5">

              <div className="text-3xl">
                🤖
              </div>

              <h3 className="mt-3 font-black">
                2. AI reads it
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                AI reads the important information in the letter.
              </p>

            </div>

            <div className="rounded-2xl bg-green-50 p-5">

              <div className="text-3xl">
                💡
              </div>

              <h3 className="mt-3 font-black">
                3. Understand
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Get a simple explanation of what it means and what
                you should do next.
              </p>

            </div>

          </div>

        </section>

        {/* IMPORTANT */}

        <div className="mt-8 rounded-2xl bg-slate-100 p-5 text-center text-xs leading-5 text-slate-500">

          AI letter analysis will work once the AI service is
          connected. For important legal, immigration, financial
          or healthcare letters, always check the official source.

        </div>

      </div>

    </main>
  );
}