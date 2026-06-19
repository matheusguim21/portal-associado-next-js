'use client'

import { useState } from 'react'
import { X, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NotificationBar() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div
      className="flex items-center gap-2 bg-muted px-4 py-2 text-sm text-primary-foreground shrink-0"
      role="alert"
    >
      <Info className="size-4 shrink-0" />
      <p className="flex-1">
        Bem-vindo ao novo Portal do Associado SOCINPRO. Em caso de dúvidas, entre em contato com a nossa equipe.
      </p>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => setVisible(false)}
        aria-label="Fechar notificação"
        className="shrink-0 hover:bg-black/10"
      >
        <X className="size-4" />
      </Button>
    </div>
  )
}
