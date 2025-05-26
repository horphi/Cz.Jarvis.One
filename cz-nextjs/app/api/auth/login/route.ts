import { TOKEN_AUTH } from "@/config/endpoint";
import { extractSessionDataFromToken, getAuthSession } from "@/lib/auth/session";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { username, password } = await req.json();

    console.log("Login attempt with username:", username);

    // call login function
    try {
        const requestBody = JSON.stringify({
            UsernameOrEmailAddress: username,
            Password: password
        });

        const response = await fetch(TOKEN_AUTH, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: requestBody,
        });

        const data = await response.json();

        if (!response.ok) {
            // Handle error responses with specific messages for toast notifications
            let errorMessage = "Login failed. Please try again.";

            if (data.error?.message) {
                errorMessage = data.error.message;
            } else if (response.status === 400) {
                errorMessage = "Invalid request. Please check your input.";
            } else if (response.status === 401) {
                errorMessage = "Invalid username or password.";
            } else if (response.status === 500) {
                errorMessage = "Server error. Please try again later.";
            }

            return NextResponse.json({
                success: false,
                message: errorMessage
            }, {
                status: response.status
            });
        }

        // Login successful, process the tokens
        console.log("Login successful");

        // Get the current auth session
        const authSession = await getAuthSession();

        // Use our token decoder to extract user information
        const sessionData = extractSessionDataFromToken(
            data.result.accessToken,
            data.result.refreshToken
        );
        console.log("Session data extracted:", sessionData.accessToken);
        // Update all session fields
        authSession.userId = sessionData.userId;
        authSession.userName = sessionData.userName;
        authSession.userRole = sessionData.userRole;
        authSession.isLoggedIn = true;
        authSession.accessToken = sessionData.accessToken;
        authSession.refreshToken = data.result.refreshToken;
        authSession.firstName = sessionData.firstName;
        authSession.lastName = sessionData.lastName;
        authSession.email = sessionData.email;

        await authSession.save();

        // Return success response
        return NextResponse.json({
            success: true,
            userName: sessionData.userName,
            userRole: sessionData.userRole
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({
            success: false,
            message: "An unexpected error occurred. Please try again."
        }, {
            status: 500
        });
    }
}

// Error 200
// {
//     "result": {
//         "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJhZG1pbkBhc3BuZXR6ZXJvLmNvbSIsIkFzcE5ldC5JZGVudGl0eS5TZWN1cml0eVN0YW1wIjoiNVhQSFFGQ1NHR0pRQUxWNkkzNUpXRDZLTlJSSVdHVzMiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiIsInN1YiI6IjEiLCJqdGkiOiJkNDEyNDkzNC0zZmQwLTQ5MTctYTkwOC00OTcxNDQ1OTQ1MmMiLCJpYXQiOjE3NDU5ODcwODgsInRva2VuX3ZhbGlkaXR5X2tleSI6ImEwZDlhOGYxLTdjOTEtNGNhMC1iMWExLTQ5NjQxODI2MjMyZiIsInVzZXJfaWRlbnRpZmllciI6IjEiLCJ0b2tlbl90eXBlIjoiMCIsInJlZnJlc2hfdG9rZW5fdmFsaWRpdHlfa2V5IjoiOGQ4OTA1MjEtMjJlYS00Zjg3LTgxYTMtOTUwMTA5YzgwZDg4IiwibmJmIjoxNzQ1OTg3MDg4LCJleHAiOjE3NDYwNzM0ODgsImlzcyI6IkphcnZpcyIsImF1ZCI6IkphcnZpcyJ9.UMFjNSKRAmxGODkwOMqS-g63CrQG9Sgq5BYNLpPYtbw",
//             "encryptedAccessToken": "g+vUS9a8rbiEydkmQvUvd2+aK8iU2wgCBJNlQIzAFR6yBz4WBf5kzK16V3H8wWvdWmZemlVCFu1Fv7EYdsf8dxE4R867XsVoAHZQLplkqXW9oJGsgZv0s918R92GiRX/pjV5tbj4UMUxmBSXbD6ufnFUZa6oCu/CVEARrbWQ7BWdJ3UYD5+BAPyKmcG5opurFIFdzK04kOBg95ItLhbURsImX0b3dCqBcx+pqinth8yWON2usVWL/3K/zAponSSUzWnIGc757gOos50HwKUeMEfDdBhmwdtRH+o6z+KzexkM/Qosaw+YE10wjkXtxPqGY7dz281FN+QeksN6dBXLpZfFkRxfSJX7UoY3R/fSeqn+G8U9P/n/kWYjtgfd0TTHc3k0HHLDnJGryY5vcvpyhn7xRgSp7W8ot/u2YYFWKZ6h4rMNrEQEcrr+rU5M9hC3/WPCmjdmtSbr1xp1Gek9Ex9/YEY2bFlPFKPEZ4Xoo+7ythD/K5FlHU9bPiaK4cht1u8JIRwFXjxC/ocLZFXcrBS6Q/22LJnvy29x4o97xkYiJ1LFFbN/8BljrHosxv5BxcbefxH15JVCxYeJCCj6rr5ArVjpC2VwzNIOXPJQkO6ksiTfD68wUXz5vY1W8ry1Zolxre6QSI4O2RbFQ8M+NyuEnmLWw+9z6j5BLMJOs+y7fpOqHF2q1ULQj4KjXxtpNy5dji4Dk+6wEYFpQPHxzta4kWtD8dRyr6NiQ5VF1w/l1n9KIKy/LAkSK8aEeaD0RuXSRt027Cl8LUzfy+g61kutTM6rQMgEpWccaL3PqxcyOBcEqRnNLihIFfaRJ+g66401CYPoKZAtNTRKv+Q75Wd8cqKPU6Tr1ivgPQQR+ZDgujDHGh/9BJX0eq/KpkFZzDP+7SeLEHHNcTFioo1B3javFCy71DgymoqGMvOZBqrfdvksicyURqxPh+QjvhpJPeXhdLCrP0t4RddtHXe79AElMRb3pskPdERf02+kE0yfOsUe5gWICPRiZs5nTP5iCyz//EMr18cc5Y7RDhTLP6XWJDNMYSlqYnnKh569UrMrQhMOzO7mWIDuU9JCHkctLVULTYhfhS859uUwisdWX4NuTQjXQzh7473btcoGPdPe0m3N2wsaJh3ukULqYqjGDls/BUo7aj5yWQEGLoUFVAjvMd9OqRvZrQmOFAhIEb56mbovJVLWXCzfE9KNDQOpowZ2lEkUiZu3C6a2AfOCcjNZlVNBHEHGVR8Flruv7QnYDYETmtQixzHJlb/uPf9SdVEBRmGlfCeHzqbKLUkX+8IIOv412rSDh8M0MZK4cgY=",
//                 "expireInSeconds": 86400,
//                     "shouldResetPassword": false,
//                         "passwordResetCode": null,
//                             "userId": 1,
//                                 "requiresTwoFactorVerification": false,
//                                     "twoFactorAuthProviders": null,
//                                         "twoFactorRememberClientToken": null,
//                                             "returnUrl": null,
//                                                 "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJhZG1pbkBhc3BuZXR6ZXJvLmNvbSIsIkFzcE5ldC5JZGVudGl0eS5TZWN1cml0eVN0YW1wIjoiNVhQSFFGQ1NHR0pRQUxWNkkzNUpXRDZLTlJSSVdHVzMiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiIsInN1YiI6IjEiLCJqdGkiOiI2YzBkNzg0My0zOTlmLTQwYWEtOGQwZi1iNWY2OWM0NzY2MWYiLCJpYXQiOjE3NDU5ODcwODgsInRva2VuX3ZhbGlkaXR5X2tleSI6IjhkODkwNTIxLTIyZWEtNGY4Ny04MWEzLTk1MDEwOWM4MGQ4OCIsInVzZXJfaWRlbnRpZmllciI6IjEiLCJ0b2tlbl90eXBlIjoiMSIsIm5iZiI6MTc0NTk4NzA4OCwiZXhwIjoxNzc3NTIzMDg4LCJpc3MiOiJKYXJ2aXMiLCJhdWQiOiJKYXJ2aXMifQ.KI7vCnA41hgBbY7Tvrxa0Nu9b9DPU4ZIT_CKuSb_0eA",
//                                                     "refreshTokenExpireInSeconds": 31536000,
//                                                         "c": null
//     },
//     "targetUrl": null,
//         "success": true,
//             "error": null,
//                 "unAuthorizedRequest": false,
//                     "__abp": true
// }

// Error 400
// {
//     "result": null,
//         "targetUrl": null,
//             "success": false,
//                 "error": {
//         "code": 0,
//             "message": "Your request is not valid!",
//                 "details": "The following errors were detected during validation.\n - The UserNameOrEmailAddress field is required.\n",
//                     "validationErrors": [
//                         {
//                             "message": "The UserNameOrEmailAddress field is required.",
//                             "members": [
//                                 "userNameOrEmailAddress"
//                             ]
//                         }
//                     ]
//     },
//     "unAuthorizedRequest": false,
//         "__abp": true
// }


// Error 401
// {
//     "result": null,
//         "targetUrl": null,
//             "success": false,
//                 "error": {
//         "code": 0,
//             "message": "Invalid user name or password",
//                 "details": null,
//                     "validationErrors": null
//     },
//     "unAuthorizedRequest": true,
//         "__abp": true
// }


// Error 500
// {
//     "result": null,
//         "targetUrl": null,
//             "success": false,
//                 "error": {
//         "code": 0,
//             "message": "An internal error occurred during your request!",
//                 "details": null,
//                     "validationErrors": null
//     },
//     "unAuthorizedRequest": false,
//         "__abp": true
// }


