export type StreamTextOptions = {
  charDelayMs?: number
  signal?: AbortSignal
}

/** SSE delta처럼 문자열을 한 글자씩 공개한다. */
export function streamTextReveal(
  fullText: string,
  onPartial: (partial: string) => void,
  options?: StreamTextOptions,
): Promise<void> {
  const delay = options?.charDelayMs ?? 32
  const signal = options?.signal

  return new Promise((resolve) => {
    if (signal?.aborted) {
      resolve()
      return
    }
    if (!fullText) {
      onPartial('')
      resolve()
      return
    }

    let index = 0
    const step = () => {
      if (signal?.aborted) {
        resolve()
        return
      }
      index += 1
      onPartial(fullText.slice(0, index))
      if (index >= fullText.length) {
        resolve()
        return
      }
      setTimeout(step, delay)
    }

    onPartial('')
    setTimeout(step, delay)
  })
}
