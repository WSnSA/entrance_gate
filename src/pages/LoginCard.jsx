import { useEffect, useRef, useState } from "react";
import { login, verifyOtp } from "../services/auth";

export default function LoginCard({ onSuccess }) {
    const [username, setUsername] = useState(localStorage.getItem("remember_username") || "");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(!!localStorage.getItem("remember_username"));
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otpMode, setOtpMode] = useState(false);
    const [txId, setTxId] = useState(null);
    const [error, setError] = useState("");

    const OTP_LEN = 6;
    const [otpArr, setOtpArr] = useState(Array(OTP_LEN).fill(""));
    const otpRefs = useRef([...Array(OTP_LEN)].map(() => null));

    useEffect(() => setError(""), [username, password, otpArr]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Enter" && !loading) {
                if (otpMode) handleVerifyOtp(e);
                else handleSubmit(e);
            }
            if (e.key === "Escape" && otpMode) {
                setOtpMode(false);
                setOtpArr(Array(OTP_LEN).fill(""));
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [otpMode, loading, username, password, otpArr]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError("Нэр болон нууц үгээ оруулна уу.");
            return;
        }
        try {
            setLoading(true);
            setError("");
            const res = await login(username.trim(), password);
            if (res?.mfaRequired) {
                if (!res.txId) {
                    setError("OTP эхлүүлэхэд алдаа гарлаа. Дахин оролдоно уу.");
                } else {
                    setTxId(res.txId);
                    setOtpMode(true);
                    setTimeout(() => otpRefs.current[0]?.focus(), 0);
                }
            } else {
                if (remember) localStorage.setItem("remember_username", username.trim());
                else localStorage.removeItem("remember_username");
                onSuccess?.();
            }
        } catch (err) {
            setError(err?.message || "Алдаа гарлаа.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const joined = otpArr.join("").trim();
        if (!joined || joined.length < 6) {
            setError("OTP 6 оронтой кодоо бүрэн оруулна уу.");
            return;
        }
        try {
            setLoading(true);
            setError("");
            await verifyOtp(txId, joined); // <<== verifyOtp(txId, otp)
            if (remember) localStorage.setItem("remember_username", username.trim());
            else localStorage.removeItem("remember_username");
            onSuccess?.();
        } catch (err) {
            setError(err?.message || "OTP алдаа.");
            setOtpArr(Array(OTP_LEN).fill(""));
            otpRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    // OTP helpers
    const onOtpChange = (idx, val) => {
        const v = val.replace(/\D/g, "").slice(0, 1);
        const next = [...otpArr];
        next[idx] = v;
        setOtpArr(next);
        if (v && idx < OTP_LEN - 1) otpRefs.current[idx + 1]?.focus();
    };
    const onOtpKeyDown = (idx, e) => {
        if (e.key === "Backspace" && !otpArr[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
        if (e.key === "ArrowLeft" && idx > 0) otpRefs.current[idx - 1]?.focus();
        if (e.key === "ArrowRight" && idx < OTP_LEN - 1) otpRefs.current[idx + 1]?.focus();
    };
    const onOtpPaste = (e) => {
        const text = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, OTP_LEN);
        if (!text) return;
        e.preventDefault();
        const next = Array(OTP_LEN).fill("");
        for (let i = 0; i < text.length; i++) next[i] = text[i];
        setOtpArr(next);
        const last = Math.min(text.length, OTP_LEN) - 1;
        otpRefs.current[last >= 0 ? last : 0]?.focus();
    };

    return (
        <div className="rounded-2xl border border-blue-200/70 bg-white/40 shadow-xl shadow-blue-100/60 backdrop-blur">
            <div className="p-5 sm:p-7">
                {!otpMode ? (
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="text-slate-800">
                            <h1 className="text-xl font-semibold font-heading">Нэвтрэх</h1>
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Хэрэглэгчийн нэр / Имэйл
                            </label>
                            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5Zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5Z"/>
                  </svg>
                </span>
                                <input
                                    type="text"
                                    className="w-full rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 pl-10 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                                    placeholder="user@usug.mn"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    autoComplete="username"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Нууц үг</label>
                            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm6-6h-1V9a5 5 0 0 0-10 0v2H6v10h12V11Zm-7 0H9V9a3 3 0 1 1 6 0v2h-2Z"/>
                  </svg>
                </span>
                                <input
                                    type={showPw ? "text" : "password"}
                                    className="w-full rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 pl-10 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw((s) => !s)}
                                    className="absolute inset-y-0 right-0 px-3 text-slate-500 hover:text-slate-700"
                                    aria-label="Show or hide password"
                                    disabled={loading}
                                >
                                    {showPw ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M12 7a5 5 0 0 1 5 5l3 3 1-1-3-3a9.7 9.7 0 0 0-6-3a9.7 9.7 0 0 0-6 3l-2 2l1 1l2-2a5 5 0 0 1 5-5Zm0-4C7 3 2.7 6 1 12c1.7 6 6 9 11 9c2.4 0 4.5-.7 6.4-2l-1.5-1.5A9.8 9.8 0 0 1 12 19c-4.3 0-7.6-2.7-9-7c.7-2.2 2-4 3.7-5.2L4.2 5.3L5.6 3.9L20.1 18.4l1.4-1.4L6.9 2.5A11.4 11.4 0 0 1 12 3Z"/>
                                        </svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M12 5c5 0 9.3 3 11 9c-1.7 6-6 9-11 9S2.7 20 1 14c1.7-6 6-9 11-9Zm0 2c-4.3 0-7.6 2.7-9 7c1.4 4.3 4.7 7 9 7s7.6-2.7 9-7c-1.4-4.3-4.7-7-9-7Zm0 2a5 5 0 1 1 0 10a5 5 0 0 1 0-10Z"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error ? (
                            <div className="rounded-lg bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 text-sm">
                                {error}
                            </div>
                        ) : null}

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between">
                            <label className="inline-flex items-center gap-2 text-sm text-slate-700 select-none">
                                <input
                                    type="checkbox"
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                    disabled={loading}
                                />
                                Сануулах
                            </label>
                            <a href="/forgot-password" className="text-sm text-blue-700 hover:text-blue-600">
                                Нууц үг мартсан?
                            </a>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-blue-600 text-white font-medium py-2.5 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300/60 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                  Нэвтэрч байна…
                </span>
                            ) : (
                                "Нэвтрэх"
                            )}
                        </button>
                    </form>
                ) : (
                    <form className="space-y-5" onSubmit={handleVerifyOtp}>
                        <div className="text-slate-800">
                            <h2 className="text-lg font-semibold font-heading">2FA баталгаажуулалт</h2>
                            <p className="text-sm text-slate-600 mt-1">
                                Таны бүртгэлд хоёр шатлалт нэвтрэлт идэвхтэй байна. 6 оронтой OTP кодоо оруулна уу.
                            </p>
                        </div>

                        {/* Segmented OTP */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">OTP код</label>
                            <div className="flex items-center justify-between gap-2" onPaste={onOtpPaste}>
                                {otpArr.map((v, idx) => (
                                    <input
                                        key={idx}
                                        ref={(el) => (otpRefs.current[idx] = el)}
                                        inputMode="numeric"
                                        pattern="\d*"
                                        maxLength={1}
                                        value={v}
                                        onChange={(e) => onOtpChange(idx, e.target.value)}
                                        onKeyDown={(e) => onOtpKeyDown(idx, e)}
                                        autoComplete="one-time-code"
                                        className="w-12 h-12 text-center text-lg font-semibold rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                                        aria-label={`OTP digit ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Error */}
                        {error ? (
                            <div className="rounded-lg bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 text-sm">
                                {error}
                            </div>
                        ) : null}

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setOtpMode(false);
                                    setOtpArr(Array(OTP_LEN).fill(""));
                                }}
                                className="w-1/3 rounded-xl border border-slate-300 text-slate-700 font-medium py-2.5 hover:bg-slate-50"
                                disabled={loading}
                            >
                                Буцах
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-2/3 rounded-xl bg-blue-600 text-white font-medium py-2.5 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300/60 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                    Баталгаажуулж байна…
                  </span>
                                ) : (
                                    "Баталгаажуулах"
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
