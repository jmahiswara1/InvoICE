"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type AuthTab = "login" | "register";
type LoginMode = "password" | "code";
type AuthView = "auth" | "forgot-password" | "forgot-sent" | "admin";

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export function AuthPage() {
  const [tab, setTab] = useState<AuthTab>("login");
  const [loginMode, setLoginMode] = useState<LoginMode>("password");
  const [view, setView] = useState<AuthView>("auth");

  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Honeypot
  const [honeypot, setHoneypot] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Rate limit cooldown
  const [, setFailedAttempts] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const MAX_ATTEMPTS = 3;
  const COOLDOWN_SECONDS = 60;

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const isCoolingDown = cooldown > 0;

  const emailValid = useMemo(() => EMAIL_REGEX.test(email), [email]);
  const emailError = useMemo(() => {
    if (!email) return null;
    if (!emailValid) return "Format email tidak valid";
    return null;
  }, [email, emailValid]);

  const passwordValid = password.length >= 4;
  const passwordsMatch = password === confirmPassword;

  const isFormValid = () => {
    if (isCoolingDown) return false;
    if (honeypot) return false;
    if (tab === "login" && loginMode === "code") {
      return emailValid && otpCode.length === 6;
    }
    if (tab === "register") {
      return emailValid && passwordValid && passwordsMatch;
    }
    return emailValid && passwordValid;
  };

  const recordFailure = useCallback(() => {
    setFailedAttempts((prev) => {
      const next = prev + 1;
      if (next >= MAX_ATTEMPTS) {
        setCooldown(COOLDOWN_SECONDS);
      }
      return next;
    });
  }, []);

  const recordSuccess = useCallback(() => {
    setFailedAttempts(0);
    setCooldown(0);
  }, []);

  const resetForm = () => {
    setEmail("");
    setEmailTouched(false);
    setPassword("");
    setConfirmPassword("");
    setOtpCode("");
    setOtpSent(false);
    setError(null);
    setSuccess(null);
    setShowPassword(false);
    setHoneypot("");
  };

  const handleTabChange = (newTab: AuthTab) => {
    setTab(newTab);
    resetForm();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (honeypot) {
      setError("Submission ditolak.");
      return;
    }

    if (!emailValid) {
      setError("Format email tidak valid.");
      return;
    }

    if (!passwordValid) {
      setError("Password minimal 4 karakter.");
      return;
    }

    if (!passwordsMatch) {
      setError("Password tidak cocok.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });

      if (error) {
        setError(error.message);
        recordFailure();
      } else {
        setSuccess("Registrasi berhasil! Silakan login.");
        setTab("login");
        resetForm();
        recordSuccess();
      }
    } catch {
      setError("Gagal registrasi. Cek koneksi internet.");
      recordFailure();
    } finally {
      setLoading(false);
    }
  };

  const handleLoginPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (honeypot) {
      setError("Submission ditolak.");
      return;
    }

    if (!emailValid) {
      setError("Format email tidak valid.");
      return;
    }

    if (!passwordValid) {
      setError("Password minimal 4 karakter.");
      return;
    }

    setLoading(true);
    try {
      // Try Supabase Auth first
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (!error) {
        recordSuccess();
        return;
      }

      // If Supabase Auth fails, check admin_users table
      const { data: adminUser, error: adminError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", email)
        .single();

      if (adminUser && !adminError && adminUser.password_hash === password) {
        // Store admin session
        localStorage.setItem("admin_user", JSON.stringify({
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
        }));
        recordSuccess();
        window.location.reload();
        return;
      }

      // Both failed
      setError(error.message);
      recordFailure();
    } catch {
      setError("Gagal login. Cek koneksi internet.");
      recordFailure();
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!emailValid) {
      setError("Format email tidak valid.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({ email });

      if (error) {
        setError(error.message);
        recordFailure();
      } else {
        setOtpSent(true);
        setSuccess("Kode OTP telah dikirim ke email Anda.");
      }
    } catch {
      setError("Gagal mengirim OTP. Cek koneksi internet.");
      recordFailure();
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!emailValid) {
      setError("Format email tidak valid.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: "email",
      });

      if (error) {
        setError(error.message);
        recordFailure();
      } else {
        recordSuccess();
      }
    } catch {
      setError("Gagal verifikasi OTP.");
      recordFailure();
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!emailValid) {
      setError("Format email tidak valid.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        setError(error.message);
      } else {
        setView("forgot-sent");
      }
    } catch {
      setError("Gagal mengirim email reset password.");
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Sent
  if (view === "forgot-sent") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm text-center">
          <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
          <h1 className="text-xl font-bold mb-2">Email Terkirim</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Link reset password telah dikirim ke <strong>{email}</strong>.
          </p>
          <button onClick={() => { setView("auth"); resetForm(); }}
            className="text-sm text-muted-foreground hover:text-foreground">
            Kembali ke login
          </button>
        </div>
      </div>
    );
  }

  // Forgot Password
  if (view === "forgot-password") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold mb-1">Lupa Password</h1>
            <p className="text-sm text-muted-foreground">Masukkan email untuk menerima link reset.</p>
          </div>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="email@bisnis.com" required
                className="w-full mt-1 px-3 py-2 border text-sm outline-none focus:border-foreground" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button type="submit" disabled={loading || !emailValid}
              className="w-full py-2.5 bg-foreground text-background text-sm font-medium disabled:opacity-50">
              {loading ? "Mengirim..." : "Kirim Link Reset"}
            </button>
            <button type="button" onClick={() => { setView("auth"); resetForm(); }}
              className="w-full text-sm text-muted-foreground hover:text-foreground">
              Kembali ke login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main Auth
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-1">InvoICE</h1>
          <p className="text-sm text-muted-foreground">
            {tab === "login" ? "Masuk ke akun Anda" : "Buat akun baru"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button onClick={() => handleTabChange("login")}
            className={`flex-1 py-2.5 text-sm font-medium border-b-2 -mb-px ${
              tab === "login" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"
            }`}>Login</button>
          <button onClick={() => handleTabChange("register")}
            className={`flex-1 py-2.5 text-sm font-medium border-b-2 -mb-px ${
              tab === "register" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"
            }`}>Register</button>
        </div>

        {/* Cooldown */}
        {isCoolingDown && (
          <div className="mb-4 p-3 border border-destructive/30 bg-destructive/5 text-sm text-destructive text-center">
            Terlalu banyak percobaan. Coba lagi dalam {cooldown} detik.
          </div>
        )}

        {/* Login */}
        {tab === "login" && (
          <>
            {loginMode === "password" ? (
              <form onSubmit={handleLoginPassword} className="space-y-4">
                <input type="text" name="website" value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1} autoComplete="off" aria-hidden="true"
                  className="absolute -left-[9999px] w-px h-px opacity-0" />

                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)} placeholder="email@bisnis.com" required
                    className="w-full mt-1 px-3 py-2 border text-sm outline-none focus:border-foreground" />
                  {emailTouched && emailError && <p className="text-xs text-destructive mt-1">{emailError}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Password</label>
                    <button type="button" onClick={() => setView("forgot-password")}
                      className="text-xs text-muted-foreground hover:text-foreground">Lupa password?</button>
                  </div>
                  <div className="relative mt-1">
                    <input type={showPassword ? "text" : "password"} value={password}
                      onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 4 karakter"
                      required minLength={4}
                      className="w-full px-3 py-2 border text-sm outline-none focus:border-foreground pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {password && !passwordValid && <p className="text-xs text-destructive mt-1">Password minimal 4 karakter</p>}
                </div>

                {error && <div className="flex items-center gap-2 text-sm text-destructive"><AlertCircle className="h-4 w-4" />{error}</div>}
                {success && <div className="flex items-center gap-2 text-sm text-green-600"><CheckCircle className="h-4 w-4" />{success}</div>}

                <button type="submit" disabled={loading || !isFormValid()}
                  className="w-full py-2.5 bg-foreground text-background text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? "Logging in..." : "Login"} <ArrowRight className="h-4 w-4" />
                </button>

                <button type="button" onClick={() => { setLoginMode("code"); setError(null); setSuccess(null); }}
                  className="w-full text-sm text-muted-foreground hover:text-foreground">
                  Login dengan kode OTP
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <input type="text" name="website" value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1} autoComplete="off" aria-hidden="true"
                  className="absolute -left-[9999px] w-px h-px opacity-0" />

                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)} placeholder="email@bisnis.com" disabled={otpSent}
                    className="w-full mt-1 px-3 py-2 border text-sm outline-none focus:border-foreground disabled:opacity-50" />
                  {emailTouched && emailError && <p className="text-xs text-destructive mt-1">{emailError}</p>}
                </div>

                {!otpSent ? (
                  <button onClick={handleSendOtp} disabled={loading || !emailValid}
                    className="w-full py-2.5 bg-foreground text-background text-sm font-medium disabled:opacity-50">
                    {loading ? "Mengirim..." : "Kirim Kode OTP"}
                  </button>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Kode OTP</label>
                      <input type="text" value={otpCode} onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="Masukkan 6 digit kode" maxLength={6} required
                        className="w-full mt-1 px-3 py-2 border text-sm outline-none focus:border-foreground font-mono text-center tracking-widest" />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <button type="submit" disabled={loading || otpCode.length < 6}
                      className="w-full py-2.5 bg-foreground text-background text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                      {loading ? "Memverifikasi..." : "Verifikasi"} <ArrowRight className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => { setOtpSent(false); setOtpCode(""); setError(null); }}
                      className="w-full text-sm text-muted-foreground hover:text-foreground">
                      Ganti email atau kirim ulang
                    </button>
                  </form>
                )}

                <button type="button" onClick={() => { setLoginMode("password"); setOtpSent(false); setOtpCode(""); setError(null); }}
                  className="w-full text-sm text-muted-foreground hover:text-foreground">
                  Login dengan password
                </button>
              </div>
            )}
          </>
        )}

        {/* Register */}
        {tab === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <input type="text" name="website" value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1} autoComplete="off" aria-hidden="true"
              className="absolute -left-[9999px] w-px h-px opacity-0" />

            <div>
              <label className="text-sm font-medium">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)} placeholder="email@bisnis.com" required
                className="w-full mt-1 px-3 py-2 border text-sm outline-none focus:border-foreground" />
              {emailTouched && emailError && <p className="text-xs text-destructive mt-1">{emailError}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="relative mt-1">
                <input type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 4 karakter"
                  required minLength={4}
                  className="w-full px-3 py-2 border text-sm outline-none focus:border-foreground pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password && !passwordValid && <p className="text-xs text-destructive mt-1">Password minimal 4 karakter</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Konfirmasi Password</label>
              <input type={showPassword ? "text" : "password"} value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Ulangi password"
                required minLength={4}
                className="w-full mt-1 px-3 py-2 border text-sm outline-none focus:border-foreground" />
              {confirmPassword && !passwordsMatch && <p className="text-xs text-destructive mt-1">Password tidak cocok</p>}
            </div>

            {error && <div className="flex items-center gap-2 text-sm text-destructive"><AlertCircle className="h-4 w-4" />{error}</div>}
            {success && <div className="flex items-center gap-2 text-sm text-green-600"><CheckCircle className="h-4 w-4" />{success}</div>}

            <button type="submit" disabled={loading || !isFormValid()}
              className="w-full py-2.5 bg-foreground text-background text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? "Mendaftar..." : "Register"} <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}