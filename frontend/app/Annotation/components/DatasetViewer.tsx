import React, { useState } from "react"
import { DataModel } from "@/lib/interfaces/DataModelInterfaces"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

interface DatasetViewerProps {
  dataModel: DataModel
  records: Record<string, any>[]
  onAddRecord: () => void
}

export function DatasetViewer({ dataModel, records, onAddRecord }: DatasetViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 5

  // Calculate pagination
  const totalPages = Math.ceil(records.length / recordsPerPage)
  const startIndex = (currentPage - 1) * recordsPerPage
  const endIndex = startIndex + recordsPerPage
  const currentRecords = records.slice(startIndex, endIndex)

  // Reset to first page when records change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [records.length])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Dataset Records</h3>
        <Button onClick={onAddRecord} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add New Record
        </Button>
      </div>

      {records.length === 0 ? (
        <div className="border rounded-lg p-8 text-center text-gray-500">
          <p>No records found in this dataset.</p>
          <p className="text-sm mt-2">Click "Add New Record" to create your first record.</p>
        </div>
      ) : (
        <>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  {dataModel.fields.map((field) => (
                    <TableHead key={field.id}>{field.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRecords.map((record, index) => (
                  <TableRow key={startIndex + index}>
                    {dataModel.fields.map((field) => (
                      <TableCell key={field.id} className="font-mono text-xs">
                        {String(record[field.name] ?? "")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to {Math.min(endIndex, records.length)} of {records.length} records
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
