import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function ProfileCard() {
  return (
    <CardHeader className="flex flex-row items-center gap-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src="/avatars/default-avatar.png" alt="Profile" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <div>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details and password</CardDescription>
      </div>
    </CardHeader>
  );
}