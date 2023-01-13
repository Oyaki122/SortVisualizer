import Box from '@mui/material/Box'

interface BarProps {
  height: number
  target: boolean
  color: string
}

export const Bar = ({ height, target, color }: BarProps): JSX.Element => {
  return (
    <Box sx={{ flexShrink: 1, width: '100%', height: `${height / 256 * 100}%`, backgroundColor: target ? 'red' : color }} />
  )
}
