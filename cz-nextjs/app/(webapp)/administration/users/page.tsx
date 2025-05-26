import { getLocale, getTranslations } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { HeaderContainer } from "@/components/header-container";
import { Button } from "@/components/ui/button";
import { Main } from "@/components/ui/main";
import UsersDataTable from "./components/user-datatable";

export default async function UsersPage() {
    const locale = await getLocale();
    const t = await getTranslations(locale);

    return (
        <>
            <Main fixed>
                <HeaderContainer>
                    <>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {/* {t.administration.user.title} */}
                            Users
                        </h1>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" asChild>
                                <a href="/administration/users/create">Create New User</a>
                            </Button>
                        </div>
                    </>
                </HeaderContainer>

                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsContent value="overview" className="space-y-4 ">
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
                            <Card className="col-span-1 lg:col-span-4">
                                <CardHeader>
                                    <CardTitle>Users</CardTitle>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <UsersDataTable />
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