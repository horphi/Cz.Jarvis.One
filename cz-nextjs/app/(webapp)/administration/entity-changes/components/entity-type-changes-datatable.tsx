"use client";
import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from 'sonner';
import { TEntityChange, getEntityChangeTypeText, getEntityChangeTypeColor, EntityListDto } from '@/types/audit-log/entity-change-type';
import { Input } from "@/components/ui/input";
import { TEntityPropertyChange } from '@/types/audit-log/entity-property-changes-type';
import { ApiResult } from '@/types/http/api-result';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
            <div className="mb-4 p-4 bg-card rounded-lg border space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Entity Type</label>
                        <Input
                            placeholder="Entity type..."
                            value={entityTypeFilter}
                            onChange={(e) => setEntityTypeFilter(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
                                <TableHead
                                    className="cursor-pointer hover:bg-muted/50 select-none"
                                    onClick={() => handleSort('changeTime')}
                                >
                                    Change Time{renderSortIcon('changeTime')}
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer hover:bg-muted/50 select-none"
                                    onClick={() => handleSort('changeType')}
                                >
                                    Change Type{renderSortIcon('changeType')}
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer hover:bg-muted/50 select-none"
                                    onClick={() => handleSort('entityTypeFullName')}
                                >
                                    Entity Type{renderSortIcon('entityTypeFullName')}
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer hover:bg-muted/50 select-none"
                                    onClick={() => handleSort('entityId')}
                                >
                                    Entity ID{renderSortIcon('entityId')}
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer hover:bg-muted/50 select-none"
                                    onClick={() => handleSort('userName')}                                >
                                    User Name{renderSortIcon('userName')}
                                </TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {entityChanges.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center">
                                        No data found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                entityChanges.map((entityChange) => (
                                    <TableRow key={entityChange.id}>
                                        <TableCell>
                                            {new Date(entityChange.changeTime).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={getEntityChangeTypeColor(entityChange.changeType)}
                                            >
                                                {getEntityChangeTypeText(entityChange.changeType)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {entityChange.entityTypeFullName}
                                        </TableCell>
                                        <TableCell>{entityChange.entityId}</TableCell>
                                        <TableCell>{entityChange.userName || '-'}</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleViewPropertyChanges(entityChange.id)}
                                                    className="h-8 w-8 p-0"
                                                    disabled={loadingPropertyChanges}
                                                    title="View property changes"
                                                >
                                                    <FileText className="h-4 w-4" />
                                                    <span className="sr-only">View property changes</span>
                                                </Button>                                            </div>
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
                        {page < totalPages - 2 && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )}
                        {page < totalPages - 1 && totalPages > 1 && (
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
                        "No entries found")}
                </div>
            </div>

            {/* Property Changes Dialog */}
            <Dialog open={isPropertyChangesDialogOpen} onOpenChange={setIsPropertyChangesDialogOpen}>
                <DialogContent className="max-w-none w-[95vw] max-h-[85vh] overflow-y-auto p-6">
                    <DialogHeader>
                        <DialogTitle>Entity Property Changes</DialogTitle>
                    </DialogHeader>

                    {loadingPropertyChanges ? (
                        <div className="flex items-center justify-center p-8">
                            <span className="text-muted-foreground">Loading property changes...</span>
                        </div>
                    ) : selectedPropertyChanges.length === 0 ? (
                        <div className="text-center p-8">
                            <p className="text-muted-foreground">No property changes found.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {selectedPropertyChanges.map((propertyChange) => (
                                <div key={propertyChange.id} className="border rounded-lg p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Property Name:</label>
                                            <p className="text-sm font-medium">{propertyChange.propertyName}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Property Type:</label>
                                            <p className="text-sm">{propertyChange.propertyTypeFullName || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Original Value:</label>
                                            <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded text-sm">
                                                <code className="text-red-800">
                                                    {propertyChange.originalValue || 'null'}
                                                </code>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">New Value:</label>
                                            <div className="mt-1 p-2 bg-green-50 border border-green-200 rounded text-sm">
                                                <code className="text-green-800">
                                                    {propertyChange.newValue || 'null'}
                                                </code>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-end mt-6">
                        <Button onClick={() => setIsPropertyChangesDialogOpen(false)}>
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
