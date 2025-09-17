import React, { useEffect, useMemo, useState } from "react";
import { browser } from "@wxt-dev/browser";
import { Check, Copy, Globe, LoaderCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import "./style.css";

interface Cookie {
  name: string;
  value: string;
  domain: string;
}

type FilterType = "all" | "key" | "value";

const filterOptions: Array<{ value: FilterType; label: string }> = [
  { value: "all", label: "All" },
  { value: "key", label: "Key" },
  { value: "value", label: "Value" },
];

const FILTER_LABEL: Record<FilterType, string> = {
  all: "All",
  key: "Key",
  value: "Value",
};

const ESCAPE_PATTERN = /[-\\/^$*+?.()|[\]{}]/g;

const escapeRegExp = (value: string) => value.replace(ESCAPE_PATTERN, "\\$&");

const Highlight: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query) return <>{text}</>;
  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, "gi"));

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span
            key={`${part}-${index}`}
            className="rounded-md bg-[#e3ebff] px-1 py-0.5 text-[#0b57d0]"
          >
            {part}
          </span>
        ) : (
          <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
        ),
      )}
    </>
  );
};

const App: React.FC = () => {
  const [allCookies, setAllCookies] = useState<Cookie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [extensionVersion, setExtensionVersion] = useState("");
  const [currentDomain, setCurrentDomain] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function initializeExtension() {
      try {
        const manifest = browser.runtime.getManifest();
        if (isMounted) {
          setExtensionVersion(manifest.version ?? "");
        }

        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        const activeTab = tabs[0];

        if (activeTab?.url) {
          const currentUrl = new URL(activeTab.url);
          const domain = currentUrl.hostname;
          if (isMounted) {
            setCurrentDomain(domain);
          }

          const cookies = await browser.cookies.getAll({ domain });
          if (isMounted) {
            setAllCookies(
              cookies.map(({ name, value, domain: cookieDomain }) => ({
                name,
                value,
                domain: cookieDomain,
              })),
            );
          }
        } else if (isMounted) {
          setCurrentDomain("");
          setAllCookies([]);
        }
      } catch (error) {
        console.error("Error initializing extension:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initializeExtension();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCookies = useMemo(() => {
    if (!searchQuery) return allCookies;
    const lowercasedQuery = searchQuery.toLowerCase();

    return allCookies.filter((cookie) => {
      const name = cookie.name.toLowerCase();
      const value = cookie.value.toLowerCase();

      if (filterType === "key") {
        return name.includes(lowercasedQuery);
      }

      if (filterType === "value") {
        return value.includes(lowercasedQuery);
      }

      return name.includes(lowercasedQuery) || value.includes(lowercasedQuery);
    });
  }, [allCookies, filterType, searchQuery]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStates((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [id]: false }));
      }, 2000);
    });
  };

  const totalCookies = allCookies.length;
  const shownCookies = filteredCookies.length;
  const activeFilterLabel = FILTER_LABEL[filterType];

  return (
    <div
      className="flex h-[520px] w-[520px] flex-col overflow-hidden rounded-[28px] border border-slate-200/60 bg-white font-sans text-slate-900 shadow-lg"
      style={{
        background: "linear-gradient(160deg, #f6f8ff 0%, #ffffff 45%, #f8f3ff 100%)",
      }}
    >
      <header className="bg-white/60 px-5 pb-4 pt-5 backdrop-blur-sm border-b border-slate-200/70">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0b57d0] to-[#8c66ff] text-lg shadow-sm">
              <span role="img" aria-label="Cookie">
                🍪
              </span>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-semibold tracking-tight">Cookie Jar</h1>
              <p className="text-xs text-slate-500">Clean, simple cookie insights</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 text-right">
            <span className="rounded-full border border-[#0b57d0]/20 bg-[#0b57d0]/10 px-3 py-1 text-[11px] font-semibold text-[#0b57d0]">
              v{extensionVersion}
            </span>
            {currentDomain && (
              <div className="flex max-w-[200px] items-center gap-1 text-[11px] text-slate-500">
                <Globe className="h-3.5 w-3.5 text-[#0b57d0]" aria-hidden="true" />
                <span className="truncate" title={currentDomain}>
                  {currentDomain}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200/70 bg-white/75 px-4 py-3 shadow-sm">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Search cookies"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white/90 pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#0b57d0] focus:outline-none focus:ring-4 focus:ring-[#0b57d0]/15"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Filter
              </span>
              <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white/70 p-1">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFilterType(option.value)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                      filterType === option.value
                        ? "bg-[#0b57d0] text-white shadow-sm"
                        : "text-slate-500 hover:bg-slate-100",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-5 py-4">
        {loading ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-500">
            <LoaderCircle className="h-8 w-8 animate-spin text-[#0b57d0]" aria-hidden="true" />
            <p className="text-sm font-medium">Loading cookies…</p>
          </div>
        ) : shownCookies === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-slate-500">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-[#0b57d0]/30 bg-white/60">
              <Search className="h-7 w-7 text-[#0b57d0]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">No cookies found</p>
              <p className="text-xs text-slate-500">
                Try a different keyword or filter
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
              <span>
                Showing {shownCookies} {shownCookies === 1 ? "cookie" : "cookies"}
                {shownCookies !== totalCookies ? ` of ${totalCookies}` : ""}
              </span>
              <div className="flex items-center gap-3 text-right">
                {searchQuery && (
                  <span className="truncate text-slate-500" title={searchQuery}>
                    Search "{searchQuery}"
                  </span>
                )}
                {filterType !== "all" && <span>Filter: {activeFilterLabel}</span>}
              </div>
            </div>

            <div className="space-y-3 pb-4">
              {filteredCookies.map((cookie, index) => {
                const cookieId = `cookie-${index}`;
                const isCopied = copiedStates[cookieId];

                return (
                  <article
                    key={cookieId}
                    className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 shadow-sm transition hover:border-[#0b57d0]/35 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-500">
                          <Highlight text={cookie.domain} query={searchQuery} />
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(cookie.value, cookieId)}
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full border transition duration-200 focus:outline-none focus:ring-4 focus:ring-[#0b57d0]/20",
                          isCopied
                            ? "border-[#0b57d0]/40 bg-[#0b57d0] text-white shadow-sm"
                            : "border-transparent bg-slate-100/80 text-slate-500 hover:border-[#0b57d0]/30 hover:bg-white hover:text-[#0b57d0]",
                        )}
                        aria-label="Copy cookie value"
                      >
                        {isCopied ? (
                          <Check className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Copy className="h-4 w-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>

                    <dl className="mt-3 space-y-3">
                      <div>
                        <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#0b57d0]">
                          Key
                        </dt>
                        <dd className="mt-1 break-words text-sm font-semibold text-slate-900">
                          <Highlight text={cookie.name} query={searchQuery} />
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#0b57d0]">
                          Value
                        </dt>
                        <dd className="mt-1 max-h-28 overflow-y-auto break-all rounded-xl border border-slate-200/70 bg-slate-50/80 px-3 py-2 font-mono text-xs leading-relaxed text-slate-700">
                          <Highlight text={cookie.value} query={searchQuery} />
                        </dd>
                      </div>
                    </dl>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;
