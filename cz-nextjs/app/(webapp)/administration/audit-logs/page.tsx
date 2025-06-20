import { getLocale, getTranslations } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { HeaderContainer } from "@/components/header-container";
// import { Button } from "@/components/ui/button";
import { Main } from "@/components/ui/main";
import AuditLogsDataTable from "./components/audit-log-datatable";

export default async function AuditLogPage() {
    const locale = await getLocale();
    const t = await getTranslations(locale);
    console.log("Translations:", t);
    return (
        <>
            <Main fixed>
                <HeaderContainer>
                    <>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {/* {t.administration.user.title} */}
                            Audit Log
                        </h1>
                        <div className="flex items-center space-x-2">
                            {/* <Button variant="outline" asChild>
                                <a href="/administration/users/create">Create New User</a>
                            </Button> */}
                        </div>
                    </>
                </HeaderContainer>

                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsContent value="overview" className="space-y-4 ">
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
                            <Card className="col-span-1 lg:col-span-4">
                                <CardHeader>
                                    <CardTitle></CardTitle>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <AuditLogsDataTable />
                                    {/* UsersDataTable component should be implemented here */}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </Main>
        </>
    );
}