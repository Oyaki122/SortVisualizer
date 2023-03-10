import { useState, useRef, useCallback, useEffect } from 'react'
import { quickSort } from './logic/quickSort'
import { selectionSort } from './logic/selectionSort'
import { insertSort } from './logic/insertSort'
import { createShuffleArray, createUpArray } from './logic/createArray'
import { Record } from './types/record'
import { SortGraph } from './component/SortGraph'

import Box from '@mui/material/Box'
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

const useAnimationFrame = (isRunning: boolean,
  callback: (now: number, prev: number) => void): void => {
  const reqIdRef = useRef<number>(0)
  const elapsedRef = useRef(0)
  useEffect(() => {
    elapsedRef.current = (isRunning) ? performance.now() : 0
  }, [isRunning])

  const loop: FrameRequestCallback = useCallback((now) => {
    if (isRunning) {
      callback(now, elapsedRef.current)
      reqIdRef.current = requestAnimationFrame(loop)
    }
  }, [isRunning, callback])

  useEffect(() => {
    reqIdRef.current = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(reqIdRef.current) }
  }, [loop])
}

const App = (): JSX.Element => {
  const [quickRecord, setQuickRecord] = useState<Record[]>([])
  const [n2Record, setN2Record] = useState<Record[]>([])
  const [counter, setCounter] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [arrayType, setArrayType] =
    useState<'up' | 'down' | 'shuffle'>('shuffle')
  const [n2SortType, setN2SortType] = useState<'selection' | 'insert'>('insert')

  const isRecordsGenerated = quickRecord[0]?.array?.length > 0 &&
    n2Record[0]?.array?.length > 0

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

    const record2 =
      (n2SortType === 'insert') ? insertSort(array2) : selectionSort(array2)
    setN2Record(record2)
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
    if (counterRef.current >= quickRecord.length &&
      counterRef.current >= n2Record.length) {
      setIsRunning(false)
      return
    }
    let nextCounter = Math.floor(
      (now - started.current) / 1000 * speed + initialCounterRef.current)
    if (nextCounter < 0) {
      nextCounter = 0
      initialCounterRef.current = 0
    }
    if (nextCounter > n2Record.length) {
      nextCounter = n2Record.length
    }
    setCounter(nextCounter)
  }
  , [speed, quickRecord, n2Record]))

  const handleBlur = (): void => {
    if (speed < 1) {
      setSpeed(1)
    } else if (speed > 2000) {
      setSpeed(2000)
    }
  }

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
              ?????????????????????
              {counter >= quickRecord.length && isRecordsGenerated
                ? ` ??????(${quickRecord.length})`
                : ''}
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
              {n2SortType === 'insert' ? '?????????' : '???????????????'}
              {counter >= n2Record.length && isRecordsGenerated
                ? ` ??????(${n2Record.length})`
                : ''}
            </Typography>
            <SortGraph record={(counter >= n2Record.length)
              ? {
                  ...n2Record[n2Record.length - 1],
                  manuPoint: []
                }
              : n2Record[counter]}
            />
          </Box>
        </Box>
        <Box sx={{ width: '200px', borderLeft: 1, p: '1rem' }}>
          <FormControl fullWidth sx={{ my: '0.4rem' }}>
            <InputLabel id='demo-simple-select-label'>??????????????????</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={arrayType}
              label='Age'
              onChange={(e) => {
                setQuickRecord([])
                setN2Record([])
                setArrayType(e.target.value as 'up' | 'down' | 'shuffle')
              }}
            >
              <MenuItem value='up'>??????</MenuItem>
              <MenuItem value='down'>??????</MenuItem>
              <MenuItem value='shuffle'>????????????</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ my: '0.4rem' }}>
            <InputLabel id='sortMethodLabel'>O(n<sup>2</sup>) ???????????????</InputLabel>
            <Select
              labelId='sortMethodLabel'
              value={n2SortType}
              onChange={(e) => {
                setQuickRecord([])
                setN2Record([])
                setN2SortType(e.target.value as 'selection' | 'insert')
              }}
            >
              <MenuItem value='selection'>?????????</MenuItem>
              <MenuItem value='insert'>?????????</MenuItem>
            </Select>
          </FormControl>
          <Button
            onClick={createSortRecord}
            variant='contained' fullWidth
          >
            ??????
          </Button>
          <hr />
          <Typography variant='subtitle1' component='div'>????????????</Typography>
          <Box
            sx={{
              display: 'flex', justifyContent: 'space-between', gap: '0.5rem'
            }}
          >
            <Button
              onClick={() => { setCounter(counter - 1) }}
              variant='outlined'
              disabled={!isRecordsGenerated || counter <= 0 || isRunning}
              size='small'
              sx={{ flexGrow: 1, minWidth: 'auto' }}
            >
              -
            </Button>
            <p>{counter}</p>
            <Button
              onClick={() => { setCounter(counter + 1) }}
              variant='outlined'
              disabled={!isRecordsGenerated || (
                counter >= quickRecord.length &&
                counter >= n2Record.length) ||
                isRunning}
              size='small'
              sx={{ flexGrow: 1, minWidth: 'auto' }}
            >
              +
            </Button>
          </Box>
          <Button
            onClick={() => { setCounter(0) }}
            variant='outlined' fullWidth
            disabled={!isRecordsGenerated || isRunning}
          >????????????
          </Button>
          <Box sx={{ my: '1rem' }}>
            <Typography variant='subtitle1' component='div'>????????????
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
