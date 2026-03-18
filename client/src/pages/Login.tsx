/**
 * 芯颜 AI — Login Page
 * Design: Warm Ivory Minimalism
 * Features: Phone + verification code login, register
 */

import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useUser } from "@/contexts/UserContext";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useUser();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const isPhoneValid = /^1[3-9]\d{9}$/.test(phone);

  const sendCode = () => {
    if (!isPhoneValid) {
      setError("请输入正确的手机号");
      return;
    }
    if (!agreed) {
      setError("请先同意用户协议");
      return;
    }
    setError("");
    setCodeSent(true);
    setCountdown(60);
    setTimeout(() => codeRef.current?.focus(), 100);
  };

  const handleLogin = () => {
    if (!isPhoneValid) {
      setError("请输入正确的手机号");
      return;
    }
    if (code.length < 4) {
      setError("请输入验证码");
      return;
    }
    setError("");
    login(phone);
    setLocation("/profile");
  };

  return (
    <div
      className="page-locked flex flex-col"
      style={{ background: "linear-gradient(135deg, #F5F0E8 0%, #EDE8DF 100%)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(193,123,92,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-5 md:px-8 py-4 border-b border-[rgba(45,36,32,0.07)] flex-shrink-0 bg-[rgba(242,237,230,0.8)]" style={{ backdropFilter: "blur(12px)" }}>
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-1.5 text-[#9A8C82] hover:text-[#2D2420] transition-colors text-sm"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          返回
        </button>
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="10" stroke="#C17B5C" strokeWidth="1.2" />
            <circle cx="11" cy="11" r="5" fill="rgba(193,123,92,0.15)" stroke="#C17B5C" strokeWidth="1" />
            <circle cx="11" cy="11" r="2" fill="#C17B5C" />
          </svg>
          <span className="text-[#2D2420] font-medium text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            芯颜 <span className="text-[#C17B5C]">AI</span>
          </span>
        </div>
        <div className="w-12" />
      </header>

      {/* Body */}
      <div className={`relative z-10 flex-1 overflow-y-auto flex flex-col items-center justify-center px-6 py-8 anim-fade-in ${ready ? "" : "opacity-0"}`}>
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: "rgba(193,123,92,0.1)", border: "1px solid rgba(193,123,92,0.2)" }}>
          <svg width="28" height="28" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="10" stroke="#C17B5C" strokeWidth="1.3" />
            <circle cx="11" cy="11" r="5" fill="rgba(193,123,92,0.2)" stroke="#C17B5C" strokeWidth="1" />
            <circle cx="11" cy="11" r="2.2" fill="#C17B5C" />
          </svg>
        </div>

        <h1
          className="mb-2"
          style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1.6rem", fontWeight: 400, color: "#2D2420" }}
        >
          欢迎使用芯颜 AI
        </h1>
        <p
          className="text-[#9A8C82] text-sm mb-8 text-center max-w-xs"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          登录后可保存检测记录、查看历史报告、获取个性化护肤方案
        </p>

        {/* Form */}
        <div className="w-full max-w-sm space-y-4">
          {/* Phone input */}
          <div>
            <label className="block text-[#7A6E68] text-xs mb-1.5 tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              手机号
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-[rgba(45,36,32,0.12)] bg-[#FDFAF7] px-4 py-3 focus-within:border-[rgba(193,123,92,0.4)] focus-within:shadow-[0_0_0_3px_rgba(193,123,92,0.08)] transition-all duration-200">
              <span className="text-[#9A8C82] text-sm flex-shrink-0" style={{ fontFamily: "'DM Sans', sans-serif" }}>+86</span>
              <div className="w-px h-4 bg-[rgba(45,36,32,0.12)]" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 11)); setError(""); }}
                placeholder="请输入手机号"
                className="flex-1 bg-transparent outline-none text-[#2D2420] placeholder-[#C4BAB3] text-sm"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                maxLength={11}
              />
            </div>
          </div>

          {/* Verification code */}
          <div>
            <label className="block text-[#7A6E68] text-xs mb-1.5 tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              验证码
            </label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center rounded-xl border border-[rgba(45,36,32,0.12)] bg-[#FDFAF7] px-4 py-3 focus-within:border-[rgba(193,123,92,0.4)] focus-within:shadow-[0_0_0_3px_rgba(193,123,92,0.08)] transition-all duration-200">
                <input
                  ref={codeRef}
                  type="text"
                  value={code}
                  onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
                  placeholder="请输入验证码"
                  className="flex-1 bg-transparent outline-none text-[#2D2420] placeholder-[#C4BAB3] text-sm"
                  style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.15em" }}
                  maxLength={6}
                />
              </div>
              <button
                onClick={sendCode}
                disabled={countdown > 0 || !isPhoneValid}
                className="flex-shrink-0 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-40"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  background: countdown > 0 ? "rgba(45,36,32,0.06)" : "rgba(193,123,92,0.1)",
                  color: countdown > 0 ? "#B5ADA7" : "#C17B5C",
                  border: "1px solid " + (countdown > 0 ? "rgba(45,36,32,0.08)" : "rgba(193,123,92,0.2)"),
                }}
              >
                {countdown > 0 ? `${countdown}s` : codeSent ? "重新发送" : "获取验证码"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-[#C0392B] text-xs anim-fade-up" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {error}
            </p>
          )}

          {/* Agreement */}
          <div className="flex items-start gap-2 pt-1">
            <button
              onClick={() => { setAgreed(!agreed); setError(""); }}
              className="flex-shrink-0 w-4 h-4 mt-0.5 rounded border transition-all duration-200 flex items-center justify-center"
              style={{
                borderColor: agreed ? "#C17B5C" : "rgba(45,36,32,0.2)",
                background: agreed ? "#C17B5C" : "transparent",
              }}
            >
              {agreed && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5L4 7L8 3" stroke="#FDFAF7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <p className="text-[#B5ADA7] text-xs leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              我已阅读并同意{" "}
              <span className="text-[#C17B5C] cursor-pointer hover:underline">《用户协议》</span>
              {" "}和{" "}
              <span className="text-[#C17B5C] cursor-pointer hover:underline">《隐私政策》</span>
            </p>
          </div>

          {/* Login button */}
          <button
            onClick={handleLogin}
            disabled={!isPhoneValid || code.length < 4 || !agreed}
            className="w-full btn-primary py-3.5 text-sm mt-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
          >
            登录 / 注册
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 pt-4">
            <div className="flex-1 h-px bg-[rgba(45,36,32,0.08)]" />
            <span className="text-[#C4BAB3] text-[10px] tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              其他登录方式
            </span>
            <div className="flex-1 h-px bg-[rgba(45,36,32,0.08)]" />
          </div>

          {/* Social login */}
          <div className="flex items-center justify-center gap-6 pt-2">
            {[
              { name: "微信", icon: "M7.5 3C4.46 3 2 5.12 2 7.73c0 1.5.82 2.83 2.1 3.7l-.53 1.58 1.84-1.02c.66.18 1.36.28 2.09.28.18 0 .36-.01.54-.02A4.38 4.38 0 018 11.5c0-.17.01-.33.03-.5C8.03 8.06 10.4 6 13.3 6c.16 0 .32.01.47.02C13.14 4.2 10.56 3 7.5 3zm-2 2.5a.75.75 0 110 1.5.75.75 0 010-1.5zm3.5 0a.75.75 0 110 1.5.75.75 0 010-1.5z" },
              { name: "Apple", icon: "M11 2c-1.5 0-2.5 1-3 2-.5-1-1.5-2-3-2C3 2 1 4 1 6.5 1 11 7 15 8 16c1-1 7-5 7-9.5C15 4 13 2 11 2z" },
            ].map((s) => (
              <button
                key={s.name}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                style={{
                  background: "rgba(45,36,32,0.04)",
                  border: "1px solid rgba(45,36,32,0.1)",
                }}
                title={`${s.name}登录`}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d={s.icon} fill="#7A6E68" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom padding for mobile tab bar */}
      <div className="h-16 md:h-0 flex-shrink-0" />
    </div>
  );
}
