'use client';
import { Button } from "@/components/ui/button";
import { useCreateOrEditUserContext } from "@/context/administration/user-context";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiResult } from "@/types/http/api-result";

export default function SaveUserButton() {
    const logIdentifier = "SaveUserButton";
    const {
        id,
        firstName,
        surName,
        userName,
        emailAddress,
        password,
        confirmPassword,
        shouldChangePasswordOnNextLogin,
        isTwoFactorEnabled,
        assignedRoleNames,
        sendActivationEmail,
        setRandomPassword,
        isActive,
        isLockoutEnabled } = useCreateOrEditUserContext();
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        setSubmitting(true);

        // Form Validation
        if (!isFormValid()) {
            setSubmitting(false);
            return;
        }

        // Prepare the payload
        const requestBody = {
            id: id || null,
            firstName,
            surName,
            userName,
            emailAddress,
            password,
            shouldChangePasswordOnNextLogin,
            isTwoFactorEnabled,
            assignedRoleNames,
            sendActivationEmail,
            setRandomPassword,
            isActive,
            isLockoutEnabled
        };


        try {
            const response = await fetch("/api/administration/user/create-or-update", {
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
                toast.success(responseResult.message || "your request has been successfully processed.");
                setTimeout(() => {
                    router.push("/administration/users");
                }, 1200);
            }
        } catch (error) {
            console.error(`${logIdentifier}:`, error);
            toast.error("An error occurred while processing your request. Please try again.");
        }
        finally {
            setSubmitting(false);
        }
    }


    function isFormValid() {
        const validationError: string[] = [];
        if (!firstName) {
            validationError.push("First name is required.");
        }
        if (!surName) {
            validationError.push("Surname is required.");
        }
        if (!userName) {
            validationError.push("Username is required.");
        }
        if (!emailAddress) {
            validationError.push("Email address is required.");
        }
        if (!password && id === null && setRandomPassword) {
            // Only validate password if it's a new user or random password is set
            validationError.push("Password is required.");
        }
        if ((password && password !== confirmPassword) && id !== null) {
            validationError.push("Passwords do not match.");
        }
        if (assignedRoleNames.length === 0) {
            validationError.push("At least one role must be assigned.");
        }
        if (validationError.length > 0) {
            toast.error(validationError.join(" "));
            return false;
        }
        return true;

    }

    return (
        <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Save"}
        </Button>
    );
}
