"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/authClient";
import styles from "./AdminLogin.module.css";

type View = "signin" | "reset" | "sent" | "newPassword" | "passwordSaved";
type ErrorKind = "" | "empty" | "bad" | "locked" | "short" | "expired" | "network";

const MESSAGES: Record<Exclude<ErrorKind, "">, string> = {
  empty: "Add your email and password.",
  bad: "That email and password don't match. Try again, or reset it.",
  locked: "Too many tries. Wait 15 minutes, or reset your password.",
  short: "Use at least 10 characters.",
  expired: "That link has expired or was already used. Ask for a new one.",
  network: "Couldn't reach the server. Check your connection and try again.",
};

const EMAIL = /^\S+@\S+\.\S+$/;

/** After sign-in: the admin page that was asked for (the proxy shows this screen in its place), else the dashboard. */
function nextPath() {
  const { pathname, search } = window.location;
  return pathname.startsWith("/admin") && !pathname.startsWith("/admin/login") && !pathname.startsWith("/admin/reset-password")
    ? pathname + search
    : "/admin";
}

// Admin sign-in card (AdminLogin.dc.html). `mode="newPassword"` is the page the
// emailed reset link opens (/admin/reset-password?token=…).
export function AdminLogin({ mode = "signin" }: { mode?: "signin" | "newPassword" }) {
  const router = useRouter();
  const [view, setView] = useState<View>(mode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<ErrorKind>("");
  const [loading, setLoading] = useState(false);
  const locked = error === "locked";

  const signIn = async (e: FormEvent) => {
    e.preventDefault();
    if (loading || locked) return;
    if (!EMAIL.test(email) || !password) return setError("empty");
    setLoading(true);
    setError("");
    try {
      const { error: err } = await authClient.signIn.email({ email, password });
      if (err) {
        setError(err.status === 429 ? "locked" : "bad");
        setLoading(false);
        return;
      }
      router.replace(nextPath());
      router.refresh();
    } catch {
      setError("network");
      setLoading(false);
    }
  };

  const requestReset = async (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL.test(email)) return setError("empty");
    setLoading(true);
    try {
      // Always shows "check your inbox" — never reveals whether the email has an account.
      await authClient.requestPasswordReset({ email, redirectTo: "/admin/reset-password" });
    } catch {
      /* same message either way */
    }
    setLoading(false);
    setError("");
    setView("sent");
  };

  const saveNewPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (password.length < 10) return setError("short");
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) return setError("expired");
    setLoading(true);
    setError("");
    try {
      const { error: err } = await authClient.resetPassword({ newPassword: password, token });
      setLoading(false);
      if (err) return setError("expired");
      setPassword("");
      setView("passwordSaved");
    } catch {
      setLoading(false);
      setError("network");
    }
  };

  const goSignIn = () => {
    setError("");
    setPassword("");
    setView("signin");
    if (mode === "newPassword") router.replace("/admin/login");
  };

  const passwordField = (autoComplete: string, placeholder: string) => (
    <span className={styles.passwordWrap}>
      <input
        className={styles.input}
        data-error={error === "bad" || error === "short" || undefined}
        type={show ? "text" : "password"}
        autoComplete={autoComplete}
        value={password}
        placeholder={placeholder}
        onChange={(e) => {
          setPassword(e.target.value);
          if (!locked) setError("");
        }}
      />
      <button type="button" className={styles.show} onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>
        {show ? "hide" : "show"}
      </button>
    </span>
  );

  const alert = error && (
    <div role="alert" className={styles.alert}>
      <span className={styles.alertIcon}>!</span>
      <span>{MESSAGES[error]}</span>
    </div>
  );

  return (
    <div data-component="AdminLogin" className={styles.mat}>
      <div className={styles.card}>
        <span className={styles.tape} aria-hidden />
        <div className={styles.brand}>
          <span className={styles.wordmark}>yurix</span>
          <span className={styles.badge}>admin</span>
        </div>

        {view === "signin" && (
          <form onSubmit={signIn} className={styles.form} noValidate>
            <div className={styles.titles}>
              <h1 className={styles.heading}>welcome back.</h1>
              <p className={styles.lede}>Sign in to edit the site.</p>
            </div>
            {alert}
            <label className={styles.field}>
              <span className={styles.label}>email</span>
              <input
                className={styles.input}
                data-error={error === "bad" || undefined}
                type="email"
                autoComplete="username"
                value={email}
                placeholder="you@email.com"
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (!locked) setError("");
                }}
              />
            </label>
            <label className={styles.field}>
              <span className={styles.labelRow}>
                <span className={styles.label}>password</span>
                <button
                  type="button"
                  className={styles.forgot}
                  onClick={() => {
                    setError("");
                    setView("reset");
                  }}
                >
                  forgot?
                </button>
              </span>
              {passwordField("current-password", "••••••••")}
            </label>
            <button type="submit" className={styles.primary} style={{ opacity: loading || locked ? 0.6 : 1 }} disabled={loading}>
              {loading ? "signing in…" : "sign in →"}
            </button>
          </form>
        )}

        {view === "reset" && (
          <form onSubmit={requestReset} className={styles.form} noValidate>
            <div className={styles.titles}>
              <h1 className={styles.heading}>forgot it? happens.</h1>
              <p className={styles.lede}>Enter your email and I&apos;ll send a link to set a new password.</p>
            </div>
            {alert}
            <label className={styles.field}>
              <span className={styles.label}>email</span>
              <input
                className={styles.input}
                type="email"
                autoComplete="username"
                value={email}
                placeholder="you@email.com"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
              />
            </label>
            <button type="submit" className={styles.primary} disabled={loading}>
              send reset link →
            </button>
            <button type="button" className={styles.back} onClick={goSignIn}>
              ← back to sign in
            </button>
          </form>
        )}

        {view === "sent" && (
          <div className={styles.form}>
            <span className={styles.okPill}>
              <span className={styles.okDot} />
              link sent
            </span>
            <h1 className={styles.heading}>check your inbox.</h1>
            <p className={styles.lede}>If {email || "that email"} has an account, a reset link is on its way. It works for 30 minutes.</p>
            <button type="button" className={styles.primary} onClick={goSignIn}>
              back to sign in
            </button>
          </div>
        )}

        {/* Not in the design: the page the reset link opens. Same card and controls. */}
        {view === "newPassword" && (
          <form onSubmit={saveNewPassword} className={styles.form} noValidate>
            <div className={styles.titles}>
              <h1 className={styles.heading}>new password.</h1>
              <p className={styles.lede}>Pick something long — at least 10 characters.</p>
            </div>
            {alert}
            <input type="email" autoComplete="username" value="" readOnly hidden />
            <label className={styles.field}>
              <span className={styles.label}>new password</span>
              {passwordField("new-password", "at least 10 characters")}
            </label>
            <button type="submit" className={styles.primary} style={{ opacity: loading ? 0.6 : 1 }} disabled={loading}>
              {loading ? "saving…" : "save password →"}
            </button>
            {error === "expired" && (
              <button
                type="button"
                className={styles.back}
                onClick={() => {
                  setError("");
                  setView("reset");
                }}
              >
                send a new link →
              </button>
            )}
          </form>
        )}

        {view === "passwordSaved" && (
          <div className={styles.form}>
            <span className={styles.okPill}>
              <span className={styles.okDot} />
              password saved
            </span>
            <h1 className={styles.heading}>all set.</h1>
            <p className={styles.lede}>Sign in with your new password.</p>
            <button type="button" className={styles.primary} onClick={goSignIn}>
              sign in →
            </button>
          </div>
        )}

        <div className={styles.foot}>
          <Link href="/" className={styles.siteLink}>
            ← back to the site
          </Link>
          <span className={styles.note}>only you can get in</span>
        </div>
      </div>
    </div>
  );
}
