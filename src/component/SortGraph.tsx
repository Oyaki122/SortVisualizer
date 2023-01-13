import { Record } from '../types/record'
import Box from '@mui/material/Box'
import { Bar } from './Bar'

interface SortGraphProps {
  record?: Record
}

export const SortGraph = ({ record }: SortGraphProps): JSX.Element => {
  // console.log(record)
  return (
    <Box sx={{ width: '100%', flexShrink: 1, display: 'flex', justifyContent: 'start', mx: '5px', alignItems: 'end' }}>
      {/* <p>{JSON.stringify(record)}</p> */}
      {record?.array?.map((value, index) => {
        return (
          <Bar key={index} height={value} target={record?.manuPoint.includes(index)} color='blue' />
        )
      })}
    </Box>
  )
}
