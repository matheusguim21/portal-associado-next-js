"use client"

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react"
import { useInView, useMotionValue, useSpring } from "motion/react"

import { cn } from "@/lib/utils"

interface NumberTickerProps extends Omit<ComponentPropsWithoutRef<"span">, "x" | "y"> {
  value: number
  startValue?: number
  direction?: "up" | "down"
  delay?: number
  /** Duração da contagem em segundos. Menor = mais rápido. */
  duration?: number
  /** Oscilação ao final (0 = sem bounce). */
  bounce?: number
  decimalPlaces?: number
  locale?: string
  currency?: string
  as?: "span" | "tspan"
  x?: number | string
  y?: number | string
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  duration = 0.4,
  bounce = 0,
  className,
  decimalPlaces = 0,
  locale = "en-US",
  currency,
  as = "span",
  x,
  y,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement | SVGTSpanElement>(null)
  const motionValue = useMotionValue(direction === "down" ? value : startValue)
  const springValue = useSpring(motionValue, {
    visualDuration: duration,
    bounce,
  })
  const isInView = useInView(ref, { once: true, margin: "0px" })

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null

    if (isInView) {
      timer = setTimeout(() => {
        motionValue.set(direction === "down" ? startValue : value)
      }, delay * 1000)
    }

    return () => {
      if (timer !== null) {
        clearTimeout(timer)
      }
    }
  }, [motionValue, isInView, delay, value, direction, startValue])

  const formatValue = (amount: number) =>
    Intl.NumberFormat(locale, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
      ...(currency ? { style: "currency", currency } : {}),
    }).format(Number(amount.toFixed(decimalPlaces)))

  useEffect(() => {
    const updateText = (latest: number) => {
      if (ref.current) {
        ref.current.textContent = formatValue(latest)
      }
    }

    updateText(springValue.get())

    return springValue.on("change", updateText)
  }, [springValue, decimalPlaces, locale, currency])

  const initialValue = formatValue(direction === "down" ? value : startValue)

  if (as === "tspan") {
    return (
      <tspan
        ref={ref}
        x={x}
        y={y}
        className={cn("tabular-nums", className)}
        {...props}
      >
        {initialValue}
      </tspan>
    )
  }

  return (
    <span
      ref={ref}
      className={cn(
        "inline-block tracking-wider text-black tabular-nums dark:text-white",
        className
      )}
      {...props}
    >
      {initialValue}
    </span>
  )
}
