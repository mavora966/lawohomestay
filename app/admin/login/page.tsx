"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IconLoader, IconLock } from "@tabler/icons-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Username atau password salah.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-lawo-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-lawo-black rounded-[10px] flex items-center justify-center mx-auto mb-4">
            <IconLock size={22} className="text-lawo-white" />
          </div>
          <h1 className="font-playfair text-2xl font-bold text-lawo-black">Admin Login</h1>
          <p className="font-outfit text-sm text-lawo-gray mt-1">The Lawo Homestay</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-lawo-white rounded-[14px] p-6 flex flex-col gap-4">
          <div>
            <label className="font-outfit text-xs font-semibold text-lawo-gray uppercase tracking-wider block mb-1.5">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              className="w-full border border-lawo-gray-light rounded-[8px] px-3 py-2.5 font-outfit text-sm text-lawo-black focus:outline-none focus:border-lawo-black transition-colors"
            />
          </div>
          <div>
            <label className="font-outfit text-xs font-semibold text-lawo-gray uppercase tracking-wider block mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full border border-lawo-gray-light rounded-[8px] px-3 py-2.5 font-outfit text-sm text-lawo-black focus:outline-none focus:border-lawo-black transition-colors"
            />
          </div>

          {error && (
            <p className="font-outfit text-xs text-red-600 bg-red-50 border border-red-200 rounded-[6px] px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-lawo-black text-lawo-white font-outfit font-semibold text-sm rounded-[8px] hover:bg-lawo-gray-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <><IconLoader size={16} className="animate-spin" /> Masuk...</> : "Log Masuk"}
          </button>
        </form>
      </div>
    </main>
  );
}
