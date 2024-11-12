'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { AppStore, store } from '@/lib/store'

export default function StoreProvider({
  children
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore>()
  if (!storeRef.current) {
    storeRef.current = store // Assign the store object directly
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}