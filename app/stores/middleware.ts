import { createMMKV } from 'react-native-mmkv'
import { StateStorage } from 'zustand/middleware'

const storage = createMMKV()

export const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value)
  },
  getItem: (name) => {
    const value = storage.getString(name)
    return value ?? null
  },
  removeItem: (name) => {
    return storage.remove(name)
  },
}