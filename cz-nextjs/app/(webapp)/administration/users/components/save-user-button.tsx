'use client';
import { Button } from "@/components/ui/button";
import { useCreateOrEditUserContext } from "@/context/administration/user-context";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SaveUserButton() {
    const {
        id,
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
            const data = await response.json();

            if (data.success) {
                toast.success(data.message || "User saved successfully.");
                setTimeout(() => {
                    router.push("/administration/users");
                }, 1200);
            } else {
                toast.error(data.message || "Failed to save user.");
            }
        } catch (error) {
            console.error("Error during user form submission:", error);
            toast.error("An unexpected error occurred while saving the user.");
        }
        finally {
            setSubmitting(false);
        }


    }


    function isFormValid() {
        const validatoinErrors: string[] = [];
        if (!firstName) {
            validatoinErrors.push("First name is required.");
        }
        if (!surName) {
            validatoinErrors.push("Surname is required.");
        }
        if (!userName) {
            validatoinErrors.push("Username is required.");
        }
        if (!emailAddress) {
            validatoinErrors.push("Email address is required.");
        }
        if (!password && id === null && setRandomPassword) {
            // Only validate password if it's a new user or random password is set
            validatoinErrors.push("Password is required.");
        }
        if (assignedRoleNames.length === 0) {
            validatoinErrors.push("At least one role must be assigned.");
        }
        if (validatoinErrors.length > 0) {
            toast.error(validatoinErrors.join(" "));
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
