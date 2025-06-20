# User Impersonation Feature

This document describes the user impersonation functionality that allows admin users to temporarily act as other users for support and troubleshooting purposes.

## Overview

The impersonation feature allows administrators to:
- Switch to another user's account temporarily
- Maintain their original session for easy return
- See the application from the impersonated user's perspective
- End impersonation at any time to return to their original account

## API Endpoints

### Backend Endpoints (from endpoint.ts)
- `IMPERSONATE_USER`: Start impersonation process
- `IMPERSONATED_AUTHENTICATION`: Get access token for impersonated user
- `BACK_TO_IMPERSONATOR`: Signal end of impersonation

### Frontend API Routes
- `POST /api/auth/impersonate`: Start impersonation
- `POST /api/auth/end-impersonation`: End impersonation
- `GET /api/auth/session`: Get session info (includes impersonation status)

## Implementation Flow

### Starting Impersonation

1. **Admin Authorization Check**
   ```typescript
   // Only admin users can impersonate
   if (!session.userRole?.some(role => 
     ['admin', 'administrator'].includes(role.toLowerCase())
   )) {
     return error(403, "Admin privileges required")
   }
   ```

2. **Get Impersonation Token**
   ```typescript
   const response = await fetch(IMPERSONATE_USER, {
     method: "POST",
     headers: { Authorization: `Bearer ${session.accessToken}` },
     body: JSON.stringify({ userId })
   })
   // Returns: { result: { impersonationToken: "uuid" } }
   ```

3. **Get Impersonated Access Token**
   ```typescript
   const authResponse = await fetch(
     `${IMPERSONATED_AUTHENTICATION}${impersonationToken}`,
     { method: "POST" }
   )
   // Returns: { result: { accessToken: "jwt_token" } }
   ```

4. **Update Session**
   ```typescript
   // Store original session data
   session.isImpersonating = true
   session.impersonationToken = impersonationToken
   session.originalUserId = session.userId
   session.originalAccessToken = session.accessToken
   
   // Update with impersonated user data
   session.userId = impersonatedSessionData.userId
   session.accessToken = impersonatedSessionData.accessToken
   // ... other user fields
   ```

### Ending Impersonation

1. **Call Backend API**
   ```typescript
   await fetch(BACK_TO_IMPERSONATOR, {
     method: "POST",
     headers: { Authorization: `Bearer ${impersonatedAccessToken}` }
   })
   ```

2. **Get Fresh Original Token**
   ```typescript
   const authResponse = await fetch(
     `${IMPERSONATED_AUTHENTICATION}${impersonationToken}`,
     { method: "POST" }
   )
   ```

3. **Restore Session**
   ```typescript
   // Restore original user data
   session.userId = session.originalUserId
   session.accessToken = freshOriginalToken
   
   // Clear impersonation data
   session.isImpersonating = false
   session.impersonationToken = undefined
   ```

## Components

### 1. ImpersonationDialog (`components/impersonation-dialog.tsx`)
Modal dialog for starting impersonation:
```tsx
<ImpersonationDialog 
  trigger={<Button>Impersonate User</Button>} 
/>

// Or use default trigger
<ImpersonationDialog />
```

Features:
- Input field for User ID
- Loading states
- Error handling
- Admin-only visibility

### 2. ImpersonationBanner (`components/impersonation-banner.tsx`)
Banner shown when impersonating:
```tsx
<ImpersonationBanner />
```

Features:
- Shows current impersonated user
- Shows original user name
- "End Impersonation" button
- Orange warning styling
- Auto-hides when not impersonating

### 3. useImpersonation Hook (`hooks/use-impersonation.ts`)
React hook for impersonation functionality:
```tsx
const { 
  impersonationState, 
  startImpersonation, 
  endImpersonation 
} = useImpersonation()

// Start impersonation
await startImpersonation("user123")

// End impersonation
await endImpersonation()
```

### 4. Extended useAuth Hook
Now includes impersonation status:
```tsx
const { isImpersonating, session } = useAuth()

if (isImpersonating) {
  console.log(`Impersonating: ${session.userName}`)
  console.log(`Original user: ${session.originalUserName}`)
}
```

## Session Data Structure

Extended `AuthSessionData` interface:
```typescript
interface AuthSessionData {
  // ... existing fields
  isImpersonating?: boolean
  impersonationToken?: string
  originalUserId?: string
  originalUserName?: string
  originalAccessToken?: string
}
```

## Security Features

### 1. Admin-Only Access
- Only users with 'admin' or 'administrator' roles can impersonate
- Server-side role validation on all impersonation endpoints

### 2. Session Preservation
- Original user session is preserved and restored when ending impersonation
- Impersonation token is securely stored for proper cleanup

### 3. Visual Indicators
- Clear orange banner when impersonating
- Shows both impersonated and original user names
- Easy access to end impersonation

### 4. Server-Side Validation
- All impersonation requests validated server-side
- JWT tokens properly handled and refreshed

## Usage Examples

### 1. Admin Dashboard Integration
```tsx
// In admin user management page
function UserRow({ user }) {
  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>
        <ImpersonationDialog 
          trigger={
            <Button size="sm" variant="outline">
              Impersonate
            </Button>
          }
        />
      </td>
    </tr>
  )
}
```

### 2. Layout Integration
```tsx
// In main layout
export default function Layout({ children }) {
  return (
    <div>
      <Header />
      <ImpersonationBanner />
      <main>{children}</main>
    </div>
  )
}
```

### 3. Role-Based Components
```tsx
function AdminToolbar() {
  const { isAdmin } = useAuth()
  
  if (!isAdmin()) return null
  
  return (
    <div className="admin-toolbar">
      <ImpersonationDialog />
      {/* other admin tools */}
    </div>
  )
}
```

## Testing

### Test Scenarios

1. **Start Impersonation**
   - Login as admin user
   - Navigate to impersonation page or user management
   - Enter valid User ID and start impersonation
   - Verify session updates and banner appears

2. **During Impersonation**
   - Check that navigation reflects impersonated user's roles
   - Verify API requests use impersonated access token
   - Confirm banner shows correct user information

3. **End Impersonation**
   - Click "End Impersonation" button
   - Verify return to original user session
   - Check that banner disappears
   - Confirm original user's permissions restored

4. **Error Handling**
   - Test with invalid User ID
   - Test impersonation by non-admin user
   - Test network failures during impersonation

### Manual Testing Steps

1. Create admin and regular user accounts
2. Login as admin user
3. Navigate to `/administration/impersonation`
4. Start impersonation with regular user ID
5. Navigate around app to verify impersonated perspective
6. End impersonation and verify return to admin

## Troubleshooting

### Common Issues

1. **"Admin privileges required" error**
   - Ensure user has 'admin' or 'administrator' role
   - Check JWT token contains correct role claims

2. **"No active impersonation session found"**
   - Session may have expired
   - Try starting impersonation again

3. **Impersonation token invalid**
   - Backend API may be unavailable
   - Check network connectivity and API endpoints

4. **Page doesn't refresh after impersonation**
   - The system automatically reloads the page
   - Check browser console for errors

### Debug Information

Session information available in browser dev tools:
```javascript
// Check current session
fetch('/api/auth/session').then(r => r.json()).then(console.log)

// Should show:
// {
//   isLoggedIn: true,
//   isImpersonating: true,
//   userId: "impersonated_user_id",
//   originalUserId: "admin_user_id",
//   ...
// }
```

## Configuration

### Environment Variables
Make sure these are set in your environment:
```bash
CZ_API_HOST=https://your-api-host.com
SESSION_SECRET=your-session-secret-key
```

### API Endpoint Configuration
Update `config/endpoint.ts` if your API endpoints change:
```typescript
export const IMPERSONATE_USER = `${Host}/api/services/app/Account/ImpersonateUser`
export const IMPERSONATED_AUTHENTICATION = `${Host}/api/TokenAuth/ImpersonatedAuthenticate?impersonationToken=`
export const BACK_TO_IMPERSONATOR = `${Host}/api/services/app/Account/BackToImpersonator`
```
