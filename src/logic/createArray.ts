function shuffle (array: number[]): number[] {
  for (let i = array.length - 1; i >= 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    // 配列の数値を入れ替える
    [array[i], array[rand]] = [array[rand], array[i]]
  }
  return array
}

export function createShuffleArray (): number[] {
  const array = []
  for (let i = 1; i <= 512; i++) {
    array.push(i)
  }
  return shuffle(array)
}

export function createUpArray (): number[] {
  const array = []
  for (let i = 1; i <= 512; i++) {
    array.push(i)
  }
  return array
}
