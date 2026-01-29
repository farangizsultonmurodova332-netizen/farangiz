"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../lib/auth";
import { useLanguage } from "../../lib/i18n";

type FormValues = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useLanguage();
  const schema = useMemo(
    () =>
      z.object({
        username: z.string().min(3, t("auth.usernameMin")),
        password: z.string().min(8, t("auth.passwordMin")),
      }),
    [t]
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      await login(values.username, values.password);
      router.push("/");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-220px)] flex items-center justify-center p-6">
      <div className="card p-8 max-w-md w-full">
        <h1 className="section-title">{t("auth.loginTitle")}</h1>
        <p className="mt-2 section-subtitle">{t("auth.loginSubtitle")}</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <input {...register("username")} placeholder={t("auth.username")} className="input" />
          {errors.username && <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>}
        </div>
        <div>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder={t("auth.password")}
              className="input pr-12"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-ink/60 hover:text-ink"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? t("auth.hide") : t("auth.show")}
            </button>
          </div>
          {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <p className="text-sm text-ink/60">
          {t("auth.noAccount")}{" "}
          <a href="/register" className="text-ink underline">
            {t("auth.registerLink")}
          </a>
        </p>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? t("auth.signingIn") : t("auth.signIn")}
        </button>
        </form>
      </div>
    </div>
  );
}
