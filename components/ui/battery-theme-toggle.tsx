'use client'

import { useTheme } from "next-themes"
import { Battery } from "lucide-react"
import { Button } from "./button"
import { useEffect, useState } from "react"

export function BatteryThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-9 h-9 relative group hover:bg-gray-100 dark:hover:bg-gray-800"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="relative">
        <Battery 
          className={`h-5 w-5 transition-all
            ${theme === 'dark' 
              ? 'text-yellow-400' 
              : 'text-blue-500'
            }`}
        />
        <div 
          className={`absolute inset-0 transition-all duration-300 ease-in-out
            ${theme === 'dark'
              ? 'bg-yellow-400 opacity-50'
              : 'bg-blue-500 opacity-50'
            } ${theme === 'dark' ? 'scale-x-100' : 'scale-x-25'}`}
          style={{
            transformOrigin: 'left',
            left: '1px',
            right: '2px',
            top: '2px',
            bottom: '2px',
            borderRadius: '1px'
          }}
        />
      </div>
      <span className="sr-only">
        {`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      </span>
    </Button>
  )
} 