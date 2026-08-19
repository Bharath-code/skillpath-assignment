import { useState, useEffect, useMemo, useCallback } from "react"

export interface Course {
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

export type CountryCode = "IN" | "US"

export type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string; apiDetail?: string; statusCode?: number }
  | { status: "success"; data: Course[] }

const API_BASE = "https://syncsphere-hiv6.onrender.com"

export interface SkillpathCoursesProps {
  accentColor?: string
  showRefundableBadge?: boolean
}

async function extractApiErrorDetail(res: Response): Promise<string> {
  try {
    const json = await res.json()
    if (json && typeof json.detail === "string") return json.detail
    if (json && typeof json.message === "string") return json.message
  } catch {
    // Non-JSON fallback
  }
  return `HTTP ${res.status}`
}

/**
 * Custom Hook extracting catalog state, fetching logic, and error boundaries
 * Following React Patterns: Custom Hook Extraction & Derived State
 */
export function useCourseCatalog() {
  const [fetchState, setFetchState] = useState<FetchState>({ status: "loading" })
  const [countryCode, setCountryCode] = useState<CountryCode>("IN")
  const [countryFetchFailed, setCountryFetchFailed] = useState<boolean>(false)
  const [countryErrorDetail, setCountryErrorDetail] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default")

  const refetch = useCallback(async (signal?: AbortSignal) => {
    setFetchState({ status: "loading" })
    setCountryFetchFailed(false)
    setCountryErrorDetail(null)

    try {
      const [coursesRes, countryRes] = await Promise.allSettled([
        fetch(`${API_BASE}/assignment/course-data`, { method: "GET", signal }),
        fetch(`${API_BASE}/assignment/country-code`, { method: "GET", signal }),
      ])

      // 1. Process Course Data Endpoint
      if (coursesRes.status === "fulfilled") {
        const res = coursesRes.value
        if (!res.ok) {
          const detail = await extractApiErrorDetail(res)
          setFetchState({
            status: "error",
            message: `Course service failed with status ${res.status}.`,
            apiDetail: detail,
            statusCode: res.status,
          })
          return
        }
        const data: Course[] = await res.json()
        setFetchState({ status: "success", data: Array.isArray(data) ? data : [] })
      } else {
        if (coursesRes.reason?.name === "AbortError") return
        setFetchState({
          status: "error",
          message: "Unable to reach course service endpoint.",
          apiDetail: coursesRes.reason?.message || "Network connection failed",
        })
        return
      }

      // 2. Process Country Code Endpoint (Isolated Fallback)
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
          const detail = await extractApiErrorDetail(res)
          setCountryCode("IN")
          setCountryFetchFailed(true)
          setCountryErrorDetail(`HTTP ${res.status}: "${detail}"`)
        }
      } else {
        setCountryCode("IN")
        setCountryFetchFailed(true)
      }
    } catch (err: any) {
      if (err.name === "AbortError") return
      setFetchState({
        status: "error",
        message: "An unexpected client error occurred.",
        apiDetail: err.message,
      })
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    refetch(controller.signal)
    return () => controller.abort()
  }, [refetch])

  // Price Formatter
  const formatPrice = useCallback((course: Course, country: CountryCode) => {
    if (country === "IN") {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(course.pricePaise / 100)
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(course.priceUsdCents / 100)
  }, [])

  // Derived filtered & sorted course list (No state duplication / useEffect)
  const processedCourses = useMemo(() => {
    if (fetchState.status !== "success") return []
    let result = [...fetchState.data]

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
      result.sort((a, b) =>
        countryCode === "IN" ? a.pricePaise - b.pricePaise : a.priceUsdCents - b.priceUsdCents
      )
    } else if (sortBy === "price-desc") {
      result.sort((a, b) =>
        countryCode === "IN" ? b.pricePaise - a.pricePaise : b.priceUsdCents - a.priceUsdCents
      )
    }

    return result
  }, [fetchState, searchQuery, sortBy, countryCode])

  const toggleCountryCode = useCallback(() => {
    setCountryCode(c => (c === "IN" ? "US" : "IN"))
  }, [])

  return {
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
  }
}
