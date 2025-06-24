
import * as React from "react"
import { cn } from "@/lib/utils"

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  highlight?: string
  children: React.ReactNode
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = 1, highlight, children, ...props }, ref) => {
    const Component = `h${level}` as keyof JSX.IntrinsicElements

    const getSizeClass = (level: number) => {
      switch (level) {
        case 1:
          return "text-5xl md:text-6xl font-bold"
        case 2:
          return "text-4xl font-bold"
        case 3:
          return "text-2xl font-semibold"
        case 4:
          return "text-xl font-semibold"
        case 5:
          return "text-lg font-semibold"
        case 6:
          return "text-lg font-medium"
        default:
          return "text-2xl font-semibold"
      }
    }

    const renderContent = () => {
      if (highlight && typeof children === 'string') {
        const parts = children.split(highlight)
        if (parts.length === 2) {
          return (
            <>
              {parts[0]}<span className="text-primary">{highlight}</span>{parts[1]}
            </>
          )
        }
      }
      return children
    }

    return React.createElement(
      Component,
      {
        className: cn(
          getSizeClass(level),
          "text-text-primary leading-tight",
          className
        ),
        ref,
        ...props
      },
      renderContent()
    )
  }
)
Heading.displayName = "Heading"

export { Heading }
