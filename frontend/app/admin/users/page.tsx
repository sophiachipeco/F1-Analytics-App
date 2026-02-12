"use client"

import { DatabaseTableViewer } from "@/components/admin/database-table-viewer"
import { Users as UsersIcon } from "lucide-react"

export default function UsersPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <div className="flex items-center gap-2">
                    <UsersIcon className="h-6 w-6" />
                    <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                </div>
                <p className="text-muted-foreground mt-2">
                    Manage and view all registered users
                </p>
            </div>

            {/* Users Table */}
            <DatabaseTableViewer
                tableName="Users"
                apiEndpoint="http://localhost:8000/admin/users"
            />
        </div>
    )
}
