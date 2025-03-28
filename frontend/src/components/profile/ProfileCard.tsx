import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfileCard() {
  return (
    <CardHeader className="flex flex-row items-center gap-4">
      <Avatar className="h-16 w-16">
        <AvatarImage alt="Profile" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <div>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details and password</CardDescription>
      </div>
    </CardHeader>
  );
}