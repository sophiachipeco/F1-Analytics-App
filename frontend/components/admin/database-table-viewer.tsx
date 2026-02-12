"use client"

import { useEffect, useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Plus, Download } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface TableViewerProps {
    tableName: string
    apiEndpoint: string
}

export function DatabaseTableViewer({ tableName, apiEndpoint }: TableViewerProps) {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(apiEndpoint)
            if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`)
            const result = await res.json()
            setData(result)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [apiEndpoint])

    // Get column names from first row
    const columns = data.length > 0 ? Object.keys(data[0]) : []

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                    <CardTitle className="text-xl">{tableName}</CardTitle>
                    <CardDescription>
                        {loading ? "Loading..." : `${data.length} rows`}
                    </CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchData}
                        disabled={loading}
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Row
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {error ? (
                    <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
                        Error: {error}
                    </div>
                ) : loading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ) : data.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                        No data found in this table
                    </div>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {columns.map((col) => (
                                        <TableHead key={col} className="font-semibold">
                                            {col}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map((row, idx) => (
                                    <TableRow key={idx}>
                                        {columns.map((col) => (
                                            <TableCell key={col} className="font-mono text-xs">
                                                {renderCell(row[col])}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function renderCell(value: any): React.ReactNode {
    if (value === null || value === undefined) {
        return <span className="text-muted-foreground italic">null</span>
    }
    if (typeof value === "boolean") {
        return (
            <Badge variant={value ? "default" : "secondary"}>
                {value.toString()}
            </Badge>
        )
    }
    if (typeof value === "object") {
        return <span className="text-muted-foreground">{JSON.stringify(value)}</span>
    }
    // Truncate long strings
    const stringValue = String(value)
    if (stringValue.length > 50) {
        return (
            <span title={stringValue}>
                {stringValue.substring(0, 50)}...
            </span>
        )
    }
    return stringValue
}
