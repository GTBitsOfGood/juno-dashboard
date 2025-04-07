import { Skeleton } from "../ui/skeleton"
import { TableCell, TableRow } from "../ui/table"

export interface SkeletonRowsProps {
  numRows: number,
  numCells: number
}

const SkeletonRows = ({ numRows, numCells }: SkeletonRowsProps) => {
  return (
    [...Array(numRows)].map((_, i) => <TableRow key={i}>
      {[...Array(numCells)].map((_, j) => <TableCell key={j}>
        <Skeleton key={j} className="mr-3 h-6" />
      </TableCell>)
      }
    </TableRow>)
  )
}

export default SkeletonRows;
