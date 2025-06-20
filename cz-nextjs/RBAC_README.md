# Role-Based Access Control (RBAC) Implementation

This document describes the role-based access control system implemented in the application.

## Overview

The RBAC system provides both client-side and server-side access control based on user roles. It includes:

- **Navigation filtering**: Hide navigation items based on user roles
- **Component-level access control**: Show/hide components based on roles
- **Route protection**: Server-side middleware to protect routes
- **Utility functions**: Helper functions for role checking

## Key Components

### 1. Role Utilities (`lib/auth/role-utils.ts`)

Utility functions for role checking:

```typescript
import { hasRole, hasAnyRole, isAdmin } from '@/lib/auth/role-utils'

// Check if user has a specific role
const canEdit = hasRole(userRoles, 'editor')

// Check if user has any of multiple roles
const canModerate = hasAnyRole(userRoles, ['admin', 'moderator'])

// Check if user is an admin
const isUserAdmin = isAdmin(userRoles)
```

### 2. Authentication Hook (`hooks/use-auth.ts`)

React hook for authentication state and role checking:

```typescript
import { useAuth } from '@/hooks/use-auth'

function MyComponent() {
  const { session, isLoading, hasRole, isAdmin } = useAuth()
  
  if (isLoading) return <div>Loading...</div>
  
  return (
    <div>
      {isAdmin() && <AdminButton />}
      {hasRole('editor') && <EditButton />}
    </div>
  )
}
```

### 3. RoleGuard Component (`components/role-guard.tsx`)

Conditional rendering based on roles:

```typescript
import { RoleGuard } from '@/components/role-guard'

// Require admin access
<RoleGuard requireAdmin>
  <AdminPanel />
</RoleGuard>

// Require any of multiple roles
<RoleGuard requiredRoles={['admin', 'moderator']} fallback={<div>Access denied</div>}>
  <ModeratorContent />
</RoleGuard>

// Require specific role, hide when no access
<RoleGuard role="user" hideWhenNoAccess>
  <UserOnlyButton />
</RoleGuard>
```

### 4. Navigation System

The sidebar navigation automatically filters based on user roles:

#### Navigation Configuration (`components/layout/data/nav-group.ts`)

```typescript
export const navGroupData: NavGroup[] = [
  {
    title: "Administration",
    requiredRoles: ["admin", "administrator"], // Only admins see this
    items: [
      // admin menu items
    ],
  },
  {
    title: "General",
    // No requiredRoles means everyone sees this
    items: [
      // general menu items
    ],
  },
]
```

### 5. Server-Side Protection (`middleware.ts`)

Automatic route protection:

```typescript
// Routes starting with /administration are automatically protected
// Only users with admin/administrator roles can access them
// Non-admin users are redirected to /dashboard
```

## Session API

### GET `/api/auth/session`

Returns current user session data:

```json
{
  "isLoggedIn": true,
  "userId": "user123",
  "userName": "johndoe",
  "userRole": ["admin", "user"],
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com"
}
```

## Usage Examples

### 1. Hide Admin Navigation

The administration section is automatically hidden for non-admin users.

### 2. Conditional Button Rendering

```typescript
function ActionButton() {
  const { hasRole } = useAuth()
  
  return (
    <div>
      {hasRole('admin') && <DeleteButton />}
      {hasRole('editor') && <EditButton />}
      <ViewButton /> {/* Everyone can see this */}
    </div>
  )
}
```

### 3. Page-Level Protection

```typescript
import { RoleGuard } from '@/components/role-guard'

export default function AdminPage() {
  return (
    <RoleGuard requireAdmin fallback={<div>You don't have admin access</div>}>
      <AdminDashboard />
    </RoleGuard>
  )
}
```

### 4. Nested Role Requirements

```typescript
function ComplexComponent() {
  return (
    <div>
      <RoleGuard requiredRoles={['admin', 'moderator']}>
        <ModerationPanel />
        
        <RoleGuard requireAdmin>
          <AdminOnlySettings />
        </RoleGuard>
      </RoleGuard>
    </div>
  )
}
```

## Security Considerations

1. **Client-side only**: The current implementation is primarily client-side. For sensitive operations, always verify permissions server-side.

2. **Server-side middleware**: The middleware provides server-side route protection for admin routes.

3. **Fallback behavior**: When session fetch fails, the system defaults to hiding restricted content (fail-safe).

4. **Case-insensitive**: Role checking is case-insensitive for better reliability.

## Extending the System

### Adding New Roles

1. Update your authentication system to include the new role in JWT tokens
2. Add the role to navigation groups or use RoleGuard components
3. Update middleware if route protection is needed

### Adding New Protected Routes

Update the `ADMIN_ROUTES` array in `middleware.ts`:

```typescript
const ADMIN_ROUTES = [
  '/administration',
  '/admin',
  '/super-admin', // New protected route
]
```

### Custom Role Logic

Create custom role checking functions in `role-utils.ts`:

```typescript
export function canEditPosts(userRoles: string[]): boolean {
  return hasAnyRole(userRoles, ['admin', 'editor', 'author'])
}

export function canDeleteUsers(userRoles: string[]): boolean {
  return hasRole(userRoles, 'admin') // Only admins
}
```

## Testing Role-Based Access

1. **Login as different users** with different roles
2. **Check navigation**: Verify that admin sections appear/disappear
3. **Check components**: Ensure RoleGuard components work correctly
4. **Check routes**: Try accessing admin routes without proper roles
5. **Check API**: Verify session endpoint returns correct role information

## Troubleshooting

### Navigation not filtering correctly
- Check that `requiredRoles` is set correctly in nav-group.ts
- Verify session API returns correct roles
- Check browser console for errors

### RoleGuard not working
- Ensure `useAuth` hook is working
- Check that roles are formatted correctly (case-insensitive)
- Verify session data structure

### Middleware redirect loops
- Check that redirect target routes don't require the same role
- Ensure login route is accessible
- Review middleware matcher configuration
