'use client';
import { Button } from "@/components/ui/button";
import { useCreateRoleContext } from "@/context/administration/role-context";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SaveRoleButton() {
    const { id, roleName, isDefault, selectedPermissions } = useCreateRoleContext();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        setSubmitting(true);

        if (!roleName) {
            toast.error("Role name is required.");
            setSubmitting(false);
            return;
        }

        if (selectedPermissions.length === 0) {
            toast.error("At least one permission is required.");
            setSubmitting(false);
            return;
        }

        const payload = {
            id: id || null,
            roleName: roleName,
            isDefault: isDefault,
            permissions: selectedPermissions
        };

        try {

            const response = await fetch("/api/administration/role/create-or-update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (data.success) {
                toast.success(data.message || "Role saved successfully.");
                setTimeout(() => {
                    router.push("/administration/roles");
                }, 1200);
            } else {
                toast.error(data.message || "Failed to save role.");
            }
        } catch (error) {
            console.error("Error saving role:", error);
            toast.error("An unexpected error occurred while saving the role.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Save"}
        </Button>
    );
}