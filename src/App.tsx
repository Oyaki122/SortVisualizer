import { useState, useRef, useCallback, useEffect } from 'react'
import { quickSort } from './logic/quickSort'
import { selectionSort } from './logic/selectionSort'
import { createDownArray } from './logic/createArray'
import { Record } from './types/record'
import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import AppBar from '@mui/material/AppBar'
import Typography from '@mui/material/Typography'
import Slider from '@mui/material/Slider'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { SortGraph } from './component/SortGraph'

// import './App.css'
const useAnimationFrame = (isRunning: boolean,
  callback: (now: number, prev: number) => void): void => {
  const reqIdRef = useRef<number>(0)
  const elapsedRef = useRef(0)
  useEffect(() => {
    elapsedRef.current = (isRunning) ? performance.now() : 0
  }, [isRunning])

  const loop: FrameRequestCallback = useCallback((now) => {
    if (isRunning) {
      // isRunning が true の時だけループ
      reqIdRef.current = requestAnimationFrame(loop)
      callback(now, elapsedRef.current)
    }
    // isRunning も依存配列に追加
  }, [isRunning, callback])

  useEffect(() => {
    reqIdRef.current = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(reqIdRef.current) }
  }, [loop])
}

const App = (): JSX.Element => {
  // const [count, setCount] = useState(0)
  const [quickRecord, setQuickRecord] = useState<Record[]>([])
  const [selectionRecord, setSelectionRecord] = useState<Record[]>([])
  const [counter, setCounter] = useState(0)
  const [speed, setSpeed] = useState(1)

  const isRecordsGenerated = quickRecord[0]?.array?.length > 0 &&
    selectionRecord[0]?.array?.length > 0

  const createSortRecord = (): void => {
    const array = createDownArray(256)
    const record = quickSort(array)
    setQuickRecord(record)
    console.log(record)

    const array2 = createDownArray(256)
    const record2 = selectionSort(array2)
    setSelectionRecord(record2)
    console.log(record2)
  }

  const counterRef = useRef(counter)
  counterRef.current = counter

  const [isRunning, setIsRunning] = useState(false)
  useAnimationFrame(isRunning, useCallback((now, started) => {
    if (counterRef.current >= quickRecord.length - 1 &&
      counterRef.current >= selectionRecord.length - 1) return
    setCounter(Math.floor((now - started) / 1000 * speed))
  }
  , [speed]))

  // console.log(quickRecord.length, selectionRecord.length)
  return (
    <div style={{ height: '100%', display: 'flex', flexFlow: 'column' }}>
      <AppBar position='static'>
        <Typography
          variant='h6'
          component='div'
          sx={{ flexGrow: 1, px: 2 }}
        >
          Sort Visualizer
        </Typography>
      </AppBar>
      <Box sx={{ display: 'flex', height: '100%' }}>
        <Box sx={{ p: 2, flexGrow: 4, display: 'flex' }}>
          <SortGraph record={(counter >= quickRecord.length)
            ? { ...quickRecord[quickRecord.length - 1], manuPoint: [] }
            : quickRecord[counter]}
          />
          <SortGraph record={(counter >= selectionRecord.length)
            ? { ...selectionRecord[selectionRecord.length - 1], manuPoint: [] }
            : selectionRecord[counter]}
          />
        </Box>
        <Box sx={{ width: '200px', borderLeft: 1, p: '1rem' }}>
          <Button
            onClick={createSortRecord}
            variant='contained' fullWidth
          >
            生成
          </Button>
          <hr />
          <Typography variant='subtitle1' component='div'>ステップ</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              onClick={() => { setCounter(counter - 1) }}
              variant='outlined'
              disabled={!isRecordsGenerated || counter <= 0}
            >
              -1
            </Button>
            <p>{counter}</p>
            <Button
              onClick={() => { setCounter(counter + 1) }}
              variant='outlined'
              disabled={!isRecordsGenerated || (
                counter >= quickRecord.length - 1 ||
                counter >= selectionRecord.length - 1
              )}
            >
              +1
            </Button>
          </Box>
          <Box sx={{ my: '1rem' }}>
            <Typography variant='subtitle1' component='div'>スピード
            </Typography>
            <Slider
              aria-label='Volume'
              value={speed}
              min={1}
              max={1000}
              valueLabelFormat={(value) => `${value}x`}
              valueLabelDisplay='auto'
              onChange={(_, value) => {
                if (typeof value === 'number') setSpeed(value)
              }}
            />
            <PlayArrowIcon onClick={() => { setIsRunning(!isRunning) }} />
          </Box>
        </Box>
      </Box>
    </div>
  )
}

export default App
