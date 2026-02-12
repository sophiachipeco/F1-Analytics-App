"use client"

import { DatabaseTableViewer } from "@/components/admin/database-table-viewer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database } from "lucide-react"

export default function DatabasePage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <div className="flex items-center gap-2">
                    <Database className="h-6 w-6" />
                    <h1 className="text-3xl font-bold tracking-tight">Database</h1>
                </div>
                <p className="text-muted-foreground mt-2">
                    View and manage your database tables
                </p>
            </div>

            {/* Tables Tabs */}
            <Tabs defaultValue="users" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="user_settings">User Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="space-y-4">
                    <DatabaseTableViewer
                        tableName="users"
                        apiEndpoint="http://localhost:8000/admin/users"
                    />
                </TabsContent>

                <TabsContent value="user_settings" className="space-y-4">
                    <DatabaseTableViewer
                        tableName="user_settings"
                        apiEndpoint="http://localhost:8000/admin/user-settings"
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}
