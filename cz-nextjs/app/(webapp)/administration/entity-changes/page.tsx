import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { HeaderContainer } from "@/components/header-container";
import { Main } from "@/components/ui/main";
import EntityChangesDataTable from "./components/entity-changes-datatable";

export default async function EntityChangesPage() {

    return (
        <>
            <Main fixed>
                <HeaderContainer>
                    <>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Entity Changes
                        </h1>
                        <div className="flex items-center space-x-2">
                            {/* Future: Export functionality can be added here */}
                        </div>
                    </>
                </HeaderContainer>

                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
                            <Card className="col-span-1 lg:col-span-4">
                                <CardHeader>
                                    <CardTitle>Entity Changes History</CardTitle>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <EntityChangesDataTable />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </Main>
        </>
    );
}
