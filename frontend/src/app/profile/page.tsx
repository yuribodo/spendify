import { Suspense } from 'react';
import { Card } from "@/components/ui/card";
import ProfileCard from '@/components/profile/ProfileCard';
import ProfileForm from '@/components/profile/ProfileForm';

export const metadata = {
  title: 'Profile Settings | Spendify',
  description: 'Update your personal information and account settings',
};

export default function ProfilePage() {
  return (
    <div className="container  mx-auto px-4 max-w-4xl py-14">
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
      
      <div className="grid gap-6">
        <Card>
          <Suspense fallback={<div>Loading profile...</div>}>
            <ProfileCard />
            <ProfileForm />
          </Suspense>
        </Card>
      </div>
    </div>
  );
}