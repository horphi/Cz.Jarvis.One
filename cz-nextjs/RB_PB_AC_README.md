# Role-Based and Permission-Based Access Control (RBAC/PBAC) Implementation

This document describes the role-based and permission-based access control system implemented in the application.

## Overview

The access control system provides both client-side and server-side access control based on user roles and permissions. It includes:

- **Navigation filtering**: Hide navigation items based on user roles or permissions
- **Component-level access control**: Show/hide components based on roles or permissions
- **Route protection**: Server-side middleware to protect routes
- **Utility functions**: Helper functions for role and permission checking
- **Permission management**: Granular permission-based access control from backend

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

React hook for authentication state, role checking, and permission checking:

```typescript
import { useAuth } from '@/hooks/use-auth'

function MyComponent() {
  const { session, isLoading, hasRole, hasPermission, isAdmin } = useAuth()
  
  if (isLoading) return <div>Loading...</div>
  
  return (
    <div>
      {/* Role-based access */}
      {isAdmin() && <AdminButton />}
      {hasRole('editor') && <EditButton />}
      
      {/* Permission-based access */}
      {hasPermission('Pages.Administration.Users') && <UserManagement />}
      {hasPermission('Pages.Administration.Roles') && <RoleManagement />}
    </div>
  )
}
```

### 3. RoleGuard Component (`components/role-guard.tsx`)

Conditional rendering based on roles or permissions:

```typescript
import { RoleGuard } from '@/components/role-guard'

// Require admin access (role-based)
<RoleGuard requireAdmin>
  <AdminPanel />
</RoleGuard>

// Require any of multiple roles
<RoleGuard requiredRoles={['admin', 'moderator']} fallback={<div>Access denied</div>}>
  <ModeratorContent />
</RoleGuard>

// Require specific permission (permission-based)
<RoleGuard permission="Pages.Administration.Users" hideWhenNoAccess>
  <UserManagement />
</RoleGuard>

// Require any of multiple permissions
<RoleGuard requiredPermissions={['Pages.Administration.Users', 'Pages.Administration.Roles']}>
  <AdministrationPanel />
</RoleGuard>

// Combine roles and permissions (OR logic)
<RoleGuard 
  requiredRoles={['admin']} 
  requiredPermissions={['Pages.Administration.Users']}
  fallback={<div>Access denied</div>}
>
  <UserManagement />
</RoleGuard>
```

### 4. Navigation System

The sidebar navigation automatically filters based on user roles and permissions:

#### Navigation Configuration (`components/layout/data/nav-group.ts`)

```typescript
export const navGroupData: NavGroup[] = [
  {
    title: "Administration",
    requiredRoles: ["admin", "administrator"], // Role-based filtering
    requiredPermissions: ["Pages.Administration"], // Permission-based filtering
    items: [
      {
        title: "Users",
        url: "/administration/users",
        icon: Users,
        requiredPermissions: ["Pages.Administration.Users"], // Item-level permission
      },
      {
        title: "Roles",
        url: "/administration/roles",
        icon: Shield,
        requiredPermissions: ["Pages.Administration.Roles"],
      },
    ],
  },
  {
    title: "General",
    // No requiredRoles or requiredPermissions means everyone sees this
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
  "email": "john@example.com",
  "grantedPermissions": {
    "Pages.Administration": "true",
    "Pages.Administration.Users": "true",
    "Pages.Administration.Roles": "true"
  }
}
```

### GET `/api/auth/user-configuration`

Returns user configuration including permissions from the backend:

```json
{
  "success": true,
  "data": {
    "auth": {
      "grantedPermissions": {
        "Pages.Administration": "true",
        "Pages.Administration.Users": "true",
        "Pages.Administration.Roles": "true"
      }
    }
  }
}
```

## Usage Examples

### 1. Hide Admin Navigation

The administration section is automatically hidden for users without the required roles or permissions.

### 2. Conditional Button Rendering (Role-Based)

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

### 2b. Conditional Button Rendering (Permission-Based)

```typescript
function ActionButton() {
  const { hasPermission } = useAuth()
  
  return (
    <div>
      {hasPermission('Pages.Users.Delete') && <DeleteButton />}
      {hasPermission('Pages.Users.Edit') && <EditButton />}
      <ViewButton /> {/* Everyone can see this */}
    </div>
  )
}
```

### 3. Page-Level Protection (Role-Based)

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

### 3b. Page-Level Protection (Permission-Based)

```typescript
import { RoleGuard } from '@/components/role-guard'

export default function UserManagementPage() {
  return (
    <RoleGuard 
      permission="Pages.Administration.Users" 
      fallback={<div>You don't have permission to manage users</div>}
    >
      <UserManagementDashboard />
    </RoleGuard>
  )
}
```

### 4. Nested Role and Permission Requirements

```typescript
function ComplexComponent() {
  return (
    <div>
      {/* Nested role-based guards */}
      <RoleGuard requiredRoles={['admin', 'moderator']}>
        <ModerationPanel />
        
        <RoleGuard requireAdmin>
          <AdminOnlySettings />
        </RoleGuard>
      </RoleGuard>
      
      {/* Nested permission-based guards */}
      <RoleGuard permission="Pages.Administration">
        <AdministrationPanel />
        
        <RoleGuard permission="Pages.Administration.Users">
          <UserManagement />
        </RoleGuard>
      </RoleGuard>
    </div>
  )
}
```

### 5. Using Permissions in useAuth Hook

```typescript
import { useAuth } from '@/hooks/use-auth'

function UserActions() {
  const { hasPermission, isGranted } = useAuth()
  
  // Both hasPermission and isGranted work the same way
  const canManageUsers = hasPermission('Pages.Administration.Users')
  const canManageRoles = isGranted('Pages.Administration.Roles')
  
  return (
    <div>
      {canManageUsers && <button>Manage Users</button>}
      {canManageRoles && <button>Manage Roles</button>}
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
