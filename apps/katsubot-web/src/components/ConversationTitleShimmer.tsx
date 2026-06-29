type ConversationTitleShimmerProps = {
  className?: string
}

export function ConversationTitleShimmer({ className = '' }: ConversationTitleShimmerProps) {
  return (
    <span
      className={`conversation-title-shimmer block h-3.5 w-[88%] max-w-48 shrink-0 rounded-full ${className}`.trim()}
      aria-label="대화 제목 생성 중"
      aria-busy="true"
    />
  )
}
