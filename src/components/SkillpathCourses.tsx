import React from "react"
import { Search, ArrowUpDown, RefreshCw, Terminal } from "lucide-react"
import { useCourseCatalog, SkillpathCoursesProps } from "../hooks/useCourseCatalog"

export function SkillpathCourses({
  accentColor = "#ccff00",
  showRefundableBadge = true,
}: SkillpathCoursesProps) {
  const {
    fetchState,
    countryCode,
    countryFetchFailed,
    countryErrorDetail,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    processedCourses,
    formatPrice,
    toggleCountryCode,
    refetch,
  } = useCourseCatalog()

  return (
    <section
      id="courses"
      aria-labelledby="catalog-heading"
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16"
    >
      {/* Header Bar: Stack on Mobile, Flex Row on Desktop */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-6 border-b border-white/10 pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#ccff00] bg-[#ccff00]/10 px-2.5 py-1 border border-[#ccff00]/30">
              [ 02 // INDEX ]
            </span>
            {countryFetchFailed && (
              <span
                role="status"
                title={countryErrorDetail ? `Country API Response: ${countryErrorDetail}` : undefined}
                className="font-mono text-[11px] text-amber-400 bg-amber-400/10 px-2.5 py-1 border border-amber-400/20"
              >
                COUNTRY_API_OFFLINE ({countryErrorDetail || "DEFAULT_INR"})
              </span>
            )}
          </div>
          <h2 id="catalog-heading" className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight">
            Curated <em className="italic text-[#ccff00]">Curriculum</em>
          </h2>
        </div>

        {/* Filter & Currency Controls: Responsive Touch Targets */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] sm:w-60">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden="true" />
            <input
              type="text"
              aria-label="Search course catalog"
              placeholder="Search index..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full min-h-[44px] bg-[#12141c] text-slate-100 placeholder-slate-500 font-mono text-xs rounded-none pl-10 pr-4 py-2.5 border border-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00] transition-all"
            />
          </div>

          <div className="relative min-h-[44px]">
            <select
              aria-label="Sort courses by price or default"
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="min-h-[44px] bg-[#12141c] text-slate-200 font-mono text-xs rounded-none pl-8 pr-8 py-2.5 border border-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00] appearance-none cursor-pointer"
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
            <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" aria-hidden="true" />
          </div>

          <button
            onClick={toggleCountryCode}
            title="Toggle currency region (INR / USD)"
            aria-label={`Toggle region currency. Currently showing ${countryCode === "IN" ? "Indian Rupees" : "US Dollars"}`}
            className="min-h-[44px] flex items-center gap-1.5 px-4 py-2.5 bg-[#12141c] hover:bg-slate-800 font-mono text-xs text-slate-300 rounded-none border border-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00] transition-colors"
          >
            <span>REG:</span>
            <span className="text-[#ccff00] font-bold">{countryCode === "IN" ? "INR (₹)" : "USD ($)"}</span>
          </button>

          <button
            onClick={() => refetch()}
            aria-label="Refresh course API data"
            title="Re-trigger API calls to test flaky 1-in-3 error handling"
            className="min-h-[44px] flex items-center gap-1.5 px-4 py-2.5 bg-white/5 hover:bg-white/10 font-mono text-xs text-slate-400 hover:text-white rounded-none border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">REFRESH API</span>
          </button>
        </div>
      </div>

      {/* STATE 1: LOADING (Accessible Skeleton Grid) */}
      {fetchState.status === "loading" && (
        <div
          aria-busy="true"
          aria-live="polite"
          aria-label="Loading catalog items"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="tactile-card p-6 flex flex-col justify-between h-64 border border-white/10">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="h-4 w-20 shimmer-bg" />
                  <div className="h-4 w-16 shimmer-bg" />
                </div>
                <div className="h-6 w-3/4 shimmer-bg mb-3" />
                <div className="h-4 w-full shimmer-bg mb-2" />
                <div className="h-4 w-2/3 shimmer-bg" />
              </div>
              <div className="flex justify-between items-end pt-4 border-t border-white/10 mt-4">
                <div className="h-6 w-20 shimmer-bg" />
                <div className="h-8 w-24 shimmer-bg" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STATE 2: ERROR (WCAG Accessible Alert Region) */}
      {fetchState.status === "error" && (
        <div
          role="alert"
          aria-live="assertive"
          className="tactile-card p-6 sm:p-8 max-w-xl mx-auto text-center border-red-500/30 my-8"
        >
          <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-none flex items-center justify-center mx-auto mb-4 border border-red-500/30 font-mono text-xl">
            !
          </div>
          <h3 className="font-serif text-2xl font-normal text-white mb-2">Service Error Encountered</h3>
          <p className="font-mono text-xs text-red-400 mb-2">{fetchState.message}</p>

          {fetchState.apiDetail && (
            <div className="bg-[#08090c] text-[#ff8888] font-mono text-xs p-3 border border-red-500/20 text-left my-4 overflow-x-auto">
              <span className="text-slate-500 block text-[10px] uppercase mb-1">API Response Detail:</span>
              <code>{fetchState.apiDetail}</code>
            </div>
          )}

          <button
            onClick={() => refetch()}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-xs uppercase font-bold text-black bg-[#ccff00] hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors border border-[#ccff00] mt-2"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            <span>RETRY CONNECTION</span>
          </button>
        </div>
      )}

      {/* STATE 3: ZERO RESULTS */}
      {fetchState.status === "success" && processedCourses.length === 0 && (
        <div role="status" className="tactile-card p-12 max-w-md mx-auto text-center border-white/10 my-8">
          <Terminal className="w-8 h-8 text-slate-500 mx-auto mb-3" aria-hidden="true" />
          <h3 className="font-serif text-xl font-normal text-white mb-1">Zero Index Matches</h3>
          <p className="font-mono text-xs text-slate-400 mb-4">
            {fetchState.data.length === 0 ? "Catalog empty." : `No match for "${searchQuery}".`}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="min-h-[44px] px-4 py-2 bg-slate-800 text-slate-200 font-mono text-xs rounded-none border border-white/10 hover:border-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00] transition-colors"
            >
              Clear Query Filter
            </button>
          )}
        </div>
      )}

      {/* STATE 4: WORKING CATALOG (3-col Desktop, 2-col Tablet, 1-col Mobile Grid) */}
      {fetchState.status === "success" && processedCourses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedCourses.map(course => (
            <article
              key={course.mangoId || course.courseCode}
              tabIndex={0}
              className="tactile-card p-6 flex flex-col justify-between group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00]"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="font-mono text-[10px] font-bold tracking-widest text-[#ccff00] uppercase bg-[#ccff00]/10 px-2 py-0.5 border border-[#ccff00]/20">
                    {course.mainCategory}
                  </span>

                  {showRefundableBadge && course.refundable && (
                    <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">
                      REFUNDABLE
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-2xl font-normal text-white mb-2 leading-snug group-hover:text-[#ccff00] transition-colors">
                  {course.courseName}
                </h3>

                <p className="text-slate-400 text-xs font-sans line-clamp-2 leading-relaxed mb-6">
                  {course.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500 block">
                    TUITION
                  </span>
                  <span className="font-mono text-xl font-bold text-white tracking-tight">
                    {formatPrice(course, countryCode)}
                  </span>
                </div>

                <button
                  aria-label={`Enroll in ${course.courseName} for ${formatPrice(course, countryCode)}`}
                  className="min-h-[40px] px-4 py-2 font-mono text-xs uppercase font-bold text-black bg-[#ccff00] hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors border border-[#ccff00]"
                >
                  ENROLL
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default SkillpathCourses
