"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import IdeaCard from "../components/IdeaCard";
import Pagination from "../components/Pagination";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../lib/auth";
import { useLanguage } from "../lib/i18n";
import type { Idea, PaginatedResponse } from "../lib/types";

export default function HomePage() {
  const { apiFetch, user } = useAuth();
  const { t } = useLanguage();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [feed, setFeed] = useState("new");

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(handler);
  }, [search]);

  const queryKey = ["ideas", page, debouncedSearch, category, tag, feed];

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (category) params.set("category", category);
    if (tag) params.set("tag", tag);
    params.set("ordering", "-created_at");
    return params.toString();
  }, [page, debouncedSearch, category, tag]);

  const endpoint =
    feed === "following"
      ? `/ideas/following?${queryString}`
      : feed === "trending"
        ? `/ideas/trending?days=7&page=${page}`
        : `/ideas?${queryString}`;

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => apiFetch<PaginatedResponse<Idea>>(endpoint),
    enabled: feed !== "following" || !!user,
  });

  return (
    <div className="space-y-6 md:space-y-10">
      <section className="card p-6 md:p-10">
        <div className="grid gap-6 md:grid-cols-[2fr,1fr] md:items-center">
          <div>
            <h1 className="section-title">{t("home.heroTitle")}</h1>
            <p className="mt-2 md:mt-3 section-subtitle">{t("home.heroSubtitle")}</p>
            <div className="mt-4 md:mt-6 flex flex-wrap gap-3">
              <a href="/ideas/new" className="btn-primary flex-1 md:flex-none justify-center">
                {t("home.shareIdea")}
              </a>
              <a href="#ideas" className="btn-secondary flex-1 md:flex-none justify-center">
                {t("home.giveFeedback")}
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-haze bg-card p-4 md:p-6 text-sm text-ink/70">
            <p className="font-semibold text-ink">{t("home.noFakeTitle")}</p>
            <p className="mt-2">
              {t("home.noFakeBody")}
            </p>
          </div>
        </div>
      </section>

      <section id="ideas" className="grid gap-6 md:grid-cols-[1.5fr,3fr]">
        {/* On mobile, we might want search/filter to be less dominant, but for now just compacting paddings */}
        <aside className="space-y-4">
          <div className="card p-4 md:p-6">
            <p className="text-sm font-semibold text-ink">{t("home.searchTitle")}</p>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("home.searchPlaceholder")}
              className="input mt-3"
            />
          </div>
          <div className="card p-4 md:p-6 space-y-3">
            <p className="text-sm font-semibold text-ink">{t("home.filtersTitle")}</p>
            <input
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder={t("home.filterCategory")}
              className="input"
            />
            <input
              value={tag}
              onChange={(event) => setTag(event.target.value)}
              placeholder={t("home.filterTag")}
              className="input"
            />
          </div>
          <div className="card p-4 md:p-6 hidden md:block">
            <p className="text-sm font-semibold text-ink">{t("home.writeSharperTitle")}</p>
            <ul className="mt-3 space-y-2 text-sm text-ink/60">
              <li>{t("home.writeSharperTip1")}</li>
              <li>{t("home.writeSharperTip2")}</li>
              <li>{t("home.writeSharperTip3")}</li>
            </ul>
          </div>
        </aside>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-ink/60 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {["following", "new", "trending"].map((value) => (
              <button
                key={value}
                className={`btn whitespace-nowrap ${feed === value ? "btn-primary" : "btn-secondary"}`}
                onClick={() => {
                  setFeed(value);
                  setPage(1);
                }}
              >
                {value === "new"
                  ? t("feed.new")
                  : value === "following"
                    ? t("feed.following")
                    : t("feed.trending")}
              </button>
            ))}
          </div>
          {feed === "following" && !user && (
            <EmptyState
              title={t("home.followingEmptyTitle")}
              description={t("home.followingEmptyBody")}
              actionLabel={t("nav.signIn")}
              actionHref="/login"
            />
          )}
          {isLoading && <Loading />}
          {error && (
            <EmptyState
              title={t("common.somethingWrong")}
              description={(error as Error).message}
              actionLabel={t("common.refresh")}
              actionHref="/"
            />
          )}
          {!isLoading && data?.results?.length === 0 && feed === "following" && (
            <EmptyState
              title={t("home.followingEmptyFeedTitle")}
              description={t("home.followingEmptyFeedBody")}
              actionLabel={t("home.exploreIdeas")}
              actionHref="/"
            />
          )}
          {!isLoading && data?.results?.length === 0 && feed === "trending" && (
            <EmptyState
              title={t("home.noTrendingTitle")}
              description={t("home.noTrendingBody")}
              actionLabel={t("home.shareIdea")}
              actionHref="/ideas/new"
            />
          )}
          {!isLoading && data?.results?.length === 0 && feed === "new" && (
            <EmptyState
              title={t("home.noIdeasTitle")}
              description={t("home.noIdeasBody")}
              actionLabel={t("home.shareIdea")}
              actionHref="/ideas/new"
            />
          )}
          {(feed !== "following" || !!user) && (
            <>
              <div className="grid gap-4">
                {data?.results?.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} />
                ))}
              </div>
              {data && <Pagination page={page} total={data.count} onPage={setPage} />}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
