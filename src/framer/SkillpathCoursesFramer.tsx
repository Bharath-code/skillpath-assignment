import React, { useState, useEffect, useMemo, useCallback } from "react"
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

interface SkillpathCoursesProps {
  accentColor?: string
  showRefundableBadge?: boolean
}

const API_BASE = "https://syncsphere-hiv6.onrender.com"

async function extractApiErrorDetail(res: Response): Promise<string> {
  try {
    const json = await res.json()
    if (json && typeof json.detail === "string") return json.detail
    if (json && typeof json.message === "string") return json.message
  } catch {
    // Response was not JSON
  }
  return `HTTP ${res.status}`
}

export function SkillpathCourses(props: SkillpathCoursesProps) {
  const { accentColor = "#CCFF00", showRefundableBadge = true } = props

  const [courses, setCourses] = useState<Course[]>([])
  const [countryCode, setCountryCode] = useState<"IN" | "US">("IN")
  const [countryFetchFailed, setCountryFetchFailed] = useState<boolean>(false)
  const [countryErrorDetail, setCountryErrorDetail] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [errorDetail, setErrorDetail] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default")

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    setErrorDetail(null)
    setCountryFetchFailed(false)
    setCountryErrorDetail(null)

    try {
      const [coursesRes, countryRes] = await Promise.allSettled([
        fetch(`${API_BASE}/assignment/course-data`, { method: "GET" }),
        fetch(`${API_BASE}/assignment/country-code`, { method: "GET" }),
      ])

      // 1. Course Data
      if (coursesRes.status === "fulfilled") {
        const res = coursesRes.value
        if (!res.ok) {
          const detail = await extractApiErrorDetail(res)
          setError(`Course service error (${res.status})`)
          setErrorDetail(detail)
          setLoading(false)
          return
        }
        const data: Course[] = await res.json()
        setCourses(Array.isArray(data) ? data : [])
      } else {
        setError("Failed to reach course API")
        setErrorDetail(coursesRes.reason?.message || "Network error")
        setLoading(false)
        return
      }

      // 2. Country Code (Isolated Error Recovery)
      if (countryRes.status === "fulfilled") {
        const res = countryRes.value
        if (res.ok) {
          try {
            const countryData = await res.json()
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
          // Country endpoint returned 404/500 like {"detail": "FAAAAAAAAAAA"}
          const detail = await extractApiErrorDetail(res)
          setCountryCode("IN")
          setCountryFetchFailed(true)
          setCountryErrorDetail(`HTTP ${res.status}: ${detail}`)
        }
      } else {
        setCountryCode("IN")
        setCountryFetchFailed(true)
      }
    } catch (err: any) {
      setError("An unexpected client error occurred")
      setErrorDetail(err.message)
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
    <div style={styles.container}>
      {/* Header bar */}
      <div style={styles.headerBar}>
        <div>
          <div style={styles.badgeRow}>
            <span style={{ ...styles.pillBadge, borderColor: `${accentColor}50`, color: accentColor, backgroundColor: `${accentColor}15` }}>
              [ 02 // INDEX ]
            </span>
            {countryFetchFailed && (
              <span style={styles.fallbackWarning} title={countryErrorDetail || undefined}>
                COUNTRY_OFFLINE ({countryErrorDetail || "DEFAULT_INR"})
              </span>
            )}
          </div>
          <h2 style={styles.title}>
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
          {errorDetail && (
            <div style={styles.detailBox}>
              <span style={{ display: "block", fontSize: "9px", color: "#94A3B8" }}>API RESPONSE:</span>
              <code>{errorDetail}</code>
            </div>
          )}
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
    </div>
  )
}

if (typeof addPropertyControls !== "undefined") {
  addPropertyControls(SkillpathCourses, {
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
  container: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px 16px",
    fontFamily: "'Space Mono', monospace, sans-serif",
    color: "#F4F4F0",
  },
  headerBar: {
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
  pillBadge: {
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    padding: "4px 8px",
    border: "1px solid",
  },
  fallbackWarning: {
    fontSize: "10px",
    color: "#FBBF24",
    backgroundColor: "rgba(251,191,36,0.1)",
    padding: "2px 8px",
    border: "1px solid rgba(251,191,36,0.2)",
  },
  title: { fontSize: "36px", fontWeight: 400, fontFamily: "serif", margin: "4px 0", color: "#FFFFFF" },
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
  categoryTag: {
    fontSize: "10px",
    fontWeight: 700,
    textTransform: "uppercase",
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: "2px 6px",
    border: "1px solid",
  },
  refundableTag: {
    fontSize: "10px",
    fontWeight: 700,
    color: "#34D399",
    backgroundColor: "rgba(52,211,153,0.1)",
    padding: "2px 6px",
    border: "1px solid rgba(52,211,153,0.2)",
  },
  courseTitle: { fontSize: "22px", fontFamily: "serif", fontWeight: 400, margin: "0 0 8px 0", color: "#FFFFFF" },
  courseDesc: {
    fontSize: "12px",
    color: "#94A3B8",
    lineHeight: "1.5",
    fontFamily: "sans-serif",
    margin: "0 0 16px 0",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  cardFooter: {
    borderTop: "1px solid rgba(255,255,255,0.1)",
    paddingTop: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: { fontSize: "9px", textTransform: "uppercase", color: "#64748B", display: "block" },
  priceValue: { fontSize: "18px", fontWeight: 700, color: "#FFFFFF" },
  enrollBtn: {
    color: "#000000",
    border: "none",
    padding: "8px 14px",
    fontSize: "11px",
    fontWeight: 700,
    fontFamily: "monospace",
    cursor: "pointer",
  },
  skeletonCard: {
    backgroundColor: "rgba(255,255,255,0.03)",
    height: "260px",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  errorBox: {
    backgroundColor: "rgba(239,68,68,0.05)",
    border: "1px solid rgba(239,68,68,0.3)",
    padding: "32px",
    textAlign: "center",
    maxWidth: "500px",
    margin: "32px auto",
  },
  errorHeading: { fontSize: "22px", fontFamily: "serif", color: "#FFFFFF", margin: "0 0 8px 0" },
  errorText: { fontSize: "12px", color: "#F87171", margin: "0 0 8px 0" },
  detailBox: {
    backgroundColor: "#08090C",
    border: "1px solid rgba(239,68,68,0.2)",
    padding: "10px",
    fontSize: "11px",
    color: "#FF8888",
    marginBottom: "16px",
    textAlign: "left",
  },
  retryBtn: { color: "#000000", border: "none", padding: "10px 20px", fontWeight: 700, cursor: "pointer" },
  emptyBox: { textAlign: "center", padding: "48px 16px", border: "1px solid rgba(255,255,255,0.1)" },
  emptyHeading: { fontSize: "22px", fontFamily: "serif", color: "#FFFFFF" },
  emptyText: { fontSize: "12px", color: "#94A3B8" },
}

export default SkillpathCourses
