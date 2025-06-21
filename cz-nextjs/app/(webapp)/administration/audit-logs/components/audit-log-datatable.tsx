"use client";
import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Eye } from "lucide-react";
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
        <>
            {/* Filters */}
            <div className="mb-4 p-4 bg-card rounded-lg border space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Start Date</label>
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">End Date</label>
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">User Name</label>
                        <Input
                            placeholder="User name..."
                            value={userNameFilter}
                            onChange={(e) => setUserNameFilter(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Service Name</label>
                        <Input
                            placeholder="Service name..."
                            value={serviceNameFilter}
                            onChange={(e) => setServiceNameFilter(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Method Name</label>
                        <Input
                            placeholder="Method name..."
                            value={methodNameFilter}
                            onChange={(e) => setMethodNameFilter(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Has Exception</label>
                        <Select value={hasExceptionFilter} onValueChange={setHasExceptionFilter}>
                            <SelectTrigger>
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
                <div className="flex gap-2">
                    <Button onClick={handleSearch} size="sm">Search</Button>
                    <Button onClick={handleReset} variant="outline" size="sm">Reset</Button>
                </div>
            </div>

            <div className="overflow-x-auto">
                {isFetchingData ? (
                    <div className="flex items-center justify-center p-4">
                        <span className="text-muted-foreground">Loading Data...</span>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-1/12">Status</TableHead>
                                <TableHead
                                    className="w-1/4 cursor-pointer hover:bg-muted/50 select-none"
                                    onClick={() => handleSort('userName')}
                                >
                                    User Name{renderSortIcon('userName')}
                                </TableHead>
                                <TableHead
                                    className="w-1/4 cursor-pointer hover:bg-muted/50 select-none"
                                    onClick={() => handleSort('serviceName')}
                                >
                                    Service{renderSortIcon('serviceName')}
                                </TableHead>
                                <TableHead
                                    className="w-1/4 cursor-pointer hover:bg-muted/50 select-none"
                                    onClick={() => handleSort('methodName')}
                                >
                                    Action{renderSortIcon('methodName')}
                                </TableHead>
                                <TableHead
                                    className="w-1/4 cursor-pointer hover:bg-muted/50 select-none"
                                    onClick={() => handleSort('executionDuration')}
                                >
                                    Duration{renderSortIcon('executionDuration')}
                                </TableHead>
                                <TableHead
                                    className="w-1/4 cursor-pointer hover:bg-muted/50 select-none"
                                    onClick={() => handleSort('clientIpAddress')}
                                >
                                    IP Address{renderSortIcon('clientIpAddress')}
                                </TableHead>
                                <TableHead
                                    className="w-1/4 cursor-pointer hover:bg-muted/50 select-none"
                                    onClick={() => handleSort('clientName')}
                                >
                                    Client{renderSortIcon('clientName')}
                                </TableHead>
                                <TableHead
                                    className="w-1/4 cursor-pointer hover:bg-muted/50 select-none"
                                    onClick={() => handleSort('browserInfo')}
                                >
                                    Browser{renderSortIcon('browserInfo')}
                                </TableHead>
                                <TableHead
                                    className="w-1/4 cursor-pointer hover:bg-muted/50 select-none"
                                    onClick={() => handleSort('creationTime')}
                                >
                                    Creation Time{renderSortIcon('creationTime')}
                                </TableHead>
                                <TableHead className="w-1/4">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {myObjects.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={11} className="text-center">
                                        No data found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                myObjects.map((myObject) => (
                                    <TableRow key={myObject.id}>
                                        <TableCell>
                                            {!myObject.exception ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            ) : (
                                                <AlertCircle className="h-5 w-5 text-red-500" />
                                            )}
                                        </TableCell>
                                        <TableCell>{myObject.userName}</TableCell>
                                        <TableCell>{myObject.serviceName}</TableCell>
                                        <TableCell>{myObject.methodName}</TableCell>
                                        <TableCell>{myObject.executionDuration}ms</TableCell>
                                        <TableCell>{myObject.clientIpAddress}</TableCell>
                                        <TableCell>{myObject.clientName}</TableCell>
                                        <TableCell className="max-w-xs truncate">{myObject.browserInfo}</TableCell>
                                        <TableCell>{new Date(myObject.executionTime).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleView(myObject)}
                                                className="h-8 w-8 p-0"
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
            </div>
            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-4 px-4">
                <div className="flex items-center space-x-4">

                    <div>
                        <label className="mr-2 text-sm">Rows per page:</label>
                        <select
                            className="border rounded px-2 py-1 text-sm"
                            value={pageSize}
                            onChange={e => {
                                setPageSize(Number(e.target.value));
                                setPage(1);
                            }}
                        >
                            {[5, 10, 25, 50, 100].map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                aria-disabled={page === 1}
                                className={page === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                        {page > 2 && (
                            <PaginationItem>
                                <PaginationLink onClick={() => setPage(1)}>1</PaginationLink>
                            </PaginationItem>
                        )}
                        {page > 3 && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )}
                        {page > 1 && (
                            <PaginationItem>
                                <PaginationLink onClick={() => setPage(page - 1)}>{page - 1}</PaginationLink>
                            </PaginationItem>
                        )}
                        <PaginationItem>
                            <PaginationLink isActive>{page}</PaginationLink>
                        </PaginationItem>
                        {page < totalPages && (
                            <PaginationItem>
                                <PaginationLink onClick={() => setPage(page + 1)}>{page + 1}</PaginationLink>
                            </PaginationItem>
                        )}
                        {page < totalPages - 2 && ( // Corrected condition for ellipsis
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )}
                        {page < totalPages - 1 && totalPages > 1 && ( // Corrected condition for totalPages link
                            <PaginationItem>
                                <PaginationLink onClick={() => setPage(totalPages)}>{totalPages}</PaginationLink>
                            </PaginationItem>
                        )}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                aria-disabled={page === totalPages || totalPages === 0}
                                className={page === totalPages || totalPages === 0 ? "pointer-events-none opacity-50" : ""}
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
            </div>

            {/* Audit Log Detail Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-none w-[95vw] max-h-[85vh] overflow-y-auto p-6">
                    <DialogHeader>
                        <DialogTitle>Audit log detail</DialogTitle>
                    </DialogHeader>

                    {selectedAuditLog && (
                        <div className="space-y-6">
                            {/* User Information */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3">User information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">User name:</label>
                                        <p className="text-sm">{selectedAuditLog.userName || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">IP address:</label>
                                        <p className="text-sm">{selectedAuditLog.clientIpAddress || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Client:</label>
                                        <p className="text-sm">{selectedAuditLog.clientName || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Browser:</label>
                                        <p className="text-sm">{selectedAuditLog.browserInfo || '-'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Information */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Action information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Service:</label>
                                        <p className="text-sm">{selectedAuditLog.serviceName || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Action:</label>
                                        <p className="text-sm">{selectedAuditLog.methodName || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Time:</label>
                                        <p className="text-sm">
                                            {selectedAuditLog.executionTime
                                                ? new Date(selectedAuditLog.executionTime).toLocaleString()
                                                : '-'
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Duration:</label>
                                        <p className="text-sm">{selectedAuditLog.executionDuration || 0} ms</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="text-sm font-medium text-muted-foreground">Parameters:</label>
                                    <div className="mt-1 p-3 bg-muted rounded-md">
                                        <code className="text-sm">
                                            {selectedAuditLog.parameters || '{}'
                                            }
                                        </code>
                                    </div>
                                </div>
                            </div>

                            {/* Custom data */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Custom data</h3>
                                <p className="text-sm text-muted-foreground">
                                    {selectedAuditLog.customData || 'None'}
                                </p>
                            </div>

                            {/* Error state */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Error state</h3>
                                {selectedAuditLog.exception ? (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                        <pre className="text-sm text-red-800 whitespace-pre-wrap overflow-x-auto">
                                            {selectedAuditLog.exception}
                                        </pre>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No errors</p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end mt-6">
                        <Button onClick={() => setIsViewDialogOpen(false)}>
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}