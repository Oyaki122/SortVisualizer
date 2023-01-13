import { useState } from 'react'
import { quickSort } from './logic/quickSort'
import { selectionSort } from './logic/selectionSort'
import { createDownArray } from './logic/createArray'
import { Record } from './types/record'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AppBar from '@mui/material/AppBar'
import Typography from '@mui/material/Typography'
import { SortGraph } from './component/SortGraph'
// import './App.css'

const App = (): JSX.Element => {
  // const [count, setCount] = useState(0)
  const [quickRecord, setQuickRecord] = useState<Record[]>([])
  const [selectionRecord, setSelectionRecord] = useState<Record[]>([])
  const [counter, setCounter] = useState(0)

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
  // console.log(quickRecord.length, selectionRecord.length)
  return (
    <div style={{ height: '100%', display: 'flex', flexFlow: 'column' }}>
      <AppBar position='static'>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1, px: 2 }}>Sort Visualizer</Typography>
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
        <Box sx={{ width: '200px', borderLeft: 1 }}>
          <Button onClick={createSortRecord}>ソート</Button>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={() => { setCounter(counter - 1) }}>-1</Button>
            <p>{counter}</p>
            <Button onClick={() => { setCounter(counter + 1) }}>+1</Button>
          </Box>
        </Box>
      </Box>
    </div>
  )
}

export default App
