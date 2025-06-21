"use client";
import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Eye, FileSearch } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from 'sonner';
import { AuditLogListDto, TAuditLog } from '@/types/audit-log/audit-log-type';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApiResult } from '@/types/http/api-result';

// Types for DataTable
type SortDirection = 'asc' | 'desc' | null;
type SortableColumn =
    'userName' | 'serviceName' | 'methodName' | 'executionDuration' | 'clientIpAddress' | 'clientName' | 'browserInfo' | 'creationTime';


export default function AuditLogsDataTable() {
    const router = useRouter();

    // Filter states
    const [userNameFilter, setUserNameFilter] = useState("");
    const [serviceNameFilter, setServiceNameFilter] = useState("");
    const [methodNameFilter, setMethodNameFilter] = useState("");
    const [hasExceptionFilter, setHasExceptionFilter] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // State to hold fetched data
    const [myObjects, setTAuditLogs] = useState<TAuditLog[]>([]);
    const [isFetchingData, setIsFetchingData] = useState(false);

    // DataTable Pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [totalCount, setTotalCount] = useState(0);

    // Sorting state
    const [sortColumn, setSortColumn] = useState<SortableColumn | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);    // Pagination logic
    const totalPages = Math.ceil(totalCount / pageSize);
    const firstItemNum = totalCount > 0 ? (page - 1) * pageSize + 1 : 0;
    const lastItemNum = Math.min(page * pageSize, totalCount);

    // View Dialog State
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [selectedAuditLog, setSelectedAuditLog] = useState<TAuditLog | null>(null);

    // Fetch users with filters and pagination
    const fetchDatas = useCallback(async () => {
        setIsFetchingData(true);        // Build sorting string
        let sorting = "id asc"; // default sorting

        if (sortColumn && sortDirection) {
            sorting = `${sortColumn} ${sortDirection}`;
        }

        const requestBody = {
            maxResultCount: pageSize,
            skipCount: (page - 1) * pageSize,
            sorting: sorting,
            userName: userNameFilter || undefined,
            serviceName: serviceNameFilter || undefined,
            methodName: methodNameFilter || undefined,
            hasException: hasExceptionFilter === "all" ? undefined : hasExceptionFilter === "true",
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            // Additional filters and parameters can be added here
        };
        console.log("Request Body:", requestBody);
        // Reset data to empty before fetching

        try {
            const response = await fetch("/api/administration/audit-logs/get-audit-logs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody), // Remove the extra { requestBody } wrapper
            });

            const responseResult: ApiResult<AuditLogListDto> = await response.json();
            // Unauthorized, redirect to login
            if (response.status === 401) { router.push('/login'); }
            if (!responseResult.success) {
                toast.error(responseResult.message || "Failed to process your request", {
                    description: responseResult.error || "Please try again."
                });
                return;
            } else {
                // Response is Successful
                // Defensive handling of the response structure
                setTAuditLogs(responseResult.data?.items || []);
                setTotalCount(responseResult.data?.totalCount || 0);
            }

        } catch (error) {
            console.error(error);
            setTAuditLogs([]);
            toast.error("Failed to fetch users.");
        } finally {
            setIsFetchingData(false);
        }
    }, [userNameFilter, serviceNameFilter, methodNameFilter, hasExceptionFilter, startDate, endDate, router, page, pageSize, sortColumn, sortDirection]);

    // useEffect for initial load and when specific filters/pagination change (excluding text filter for auto-trigger)
    useEffect(() => {
        fetchDatas();
        // This effect runs on initial mount and when page, pageSize, onlyLockedUsers, roleId, permissions, or router change.
        // It calls the latest `fetchUsers` function, which is memoized with the current `filter` value.
        // Keystrokes in the filter input will update `filter` and re-memoize `fetchUsers`,
        // but won't trigger this effect directly.        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize, sortColumn, sortDirection, fetchDatas]); // insert other filter parameters here if needed

    // Function to handle view action
    const handleView = (auditLog: TAuditLog) => {
        setSelectedAuditLog(auditLog);
        setIsViewDialogOpen(true);
    };

    // Function to handle pagination and sorting
    const handleSort = (column: SortableColumn) => {
        if (sortColumn === column) {
            // If already sorted by this column, toggle direction
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {            // Otherwise, set new column and default to ascending
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const renderSortIcon = (column: SortableColumn) => {
        if (sortColumn !== column) return null;
        return sortDirection === 'asc' ? <ChevronUp className="inline ml-1" /> : <ChevronDown className="inline ml-1" />;
    };

    const handleSearch = () => {
        setPage(1);
        fetchDatas();
    };

    const handleReset = () => {
        setUserNameFilter("");
        setServiceNameFilter("");
        setMethodNameFilter("");
        setHasExceptionFilter("all");
        setStartDate("");
        setEndDate("");
        setPage(1);
    }; return (
        <>            {/* Filters */}
            <div className="mb-6 p-6 bg-card rounded-lg border shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                            Service Name
                        </label>
                        <Input
                            placeholder="Search service name..."
                            value={serviceNameFilter}
                            onChange={(e) => setServiceNameFilter(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="h-9"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Method Name
                        </label>
                        <Input
                            placeholder="Search method name..."
                            value={methodNameFilter}
                            onChange={(e) => setMethodNameFilter(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="h-9"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Has Exception
                        </label>
                        <Select value={hasExceptionFilter} onValueChange={setHasExceptionFilter}>
                            <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="true">With Exceptions</SelectItem>
                                <SelectItem value="false">Without Exceptions</SelectItem>
                            </SelectContent>
                        </Select>
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
                                <TableHead className="font-semibold w-16">Status</TableHead>
                                <TableHead className="font-semibold">User Name</TableHead>
                                <TableHead className="font-semibold">Service</TableHead>
                                <TableHead className="font-semibold">Action</TableHead>
                                <TableHead className="font-semibold">Duration</TableHead>
                                <TableHead className="font-semibold">IP Address</TableHead>
                                <TableHead className="font-semibold">Client</TableHead>
                                <TableHead className="font-semibold">Browser</TableHead>
                                <TableHead className="font-semibold">Creation Time</TableHead>
                                <TableHead className="font-semibold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index} className="hover:bg-transparent">
                                    <TableCell><Skeleton className="h-5 w-5 rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-semibold w-16">Status</TableHead>
                                <TableHead
                                    className="font-semibold cursor-pointer hover:bg-muted/50 select-none transition-colors"
                                    onClick={() => handleSort('userName')}
                                >
                                    User Name{renderSortIcon('userName')}
                                </TableHead>
                                <TableHead
                                    className="font-semibold cursor-pointer hover:bg-muted/50 select-none transition-colors"
                                    onClick={() => handleSort('serviceName')}
                                >
                                    Service{renderSortIcon('serviceName')}
                                </TableHead>
                                <TableHead
                                    className="font-semibold cursor-pointer hover:bg-muted/50 select-none transition-colors"
                                    onClick={() => handleSort('methodName')}
                                >
                                    Action{renderSortIcon('methodName')}
                                </TableHead>
                                <TableHead
                                    className="font-semibold cursor-pointer hover:bg-muted/50 select-none transition-colors"
                                    onClick={() => handleSort('executionDuration')}
                                >
                                    Duration{renderSortIcon('executionDuration')}
                                </TableHead>
                                <TableHead
                                    className="font-semibold cursor-pointer hover:bg-muted/50 select-none transition-colors"
                                    onClick={() => handleSort('clientIpAddress')}
                                >
                                    IP Address{renderSortIcon('clientIpAddress')}
                                </TableHead>
                                <TableHead
                                    className="font-semibold cursor-pointer hover:bg-muted/50 select-none transition-colors"
                                    onClick={() => handleSort('clientName')}
                                >
                                    Client{renderSortIcon('clientName')}
                                </TableHead>
                                <TableHead
                                    className="font-semibold cursor-pointer hover:bg-muted/50 select-none transition-colors"
                                    onClick={() => handleSort('browserInfo')}
                                >
                                    Browser{renderSortIcon('browserInfo')}
                                </TableHead>
                                <TableHead
                                    className="font-semibold cursor-pointer hover:bg-muted/50 select-none transition-colors"
                                    onClick={() => handleSort('creationTime')}
                                >
                                    Creation Time{renderSortIcon('creationTime')}
                                </TableHead>
                                <TableHead className="font-semibold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>                        <TableBody>
                            {myObjects.length === 0 ? (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={10} className="text-center py-12">
                                        <div className="flex flex-col items-center space-y-2">
                                            <FileSearch className="h-8 w-8 text-muted-foreground" />
                                            <p className="text-muted-foreground">No audit logs found.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                myObjects.map((myObject) => (
                                    <TableRow key={myObject.id} className="hover:bg-muted/50 transition-colors">
                                        <TableCell>
                                            {!myObject.exception ? (
                                                <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                                    Success
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50">
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    Error
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {myObject.userName || 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-mono text-sm">
                                                {myObject.serviceName}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-mono text-sm">
                                                {myObject.methodName}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-mono">
                                                {myObject.executionDuration}ms
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">
                                            {myObject.clientIpAddress}
                                        </TableCell>
                                        <TableCell>{myObject.clientName}</TableCell>                                        <TableCell className="max-w-xs">
                                            <div className="truncate text-sm" title={myObject.browserInfo || undefined}>
                                                {myObject.browserInfo}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">
                                            {new Date(myObject.executionTime).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleView(myObject)}
                                                className="h-8 w-8 p-0 hover:bg-muted transition-colors"
                                                title="View details"
                                            >
                                                <Eye className="h-4 w-4" />
                                                <span className="sr-only">View details</span>
                                            </Button>
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
            </div>            {/* Audit Log Detail Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-none w-[95vw] max-h-[85vh] overflow-y-auto">
                    <DialogHeader className="pb-4">
                        <DialogTitle className="text-lg font-semibold">Audit Log Details</DialogTitle>
                    </DialogHeader>

                    {selectedAuditLog && (
                        <div className="space-y-6">
                            {/* Status Badge */}
                            <div className="flex items-center gap-2">
                                {!selectedAuditLog.exception ? (
                                    <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        Success
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50">
                                        <AlertCircle className="h-4 w-4 mr-2" />
                                        Error
                                    </Badge>
                                )}
                            </div>

                            {/* User Information */}
                            <div className="space-y-3">
                                <h3 className="text-base font-semibold text-foreground border-b pb-2">User Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                            User Name
                                        </label>
                                        <p className="text-sm font-medium bg-background rounded px-2 py-1 border">
                                            {selectedAuditLog.userName || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                            IP Address
                                        </label>
                                        <p className="text-sm font-mono bg-background rounded px-2 py-1 border">
                                            {selectedAuditLog.clientIpAddress || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                            Client
                                        </label>
                                        <p className="text-sm bg-background rounded px-2 py-1 border">
                                            {selectedAuditLog.clientName || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                            Browser
                                        </label>
                                        <p className="text-sm bg-background rounded px-2 py-1 border">
                                            {selectedAuditLog.browserInfo || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Information */}
                            <div className="space-y-3">
                                <h3 className="text-base font-semibold text-foreground border-b pb-2">Action Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                            Service
                                        </label>
                                        <p className="text-sm font-mono bg-background rounded px-2 py-1 border">
                                            {selectedAuditLog.serviceName || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                            Action
                                        </label>
                                        <p className="text-sm font-mono bg-background rounded px-2 py-1 border">
                                            {selectedAuditLog.methodName || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                            Execution Time
                                        </label>
                                        <p className="text-sm font-mono bg-background rounded px-2 py-1 border">
                                            {selectedAuditLog.executionTime
                                                ? new Date(selectedAuditLog.executionTime).toLocaleString()
                                                : 'N/A'
                                            }
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                            Duration
                                        </label>
                                        <div className="flex items-center">
                                            <Badge variant="secondary" className="font-mono">
                                                {selectedAuditLog.executionDuration || 0}ms
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Parameters
                                    </label>
                                    <div className="bg-muted/50 rounded-md p-3 border">
                                        <pre className="text-sm font-mono text-foreground whitespace-pre-wrap overflow-x-auto">
                                            {selectedAuditLog.parameters || '{}'}
                                        </pre>
                                    </div>
                                </div>
                            </div>

                            {/* Custom Data */}
                            <div className="space-y-3">
                                <h3 className="text-base font-semibold text-foreground border-b pb-2">Custom Data</h3>
                                <div className="bg-muted/50 rounded-md p-3 border">
                                    <p className="text-sm text-muted-foreground">
                                        {selectedAuditLog.customData || 'No custom data available'}
                                    </p>
                                </div>
                            </div>

                            {/* Error Information */}
                            <div className="space-y-3">
                                <h3 className="text-base font-semibold text-foreground border-b pb-2">Error Information</h3>
                                {selectedAuditLog.exception ? (
                                    <div className="bg-destructive/5 border border-destructive/20 rounded-md p-4">
                                        <pre className="text-sm text-destructive font-mono whitespace-pre-wrap overflow-x-auto">
                                            {selectedAuditLog.exception}
                                        </pre>
                                    </div>
                                ) : (
                                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md p-4">
                                        <p className="text-sm text-green-700 dark:text-green-400 flex items-center">
                                            <CheckCircle2 className="h-4 w-4 mr-2" />
                                            No errors occurred during execution
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end pt-4 border-t">
                        <Button
                            onClick={() => setIsViewDialogOpen(false)}
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