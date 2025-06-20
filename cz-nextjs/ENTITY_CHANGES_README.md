# Entity Changes Feature

This feature provides a comprehensive UI for viewing Entity Changes and Entity Property Changes, following ASP.NET Zero patterns and standards.

## Features

### Entity Changes Management
- **List View**: View all entity changes with filtering and sorting capabilities
- **Detail View**: Comprehensive view of individual entity changes
- **Property Changes**: View detailed property-level changes for each entity modification

### Key Components

#### 1. Entity Changes DataTable (`/administration/entity-changes`)
- Sortable columns (Change Time, Change Type, Entity Type, Entity ID, User Name)
- Advanced filtering:
  - General search
  - Entity type filter
  - Change type filter (Created/Updated/Deleted)
  - User name filter
- Pagination with configurable page sizes
- Actions: View details, View property changes

#### 2. Entity Change Detail Page (`/administration/entity-changes/[id]`)
- Complete entity change information
- User and impersonation details
- Property changes table with before/after values
- Responsive design with card-based layout

#### 3. Property Changes Dialog
- Inline view of property modifications
- Color-coded original (red) vs new (green) values
- Supports all property types

## Technical Implementation

### Types
- `TEntityChange`: Main entity change type
- `TEntityPropertyChange`: Property-level change type
- `EntityChangeType`: Enum for change types (Created, Updated, Deleted)

### API Endpoints
- `GET /api/administration/entity-changes/get-entity-changes` - List entity changes
- `GET /api/administration/entity-changes/get-entity-change` - Get single entity change
- `GET /api/administration/entity-changes/get-entity-property-changes` - Get property changes

### Backend Integration
Uses the following ASP.NET Zero endpoints:
- `${Host}/api/services/app/EntityChange/GetEntityChanges`
- `${Host}/api/services/app/EntityChange/GetEntityPropertyChanges`

## Features Matching ASP.NET Zero

### UI/UX Features
- ✅ Responsive data tables with sorting
- ✅ Advanced filtering capabilities
- ✅ Pagination controls
- ✅ Modal dialogs for quick actions
- ✅ Dedicated detail pages
- ✅ Loading states and error handling
- ✅ Color-coded change types (badges)
- ✅ Before/after value comparison

### Data Management
- ✅ Server-side pagination
- ✅ Server-side sorting
- ✅ Multiple filter criteria
- ✅ Proper error handling
- ✅ TypeScript type safety

### Navigation
- ✅ Integrated with sidebar navigation
- ✅ Breadcrumb navigation on detail pages
- ✅ Back button functionality

## Usage

### Accessing Entity Changes
1. Navigate to Administration → Entity Changes in the sidebar
2. Use filters to narrow down results
3. Click the eye icon to view detailed information
4. Click the document icon to view property changes

### Filtering Options
- **Search**: General text search across all fields
- **Entity Type**: Filter by specific entity types
- **Change Type**: Filter by Created/Updated/Deleted
- **User Name**: Filter by user who made the change

### Sorting
Click on column headers to sort by:
- Change Time
- Change Type
- Entity Type
- Entity ID
- User Name

## Security
- Integrated with role-based access control
- Only administrators can access entity changes
- Session validation on all API calls
- Proper error handling for unauthorized access

## Future Enhancements
- Export functionality (Excel, CSV)
- Real-time updates via SignalR
- Advanced date range filtering
- Entity change statistics dashboard
- Restore functionality for deleted entities
