"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Profile = {
  name?: string;
  age?: string;
  profile?: string;
  city?: string;
  language?: string;
};

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [profile, setProfile] = useState<Profile>({});
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! 👋 I'm Netherlands Guide AI. Ask me anything about living, studying, working or travelling in the Netherlands.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(
        "netherlandsGuideProfile"
      );

      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error("Could not load profile:", error);
    }
  }, []);

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault();

    const message = input.trim();

    if (!message || loading) {
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: message,
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          profile,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "AI request failed."
        );
      }

      const assistantMessage: Message = {
        role: "assistant",
        content:
          data.reply ||
          data.answer ||
          "I couldn't generate a response.",
      };

      setMessages((current) => [
        ...current,
        assistantMessage,
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't connect to Netherlands Guide AI right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-4">

          {/* BACK TO HOME */}

          <Link
            href="/dashboard"
            className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <span className="text-lg">
              ←
            </span>

            <span>
              Back to Home
            </span>
          </Link>

          {/* LOGO */}

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-2xl">
            🇳🇱
          </div>

          {/* TITLE */}

          <div>
            <h1 className="font-black">
              Netherlands Guide
            </h1>

            <p className="text-xs text-slate-500">
              🤖 AI Assistant
            </p>
          </div>

        </div>

      </header>


      {/* CHAT */}

      <div className="mx-auto flex min-h-[calc(100vh-75px)] max-w-5xl flex-col px-5 py-6">

        <div className="mb-6">

          <h2 className="text-3xl font-black text-slate-900">
            Ask Netherlands Guide
          </h2>

          <p className="mt-2 text-slate-500">
            Ask anything about life in the Netherlands.
          </p>

        </div>


        {/* MESSAGES */}

        <div className="flex-1 space-y-4 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          {messages.map((message, index) => (

            <div
              key={index}
              className={`flex ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-7 ${
                  message.role === "user"
                    ? "bg-orange-500 text-white"
                    : "bg-slate-100 text-slate-800"
                }`}
              >

                {message.role === "assistant" && (
                  <div className="mb-1 text-xs font-black uppercase tracking-wide text-indigo-600">
                    🤖 Netherlands Guide AI
                  </div>
                )}

                <div className="whitespace-pre-wrap">
                  {message.content}
                </div>

              </div>

            </div>

          ))}


          {/* LOADING */}

          {loading && (

            <div className="flex justify-start">

              <div className="rounded-2xl bg-slate-100 px-5 py-4 text-sm text-slate-500">

                <span className="font-semibold">
                  🤖 Thinking
                </span>

                <span className="ml-2 animate-pulse">
                  ...
                </span>

              </div>

            </div>

          )}

        </div>


        {/* INPUT */}

        <form
          onSubmit={sendMessage}
          className="mt-4 flex gap-3"
        >

          <input
            type="text"
            value={input}
            onChange={(event) =>
              setInput(event.target.value)
            }
            placeholder="Ask something about the Netherlands..."
            disabled={loading}
            className="flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none transition focus:border-orange-500 disabled:bg-slate-100"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className={`rounded-2xl px-6 py-4 font-black text-white transition ${
              input.trim() && !loading
                ? "bg-orange-500 hover:bg-orange-600"
                : "cursor-not-allowed bg-slate-300"
            }`}
          >
            {loading ? "..." : "Send"}
          </button>

        </form>


        {/* PROFILE */}

        {profile.name && (

          <div className="mt-4 text-center text-xs text-slate-400">

            Personalised for{" "}
            <span className="font-bold">
              {profile.name}
            </span>

            {profile.city && (
              <>
                {" "}· {profile.city}
              </>
            )}

          </div>

        )}

      </div>

    </main>
  );
}