import { Record } from '../types/record'

interface BarProps {
  height: number
  target: boolean
  color: string
}

export const Bar = ({ height, target, color }: BarProps): JSX.Element => {
  return (
    <div
      style={{
        height: `${height / 512 * 100}%`,
        backgroundColor: target ? 'hsl(300, 100%, 50%)' : color,
        flexShrink: 1,
        width: '100%'
      }}
    />
  )
}

interface SortGraphProps {
  record?: Record
}

export const SortGraph = ({ record }: SortGraphProps): JSX.Element => {
  return (
    <div style={{
      width: '100%',
      flexShrink: 1,
      display: 'flex',
      justifyContent: 'start',
      margin: '0 5px',
      alignItems: 'end',
      height: '100%'
    }}
    >
      {record?.array?.map((value, index) => {
        return (
          <Bar
            key={index}
            height={value}
            target={record?.manuPoint.includes(index)}
            color={`hsl(${value / 512 * 270}, 90%, 40%)`}
          />
        )
      })}
    </div>
  )
}
