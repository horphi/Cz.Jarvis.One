"use client";
import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@radix-ui/react-alert-dialog';
import { AlertDialogFooter, AlertDialogHeader } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { ApiResult } from '@/types/http/api-result';


export type MyObjectListDto = {
    totalCount: number;
    items: MyObject[];
};


// My Object type definition
type MyObject = {
    id: number;
    userName: string;
    name: string;
    surname: string;
    emailAddress: string;
    isActive: boolean;
    creationTime: string; // ISO date string
    lockoutEndDateUtc: Date | null;
}

// Types for DataTable
type SortDirection = 'asc' | 'desc' | null;
type SortableColumn =
    'userName' | 'name' | 'emailAddress' | 'isEmailConfirmed' | 'isActive' | 'creationTime';


export default function DataTable() {
    const router = useRouter();
    // Filter 
    const [filter] = useState("");

    // State to hold fetched data
    const [myObjects, setMyObjects] = useState<MyObject[]>([]);
    const [isFetchingData, setIsFetchingData] = useState(false);

    // DataTable Pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [totalCount, setTotalCount] = useState(0);

    // Sorting state
    const [sortColumn, setSortColumn] = useState<SortableColumn | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);

    // Pagination logic
    const totalPages = Math.ceil(totalCount / pageSize);
    const firstItemNum = totalCount > 0 ? (page - 1) * pageSize + 1 : 0;
    const lastItemNum = Math.min(page * pageSize, totalCount);

    // Delete Entity State
    const [isDeletingEntity, setIsDeletingEntity] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [entityToDeleteId, setEntityToDeleteId] = useState<number | null>(null);
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

    // Fetch users with filters and pagination
    const fetchDatas = useCallback(async () => {
        setIsFetchingData(true);

        // Build sorting string
        let sorting = "id asc"; // default sorting
        if (sortColumn && sortDirection) {
            sorting = `${sortColumn} ${sortDirection}`;
        }

        const requestBody = {
            maxResultCount: pageSize,
            skipCount: (page - 1) * pageSize,
            sorting: sorting,
            filter: filter,
            // Additional filters and parameters can be added here
        };
        console.log("Request Body:", requestBody);
        // Reset data to empty before fetching

        try {
            const response = await fetch("/api/administration/xxx/get-myObjects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ requestBody }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/login');
                }
                throw new Error("Failed to fetch myObjects");
            }

            const responseResult: ApiResult<MyObjectListDto> = await response.json();
            // Unauthorized, redirect to login
            if (response.status === 401) { router.push('/login'); }
            if (!responseResult.success) {
                toast.error(responseResult.message || "Failed to process your request", {
                    description: responseResult.error || "Please try again."
                });
                return;
            } else {
                // Response is Successful
                setMyObjects(responseResult.data?.items || []);
                setTotalCount(responseResult.data?.totalCount || 0);
            }
        } catch (error) {
            console.error(error);
            setMyObjects([]);
            toast.error("Failed to fetch categories.");
        } finally {
            setIsFetchingData(false);
        }
    }, [filter, router, page, pageSize, sortColumn, sortDirection]);

    // useEffect for initial load and when specific filters/pagination change (excluding text filter for auto-trigger)
    useEffect(() => {
        fetchDatas();
        // This effect runs on initial mount and when page, pageSize, onlyLockedUsers, roleId, permissions, or router change.
        // It calls the latest `fetchUsers` function, which is memoized with the current `filter` value.
        // Keystrokes in the filter input will update `filter` and re-memoize `fetchUsers`,
        // but won't trigger this effect directly.

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize, router, sortColumn, sortDirection]); // insert other filter parameters here if needed



    // Function to handle edit  action
    const handleEdit = (id: number) => {
        console.log("Edit with ID:", id);
        router.push(`/administration/xxx/edit/${id}`);
    };

    // Function to handle pagination and sorting
    const handleSort = (column: SortableColumn) => {
        if (sortColumn === column) {
            // If already sorted by this column, toggle direction
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            // Otherwise, set new column and default to ascending
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const renderSortIcon = (column: SortableColumn) => {
        if (sortColumn !== column) return null;
        return sortDirection === 'asc' ? <ChevronUp className="inline ml-1" /> : <ChevronDown className="inline ml-1" />;
    };


    // Function to execute delete action
    const promptDeleteConfirmation = (id: number) => {
        setEntityToDeleteId(id);
        setOpenDropdownId(null); // Close any open dropdown
        setIsAlertOpen(true);
    };

    const handleAlertDialogOpenChange = (open: boolean) => {
        setIsAlertOpen(open);
        if (!open) {
            setEntityToDeleteId(null);
            if (isDeletingEntity) { // Ensure isDeletingUser is reset if dialog is closed prematurely
                setIsDeletingEntity(false);
            }
        }
    };

    const executeDeleteEntity = async () => {
        if (entityToDeleteId === null) return;

        console.log("Delete entity with ID:", entityToDeleteId);
        setIsDeletingEntity(true);

        try {
            // Call API to delete the entity
            const response = await fetch("/api/administration/xxx/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: entityToDeleteId }),
            });
            const data = await response.json();

            if (data.success) {
                toast.success(data.message || "MyObject deleted successfully.");
                setIsAlertOpen(false); // Close dialog on success
                fetchDatas(); // Re-fetch  data
            } else {
                toast.error(data.message || "Failed to delete MyObject.");
            }

        } catch (error) {
            console.error("Failed to delete User", error);
            toast.error("An error occurred while deleting myObject");
        } finally {
            setIsDeletingEntity(false);
            setEntityToDeleteId(null); // Reset to delete
        }
    };


    return (
        <>
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
                                    className="w-1/4 cursor-pointer hover:bg-muted/50 select-none"
                                    onClick={() => handleSort('userName')}
                                >
                                    User Name{renderSortIcon('userName')}
                                </TableHead>
                                <TableHead
                                    className="w-1/4 cursor-pointer hover:bg-muted/50 select-none"
                                    onClick={() => handleSort('name')}
                                >
                                    Full Name{renderSortIcon('name')}
                                </TableHead>
                                <TableHead
                                    className="w-1/4 cursor-pointer hover:bg-muted/50 select-none"
                                    onClick={() => handleSort('emailAddress')}
                                >
                                    Email{renderSortIcon('emailAddress')}
                                </TableHead>
                                <TableHead className="w-1/4">Role</TableHead>
                                <TableHead
                                    className="w-1/4 cursor-pointer hover:bg-muted/50 select-none"
                                    onClick={() => handleSort('isEmailConfirmed')}
                                >
                                    Email Confirmed{renderSortIcon('isEmailConfirmed')}
                                </TableHead>
                                <TableHead
                                    className="w-1/4 cursor-pointer hover:bg-muted/50 select-none"
                                    onClick={() => handleSort('isActive')}
                                >
                                    Active{renderSortIcon('isActive')}
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
                            {
                                myObjects.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center">
                                            No data found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    myObjects.map((myObject) => (
                                        <TableRow key={myObject.id}>
                                            <TableCell>{myObject.userName}</TableCell>
                                            <TableCell>{myObject.name} {myObject.surname}</TableCell>
                                            <TableCell>{myObject.emailAddress}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${myObject.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {myObject.isActive ? 'Yes' : 'No'}
                                                </span>
                                            </TableCell>
                                            <TableCell>{new Date(myObject.creationTime).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <DropdownMenu
                                                    open={openDropdownId === myObject.id}
                                                    onOpenChange={(open) => setOpenDropdownId(open ? myObject.id : null)}
                                                >
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onSelect={() => handleEdit(myObject.id)}
                                                        >
                                                            Edit MyObject
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onSelect={() => promptDeleteConfirmation(myObject.id)}
                                                        >
                                                            Delete MyObject
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )
                            }
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
            {/* Alert Dialog */}
            <AlertDialog open={isAlertOpen} onOpenChange={handleAlertDialogOpenChange}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the myObject.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeletingEntity}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={executeDeleteEntity} disabled={isDeletingEntity}>
                            {isDeletingEntity ? "Deleting..." : "Continue"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );


}