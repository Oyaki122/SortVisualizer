import { useState, useRef, useCallback, useEffect } from 'react'
import { quickSort } from './logic/quickSort'
import { selectionSort } from './logic/selectionSort'
import { createShuffleArray, createUpArray } from './logic/createArray'
import { Record } from './types/record'
import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import AppBar from '@mui/material/AppBar'
import Typography from '@mui/material/Typography'
import Slider from '@mui/material/Slider'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import Input from '@mui/material/Input'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { SortGraph } from './component/SortGraph'

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
  const [arrayType, setArrayType] =
    useState<'up' | 'down' | 'shuffle'>('shuffle')

  const isRecordsGenerated = quickRecord[0]?.array?.length > 0 &&
    selectionRecord[0]?.array?.length > 0

  const createSortRecord = (): void => {
    setCounter(0)
    let array: number[]
    if (arrayType === 'up') {
      array = createUpArray()
    } else if (arrayType === 'down') {
      array = createUpArray().reverse()
    } else {
      array = createShuffleArray()
    }
    const array2 = [...array]

    const record = quickSort(array)
    setQuickRecord(record)
    console.log(record)

    const record2 = selectionSort(array2)
    setSelectionRecord(record2)
    console.log(record2)
  }

  const counterRef = useRef(counter)
  const initialCounterRef = useRef(0)
  const [isRunning, setIsRunning] = useState(false)
  const started = useRef(0)

  counterRef.current = counter

  useEffect(() => {
    started.current = performance.now()
    initialCounterRef.current = counter
    counterRef.current = counter
  }, [isRunning, speed])

  useAnimationFrame(isRunning, useCallback((now, _) => {
    if (counterRef.current >= quickRecord.length - 1 &&
      counterRef.current >= selectionRecord.length - 1) {
      setIsRunning(false)
      return
    }
    let nextCounter = Math.floor(
      (now - started.current) / 1000 * speed + initialCounterRef.current)
    if (nextCounter < 0) {
      nextCounter = 0
      initialCounterRef.current = 0
    }
    setCounter(nextCounter)
  }
  , [speed, quickRecord, selectionRecord]))

  const handleBlur = (): void => {
    if (speed < 1) {
      setSpeed(1)
    } else if (speed > 5000) {
      setSpeed(5000)
    }
  }

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
          <Box sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
          >
            <Typography
              variant='h6' component='div' sx={{ textAlign: 'center' }}
            >
              クイックソート
            </Typography>
            <SortGraph record={(counter >= quickRecord.length)
              ? { ...quickRecord[quickRecord.length - 1], manuPoint: [] }
              : quickRecord[counter]}
            />
          </Box>

          <Box sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
          >
            <Typography
              variant='h6' component='div' sx={{ textAlign: 'center' }}
            >
              選択ソート
            </Typography>
            <SortGraph record={(counter >= selectionRecord.length)
              ? {
                  ...selectionRecord[selectionRecord.length - 1],
                  manuPoint: []
                }
              : selectionRecord[counter]}
            />
          </Box>
        </Box>
        <Box sx={{ width: '200px', borderLeft: 1, p: '1rem' }}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Age</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={arrayType}
              label='Age'
              onChange={(e) => {
                setArrayType(e.target.value as 'up' | 'down' | 'shuffle')
              }}
            >
              <MenuItem value='up'>昇順</MenuItem>
              <MenuItem value='down'>降順</MenuItem>
              <MenuItem value='shuffle'>ランダム</MenuItem>
            </Select>
          </FormControl>
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
              disabled={!isRecordsGenerated || counter <= 0 || isRunning}
            >
              -1
            </Button>
            <p>{counter}</p>
            <Button
              onClick={() => { setCounter(counter + 1) }}
              variant='outlined'
              disabled={!isRecordsGenerated || (
                counter >= quickRecord.length - 1 &&
                counter >= selectionRecord.length - 1) ||
                isRunning}
            >
              +1
            </Button>
          </Box>
          <Button
            onClick={() => { setCounter(0) }}
            variant='outlined' fullWidth
            disabled={!isRecordsGenerated || isRunning}
          >リセット
          </Button>
          <Box sx={{ my: '1rem' }}>
            <Typography variant='subtitle1' component='div'>スピード
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Slider
                aria-label='Volume'
                value={speed}
                min={1}
                max={2000}
                valueLabelFormat={(value) => `${value}x`}
                valueLabelDisplay='auto'
                onChange={(_, value) => {
                  if (typeof value === 'number') setSpeed(value)
                }}
              />
              <Input
                value={speed}
                size='small'
                onChange={e => { setSpeed(Number(e.target.value)) }}
                onBlur={handleBlur}
                inputProps={{
                  step: 10,
                  min: 0,
                  max: 2000,
                  type: 'number',
                  'aria-labelledby': 'input-slider'
                }}
              />
            </Box>

            <Box>
              {!isRunning
                ? <PlayArrowIcon onClick={() => { setIsRunning(!isRunning) }} />
                : <PauseIcon onClick={() => { setIsRunning(!isRunning) }} />}
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  )
}

export default App
