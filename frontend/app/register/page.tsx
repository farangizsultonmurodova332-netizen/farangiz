"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../lib/auth";
import { useLanguage } from "../../lib/i18n";

const getPasswordStrength = (value: string, labels: string[]) => {
  let score = 0;
  if (value.length >= 10) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  const colors = ["bg-red-500", "bg-orange-500", "bg-amber-500", "bg-lime-500", "bg-emerald-500"];
  return { score, label: labels[score], color: colors[score] };
};

type FormValues = {
  username: string;
  email: string;
  birth_date: string;
  phone: string;
  location: string;
  portfolio_file: FileList;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const { t } = useLanguage();
  const schema = useMemo(
    () =>
      z
        .object({
          username: z.string().min(3, t("auth.usernameMin")),
          email: z.string().email(t("auth.emailInvalid")),
          birth_date: z.string().min(1, t("auth.birthDateRequired")),
          phone: z.string().min(1, t("auth.phoneRequired")),
          location: z.string().min(1, t("auth.locationRequired")),
          portfolio_file: z
            .custom<FileList>((value) => value instanceof FileList, {
              message: t("auth.portfolioRequired"),
            })
            .refine((files) => files.length > 0, t("auth.portfolioRequired")),
          password: z
            .string()
            .min(10, t("auth.passwordMin10"))
            .regex(/[A-Z]/, t("auth.passwordUpper"))
            .regex(/[a-z]/, t("auth.passwordLower"))
            .regex(/\d/, t("auth.passwordNumber"))
            .regex(/[^A-Za-z0-9]/, t("auth.passwordSymbol")),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: t("auth.passwordMismatch"),
          path: ["confirmPassword"],
        }),
    [t]
  );
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordValue = watch("password") || "";
  const strength = getPasswordStrength(passwordValue, [
    t("auth.strengthVeryWeak"),
    t("auth.strengthWeak"),
    t("auth.strengthOkay"),
    t("auth.strengthGood"),
    t("auth.strengthStrong"),
  ]);

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      await registerUser(
        values.username,
        values.email,
        values.password,
        values.birth_date,
        values.phone,
        values.location,
        values.portfolio_file[0]
      );
      router.push("/");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-220px)] flex items-center justify-center p-6">
      <div className="card p-8 max-w-md w-full">
        <h1 className="section-title">{t("auth.registerTitle")}</h1>
        <p className="mt-2 section-subtitle">{t("auth.registerSubtitle")}</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <input {...register("username")} placeholder={t("auth.username")} className="input" />
          {errors.username && <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>}
        </div>
        <div>
          <input
            {...register("email")}
            type="email"
            placeholder={t("auth.email")}
            className="input"
            required
          />
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <input
            {...register("birth_date")}
            type="date"
            className="input"
            required
          />
          {errors.birth_date && <p className="text-sm text-red-600 mt-1">{errors.birth_date.message}</p>}
        </div>
        <div>
          <input
            {...register("phone")}
            type="tel"
            placeholder={t("auth.phonePlaceholder")}
            className="input"
            required
          />
          {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <input
            {...register("portfolio_file")}
            type="file"
            accept=".pdf,.doc,.docx,.zip,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/zip"
            className="input"
            required
          />
          <p className="text-xs text-ink/60 mt-1">{t("auth.portfolioHint")}</p>
          {errors.portfolio_file && (
            <p className="text-sm text-red-600 mt-1">{errors.portfolio_file.message}</p>
          )}
        </div>
        <div>
          <input
            {...register("location")}
            placeholder={t("auth.locationPlaceholder")}
            className="input"
            required
          />
          {errors.location && <p className="text-sm text-red-600 mt-1">{errors.location.message}</p>}
        </div>
        <div className="relative">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder={t("auth.password")}
            className="input pr-12"
          />
          <button
            type="button"
            className="absolute right-3 top-[14px] text-xs font-semibold text-ink/60 hover:text-ink"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? t("auth.hide") : t("auth.show")}
          </button>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all ${strength.color}`}
              style={{ width: `${(strength.score / 4) * 100}%` }}
            />
          </div>
          <p className="text-xs text-ink/60 mt-2">
            {t("auth.strength")}: {strength.label}
          </p>
          {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
        </div>
        <div className="relative">
          <input
            {...register("confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            placeholder={t("auth.confirmPassword")}
            className="input pr-12"
            onPaste={(event) => event.preventDefault()}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-ink/60 hover:text-ink"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? t("auth.hide") : t("auth.show")}
          </button>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? t("auth.creating") : t("auth.createAccount")}
        </button>
        </form>
      </div>
    </div>
  );
}
