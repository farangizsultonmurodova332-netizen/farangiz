"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../lib/auth";
import { useLanguage } from "../../../lib/i18n";
import type { User } from "../../../lib/types";
import EmptyState from "../../../components/EmptyState";

const OTP_LENGTH = 6;
const getPasswordStrength = (value: string, labels: string[]) => {
  let score = 0;
  if (value.length >= 10) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  const colors = ["bg-red-500", "bg-orange-500", "bg-amber-500", "bg-lime-500", "bg-emerald-500"];
  return { score, label: labels[score], color: colors[score] };
};

export default function ChangePasswordPage() {
  const { user, apiFetch } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  const [isSending, setIsSending] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [step, setStep] = useState<"request" | "verify" | "password">("request");
  const [formError, setFormError] = useState<string | null>(null);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const [otpDigits, setOtpDigits] = useState<string[]>(Array.from({ length: OTP_LENGTH }, () => ""));
  const [formState, setFormState] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const profileQuery = useQuery({
    queryKey: ["me-profile-email"],
    queryFn: () => apiFetch<User>("/users/me"),
    enabled: !!user,
  });

  const emailAddress = profileQuery.data?.email || user?.email || t("password.defaultEmail");
  const strength = getPasswordStrength(formState.password, [
    t("auth.strengthVeryWeak"),
    t("auth.strengthWeak"),
    t("auth.strengthOkay"),
    t("auth.strengthGood"),
    t("auth.strengthStrong"),
  ]);

  if (!user) {
    return (
      <EmptyState
        title={t("password.signInTitle")}
        description={t("password.signInBody")}
        actionLabel={t("nav.signIn")}
        actionHref="/login"
      />
    );
  }

  const requestOtp = async () => {
    setIsSending(true);
    setFormError(null);
    setRetryAfter(null);
    try {
      await apiFetch("/auth/password-otp/request", {
        method: "POST",
      });
      setStep("verify");
    } catch (error) {
      const message = (error as Error).message;
      setFormError(message);
      const match = message.match(/(\d+)\s*seconds?/i);
      if (match) {
        setRetryAfter(Number(match[1]));
      }
    } finally {
      setIsSending(false);
    }
  };

  const otpValue = otpDigits.join("");

  const verifyOtp = async () => {
    if (otpValue.length !== OTP_LENGTH) return;
    setIsVerifying(true);
    setFormError(null);
    try {
      await apiFetch("/auth/password-otp/verify", {
        method: "POST",
        body: JSON.stringify({
          code: otpValue,
        }),
      });
      setStep("password");
    } catch (error) {
      setFormError((error as Error).message);
    } finally {
      setIsVerifying(false);
    }
  };

  const submitNewPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (otpValue.length !== OTP_LENGTH) return;
    if (formState.password != formState.confirmPassword) {
      setFormError(t("password.passwordsDoNotMatch"));
      return;
    }
    setIsSaving(true);
    setFormError(null);
    try {
      await apiFetch("/auth/password-otp/verify", {
        method: "POST",
        body: JSON.stringify({
          code: otpValue,
          password: formState.password,
        }),
      });
      setFormState({ password: "", confirmPassword: "" });
      setOtpDigits(Array.from({ length: OTP_LENGTH }, () => ""));
      setStep("request");
      router.push("/profile");
    } catch (error) {
      setFormError((error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (step === "request") {
      setOtpDigits(Array.from({ length: OTP_LENGTH }, () => ""));
      setFormState({ password: "", confirmPassword: "" });
      setFormError(null);
    }
  }, [step]);

  const handleOtpChange = (index: number, value: string) => {
    const nextValue = value.replace(/\D/g, "").slice(-1);
    setOtpDigits((prev) => {
      const copy = [...prev];
      copy[index] = nextValue;
      return copy;
    });
    if (nextValue && index < OTP_LENGTH - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        (prevInput as HTMLInputElement).focus();
      }
    }
  };

  const handleOtpPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const text = event.clipboardData.getData("text").replace(/\D/g, "");
    if (!text) return;
    const next = Array.from({ length: OTP_LENGTH }, (_, i) => text[i] || "");
    setOtpDigits(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            {t("password.security")}
          </p>
          <h1 className="text-2xl font-semibold text-ink">{t("password.changeTitle")}</h1>
        </div>
        <Link href="/profile" className="btn-secondary">
          {t("profile.backToProfile")}
        </Link>
      </div>

      <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-soft">
        <div className="space-y-4">
          <p className="text-sm text-ink/60">
            {t("password.otpInfoPrefix")}
            <span className="font-medium text-ink">{emailAddress}</span>
            {t("password.otpInfoSuffix")}
          </p>
          {step === "request" && (
            <button type="button" className="btn-primary" onClick={requestOtp} disabled={isSending}>
              {isSending ? t("password.sending") : t("password.sendCode")}
            </button>
          )}
          {step === "verify" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-ink">{t("password.otpCode")}</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={`otp-${index}`}
                      id={`otp-${index}`}
                      value={digit}
                      onChange={(event) => handleOtpChange(index, event.target.value)}
                      onKeyDown={(event) => handleOtpKeyDown(index, event)}
                      onPaste={handleOtpPaste}
                      className="h-12 w-12 rounded-xl border border-haze bg-white/80 text-center text-lg font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-ink/20"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      aria-label={`${t("password.otpDigit")} ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
              {formError && <p className="text-sm text-red-600">{formError}</p>}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn-primary"
                  disabled={isVerifying || otpValue.length !== OTP_LENGTH}
                  onClick={verifyOtp}
                >
                  {isVerifying ? t("password.verifying") : t("password.verifyCode")}
                </button>
                <button type="button" className="btn-secondary" onClick={requestOtp} disabled={isSending}>
                  {isSending ? t("password.resending") : t("password.resendCode")}
                </button>
              </div>
            </div>
          )}
          {step === "password" && (
            <form className="space-y-4" onSubmit={submitNewPassword}>
              <div>
                <label className="text-sm font-medium text-ink">{t("password.newPassword")}</label>
                <div className="relative mt-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input pr-12"
                    value={formState.password}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, password: event.target.value }))
                    }
                    placeholder={t("password.newPasswordPlaceholder")}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-ink/60 hover:text-ink"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? t("auth.hide") : t("auth.show")}
                  </button>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all ${strength.color}`}
                    style={{ width: `${(strength.score / 4) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-ink/60 mt-2">
                  {t("auth.strength")}: {strength.label}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-ink">{t("password.confirmPassword")}</label>
                <div className="relative mt-2">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="input pr-12"
                    value={formState.confirmPassword}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, confirmPassword: event.target.value }))
                    }
                    onPaste={(event) => event.preventDefault()}
                    placeholder={t("password.confirmPasswordPlaceholder")}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-ink/60 hover:text-ink"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? t("auth.hide") : t("auth.show")}
                  </button>
                </div>
              </div>
              {formError && <p className="text-sm text-red-600">{formError}</p>}
              <div className="flex flex-wrap gap-2">
                <button type="submit" className="btn-primary" disabled={isSaving}>
                  {isSaving ? t("profile.saving") : t("password.updatePassword")}
                </button>
                <button type="button" className="btn-secondary" onClick={requestOtp} disabled={isSending}>
                  {isSending ? t("password.resending") : t("password.resendCode")}
                </button>
              </div>
            </form>
          )}
          {formError && step === "request" && (
            <p className="text-sm text-red-600">
              {retryAfter
                ? t("password.waitRetry", { seconds: retryAfter })
                : formError}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
