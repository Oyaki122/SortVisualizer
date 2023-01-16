import { swap } from './commonLogic'
import { Record } from '../types/record'

export function insertSort (array: number[]): Record[] {
  const result: Record[] = []
  result.push({ array: [...array], manuPoint: [] })
  for (let i = 1; i < array.length; i++) {
    for (let j = i - 1; j >= 0; j--) {
      result.push({ array: [...array], manuPoint: [j, j + 1] })
      if (array[j] <= array[j + 1]) break
      swap(array, j, j + 1)
    }
  }
  return result
}
