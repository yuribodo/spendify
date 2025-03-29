'use client';

import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const signupSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username must be at most 20 characters long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Invalid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must include uppercase, lowercase letters, numbers, and special characters'
    ),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export default function SignupPage() {
  const { signup } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    try {
      const { confirmPassword, ...signupData } = data;
      void confirmPassword;

      await signup(signupData.username, signupData.email, signupData.password);
      toast.success('Account successfully created');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Signup failed');
      } else {
        toast.error('Signup failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">

      <div className="max-w-md w-full p-8 bg-card text-card-foreground rounded-xl shadow-lg border">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold">Create Account</h2>
          <p className="text-muted-foreground mt-2">Sign up to get started</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Username
            </label>
            <Input
              id="username"
              {...register('username')}
              placeholder="Enter your username"
              disabled={isSubmitting}
              className="w-full"
            />
            {errors.username && (
              <p className="text-destructive text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <Input
              id="email"
              {...register('email')}
              placeholder="Enter your email"
              type="email"
              disabled={isSubmitting}
              className="w-full"
            />
            {errors.email && (
              <p className="text-destructive text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <Input
              id="password"
              {...register('password')}
              placeholder="Enter your password"
              type="password"
              disabled={isSubmitting}
              className="w-full"
            />
            {errors.password && (
              <p className="text-destructive text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              {...register('confirmPassword')}
              placeholder="Confirm your password"
              type="password"
              disabled={isSubmitting}
              className="w-full"
            />
            {errors.confirmPassword && (
              <p className="text-destructive text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground border cursor-pointer"
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </Button>

          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-accent hover:underline font-medium"
              >
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}