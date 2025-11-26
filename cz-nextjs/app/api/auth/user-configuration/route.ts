import { GET_USER_CONFIGURATION } from "@/config/endpoint";
import { getAuthSession } from "@/lib/auth/session";
import { ApiResult } from "@/types/http/api-result";
import { NextResponse } from "next/server";

export async function GET() {
    const logIdentifier = "GetUserConfiguration";
    const apiResult: ApiResult<any> = {
        success: false,
    };

    try {
        const session = await getAuthSession();
        // Check if session and accessToken are available
        if (!session || !session.accessToken) {
            apiResult.message = "Authentication required";
            return NextResponse.json(apiResult, { status: 401 });
        }

        // Make the Remote API request
        const response = await fetch(`${GET_USER_CONFIGURATION}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            },
        });

        const responseData = await response.json();

        if (!response.ok) {
            apiResult.message = "Failed to fetch user configuration";
            return NextResponse.json(apiResult, { status: response.status });
        }

        // Return the API result
        apiResult.success = true;
        // Return the Result Data
        // The AbpUserConfiguration endpoint returns a large object. We are interested in auth.grantedPermissions
        apiResult.data = responseData.result;
        return NextResponse.json(apiResult, { status: 200 });
    } catch (error) {
        console.error(`${logIdentifier}: `, error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
