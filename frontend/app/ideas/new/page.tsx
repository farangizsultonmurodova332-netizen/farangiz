"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../../lib/auth";
import { useLanguage } from "../../../lib/i18n";

const schema = z.object({
  title: z.string().min(3).max(120),
  short_description: z.string().min(10).max(280),
  full_description: z.string().min(20),
  category: z.string().min(2),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function NewIdeaPage() {
  const router = useRouter();
  const { apiFetch, user } = useAuth();
  const { t } = useLanguage();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const preview = watch();

  const onSubmit = async (values: FormValues) => {
    const tags = values.tags
      ? values.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      : [];
    const idea = await apiFetch<{ id: number }>("/ideas", {
      method: "POST",
      body: JSON.stringify({
        title: values.title,
        short_description: values.short_description,
        full_description: values.full_description,
        category: values.category,
        tags,
      }),
    });
    router.push(`/ideas/${idea.id}`);
  };

  if (!user) {
    return (
      <div className="card p-6">
        <p className="text-sm text-ink/60">{t("ideas.signInToCreate")}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="card p-8">
        <h1 className="section-title">{t("ideas.newTitle")}</h1>
        <p className="mt-2 section-subtitle">{t("ideas.newSubtitle")}</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-ink">{t("ideas.title")}</label>
            <input
              {...register("title")}
              placeholder={t("ideas.titlePlaceholder")}
              className="input mt-2"
            />
            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="text-sm font-semibold text-ink">{t("ideas.shortDescription")}</label>
            <input
              {...register("short_description")}
              placeholder={t("ideas.shortDescriptionPlaceholder")}
              className="input mt-2"
            />
            {errors.short_description && (
              <p className="text-sm text-red-600 mt-1">{errors.short_description.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-semibold text-ink">{t("ideas.fullDescription")}</label>
            <textarea
              {...register("full_description")}
              placeholder={t("ideas.fullDescriptionPlaceholder")}
              className="input mt-2 min-h-[160px]"
            />
            {errors.full_description && (
              <p className="text-sm text-red-600 mt-1">{errors.full_description.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-semibold text-ink">{t("ideas.category")}</label>
            <input
              {...register("category")}
              placeholder={t("ideas.categoryPlaceholder")}
              className="input mt-2"
            />
            {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>}
          </div>
          <div>
            <label className="text-sm font-semibold text-ink">{t("ideas.tags")}</label>
            <input
              {...register("tags")}
              placeholder={t("ideas.tagsPlaceholder")}
              className="input mt-2"
            />
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? t("ideas.saving") : t("ideas.publish")}
          </button>
        </form>
      </div>
      <aside className="space-y-4">
        <div className="card p-6">
          <p className="text-sm font-semibold text-ink">{t("ideas.livePreview")}</p>
          <div className="mt-4 rounded-xl border border-haze bg-card/80 p-4">
            <p className="text-lg font-semibold text-ink">
              {preview.title || t("ideas.previewTitle")}
            </p>
            <p className="mt-2 text-sm text-ink/70">
              {preview.short_description || t("ideas.previewSummary")}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink/60">
              <span className="pill bg-haze text-ink/70">
                {preview.category || t("ideas.category")}
              </span>
              {(preview.tags || "")
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean)
                .slice(0, 3)
                .map((tag) => (
                  <span key={tag} className="chip">
                    #{tag}
                  </span>
                ))}
            </div>
          </div>
        </div>
        <div className="card p-6">
          <p className="text-sm font-semibold text-ink">{t("ideas.tipsTitle")}</p>
          <ul className="mt-3 space-y-2 text-sm text-ink/60">
            <li>{t("ideas.tip1")}</li>
            <li>{t("ideas.tip2")}</li>
            <li>{t("ideas.tip3")}</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
