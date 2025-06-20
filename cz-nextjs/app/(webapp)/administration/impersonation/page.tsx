"use client";

import { ImpersonationDialog } from '@/components/impersonation-dialog'
import { RoleGuard } from '@/components/role-guard'

export default function ImpersonationDemoPage() {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">User Impersonation Demo</h1>

            <div className="space-y-6">
                <RoleGuard requireAdmin>
                    <div className="p-4 border rounded-lg">
                        <h2 className="text-lg font-semibold mb-4">Admin Only: Start Impersonation</h2>
                        <p className="text-gray-600 mb-4">
                            As an admin, you can impersonate other users to troubleshoot issues or provide support.
                        </p>
                        <ImpersonationDialog />
                    </div>
                </RoleGuard>

                <div className="p-4 border rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">How Impersonation Works</h2>
                    <div className="space-y-2 text-sm text-gray-600">
                        <p>1. <strong>Admin users</strong> can start impersonation by entering a User ID</p>
                        <p>2. The system calls the <code>IMPERSONATE_USER</code> endpoint to get an impersonation token</p>
                        <p>3. Then uses the token with <code>IMPERSONATED_AUTHENTICATION</code> to get access token</p>            <p>4. The session is updated with the impersonated user&apos;s information</p>
                        <p>5. An orange banner appears at the top showing the impersonation status</p>
                        <p>6. Click &quot;End Impersonation&quot; to return to your original account</p>
                    </div>
                </div>

                <div className="p-4 border rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Security Features</h2>
                    <div className="space-y-2 text-sm text-gray-600">
                        <p>• Only admin users can start impersonation</p>
                        <p>• Original user session is preserved</p>
                        <p>• Clear visual indication when impersonating</p>
                        <p>• Easy way to end impersonation</p>
                        <p>• Server-side validation of impersonation requests</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
