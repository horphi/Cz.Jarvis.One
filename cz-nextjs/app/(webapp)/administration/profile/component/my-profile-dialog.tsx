import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TUserLoginInfo } from "@/types/users/user-type"
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/app-context"
import { ApiResult } from "@/types/http/api-result"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
interface MyProfileDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function MyProfileDialog({ open, onOpenChange }: MyProfileDialogProps) {
    const logIdentifier = "UsersDataTable";

    const { userSession } = useAppContext();
    const user: TUserLoginInfo | null = userSession;
    const router = useRouter();
    const [firstName, setFirstName] = useState(user?.name || '');
    const [lastName, setLastName] = useState(user?.surname || '');
    const [email, setEmail] = useState(user?.emailAddress || '');

    useEffect(() => {
        if (user) {
            setFirstName(user.name || '');
            setLastName(user.surname || '');
            setEmail(user.emailAddress || '');
        }
    }, [user]);

    const handleSaveChanges = async () => {
        if (!user) return;

        try {

            const requestBody = {
                userName: user.userName,
                firstName: firstName,
                lastName: lastName,
                emailAddress: email,
            };

            const response = await fetch("/api/administration/profile/update-current-user-profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            const responseResult: ApiResult<void> = await response.json();

            // Unauthorized, redirect to login
            if (response.status === 401) { router.push('/login'); }

            if (!responseResult.success) {
                toast.error(responseResult.message || "Failed to process your request", {
                    description: responseResult.error || "Please try again."
                });
                return;
            } else {
                // Response is Successful 
                onOpenChange(false); // Close dialog on sucßcess
                toast.success(responseResult.message || "your request has been successfully processed.");
            }

        } catch (error) {
            console.error(`${logIdentifier}:`, error);
            toast.error("An error occurred while processing your request. Please try again.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you are done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="userName" className="text-right">
                            User Name
                        </Label>
                        <Input
                            id="userName"
                            defaultValue={user?.userName}
                            className="col-span-3"
                            readOnly={true}
                            disabled={true}
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="firstName" className="text-right">
                            First Name
                        </Label>
                        <Input
                            id="name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="surName" className="text-right">
                            Last Name
                        </Label>
                        <Input
                            id="surName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="emailAddress" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="emailAddress"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSaveChanges}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


// {
//   "name": "string",
//   "surname": "string",
//   "userName": "string",
//   "emailAddress": "string",
//   "phoneNumber": "string",
//   "isPhoneNumberConfirmed": true,
//   "timezone": "string",
//   "qrCodeSetupImageUrl": "string",
//   "isGoogleAuthenticatorEnabled": true
// }