"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from 'sonner';
import { TAuditLog } from '@/types/audit-log/audit-log-type';

export default function AuditLogDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [auditLog, setAuditLog] = useState<TAuditLog | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAuditLogDetail = async () => {
            try {
                setIsLoading(true);                // Fetch the specific audit log by ID
                const response = await fetch(`/api/administration/audit-logs/get-audit-log`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: id }),
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        router.push('/login');
                        return;
                    }
                    if (response.status === 404) {
                        toast.error("Audit log not found");
                        router.push('/administration/audit-logs');
                        return;
                    }
                    throw new Error("Failed to fetch audit log");
                } const data = await response.json();

                // Handle the ApiResult format
                if (data.success && data.data) {
                    setAuditLog(data.data);
                } else {
                    throw new Error(data.message || "Failed to fetch audit log");
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to fetch audit log details");
                router.push('/administration/audit-logs');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchAuditLogDetail();
        }
    }, [id, router]);

    const handleBack = () => {
        router.push('/administration/audit-logs');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <span className="text-muted-foreground">Loading audit log details...</span>
            </div>
        );
    }

    if (!auditLog) {
        return (
            <div className="flex flex-col items-center justify-center min-h-96">
                <p className="text-muted-foreground mb-4">Audit log not found</p>
                <Button onClick={handleBack} variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Audit Logs
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <Button onClick={handleBack} variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div className="flex items-center space-x-2">
                        <h1 className="text-2xl font-bold">Audit Log Detail</h1>
                        {!auditLog.exception ? (
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                        ) : (
                            <AlertCircle className="h-6 w-6 text-red-500" />
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {/* User Information */}
                <div className="bg-card rounded-lg border p-6">
                    <h2 className="text-xl font-semibold mb-4">User Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">User name:</label>
                            <p className="text-sm mt-1 font-medium">{auditLog.userName || '-'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">IP address:</label>
                            <p className="text-sm mt-1 font-medium">{auditLog.clientIpAddress || '-'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Client:</label>
                            <p className="text-sm mt-1 font-medium">{auditLog.clientName || '-'}</p>
                        </div>
                        <div className="md:col-span-2 lg:col-span-3">
                            <label className="text-sm font-medium text-muted-foreground">Browser:</label>
                            <p className="text-sm mt-1 font-medium break-all">{auditLog.browserInfo || '-'}</p>
                        </div>
                    </div>
                </div>

                {/* Action Information */}
                <div className="bg-card rounded-lg border p-6">
                    <h2 className="text-xl font-semibold mb-4">Action Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Service:</label>
                            <p className="text-sm mt-1 font-medium">{auditLog.serviceName || '-'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Action:</label>
                            <p className="text-sm mt-1 font-medium">{auditLog.methodName || '-'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Duration:</label>
                            <p className="text-sm mt-1 font-medium">{auditLog.executionDuration || 0} ms</p>
                        </div>
                        <div className="md:col-span-2 lg:col-span-3">
                            <label className="text-sm font-medium text-muted-foreground">Time:</label>
                            <p className="text-sm mt-1 font-medium">
                                {auditLog.executionTime
                                    ? new Date(auditLog.executionTime).toLocaleString()
                                    : '-'
                                }
                            </p>
                        </div>
                    </div>
                    <div className="mt-6">
                        <label className="text-sm font-medium text-muted-foreground">Parameters:</label>
                        <div className="mt-2 p-4 bg-muted rounded-md">
                            <pre className="text-sm whitespace-pre-wrap overflow-x-auto">
                                {auditLog.parameters ?
                                    (() => {
                                        try {
                                            return JSON.stringify(JSON.parse(auditLog.parameters), null, 2);
                                        } catch {
                                            return auditLog.parameters;
                                        }
                                    })() :
                                    '{}'
                                }
                            </pre>
                        </div>
                    </div>
                </div>

                {/* Custom Data */}
                <div className="bg-card rounded-lg border p-6">
                    <h2 className="text-xl font-semibold mb-4">Custom Data</h2>
                    {auditLog.customData ? (
                        <div className="p-4 bg-muted rounded-md">
                            <pre className="text-sm whitespace-pre-wrap overflow-x-auto">
                                {typeof auditLog.customData === 'string' ?
                                    auditLog.customData :
                                    JSON.stringify(auditLog.customData, null, 2)
                                }
                            </pre>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No custom data available</p>
                    )}
                </div>

                {/* Error State */}
                <div className="bg-card rounded-lg border p-6">
                    <h2 className="text-xl font-semibold mb-4">Error State</h2>
                    {auditLog.exception ? (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                            <pre className="text-sm text-red-800 whitespace-pre-wrap overflow-x-auto">
                                {auditLog.exception}
                            </pre>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <p className="text-sm text-green-700">No errors occurred during execution</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
