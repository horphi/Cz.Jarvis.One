// Removed the usage of `PermissionList` as selected permissions are no longer parsed to this page.
import { getLocale, getTranslations } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { HeaderContainer } from "@/components/header-container";
import { Main } from "@/components/ui/main";
import { CreateOrEditRoleProvider } from "@/context/administration/role-context";

import SaveRoleButton from "../components/save-role-button";
import RoleForm from "../components/role-form";


export default async function CraateRolesPage() {
    const locale = await getLocale();
    const t = await getTranslations(locale);

    return (
        <CreateOrEditRoleProvider>
            <Main fixed >
                <HeaderContainer>
                    <>
                        <h1 className="text-2xl font-bold tracking-tight">Dashboard {t.greeting}</h1>
                        <div className="flex items-center space-x-2">
                            <SaveRoleButton />
                        </div>
                    </>
                </HeaderContainer>

                <Tabs defaultValue="overview" className="space-y-4 flex-1 flex flex-col">
                    {/* <div className="w-full overflow-x-auto pb-2">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="analytics" disabled>Analytics</TabsTrigger>
                            <TabsTrigger value="reports" disabled>Reports</TabsTrigger>
                            <TabsTrigger value="notifications" disabled>Notifications</TabsTrigger>
                        </TabsList>
                    </div> */}
                    <TabsContent value="overview" className="space-y-4 flex-1 flex flex-col">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 overflow-y-scroll">

                        </div>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-1 flex-1">
                            <Card className="col-span-1 lg:col-span-4 h-full flex flex-col">
                                <CardHeader>
                                    <CardTitle>Roles</CardTitle>
                                </CardHeader>
                                <CardContent className="pl-2 flex-1 flex flex-col">
                                    <RoleForm t={t} param={null} />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </Main>
        </CreateOrEditRoleProvider>
    );
}
