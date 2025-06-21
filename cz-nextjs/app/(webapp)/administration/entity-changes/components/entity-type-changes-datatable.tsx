"use client";
import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from 'sonner';
import { TEntityChange, getEntityChangeTypeText, getEntityChangeTypeColor, EntityListDto } from '@/types/audit-log/entity-change-type';
import { Input } from "@/components/ui/input";
import { TEntityPropertyChange } from '@/types/audit-log/entity-property-changes-type';
import { ApiResult } from '@/types/http/api-result';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Types for DataTable
type SortDirection = 'asc' | 'desc' | null;
type SortableColumn = 'changeTime' | 'changeType' | 'entityTypeFullName' | 'entityId' | 'userName';

export default function EntityTypeChangesDataTable() {
    const router = useRouter();    // Filter states
    const [entityTypeFilter, setEntityTypeFilter] = useState("");
    const [userNameFilter, setUserNameFilter] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // State to hold fetched data
    const [entityChanges, setEntityChanges] = useState<TEntityChange[]>([]);
    const [isFetchingData, setIsFetchingData] = useState(false);

    // DataTable Pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [totalCount, setTotalCount] = useState(0);

    // Sorting state
    const [sortColumn, setSortColumn] = useState<SortableColumn | null>('changeTime');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    // Pagination logic
    const totalPages = Math.ceil(totalCount / pageSize);
    const firstItemNum = totalCount > 0 ? (page - 1) * pageSize + 1 : 0;
    const lastItemNum = Math.min(page * pageSize, totalCount);    // View Dialog State - removed since we navigate to detail page
    // Property Changes Dialog State
    const [isPropertyChangesDialogOpen, setIsPropertyChangesDialogOpen] = useState(false);
    const [selectedPropertyChanges, setSelectedPropertyChanges] = useState<TEntityPropertyChange[]>([]);
    const [loadingPropertyChanges, setLoadingPropertyChanges] = useState(false);

    // Fetch entity changes with filters and pagination
    const fetchData = useCallback(async () => {
        setIsFetchingData(true);

        // Build sorting string
        let sorting = "changeTime desc"; // default sorting
        if (sortColumn && sortDirection) {
            sorting = `${sortColumn} ${sortDirection}`;
        } const requestBody = {
            maxResultCount: pageSize,
            skipCount: (page - 1) * pageSize,
            sorting: sorting,
            entityTypeFullName: entityTypeFilter || undefined,
            userName: userNameFilter || undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
        };

        try {
            const response = await fetch("/api/administration/entity-changes/get-entity-changes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            const responseResult: ApiResult<EntityListDto> = await response.json();
            // Unauthorized, redirect to login
            if (response.status === 401) { router.push('/login'); }
            if (!responseResult.success) {
                toast.error(responseResult.message || "Failed to process your request", {
                    description: responseResult.error || "Please try again."
                });
                return;
            } else {
                // Response is Successful
                setEntityChanges(responseResult.data?.items || []);
                setTotalCount(responseResult.data?.totalCount || 0);
            }

        } catch (error) {
            console.error(error);
            setEntityChanges([]);
            toast.error("Failed to fetch entity changes.");
        } finally {
            setIsFetchingData(false);
        }
    }, [entityTypeFilter, userNameFilter, startDate, endDate, router, page, pageSize, sortColumn, sortDirection]);

    // useEffect for initial load and when filters/pagination change
    useEffect(() => {
        fetchData();
    }, [page, pageSize, sortColumn, sortDirection, fetchData]);    // Function to handle view action



    // Function to handle property changes view
    const handleViewPropertyChanges = async (entityChangeId: number) => {
        setLoadingPropertyChanges(true);
        setSelectedPropertyChanges([]);

        try {
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

            console.log(data);


            const propertyChanges = data?.data || [];

            setSelectedPropertyChanges(Array.isArray(propertyChanges) ? propertyChanges : []);
            setIsPropertyChangesDialogOpen(true);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch property changes.");
        } finally {
            setLoadingPropertyChanges(false);
        }
    };

    // Function to handle pagination and sorting
    const handleSort = (column: SortableColumn) => {
        if (sortColumn === column) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const renderSortIcon = (column: SortableColumn) => {
        if (sortColumn !== column) return null;
        return sortDirection === 'asc' ? <ChevronUp className="inline ml-1 h-4 w-4" /> : <ChevronDown className="inline ml-1 h-4 w-4" />;
    };

    const handleSearch = () => {
        setPage(1);
        fetchData();
    }; const handleReset = () => {
        setEntityTypeFilter("");
        setUserNameFilter("");
        setStartDate("");
        setEndDate("");
        setPage(1);
    };

    return (
        <>            {/* Filters */}
            <div className="mb-6 p-6 bg-card rounded-lg border shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Entity Type
                        </label>
                        <Input
                            placeholder="Search entity type..."
                            value={entityTypeFilter}
                            onChange={(e) => setEntityTypeFilter(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="h-9"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            User Name
                        </label>
                        <Input
                            placeholder="Search user name..."
                            value={userNameFilter}
                            onChange={(e) => setUserNameFilter(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="h-9"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Start Date
                        </label>
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="h-9"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            End Date
                        </label>
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="h-9"
                        />
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button onClick={handleSearch} size="sm" className="px-4">
                        Search
                    </Button>
                    <Button onClick={handleReset} variant="outline" size="sm" className="px-4">
                        Reset
                    </Button>
                </div>
            </div>            <div className="rounded-md border bg-card">
                {isFetchingData ? (
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-semibold">Change Time</TableHead>
                                <TableHead className="font-semibold">Change Type</TableHead>
                                <TableHead className="font-semibold">Entity Type</TableHead>
                                <TableHead className="font-semibold">Entity ID</TableHead>
                                <TableHead className="font-semibold">User Name</TableHead>
                                <TableHead className="font-semibold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index} className="hover:bg-transparent">
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead
                                    className="cursor-pointer hover:bg-muted/50 select-none font-semibold transition-colors"
                                    onClick={() => handleSort('changeTime')}
                                >
                                    Change Time{renderSortIcon('changeTime')}
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer hover:bg-muted/50 select-none font-semibold transition-colors"
                                    onClick={() => handleSort('changeType')}
                                >
                                    Change Type{renderSortIcon('changeType')}
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer hover:bg-muted/50 select-none font-semibold transition-colors"
                                    onClick={() => handleSort('entityTypeFullName')}
                                >
                                    Entity Type{renderSortIcon('entityTypeFullName')}
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer hover:bg-muted/50 select-none font-semibold transition-colors"
                                    onClick={() => handleSort('entityId')}
                                >
                                    Entity ID{renderSortIcon('entityId')}
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer hover:bg-muted/50 select-none font-semibold transition-colors"
                                    onClick={() => handleSort('userName')}
                                >
                                    User Name{renderSortIcon('userName')}
                                </TableHead>
                                <TableHead className="font-semibold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {entityChanges.length === 0 ? (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={6} className="text-center py-12">
                                        <div className="flex flex-col items-center space-y-2">
                                            <FileText className="h-8 w-8 text-muted-foreground" />
                                            <p className="text-muted-foreground">No data found.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                entityChanges.map((entityChange) => (
                                    <TableRow key={entityChange.id} className="hover:bg-muted/50 transition-colors">
                                        <TableCell className="font-mono text-sm">
                                            {new Date(entityChange.changeTime).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={getEntityChangeTypeColor(entityChange.changeType)}
                                            >
                                                {getEntityChangeTypeText(entityChange.changeType)}
                                            </Badge>
                                        </TableCell>                                        <TableCell className="max-w-xs">
                                            <div className="truncate" title={entityChange.entityTypeFullName || undefined}>
                                                {entityChange.entityTypeFullName}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono">
                                            {entityChange.entityId}
                                        </TableCell>
                                        <TableCell>
                                            <span className={entityChange.userName ? '' : 'text-muted-foreground'}>
                                                {entityChange.userName || 'N/A'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleViewPropertyChanges(entityChange.id)}
                                                    className="h-8 w-8 p-0 hover:bg-muted transition-colors"
                                                    disabled={loadingPropertyChanges}
                                                    title="View property changes"
                                                >
                                                    <FileText className="h-4 w-4" />
                                                    <span className="sr-only">View property changes</span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-6 px-2">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium">Rows per page:</label>
                        <Select
                            value={pageSize.toString()}
                            onValueChange={(value) => {
                                setPageSize(Number(value));
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-20 h-8">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[5, 10, 25, 50, 100].map(size => (
                                    <SelectItem key={size} value={size.toString()}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                aria-disabled={page === 1}
                                className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                        {page > 2 && (
                            <PaginationItem>
                                <PaginationLink
                                    onClick={() => setPage(1)}
                                    className="cursor-pointer"
                                >
                                    1
                                </PaginationLink>
                            </PaginationItem>
                        )}
                        {page > 3 && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )}
                        {page > 1 && (
                            <PaginationItem>
                                <PaginationLink
                                    onClick={() => setPage(page - 1)}
                                    className="cursor-pointer"
                                >
                                    {page - 1}
                                </PaginationLink>
                            </PaginationItem>
                        )}
                        <PaginationItem>
                            <PaginationLink isActive>{page}</PaginationLink>
                        </PaginationItem>
                        {page < totalPages && (
                            <PaginationItem>
                                <PaginationLink
                                    onClick={() => setPage(page + 1)}
                                    className="cursor-pointer"
                                >
                                    {page + 1}
                                </PaginationLink>
                            </PaginationItem>
                        )}
                        {page < totalPages - 2 && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )}
                        {page < totalPages - 1 && totalPages > 1 && (
                            <PaginationItem>
                                <PaginationLink
                                    onClick={() => setPage(totalPages)}
                                    className="cursor-pointer"
                                >
                                    {totalPages}
                                </PaginationLink>
                            </PaginationItem>
                        )}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                aria-disabled={page === totalPages || totalPages === 0}
                                className={page === totalPages || totalPages === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
                <div className="text-sm text-muted-foreground">
                    {totalCount > 0 ? (
                        `Showing ${firstItemNum} to ${lastItemNum} of ${totalCount} entries`
                    ) : (
                        "No entries found"
                    )}
                </div>
            </div>            {/* Property Changes Dialog */}
            <Dialog open={isPropertyChangesDialogOpen} onOpenChange={setIsPropertyChangesDialogOpen}>
                <DialogContent className="max-w-none w-[95vw] max-h-[85vh] overflow-y-auto">
                    <DialogHeader className="pb-4">
                        <DialogTitle className="text-lg font-semibold">Entity Property Changes</DialogTitle>
                    </DialogHeader>

                    {loadingPropertyChanges ? (
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="border rounded-lg p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Skeleton className="h-4 w-24 mb-1" />
                                            <Skeleton className="h-5 w-32" />
                                        </div>
                                        <div>
                                            <Skeleton className="h-4 w-28 mb-1" />
                                            <Skeleton className="h-5 w-40" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <Skeleton className="h-4 w-28 mb-2" />
                                            <Skeleton className="h-16 w-full" />
                                        </div>
                                        <div>
                                            <Skeleton className="h-4 w-20 mb-2" />
                                            <Skeleton className="h-16 w-full" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : selectedPropertyChanges.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="flex flex-col items-center space-y-3">
                                <FileText className="h-12 w-12 text-muted-foreground" />
                                <p className="text-muted-foreground font-medium">No property changes found</p>
                                <p className="text-sm text-muted-foreground/80">This entity change has no property modifications.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                            {selectedPropertyChanges.map((propertyChange, index) => (
                                <div key={propertyChange.id} className="border rounded-lg p-4 bg-card/50 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Badge variant="secondary" className="px-2 py-1">
                                            Property #{index + 1}
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                Property Name
                                            </label>
                                            <p className="text-sm font-semibold bg-background rounded px-2 py-1 border">
                                                {propertyChange.propertyName}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                Property Type
                                            </label>
                                            <p className="text-sm bg-background rounded px-2 py-1 border">
                                                {propertyChange.propertyTypeFullName || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-destructive uppercase tracking-wide flex items-center">
                                                Original Value
                                            </label>
                                            <div className="bg-destructive/5 border border-destructive/20 rounded p-3">
                                                <code className="text-sm text-destructive font-mono break-all">
                                                    {propertyChange.originalValue || 'null'}
                                                </code>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-green-700 dark:text-green-400 uppercase tracking-wide">
                                                New Value
                                            </label>
                                            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded p-3">
                                                <code className="text-sm text-green-700 dark:text-green-400 font-mono break-all">
                                                    {propertyChange.newValue || 'null'}
                                                </code>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-end pt-4 border-t">
                        <Button
                            onClick={() => setIsPropertyChangesDialogOpen(false)}
                            className="px-6"
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
