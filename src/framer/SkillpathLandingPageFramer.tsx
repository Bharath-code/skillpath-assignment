import React, { useState, useEffect, useMemo } from "react"
// @ts-ignore
import { addPropertyControls, ControlType } from "framer"

interface Course {
  courseName: string
  courseCode: string
  description: string
  mainCategory: string
  shortCourse: string
  courseType: string
  pricePaise: number
  priceUsdCents: number
  mangoId: string
  refundable: boolean
}

interface SkillpathLandingPageProps {
  accentColor?: string
  showRefundableBadge?: boolean
}

const API_BASE = "https://syncsphere-hiv6.onrender.com"

export function SkillpathLandingPage(props: SkillpathLandingPageProps) {
  const { accentColor = "#CCFF00", showRefundableBadge = true } = props

  const [courses, setCourses] = useState<Course[]>([])
  const [countryCode, setCountryCode] = useState<"IN" | "US">("IN")
  const [countryFetchFailed, setCountryFetchFailed] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default")

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    setCountryFetchFailed(false)

    try {
      const [coursesRes, countryRes] = await Promise.allSettled([
        fetch(`${API_BASE}/assignment/course-data`, { method: "GET" }),
        fetch(`${API_BASE}/assignment/country-code`, { method: "GET" }),
      ])

      if (coursesRes.status === "fulfilled") {
        if (!coursesRes.value.ok) {
          throw new Error(`Course service error (HTTP ${coursesRes.value.status})`)
        }
        const data: Course[] = await coursesRes.value.json()
        setCourses(Array.isArray(data) ? data : [])
      } else {
        throw new Error(coursesRes.reason?.message || "Failed to reach course API")
      }

      if (countryRes.status === "fulfilled" && countryRes.value.ok) {
        try {
          const countryData = await countryRes.value.json()
          if (countryData?.country_code === "US" || countryData?.country_code === "IN") {
            setCountryCode(countryData.country_code)
          } else {
            setCountryCode("IN")
          }
        } catch {
          setCountryCode("IN")
          setCountryFetchFailed(true)
        }
      } else {
        setCountryCode("IN")
        setCountryFetchFailed(true)
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong while connecting to Skillpath API.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const formatPrice = (course: Course, country: "IN" | "US") => {
    if (country === "IN") {
      const rupees = course.pricePaise / 100
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(rupees)
    } else {
      const dollars = course.priceUsdCents / 100
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }).format(dollars)
    }
  }

  const getNormalizedPrice = (course: Course, country: "IN" | "US") => {
    return country === "IN" ? course.pricePaise / 100 : course.priceUsdCents / 100
  }

  const processedCourses = useMemo(() => {
    let result = [...courses]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        c =>
          c.courseName.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.mainCategory.toLowerCase().includes(q)
      )
    }

    if (sortBy === "price-asc") {
      result.sort((a, b) => getNormalizedPrice(a, countryCode) - getNormalizedPrice(b, countryCode))
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => getNormalizedPrice(b, countryCode) - getNormalizedPrice(a, countryCode))
    }

    return result
  }, [courses, searchQuery, sortBy, countryCode])

  return (
    <div style={styles.pageWrapper}>
      {/* 1. Header Navigation Bar */}
      <header style={styles.navHeader}>
        <div style={styles.navContainer}>
          <div style={styles.navLogoGroup}>
            <div style={{ ...styles.navBadgeSquare, backgroundColor: accentColor }}>✳</div>
            <span style={styles.navBrandName}>Skillpath</span>
            <span style={{ ...styles.navVersionTag, color: accentColor, borderColor: `${accentColor}40` }}>v2.0</span>
          </div>
          <div style={styles.navRightGroup}>
            <span style={styles.telemetryTag}>
              <span style={{ ...styles.statusDot, backgroundColor: accentColor }} /> API: <span style={{ color: accentColor }}>LIVE_SYNC</span>
            </span>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContainer}>
          <div style={{ ...styles.heroMonoHeader, color: accentColor }}>
            ✳ SKILLPATH SYSTEM // REPO_2026 | CURATED LEARNING INDEX
          </div>

          <h1 style={styles.heroTitle}>
            Master High-Impact Skills <br />
            <em style={{ fontStyle: "italic", color: accentColor }}>Without the Noise.</em>
          </h1>

          <div style={styles.heroSubGrid}>
            <p style={styles.heroDescription}>
              Actionable, system-driven courses built for creators and operators who value raw execution over passive consumption.
            </p>
            <div>
              <a href="#catalog" style={{ ...styles.heroCtaBtn, backgroundColor: accentColor }}>
                EXPLORE CATALOG ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Dynamic Courses Section */}
      <section id="catalog" style={styles.catalogSection}>
        <div style={styles.catalogHeaderBar}>
          <div>
            <div style={styles.badgeRow}>
              <span style={{ ...styles.pillBadge, borderColor: `${accentColor}50`, color: accentColor, backgroundColor: `${accentColor}15` }}>
                [ 02 // INDEX ]
              </span>
              {countryFetchFailed && (
                <span style={styles.fallbackWarning}>COUNTRY_OFFLINE: INR_DEFAULT</span>
              )}
            </div>
            <h2 style={styles.catalogTitle}>
              Curated <em style={{ fontStyle: "italic", color: accentColor }}>Curriculum</em>
            </h2>
          </div>

          {/* Controls */}
          <div style={styles.controlsRow}>
            <input
              type="text"
              placeholder="Search index..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              style={styles.sortSelect}
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
            <button
              onClick={() => setCountryCode(c => (c === "IN" ? "US" : "IN"))}
              style={styles.regionBtn}
            >
              REG: <span style={{ color: accentColor }}>{countryCode === "IN" ? "INR (₹)" : "USD ($)"}</span>
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={styles.grid}>
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} style={styles.skeletonCard} />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={styles.errorBox}>
            <h3 style={styles.errorHeading}>Service Error</h3>
            <p style={styles.errorText}>{error}</p>
            <button onClick={fetchData} style={{ ...styles.retryBtn, backgroundColor: accentColor }}>
              RETRY CONNECTION
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && processedCourses.length === 0 && (
          <div style={styles.emptyBox}>
            <h3 style={styles.emptyHeading}>Zero Index Matches</h3>
            <p style={styles.emptyText}>No courses match your query filter.</p>
          </div>
        )}

        {/* Working Grid */}
        {!loading && !error && processedCourses.length > 0 && (
          <div style={styles.grid}>
            {processedCourses.map(course => (
              <div key={course.mangoId || course.courseCode} style={styles.card}>
                <div>
                  <div style={styles.cardHeader}>
                    <span style={{ ...styles.categoryTag, color: accentColor, borderColor: `${accentColor}40` }}>
                      {course.mainCategory}
                    </span>
                    {showRefundableBadge && course.refundable && (
                      <span style={styles.refundableTag}>REFUNDABLE</span>
                    )}
                  </div>

                  <h3 style={styles.courseTitle}>{course.courseName}</h3>
                  <p style={styles.courseDesc}>{course.description}</p>
                </div>

                <div style={styles.cardFooter}>
                  <div>
                    <span style={styles.priceLabel}>TUITION</span>
                    <div style={styles.priceValue}>{formatPrice(course, countryCode)}</div>
                  </div>
                  <button style={{ ...styles.enrollBtn, backgroundColor: accentColor }}>
                    ENROLL
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Footer Section */}
      <footer style={styles.footerSection}>
        <div style={styles.footerContainer}>
          <div style={styles.footerLogoRow}>
            <div style={{ ...styles.navBadgeSquare, backgroundColor: accentColor }}>✳</div>
            <span style={styles.footerBrand}>Skillpath</span>
            <span style={styles.footerCopyright}>// © {new Date().getFullYear()} SKILLPATH_SYSTEMS. ALL_RIGHTS_RESERVED.</span>
          </div>

          <div style={styles.footerLinksRow}>
            <a href="#privacy" style={styles.footerLink}>Privacy Policy</a>
            <a href="#terms" style={styles.footerLink}>Terms of Service</a>
            <a href="#support" style={styles.footerLink}>Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

if (typeof addPropertyControls !== "undefined") {
  addPropertyControls(SkillpathLandingPage, {
    accentColor: {
      type: ControlType.Color,
      title: "Accent Color",
      defaultValue: "#CCFF00",
    },
    showRefundableBadge: {
      type: ControlType.Boolean,
      title: "Show Refundable Badge",
      defaultValue: true,
    },
  })
}

const styles: { [key: string]: React.CSSProperties } = {
  pageWrapper: {
    width: "100%",
    backgroundColor: "#0B0C10",
    color: "#F4F4F0",
    fontFamily: "'Space Mono', monospace, sans-serif",
    minHeight: "100vh",
  },
  navHeader: {
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    backgroundColor: "rgba(11,12,16,0.95)",
    position: "sticky",
    top: 0,
    zIndex: 50,
    padding: "16px 24px",
  },
  navContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navLogoGroup: { display: "flex", alignItems: "center", gap: "10px" },
  navBadgeSquare: {
    width: "24px",
    height: "24px",
    color: "#000000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: "12px",
  },
  navBrandName: { fontSize: "20px", fontFamily: "serif", color: "#FFFFFF" },
  navVersionTag: { fontSize: "10px", padding: "2px 6px", border: "1px solid" },
  navRightGroup: { display: "flex", alignItems: "center" },
  telemetryTag: {
    fontSize: "11px",
    color: "#94A3B8",
    padding: "4px 10px",
    backgroundColor: "#12141C",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  statusDot: { width: "6px", height: "6px", borderRadius: "50%", display: "inline-block", marginRight: "6px" },
  heroSection: {
    padding: "96px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  heroContainer: { width: "100%" },
  heroMonoHeader: { fontSize: "12px", fontWeight: 700, marginBottom: "24px", letterSpacing: "1px" },
  heroTitle: { fontSize: "64px", fontFamily: "serif", fontWeight: 400, color: "#FFFFFF", lineHeight: "1.05", margin: "0 0 32px 0" },
  heroSubGrid: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: "24px",
    alignItems: "flex-end",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    paddingTop: "24px",
  },
  heroDescription: { fontSize: "16px", color: "#94A3B8", margin: 0, maxWidth: "700px", lineHeight: "1.6", fontFamily: "sans-serif" },
  heroCtaBtn: {
    color: "#000000",
    padding: "14px 28px",
    fontWeight: 700,
    fontSize: "12px",
    textDecoration: "none",
    display: "inline-block",
    cursor: "pointer",
  },
  catalogSection: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "64px 24px",
  },
  catalogHeaderBar: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "16px",
    marginBottom: "32px",
    borderBottom: "1px solid rgba(255,255,255,0.12)",
    paddingBottom: "24px",
  },
  badgeRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" },
  pillBadge: { fontSize: "11px", fontWeight: 700, textTransform: "uppercase", padding: "4px 8px", border: "1px solid" },
  fallbackWarning: { fontSize: "10px", color: "#FBBF24", backgroundColor: "rgba(251,191,36,0.1)", padding: "2px 8px", border: "1px solid rgba(251,191,36,0.2)" },
  catalogTitle: { fontSize: "36px", fontWeight: 400, fontFamily: "serif", margin: "4px 0", color: "#FFFFFF" },
  controlsRow: { display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" },
  searchInput: {
    backgroundColor: "#12141C",
    color: "#FFFFFF",
    border: "1px solid rgba(255,255,255,0.2)",
    padding: "8px 12px",
    fontSize: "12px",
    fontFamily: "monospace",
    outline: "none",
  },
  sortSelect: {
    backgroundColor: "#12141C",
    color: "#E2E8F0",
    border: "1px solid rgba(255,255,255,0.2)",
    padding: "8px 12px",
    fontSize: "12px",
    fontFamily: "monospace",
    outline: "none",
    cursor: "pointer",
  },
  regionBtn: {
    backgroundColor: "#12141C",
    color: "#94A3B8",
    border: "1px solid rgba(255,255,255,0.2)",
    padding: "8px 12px",
    fontSize: "11px",
    fontWeight: 700,
    fontFamily: "monospace",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "24px",
  },
  card: {
    backgroundColor: "#11131A",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    boxShadow: "4px 4px 0px 0px rgba(204, 255, 0, 0.08)",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "260px",
  },
  cardHeader: { display: "flex", justifyContent: "space-between", gap: "8px", marginBottom: "12px" },
  categoryTag: { fontSize: "10px", fontWeight: 700, textTransform: "uppercase", backgroundColor: "rgba(255,255,255,0.05)", padding: "2px 6px", border: "1px solid" },
  refundableTag: { fontSize: "10px", fontWeight: 700, color: "#34D399", backgroundColor: "rgba(52,211,153,0.1)", padding: "2px 6px", border: "1px solid rgba(52,211,153,0.2)" },
  courseTitle: { fontSize: "22px", fontFamily: "serif", fontWeight: 400, margin: "0 0 8px 0", color: "#FFFFFF" },
  courseDesc: { fontSize: "12px", color: "#94A3B8", lineHeight: "1.5", fontFamily: "sans-serif", margin: "0 0 16px 0", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  cardFooter: { borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  priceLabel: { fontSize: "9px", textTransform: "uppercase", color: "#64748B", display: "block" },
  priceValue: { fontSize: "18px", fontWeight: 700, color: "#FFFFFF" },
  enrollBtn: { color: "#000000", border: "none", padding: "8px 14px", fontSize: "11px", fontWeight: 700, fontFamily: "monospace", cursor: "pointer" },
  skeletonCard: { backgroundColor: "rgba(255,255,255,0.03)", height: "260px", border: "1px solid rgba(255,255,255,0.08)" },
  errorBox: { backgroundColor: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.3)", padding: "32px", textAlign: "center", maxWidth: "500px", margin: "32px auto" },
  errorHeading: { fontSize: "22px", fontFamily: "serif", color: "#FFFFFF", margin: "0 0 8px 0" },
  errorText: { fontSize: "12px", color: "#F87171", margin: "0 0 8px 0" },
  retryBtn: { color: "#000000", border: "none", padding: "10px 20px", fontWeight: 700, cursor: "pointer" },
  emptyBox: { textAlign: "center", padding: "48px 16px", border: "1px solid rgba(255,255,255,0.1)" },
  emptyHeading: { fontSize: "22px", fontFamily: "serif", color: "#FFFFFF" },
  emptyText: { fontSize: "12px", color: "#94A3B8" },
  footerSection: { borderTop: "1px solid rgba(255,255,255,0.1)", padding: "48px 24px", backgroundColor: "#0B0C10" },
  footerContainer: { maxWidth: "1200px", margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "24px" },
  footerLogoRow: { display: "flex", alignItems: "center", gap: "12px" },
  footerBrand: { fontSize: "18px", fontFamily: "serif", color: "#FFFFFF" },
  footerCopyright: { fontSize: "11px", color: "#64748B" },
  footerLinksRow: { display: "flex", gap: "24px" },
  footerLink: { fontSize: "11px", color: "#94A3B8", textDecoration: "none" },
}

export default SkillpathLandingPage
