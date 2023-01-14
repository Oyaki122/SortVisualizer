import { Record } from '../types/record'
import Box from '@mui/material/Box'
// import { Bar } from './Bar'

interface BarProps {
  height: number
  target: boolean
  color: string
}

export const Bar = ({ height, target, color }: BarProps): JSX.Element => {
  return (
    <Box
      sx={{
        flexShrink: 1,
        width: '100%'
        // height: `${height / 256 * 100}%`,
      }}
      style={{
        height: `${height / 256 * 100}%`,
        backgroundColor: target ? 'hsl(300, 100%, 50%)' : color
      }}
    />
  )
}

interface SortGraphProps {
  record?: Record
}

export const SortGraph = ({ record }: SortGraphProps): JSX.Element => {
  // console.log(record)
  return (
    <Box sx={{
      width: '100%',
      flexShrink: 1,
      display: 'flex',
      justifyContent: 'start',
      mx: '5px',
      alignItems: 'end',
      height: '100%'
    }}
    >
      {/* <p>{JSON.stringify(record)}</p> */}
      {record?.array?.map((value, index) => {
        return (
          <Bar
            key={index}
            height={value}
            target={record?.manuPoint.includes(index)}
            color={`hsl(${value / 256 * 270}, 90%, 40%)`}
          />
        )
      })}
    </Box>
  )
}
