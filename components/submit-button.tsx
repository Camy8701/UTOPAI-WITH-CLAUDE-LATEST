"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"

type SubmitButtonProps = {
  className?: string
}

export default function SubmitButton({ className = "" }: SubmitButtonProps) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(loggedInStatus)
  }, [])

  const handleClick = () => {
    if (!isLoggedIn) {
      router.push("/login")
    } else {
      router.push("/submit")
    }
  }

  if (!mounted) {
    return (
      <Link
        href="/login"
        className={`border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-md text-sm transition-all duration-300 hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:hover:text-black hover:border-black dark:hover:border-white ${className}`}
      >
        Submit AI Story
      </Link>
    )
  }

  return (
    <button
      onClick={handleClick}
      className={`border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-md text-sm transition-all duration-300 hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:hover:text-black hover:border-black dark:hover:border-white ${className}`}
    >
      Submit AI Story
    </button>
  )
}
