import { useEffect } from "react"

export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title

    const setMeta = (selector: string, value: string) => {
      document.querySelector(selector)?.setAttribute("content", value)
    }

    setMeta('meta[name="description"]', description)
    setMeta('meta[property="og:title"]', title)
    setMeta('meta[property="og:description"]', description)
    setMeta('meta[name="twitter:title"]', title)
    setMeta('meta[name="twitter:description"]', description)

    const path = window.location.pathname === "/" ? "" : window.location.pathname
    const canonical = `https://cotap.id${path}`
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", canonical)
    setMeta('meta[property="og:url"]', canonical)
  }, [title, description])
}
