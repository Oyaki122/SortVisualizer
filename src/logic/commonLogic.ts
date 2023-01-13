export function swap (array: number[], i: number, j: number): void {
  const temp = array[i]
  array[i] = array[j]
  array[j] = temp
}
