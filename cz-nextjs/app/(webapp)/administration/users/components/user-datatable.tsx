"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useCallback, use } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IRole } from "@/types/roles/i-role";
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
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from '@/types/users/user-type';


export default function UsersDataTable() {
    const router = useRouter();
    const [users, setUsers] = useState<{ items: User[] }>({ items: [] });
    const [isFetchingUsers, setIsFetchingUsers] = useState(false);
    // Filter properties
    const [filter, setFilter] = useState("");
    const [onlyLockedUsers, setOnlyLockedUsers] = useState(false);
    const [roleName, setRoleName] = useState("");
    const [permissions, setPermissions] = useState<string[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
    const [roleOptions, setRoleOptions] = useState<{ id: number; name: string }[]>([]);

    const fetchUsers = useCallback(async () => {
        setIsFetchingUsers(true);

        const requestBody = {
            maxResultCount: 25,
            skipCount: 0,
            sorting: "id asc",
            filter: filter,
            permissions: permissions,
            role: roleName ? roleName : null,
            onlyLockedUsers: onlyLockedUsers,
        };
        console.log("Request Body:", requestBody.filter);
        // Reset users to empty before fetching

        try {
            const response = await fetch("/api/administration/user/get-users", {
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
                throw new Error("Failed to fetch roles");
            }

            const data = await response.json();
            setUsers(data.data || { items: [] });
        } catch (error) {
            console.error(error);
            setUsers({ items: [] });
            toast.error("Failed to fetch users.");
        } finally {
            setIsFetchingUsers(false);
        }
    }, [filter, onlyLockedUsers, permissions, roleName, router]);


    // Fetch roles for dropdown
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch("/api/administration/role/get-roles", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ Permissions: [] }),
                });
                if (!response.ok) throw new Error("Failed to fetch roles");
                const data = await response.json();
                // Assuming data.data.items is an array of roles
                setRoleOptions((data.data?.items ?? []).map((role: IRole) => ({
                    id: role.id,
                    name: role.displayName || role.name,
                })));
            } catch (error) {
                console.error(error);
                // setRoles({ items: [] });
                toast.error("Failed to fetch roles.");
                setRoleOptions([]);
            }
        };
        fetchRoles();
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleResetFilters = () => {
        setFilter("");
        setRoleName("");
        setOnlyLockedUsers(false);
    };

    if (isFetchingUsers) {
        <div className="flex justify-center items-center min-h-[300px]">
            <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                <p>Loading...</p>
            </div>
        </div>
    }

    return (
        <>
            <div className='flex flex-row'>
                <div className='flex-1'>

                    <div className="m-4 space-x-2">
                        <div className="row  items-center space-x-2">
                            <Label htmlFor="role-name" className="block mb-2 font-medium">
                                {/* {t.administration.role.roleName}: */}
                                Filter:
                            </Label>
                            <Input
                                id="role-name"
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
                                value={roleName}
                                onValueChange={setRoleName}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roleOptions.map((role) => (
                                        <SelectItem key={role.id} value={role.name}>
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
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-1/4">User Name</TableHead>
                            <TableHead className="w-1/4">Full Name</TableHead>
                            <TableHead className="w-1/4">Email</TableHead>
                            <TableHead className="w-1/4">Role</TableHead>
                            <TableHead className="w-1/4">Email Confirmed</TableHead>
                            <TableHead className="w-1/4">Active</TableHead>
                            <TableHead className="w-1/4">Creation Time</TableHead>
                            <TableHead className="w-1/4">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            users.items.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.items.map((user) => (
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
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {/* Add actions here */}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )
                        }
                        {/* Map through users data here */}
                        {/* Example row */}
                    </TableBody>
                </Table>
            </div>

        </>
    );


}


//  <div className="flex flex-col sm:flex-row sm:space-x-8 px-2 ">
//                 {/* RoleContent */}
//                 <div className="flex-1 flex flex-col justify-start">
//                     <div className="mb-4  space-x-2">
//                         <Label htmlFor="role-name" className="block mb-2 font-medium">
//                             {/* {t.administration.role.roleName}: */}
//                             Filter:
//                         </Label>
//                         <Input
//                             id="role-name"
//                             value={filter}
//                             onChange={(e) => setFilter(e.target.value)}
//                             // placeholder={t.administration.role.roleName}
//                             className="w-full mb-4 p-2 border border-gray-300 rounded-md max-w-xl"
//                         />
//                     </div>
//                     {/* Make checkbox and label inline */}
//                     <div className="mb-4 flex items-center space-x-2">
//                         <Checkbox
//                             id="only-locked-users"
//                             checked={!!onlyLockedUsers}
//                             onCheckedChange={(checked) => setOnlyLockedUsers(checked === true)}
//                         />
//                         <Label htmlFor="only-locked-users" className="font-medium">
//                             Only Locked Users
//                             {/* {t.administration.role.default} */}
//                         </Label>
//                     </div>
//                     <div className="text-sm text-gray-500 ml-6">
//                         <p>
//                             {/* {t.administration.role.defaultRoleDescription} */}
//                         </p>
//                     </div>
//                 </div>
//                 {/*Permission */}
//                 {/* <div className="flex-1 flex flex-col justify-start">
//                     <Label className="block mb-2 font-medium">
//                         Filter by Role:
//                     </Label>
//                     <div className="border border-gray-300 rounded-md p-4 h-fit overflow-y-auto">
{/* <Select
    value={roleName}
    onValueChange={setRoleName}
>
    <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a role" />
    </SelectTrigger>
    <SelectContent>
        {roleOptions.map((role) => (
            <SelectItem key={role.id} value={role.name}>
                {role.name}
            </SelectItem>
        ))}
    </SelectContent>
</Select> */}
//                     </div>
//                 </div> */}

//             </div>