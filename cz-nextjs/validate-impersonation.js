#!/usr/bin/env node

/**
 * Simple validation script to check if all impersonation-related files are properly set up
 */

const fs = require('fs');
const path = require('path');

const files = [
    'hooks/use-auth.ts',
    'hooks/use-impersonation.ts',
    'components/impersonation-banner.tsx',
    'components/impersonation-dialog.tsx',
    'components/role-guard.tsx',
    'app/api/auth/impersonate/route.ts',
    'app/api/auth/end-impersonation/route.ts',
    'app/api/auth/session/route.ts',
    'types/sessions/auth-session.ts',
    'lib/auth/role-utils.ts',
    'app/(webapp)/administration/impersonation/page.tsx'
];

console.log('🔍 Checking impersonation feature files...\n');

let allFilesExist = true;

files.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - Missing!`);
        allFilesExist = false;
    }
});

if (allFilesExist) {
    console.log('\n🎉 All impersonation files are present!');
    console.log('\n📝 Next steps:');
    console.log('1. Ensure your backend API endpoints are configured correctly');
    console.log('2. Set up environment variables (CZ_API_HOST, SESSION_SECRET)');
    console.log('3. Test with admin and regular user accounts');
    console.log('4. Navigate to /administration/impersonation to test the feature');
} else {
    console.log('\n❌ Some files are missing. Please check the implementation.');
}

console.log('\n📚 Documentation:');
console.log('- IMPERSONATION_README.md - Detailed implementation guide');
console.log('- RBAC_README.md - Role-based access control guide');
