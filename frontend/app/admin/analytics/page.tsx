"use client"

import { BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <div className="flex items-center gap-2">
                    <BarChart3 className="h-6 w-6" />
                    <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                </div>
                <p className="text-muted-foreground mt-2">
                    View system analytics and insights
                </p>
            </div>

            {/* Coming Soon */}
            <Card>
                <CardHeader>
                    <CardTitle>Analytics Dashboard</CardTitle>
                    <CardDescription>Coming Soon</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-12 text-muted-foreground">
                        <div className="text-center">
                            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Analytics features will be available soon</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
