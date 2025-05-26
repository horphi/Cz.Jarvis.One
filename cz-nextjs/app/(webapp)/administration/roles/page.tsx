import { getLocale, getTranslations } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { HeaderContainer } from "@/components/header-container";
import { Button } from "@/components/ui/button";
import { Main } from "@/components/ui/main";
import RolesDataTable from "./components/roles-datatable";


export default async function RolesPage() {
    const locale = await getLocale();
    const t = await getTranslations(locale);

    return (
        <>
            <Main fixed>
                <HeaderContainer>
                    <>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {t.administration.role.title}
                        </h1>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" asChild>
                                <a href="/administration/roles/create">Create New Role</a>
                            </Button>
                        </div>
                    </>
                </HeaderContainer>

                <Tabs defaultValue="overview" className="space-y-4">
                    {/* <div className="w-full overflow-x-auto pb-2">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="analytics" disabled>Analytics</TabsTrigger>
                            <TabsTrigger value="reports" disabled>Reports</TabsTrigger>
                            <TabsTrigger value="notifications" disabled>Notifications</TabsTrigger>
                        </TabsList>
                    </div> */}
                    <TabsContent value="overview" className="space-y-4 ">

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
                            <Card className="col-span-1 lg:col-span-4">
                                <CardHeader>
                                    <CardTitle>Roles</CardTitle>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <RolesDataTable />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </Main>
        </>
    );
}
