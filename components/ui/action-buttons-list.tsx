'use client'

import Link from 'next/link'
import type { ReactElement } from 'react'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { ActionConfig, DisabledContext } from '@/lib/create-actions-config'

export interface ActionButtonsListProps<A extends string, I> {
  actionsConfig: Record<A, ActionConfig<I>>
  actionsToShow?: A[]
  onAction: (action: A, item: I) => void
  item: I
  disabledContext?: DisabledContext
  shouldUseTwoRows?: boolean
  loading?: boolean
  loadingByAction?: Partial<Record<A, boolean>>
}

function ActionButton<A extends string, I>({
  actionKey,
  config,
  item,
  disabled,
  loading,
  onAction,
}: {
  actionKey: A
  config: ActionConfig<I>
  item: I
  disabled: boolean
  loading: boolean
  onAction: (action: A, item: I) => void
}) {
  const { Icon, tooltip, getHref } = config
  const href = getHref?.(item)

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          href ? (
            <Button
              type="button"
              size="icon"
              disabled={disabled}
              loading={loading}
              render={<Link href={href} />}
            >
              <Icon />
            </Button>
          ) : (
            <Button
              type="button"
              size="icon"
              disabled={disabled}
              loading={loading}
              onClick={() => onAction(actionKey, item)}
            >
              <Icon />
            </Button>
          )
        }
      />
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  )
}

export function ActionButtonsList<A extends string, I>({
  actionsConfig,
  actionsToShow,
  onAction,
  item,
  disabledContext,
  shouldUseTwoRows = false,
  loading = false,
  loadingByAction,
}: ActionButtonsListProps<A, I>): ReactElement {
  const getButtonLoading = (actionKey: A) => loadingByAction?.[actionKey] ?? loading
  const keysToRender = actionsToShow ?? (Object.keys(actionsConfig) as A[])

  const renderButton = (actionKey: A) => {
    const config = actionsConfig[actionKey]
    const disabled = config.isDisabled(disabledContext)

    return (
      <ActionButton
        key={actionKey}
        actionKey={actionKey}
        config={config}
        item={item}
        disabled={disabled}
        loading={getButtonLoading(actionKey)}
        onAction={onAction}
      />
    )
  }

  if (shouldUseTwoRows) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">{keysToRender.slice(0, 4).map(renderButton)}</div>
        {keysToRender.slice(4).length > 0 ? (
          <div className="flex gap-2">{keysToRender.slice(4).map(renderButton)}</div>
        ) : null}
      </div>
    )
  }

  return <div className="flex gap-2">{keysToRender.map(renderButton)}</div>
}
