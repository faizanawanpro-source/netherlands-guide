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

    if (!selectedFile.type.startsWith("image/")) {
      setError(
        "Please upload an image of your letter, such as JPG, PNG, or HEIC."
      );
      setFile(null);
      setPreview("");
      return;
    }

    setFile(selectedFile);
    setResult("");
    setError("");

    const imageUrl = URL.createObjectURL(selectedFile);
    setPreview(imageUrl);
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

      formData.append("image", file);
      formData.append("language", "English");

      const response = await fetch(
        "/api/scan-letter",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      console.log(
        "Scanner API response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.error ||
            `Scanner API failed (${response.status})`
        );
      }

      if (!data.reply) {
        throw new Error(
          "The AI responded, but no explanation was returned."
        );
      }

      setResult(data.reply);
    } catch (err) {
      console.error(
        "Scanner error:",
        err
      );

      const message =
        err instanceof Error
          ? err.message
          : "Could not analyse the letter.";

      setError(message);
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

          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl px-3 py-2 font-bold transition hover:bg-slate-100"
          >
            <span className="text-xl">
              ←
            </span>

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
            Take a photo or upload a Dutch letter.
            Netherlands Guide will help you understand
            what it says and what you may need to do.
          </p>

        </section>

        {/* SCANNER */}

        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
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
                Take a photo or choose an image
              </p>

              <span className="mt-6 rounded-xl bg-purple-600 px-6 py-3 font-black text-white">
                Choose photo
              </span>

            </button>

          ) : (

            <div>

              {/* IMAGE PREVIEW */}

              {preview && (

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">

                  <img
                    src={preview}
                    alt="Uploaded letter"
                    className="max-h-[550px] w-full object-contain"
                  />

                </div>

              )}

              {/* FILE NAME */}

              <div className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-4">

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
                  className="shrink-0 rounded-lg px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50"
                >
                  Remove
                </button>

              </div>

              {/* ERROR */}

              {error && (

                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                  {error}
                </div>

              )}

              {/* SCAN BUTTON */}

              <button
                type="button"
                onClick={scanLetter}
                disabled={scanning}
                className="mt-6 w-full rounded-2xl bg-purple-600 px-6 py-4 text-base font-black text-white shadow-lg transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {scanning
                  ? "AI is reading your letter..."
                  : "✨ Analyse my letter"}

              </button>

            </div>

          )}

          {/* ERROR WHEN NO FILE */}

          {!file && error && (

            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              {error}
            </div>

          )}

          {/* RESULT */}

          {result && (

            <div className="mt-8">

              <div className="rounded-2xl border border-green-200 bg-green-50 p-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-xl text-white">
                    ✓
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-green-950">
                      Letter explained
                    </h2>

                    <p className="text-sm text-green-700">
                      Netherlands Guide AI
                    </p>
                  </div>

                </div>

                <div className="mt-6 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                  {result}
                </div>

              </div>

            </div>

          )}

        </section>

        {/* HOW IT WORKS */}

        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <h2 className="text-2xl font-black">
            How it works
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">

            <div className="rounded-2xl bg-purple-50 p-5">

              <div className="text-3xl">
                📷
              </div>

              <h3 className="mt-3 font-black">
                1. Take a photo
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Take a clear photo of your Dutch letter.
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

          AI explanations are provided for general understanding.
          For important legal, immigration, financial or healthcare
          letters, always check the official source.

        </div>

      </div>

    </main>
  );
}