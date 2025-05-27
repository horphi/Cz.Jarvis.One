//import Image from "next/image";
import { getLocale, getTranslations } from "@/lib/i18n";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { HeaderContainer } from "@/components/header-container";
import { Main } from "@/components/ui/main";
import { CreateOrEditUserProvider } from "@/context/administration/user-context";
import EditUserForm from "../../components/edit-user-form";
import SaveUserButton from "../../components/save-user-button";

interface EditUserPageProps {
    // params: { id: number | null };
    params: Promise<{ id: number | null }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
    const locale = await getLocale();
    const t = await getTranslations(locale);
    const userId = (await params).id || null;

    return (
        <CreateOrEditUserProvider>
            <Main fixed>
                <HeaderContainer>
                    <>
                        <h1 className="text-2xl font-bold tracking-tight">Dashboard {t.greeting}</h1>
                        <div className="flex items-center space-x-2">
                            <SaveUserButton />
                        </div>
                    </>
                </HeaderContainer>

                <Tabs defaultValue="overview" className="space-y-4">
                    <div className="w-full overflow-x-auto pb-2">
                        {/* <TabsList>
                            <TabsTrigger value="overview1">Overview1</TabsTrigger>
                            <TabsTrigger value="overview2" disabled>Overview2</TabsTrigger>
                            <TabsTrigger value="overview3" disabled>Overview3</TabsTrigger>
                            <TabsTrigger value="overview4" disabled>Overview4</TabsTrigger>
                        </TabsList> */}
                    </div>
                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
                            <Card className="col-span-1 lg:col-span-4">
                                <CardHeader>
                                    <CardTitle>Recent Sales</CardTitle>
                                    <CardDescription>You made 265 sales this month.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <EditUserForm t={t} param={userId} />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </Main>
        </CreateOrEditUserProvider>
    );
}
