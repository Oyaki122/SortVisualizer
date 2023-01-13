import { Record } from '../types/record'
import { swap } from './commonLogic'

export function quickSort (array: number[]): Record[] {
  const result: Record[] = []
  result.push({ array: [...array], manuPoint: [] })
  function quickSortInner (array: number[], start: number, end: number): void {
    if (start >= end) {
      return
    }
    let i = start
    let j = end
    const pivot = array[Math.floor((end + start) / 2)]
    while (i <= j) {
      while (array[i] < pivot) {
        result.push({ array: [...array], manuPoint: [i, j] })
        i++
      }
      while (array[j] > pivot) {
        result.push({ array: [...array], manuPoint: [i, j] })
        j--
      }
      if (i <= j) {
        swap(array, i, j)
        result.push({ array: [...array], manuPoint: [i, j] })
        i++
        j--
      }
    }

    quickSortInner(array, start, j)
    quickSortInner(array, i, end)
  }
  quickSortInner(array, 0, array.length - 1)
  return result
}
