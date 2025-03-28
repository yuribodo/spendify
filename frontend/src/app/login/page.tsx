'use client';

import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export default function LoginPage() {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      await login(data.email, data.password);
      toast.success('Login realizado com sucesso');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Falha no login');
      } else {
        toast.error('Falha no login');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Digite seu email"
              {...register('email')}
              className="mt-1 w-full"
            />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              {...register('password')}
              className="mt-1 w-full"
            />
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Ainda não tem uma conta?{' '}
          <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
