import { swap } from './commonLogic'
import { Record } from '../types/record'

export function selectionSort (array: number[]): Record[] {
  const result: Record[] = []
  result.push({ array: [...array], manuPoint: [] })
  for (let i = 0; i < array.length - 1; i++) {
    let min = i
    for (let j = i + 1; j < array.length; j++) {
      if (array[j] < array[min]) {
        min = j
      }
      result.push({ array: [...array], manuPoint: [i, j] })
    }
    if (i !== min) {
      swap(array, i, min)
      result.push({ array: [...array], manuPoint: [i, min] })
    }
  }
  return result
}
