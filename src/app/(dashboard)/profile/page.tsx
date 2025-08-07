import AvatarGenerator from "@/components/avatar-generator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <main className="flex h-screen flex-col">
        <header className="border-b p-4">
            <h1 className="text-xl font-semibold font-headline">Your Profile</h1>
            <p className="text-muted-foreground">Personalize your representation in Vio's world.</p>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Your Avatar</CardTitle>
                    <CardDescription>
                        Choose how you appear. Upload a link to your own avatar or have Vio 3 generate one based on our conversations.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AvatarGenerator />
                </CardContent>
            </Card>
        </div>
    </main>
  );
}
