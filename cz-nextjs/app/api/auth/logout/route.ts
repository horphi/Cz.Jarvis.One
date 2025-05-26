import { getAuthSession } from "@/lib/auth/session";
import { NextResponse } from "next/server";

export async function POST() {
    const authSession = await getAuthSession();
    authSession.destroy();
    return NextResponse.json({ isLoggedIn: false });
}
