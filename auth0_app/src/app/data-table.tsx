"use client"
import * as React from "react"
import {
  ColumnDef,
  flexRender,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
  _getVisibleLeafColumns,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export interface SelectedRows{
    [key: number]: boolean
}
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterStrings: string[]
  filterColumns: string[]
  setRow: Function
  setSelectedRows: Function | null
}

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

export function DataTable<TData, TValue>({
  columns,
  data,
  filterStrings,
  filterColumns,
  setRow,
  setSelectedRows
}: DataTableProps<TData, TValue>) {
const [sorting, setSorting] = React.useState<SortingState>([])
const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })
  //console.log("in table", filterString)
  

 const tableHeaders = table.getAllColumns().filter(col=>col.id !=="select").map(col => col.id)
  return (
    <div>
        <div className="flex items-center py-4 space-x-3">
        {
            filterStrings && filterStrings.length? filterStrings.filter( cond => 
                tableHeaders.includes(cond)
                ).map(filter=>{
                return  (
                    <Input
                    placeholder={`Filter ${filter}`}
                    key={filter}
                    value={(table.getColumn(filter)?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn(filter)?.setFilterValue(event.target.value)
                    }
                    className="max-w-xs"
                    /> 
     
                )
            }):
            <></>
        }
            {
                filterColumns && filterColumns.length?
                (<DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                        Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                        .getAllColumns()
                        .filter(
                            (column) => filterColumns.includes(column.id) && column.id!=="select"
                        )
                        .map((column) => {
                            return (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) =>
                                column.toggleVisibility(!!value)
                                }
                            >
                                {column.id}
                            </DropdownMenuCheckboxItem>
                            )
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>)
                :
                <></>
            }
            
        </div>
        
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return header.id === "select" && setSelectedRows?
                (
                    <TableHead 
                    key={header.id} 
                    onClick={(event)=>
                    {
                        if (Object.keys(rowSelection).length === data.length){
                            setSelectedRows({})
                        }
                        else{
                            setSelectedRows(data)
                        }
                        
                    }}>
                    {header.isPlaceholder 
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
                :
                (
                  <TableHead key={header.id}>
                    {header.isPlaceholder 
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
                
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={(event)=>{
                    setRow(row.original)
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} 
                  className="text-left pl-8"
                  onClick={(event)=>
                    {
                    if (cell.getContext().column.id === "select" && setSelectedRows){
                        const rowId: number = Number(row.id)
                        const selectedRows: SelectedRows = {...table.getState().rowSelection}
                        if (rowId in selectedRows){
                            delete selectedRows[rowId]
                        }
                        else{
                            selectedRows[rowId] = true
                        }
                        const finalSelectedRows = Object.keys(selectedRows).map(index=> data[Number(index)])
                        setSelectedRows(finalSelectedRows)
                    }
                    }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-left">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      <div className="flex-1 text-sm text-muted-foreground">
    {
        setSelectedRows &&
        `${table.getFilteredSelectedRowModel().rows.length} of ${table.getFilteredRowModel().rows.length} row(s) selected. `
    } 
</div>

    </div>
  )
}
