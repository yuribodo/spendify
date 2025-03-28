'use client'

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/lib/auth/context';
import {
  getUserProfileAPI,
  updateProfileAPI
} from '@/lib/services/profile-service';
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, Save, User } from "lucide-react";
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { toast } from 'sonner';
import * as z from "zod";


const profileFormSchema = z.object({
  username: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  currentPassword: z.string().optional(),
  newPassword: z.string()
    .min(6, { message: "Password must be at least 6 characters" })
    .optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: "Current password is required to set a new password",
  path: ["currentPassword"],
}).refine((data) => {
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function ProfileForm() {
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    async function fetchUserProfile() {
      console.log('isAuthenticated:', isAuthenticated);
      console.log('user:', user);
  
      if (!isAuthenticated || !user?.id) {
        console.log('Não autenticado ou sem ID de usuário');
        return;
      }
  
      try {
        setIsLoading(true);
        const userProfile = await getUserProfileAPI(user.id);
        console.log('Perfil carregado:', userProfile);
  
        form.reset({
          username: userProfile.username,
          email: userProfile.email,
        });
      } catch (error) {
        console.error('Erro completo:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    }
  
    fetchUserProfile();
  }, [isAuthenticated, user?.id, form]);


  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    if (!isAuthenticated || !user?.id) {
      toast.error('User not authenticated');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        userId: user?.id,
        username: values.username,
        email: values.email,
      };


      const response = await updateProfileAPI(payload);

      form.reset({
        username: response.user.username,
        email: response.user.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      toast.success("Profile Updated: Your profile has been updated successfully.");
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to update profile. Please try again.';

      toast.error(errorMessage);
      console.error("Profile update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <CardContent>
        <div className="text-center text-muted-foreground">
          Loading profile...
        </div>
      </CardContent>
    );
  }

  return (
    <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        placeholder="Enter your full name"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        placeholder="Enter your email address"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">Change Password</h3>
            <p className="text-sm text-muted-foreground">
              Update your password to enhance your account security
            </p>

            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Enter current password"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Enter new password"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Confirm new password"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full sm:w-auto"
            size="lg"
            disabled={isSubmitting}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Form>
    </CardContent>
  );
}