// api/auth/logout/route.ts
import { getAuthSession } from "@/lib/auth/session";
import { ApiResult } from "@/types/http/api-result";
import { NextResponse } from "next/server";

export async function POST() {
  const authSession = await getAuthSession();
  authSession.destroy();

  const apiResult: ApiResult<void> = {
    success: true,
    message: "Logout successful",
  };

  return NextResponse.json(apiResult, { status: 200 });
}
