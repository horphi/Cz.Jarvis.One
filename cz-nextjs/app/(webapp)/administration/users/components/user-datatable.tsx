"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RoleListDto, TRole } from "@/types/roles/i-role";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TUserForListDto, UserListDto } from '@/types/users/user-type';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { ApiResult } from '@/types/http/api-result';

type SortDirection = 'asc' | 'desc' | null;
type SortableColumn = 'userName' | 'name' | 'emailAddress' | 'isEmailConfirmed' | 'isActive' | 'creationTime';

export default function UsersDataTable() {
    const logIdentifier = "UsersDataTable";
    const router = useRouter();
    const [users, setUsers] = useState<TUserForListDto[]>([]);
    const [isFetchingUsers, setIsFetchingUsers] = useState(false);
    // Filter properties
    const [filter, setFilter] = useState("");
    const [onlyLockedUsers, setOnlyLockedUsers] = useState(false);
    const [roleId, setRoleId] = useState("");
    const [permissions] = useState<string[]>([]);
    //cconst [roles, setRoles] = useState<string[]>([]);
    const [roleOptions, setRoleOptions] = useState<TRole[]>([]);

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


    // Delete User State
    const [isDeletingUser, setIsDeletingUser] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [userToDeleteId, setUserToDeleteId] = useState<number | null>(null);
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);


    // Fetch users with filters and pagination
    const fetchUsers = useCallback(async () => {
        setIsFetchingUsers(true);

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
            permissions: permissions,
            role: roleId ? roleId : null,
            onlyLockedUsers: onlyLockedUsers,
        };
        // Reset users to empty before fetching

        try {
            const response = await fetch("/api/administration/user/get-users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ requestBody }),
            });

            const responseResult: ApiResult<UserListDto> = await response.json();

            // Unauthorized, redirect to login
            if (response.status === 401) { router.push('/login'); }

            if (!responseResult.success) {
                toast.error(responseResult.message || "Failed to process your request", {
                    description: responseResult.error || "Please try again."
                });
                return;
            } else {
                // Response is Successful 
                setUsers(responseResult.data?.items || []);
                setTotalCount(responseResult.data?.totalCount || 0);
            }

        } catch (error) {
            console.error(`${logIdentifier}:`, error);
            setUsers([]);
            toast.error("Failed to fetch users.");
        } finally {
            setIsFetchingUsers(false);
        }
    }, [filter, onlyLockedUsers, permissions, roleId, router, page, pageSize, sortColumn, sortDirection]);


    // Fetch roles for dropdown
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch("/api/administration/role/get-roles", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ Permissions: [] }),
                });
                const responseResult: ApiResult<RoleListDto> = await response.json();

                // Unauthorized, redirect to login
                if (response.status === 401) { router.push('/login'); }

                if (!responseResult.success) {
                    toast.error(responseResult.message || "Failed to process your request", {
                        description: responseResult.error || "Please try again."
                    });
                    setTimeout(() => {
                        router.push("/administration/users");
                    }, 1200);
                } else {
                    // Response is Successful
                    const roleSelectItems: TRole[] = responseResult.data?.items || [];
                    setRoleOptions(roleSelectItems);
                }
            } catch (error) {
                console.error(`${logIdentifier}:`, error);
                setRoleOptions([]);
                toast.error("An error occurred while processing your request. Please try again.");
            }
        };
        fetchRoles();
    }, [router]);

    // useEffect for initial load and when specific filters/pagination change (excluding text filter for auto-trigger)
    useEffect(() => {
        // This effect runs on initial mount and when page, pageSize, onlyLockedUsers, roleId, permissions, or router change.
        // It calls the latest `fetchUsers` function, which is memoized with the current `filter` value.
        // Keystrokes in the filter input will update `filter` and re-memoize `fetchUsers`,
        // but won't trigger this effect directly.
        fetchUsers();

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize, onlyLockedUsers, roleId, permissions, router, sortColumn, sortDirection]);

    const handleEditUser = (userId: number) => {
        console.log("Edit user with ID:", userId);
        router.push(`/administration/users/edit/${userId}`);
    };

    const promptDeleteConfirmation = (userId: number) => {
        setUserToDeleteId(userId);
        setOpenDropdownId(null); // Close any open dropdown
        setIsAlertOpen(true);
    };

    const executeDeleteUser = async () => {
        if (userToDeleteId === null) return;

        console.log("Delete user with ID:", userToDeleteId);
        setIsDeletingUser(true);

        try {
            // Assuming an API endpoint similar to roles for deleting a user
            const response = await fetch("/api/administration/user/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: userToDeleteId }),
            });
            const responseResult: ApiResult<void> = await response.json();
            // Unauthorized, redirect to login
            if (response.status === 401) { router.push('/login'); }

            if (!responseResult.success) {
                toast.error(responseResult.message || "Failed to process your request", {
                    description: responseResult.error || "Please try again."
                });
                setTimeout(() => {
                    router.push("/administration/users");
                }, 1200);
            } else {
                toast.success(responseResult.message || "your request has been successfully processed.");
                setIsAlertOpen(false); // Close dialog on success
                fetchUsers(); // Re-fetch users data
            }
        } catch (error) {
            console.error(`${logIdentifier}:`, error);
            toast.error("An error occurred while processing your request. Please try again.");
        } finally {
            setIsDeletingUser(false);
            setUserToDeleteId(null); // Reset user to delete
        }
    };

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

    const handleAlertDialogOpenChange = (open: boolean) => {
        setIsAlertOpen(open);
        if (!open) {
            setUserToDeleteId(null);
            if (isDeletingUser) { // Ensure isDeletingUser is reset if dialog is closed prematurely
                setIsDeletingUser(false);
            }
        }
    };


    const handleResetFilters = () => {
        setFilter("");
        setRoleId("");
        setOnlyLockedUsers(false);
        setSortColumn(null);
        setSortDirection(null);
    };

    return (
        <>
            <AlertDialog open={isAlertOpen} onOpenChange={handleAlertDialogOpenChange}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeletingUser}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={executeDeleteUser} disabled={isDeletingUser}>
                            {isDeletingUser ? "Deleting..." : "Continue"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className='flex flex-row'>
                <div className='flex-1'>

                    <div className="m-4 space-x-2">
                        <div className="row  items-center space-x-2">
                            <Label htmlFor="filter" className="block mb-2 font-medium">
                                {/* {t.administration.role.roleName}: */}
                                Filter:
                            </Label>
                            <Input
                                id="filter"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                // placeholder={t.administration.role.roleName}
                                className="w-full mb-4 p-2 border border-gray-300 rounded-md max-w-md"
                            />
                        </div>
                    </div>

                    <div className="m-4 space-x-2">
                        <div className='flex items-start space-x-2'>
                            <Checkbox
                                id="only-locked-users"
                                checked={!!onlyLockedUsers}
                                onCheckedChange={(checked) => setOnlyLockedUsers(checked === true)}
                            />
                            <Label htmlFor="only-locked-users" className="font-medium">
                                Only Locked Users
                                {/* {t.administration.role.default} */}
                            </Label>
                        </div>
                        <p>
                            {/* {t.administration.role.defaultRoleDescription} */}
                        </p>
                    </div>

                </div>
                <div className='flex-1'>
                    <div className="m-4 space-x-2">
                        <div className="row  items-center space-x-2">
                            <Label className="block mb-2 font-medium">
                                Filter by Role:
                            </Label>
                            <Select
                                value={roleId}
                                onValueChange={setRoleId}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roleOptions.map((role) => (
                                        <SelectItem key={role.id} value={role.id.toString()}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end space-x-4 m-4">
                <Button className='w-40' onClick={handleResetFilters}>Reset</Button>
                <Button className='w-40' onClick={fetchUsers}>Search</Button>
            </div>

            <div className="overflow-x-auto">
                {isFetchingUsers ? (
                    <div className="flex items-center justify-center p-4">
                        <span className="text-muted-foreground">Loading users...</span>
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
                                users.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center">
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.userName}</TableCell>
                                            <TableCell>{user.name} {user.surname}</TableCell>
                                            <TableCell>{user.emailAddress}</TableCell>
                                            <TableCell>{user.roles.map(r => r.roleName).join(", ")}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.isEmailConfirmed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {user.isEmailConfirmed ? 'Yes' : 'No'}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {user.isActive ? 'Yes' : 'No'}
                                                </span>
                                            </TableCell>
                                            <TableCell>{new Date(user.creationTime).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <DropdownMenu
                                                    open={openDropdownId === user.id}
                                                    onOpenChange={(open) => setOpenDropdownId(open ? user.id : null)}
                                                >
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onSelect={() => handleEditUser(user.id)}
                                                        >
                                                            Edit User
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onSelect={() => promptDeleteConfirmation(user.id)}
                                                        >
                                                            Delete User
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

        </>
    );


}
