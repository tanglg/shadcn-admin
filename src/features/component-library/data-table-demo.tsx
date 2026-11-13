import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import * as Table from '@/components/ui/table'
import {
  DataTableBulkActions,
  DataTableColumnHeader,
  DataTablePagination,
  DataTableToolbar,
} from '@/components/data-table'

const zones = [
  { label: '东校区', value: '东校区' },
  { label: '西校区', value: '西校区' },
]
const orders = ['小白菜', '胡萝卜', '番茄', '黄瓜', '生菜', '菠菜'].map(
  (name, index) => ({
    name,
    quantity: index + 1,
    zone: zones[index % zones.length].value,
  })
)

const columns: ColumnDef<(typeof orders)[number]>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        aria-label='选择当前页订单'
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(checked) =>
          table.toggleAllPageRowsSelected(checked === true)
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label={`选择${row.original.name}订单`}
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(checked === true)}
      />
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='商品' />
    ),
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='数量' />
    ),
  },
  {
    accessorKey: 'zone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='配送校区' />
    ),
    filterFn: (row, id, values: string[]) => values.includes(row.getValue(id)),
  },
]

export function DataTableDemo() {
  // TanStack Table manages the local demo state.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: orders,
    columns,
    initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className='grid gap-4'>
      <DataTableToolbar
        table={table}
        searchKey='name'
        searchPlaceholder='筛选商品…'
        filters={[{ columnId: 'zone', title: '配送校区', options: zones }]}
      />
      <div className='rounded-md border'>
        <Table.Table>
          <Table.TableHeader>
            {table.getHeaderGroups().map((group) => (
              <Table.TableRow key={group.id}>
                {group.headers.map((header) => (
                  <Table.TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </Table.TableHead>
                ))}
              </Table.TableRow>
            ))}
          </Table.TableHeader>
          <Table.TableBody>
            {table.getRowModel().rows.map((row) => (
              <Table.TableRow
                key={row.id}
                data-state={row.getIsSelected() ? 'selected' : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <Table.TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.TableCell>
                ))}
              </Table.TableRow>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <Table.TableRow>
                <Table.TableCell colSpan={table.getVisibleLeafColumns().length}>
                  没有匹配的订单。
                </Table.TableCell>
              </Table.TableRow>
            )}
          </Table.TableBody>
        </Table.Table>
      </div>
      <DataTablePagination table={table} />
      <DataTableBulkActions table={table} entityName='order'>
        <Button
          size='sm'
          onClick={() => {
            toast.success(
              `已确认 ${table.getFilteredSelectedRowModel().rows.length} 条演示订单`
            )
            table.resetRowSelection()
          }}
        >
          确认选择
        </Button>
      </DataTableBulkActions>
    </div>
  )
}
