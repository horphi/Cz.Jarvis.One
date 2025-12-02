/**
 * Re-export useAuth from auth-context for backward compatibility
 * This allows existing imports to continue working without changes
 *
 * @deprecated Consider importing directly from '@/context/auth-context' instead
 */
export { useAuth } from "@/context/auth-context";
