"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText } from "lucide-react";
import { toast } from 'sonner';
import { TEntityChange, TEntityPropertyChange, getEntityChangeTypeText, getEntityChangeTypeColor } from '@/types/entity-change/entity-change-type';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function EntityChangeDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [entityChange, setEntityChange] = useState<TEntityChange | null>(null);
    const [propertyChanges, setPropertyChanges] = useState<TEntityPropertyChange[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingPropertyChanges, setIsLoadingPropertyChanges] = useState(false);

    useEffect(() => {
        const fetchEntityChangeDetail = async () => {
            try {
                setIsLoading(true);

                // In a real implementation, you'd have an endpoint to fetch entity change by ID
                // For now, we'll simulate this - you may need to create this endpoint
                const response = await fetch(`/api/administration/entity-changes/get-entity-change`, {
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
                        toast.error("Entity change not found");
                        router.push('/administration/entity-changes');
                        return;
                    }
                    throw new Error("Failed to fetch entity change");
                }

                const data = await response.json();

                if (data.success && data.data) {
                    setEntityChange(data.data);
                    // Fetch property changes for this entity change
                    fetchPropertyChanges(data.data.id);
                } else {
                    throw new Error(data.message || "Failed to fetch entity change");
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to fetch entity change details");
                router.push('/administration/entity-changes');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchEntityChangeDetail();
        }
    }, [id, router]);

    const fetchPropertyChanges = async (entityChangeId: number) => {
        try {
            setIsLoadingPropertyChanges(true);

            const response = await fetch("/api/administration/entity-changes/get-entity-property-changes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ entityChangeId }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch property changes");
            }

            const data = await response.json();
            const propertyChanges = data?.data || [];

            setPropertyChanges(Array.isArray(propertyChanges) ? propertyChanges : []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch property changes");
        } finally {
            setIsLoadingPropertyChanges(false);
        }
    };

    const handleBack = () => {
        router.push('/administration/entity-changes');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <span className="text-muted-foreground">Loading entity change details...</span>
            </div>
        );
    }

    if (!entityChange) {
        return (
            <div className="flex flex-col items-center justify-center min-h-96">
                <p className="text-muted-foreground mb-4">Entity change not found</p>
                <Button onClick={handleBack} variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Entity Changes
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
                        <h1 className="text-2xl font-bold">Entity Change Detail</h1>
                        <Badge
                            variant="outline"
                            className={getEntityChangeTypeColor(entityChange.changeType)}
                        >
                            {getEntityChangeTypeText(entityChange.changeType)}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {/* Entity Change Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Change Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Change Time:</label>
                                <p className="text-sm mt-1 font-medium">
                                    {new Date(entityChange.changeTime).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Change Type:</label>
                                <div className="mt-1">
                                    <Badge
                                        variant="outline"
                                        className={getEntityChangeTypeColor(entityChange.changeType)}
                                    >
                                        {getEntityChangeTypeText(entityChange.changeType)}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Entity ID:</label>
                                <p className="text-sm mt-1 font-medium">{entityChange.entityId || '-'}</p>
                            </div>
                            <div className="md:col-span-2 lg:col-span-3">
                                <label className="text-sm font-medium text-muted-foreground">Entity Type:</label>
                                <p className="text-sm mt-1 font-medium break-all">{entityChange.entityTypeFullName || '-'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* User Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>User Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">User Name:</label>
                                <p className="text-sm mt-1 font-medium">{entityChange.userName || '-'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">User ID:</label>
                                <p className="text-sm mt-1 font-medium">{entityChange.userId || '-'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Tenant ID:</label>
                                <p className="text-sm mt-1 font-medium">{entityChange.tenantId || '-'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Impersonation Information */}
                {(entityChange.impersonatorUserId || entityChange.impersonatorTenantId) && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Impersonation Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Impersonator User ID:</label>
                                    <p className="text-sm mt-1 font-medium">{entityChange.impersonatorUserId || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Impersonator Tenant ID:</label>
                                    <p className="text-sm mt-1 font-medium">{entityChange.impersonatorTenantId || '-'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Reason */}
                <Card>
                    <CardHeader>
                        <CardTitle>Reason</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">{entityChange.reason || 'No reason provided'}</p>
                    </CardContent>
                </Card>

                {/* Property Changes */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <FileText className="h-5 w-5" />
                            <span>Property Changes</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingPropertyChanges ? (
                            <div className="flex items-center justify-center p-8">
                                <span className="text-muted-foreground">Loading property changes...</span>
                            </div>
                        ) : propertyChanges.length === 0 ? (
                            <div className="text-center p-8">
                                <p className="text-muted-foreground">No property changes found for this entity change.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Property Name</TableHead>
                                        <TableHead>Property Type</TableHead>
                                        <TableHead>Original Value</TableHead>
                                        <TableHead>New Value</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {propertyChanges.map((propertyChange) => (
                                        <TableRow key={propertyChange.id}>
                                            <TableCell className="font-medium">
                                                {propertyChange.propertyName}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {propertyChange.propertyTypeFullName || '-'}
                                            </TableCell>
                                            <TableCell>
                                                <div className="p-2 bg-red-50 border border-red-200 rounded text-xs">
                                                    <code className="text-red-800">
                                                        {propertyChange.originalValue || 'null'}
                                                    </code>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="p-2 bg-green-50 border border-green-200 rounded text-xs">
                                                    <code className="text-green-800">
                                                        {propertyChange.newValue || 'null'}
                                                    </code>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
