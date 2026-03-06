import { createContext, RefObject, useContext } from "react"

export const handleDebounce = (
  action: () => unknown,
  time: number | undefined,
  lastTimeRef: RefObject<number>,
) => {
  const now = Date.now()
  if (time && now - lastTimeRef.current < time * 1000) {
    return console.debug("debounce")
  } else {
    lastTimeRef.current = now
    action()
  }
}

export const DebounceContext = createContext((action: () => unknown) => {
  console.log("Debounce context not initialised")
})

export const useDebounce = () => useContext(DebounceContext)
