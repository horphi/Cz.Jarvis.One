"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TRole } from "@/types/roles/i-role";
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
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const RolesDataTable = () => {
    const router = useRouter();
    const [roles, setRoles] = useState<{ items: TRole[] }>({ items: [] });
    const [isFetchingRoles, setIsFetchingRoles] = useState(false);
    const [isDeletingRole, setIsDeletingRole] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [roleToDeleteId, setRoleToDeleteId] = useState<number | null>(null);
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

    const fetchRoles = useCallback(async () => {
        setIsFetchingRoles(true);
        try {
            const response = await fetch("/api/administration/role/get-roles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ Permissions: [] }),
            });

            console.log("Response from get-roles:", response);

            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/login');
                }
                throw new Error("Failed to fetch roles");
            }

            const data = await response.json();
            setRoles(data.data || { items: [] });
        } catch (error) {
            console.error(error);
            setRoles({ items: [] });
            toast.error("Failed to fetch roles.");
        } finally {
            setIsFetchingRoles(false);
        }
    }, [router]);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const handleEditRole = (roleId: number) => {
        console.log("Edit role with ID:", roleId);
        router.push("/administration/roles/edit/" + roleId);
    };

    const promptDeleteConfirmation = (roleId: number) => {
        setRoleToDeleteId(roleId);
        setOpenDropdownId(null); // Close any open dropdown
        setIsAlertOpen(true);
    };

    const executeDeleteRole = async () => {
        if (roleToDeleteId === null) return;

        console.log("Delete role with ID:", roleToDeleteId);
        setIsDeletingRole(true);

        try {
            const response = await fetch("/api/administration/role/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ roleId: roleToDeleteId }),
            });
            const data = await response.json();

            if (data.success) {
                toast.success(data.message || "Role deleted successfully.");
                setIsAlertOpen(false); // Close dialog on success
                fetchRoles(); // Re-fetch roles data
            } else {
                toast.error(data.message || "Failed to delete role.");
            }

        } catch (error) {
            console.error("Failed to delete Role", error);
            toast.error("An error occurred while deleting the role.");
        } finally {
            setIsDeletingRole(false);
        }
    };

    const handleAlertDialogOpenChange = (open: boolean) => {
        setIsAlertOpen(open);
        if (!open) {
            setRoleToDeleteId(null);
            if (isDeletingRole) {
                setIsDeletingRole(false);
            }
        }
    };

    return (
        <>
            <AlertDialog open={isAlertOpen} onOpenChange={handleAlertDialogOpenChange}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the role.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeletingRole}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={executeDeleteRole} disabled={isDeletingRole}>
                            {isDeletingRole ? "Deleting..." : "Continue"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {isFetchingRoles ? ( // Main page loader only depends on isFetchingRoles
                <div className="flex justify-center items-center min-h-[300px]">
                    <div className="text-center">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                        <p>Loading...</p>
                    </div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Display Name</TableHead>
                                <TableHead>Static</TableHead>
                                <TableHead>Default</TableHead>
                                <TableHead>Creation Time</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.items.map((role: TRole) => (
                                <TableRow key={role.id}>
                                    <TableCell>{role.name}</TableCell>
                                    <TableCell>{role.displayName}</TableCell>
                                    <TableCell>{role.isStatic ? "Yes" : "No"}</TableCell>
                                    <TableCell>{role.isDefault ? "Yes" : "No"}</TableCell>
                                    <TableCell>{new Date(role.creationTime).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <DropdownMenu
                                            open={openDropdownId === role.id}
                                            onOpenChange={(open) => setOpenDropdownId(open ? role.id : null)}
                                        >
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onSelect={() => handleEditRole(role.id)}
                                                >
                                                    Edit Role
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onSelect={() => promptDeleteConfirmation(role.id)}
                                                    disabled={role.isStatic}
                                                    className={role.isStatic ? "cursor-not-allowed text-muted-foreground" : "cursor-pointer"}
                                                >
                                                    Delete Role
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </>
    );
};

export default RolesDataTable;
