"use client"

import { CalendarIcon } from "lucide-react"
import { useEffect, useState } from "react"
import type { DropdownNavProps, DropdownProps } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  formatDateToIso,
  formatIsoToDisplay,
  parseDisplayToIso,
  parseIsoToDate,
} from "@/lib/date-utils"
import { formatMaskedValue, normalizeMaskedValue } from "@/lib/masks"
import { cn } from "@/lib/utils"

type DatePickerProps = {
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  placeholder?: string
  id?: string
  className?: string
}

function handleCalendarChange(
  _value: string | number,
  _e: React.ChangeEventHandler<HTMLSelectElement>,
) {
  const _event = {
    target: {
      value: String(_value),
    },
  } as React.ChangeEvent<HTMLSelectElement>
  _e(_event)
}

function DatePicker({
  value = "",
  onChange,
  disabled,
  placeholder = "dd/mm/aaaa",
  id,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(() => formatIsoToDisplay(value))

  useEffect(() => {
    setInputValue(formatIsoToDisplay(value))
  }, [value])

  const selectedDate = parseIsoToDate(value)
  const calendarMonth = selectedDate ?? new Date()

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const normalized = normalizeMaskedValue("date", e.target.value)
    setInputValue(formatMaskedValue("date", normalized))
  }

  function handleInputBlur() {
    const trimmed = inputValue.trim()
    if (!trimmed) {
      onChange?.("")
      setInputValue("")
      return
    }

    const iso = parseDisplayToIso(trimmed)
    if (iso) {
      onChange?.(iso)
      setInputValue(formatIsoToDisplay(iso))
      return
    }

    setInputValue(formatIsoToDisplay(value))
  }

  function handleCalendarSelect(date: Date | undefined) {
    if (!date) return
    const iso = formatDateToIso(date)
    onChange?.(iso)
    setInputValue(formatIsoToDisplay(iso))
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className={cn("relative", className)}>
        <Input
          id={id}
          type="text"
          inputMode="numeric"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={10}
          className="pr-9"
        />
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={disabled}
            className="absolute top-0 right-0 size-8 hover:bg-transparent"
            aria-label="Abrir calendário"
          >
            <CalendarIcon className="size-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          captionLayout="dropdown"
          className="rounded-md border-0 p-2"
          classNames={{
            month_caption: "mx-0",
          }}
          components={{
            Dropdown: (props: DropdownProps) => {
              return (
                <Select
                  onValueChange={(nextValue) => {
                    if (props.onChange && nextValue != null) {
                      handleCalendarChange(nextValue, props.onChange)
                    }
                  }}
                  value={String(props.value)}
                >
                  <SelectTrigger className="h-8 w-fit font-medium first:grow">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[min(26rem,var(--radix-select-content-available-height))]">
                    {props.options?.map((option) => (
                      <SelectItem
                        disabled={option.disabled}
                        key={option.value}
                        value={String(option.value)}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )
            },
            DropdownNav: (props: DropdownNavProps) => {
              return (
                <div className="flex w-full items-center gap-2">
                  {props.children}
                </div>
              )
            },
          }}
          defaultMonth={calendarMonth}
          hideNavigation
          mode="single"
          onSelect={handleCalendarSelect}
          selected={selectedDate}
          startMonth={new Date(1980, 0)}
        />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
