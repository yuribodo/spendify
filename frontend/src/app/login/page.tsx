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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      
      <div className="max-w-md w-full p-8 bg-card text-card-foreground rounded-xl shadow-lg border">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold">Login</h2>
          <p className="text-muted-foreground mt-2">Entre para acessar sua conta</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Digite seu email"
              {...register('email')}
              className="w-full"
            />
            {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium">
                Senha
              </label>
              <Link href="/forgot-password" className="text-sm text-accent hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              {...register('password')}
              className="w-full"
            />
            {errors.password && <p className="text-destructive text-sm mt-1">{errors.password.message}</p>}
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground border cursor-pointer"
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            Ainda não tem uma conta?{' '}
            <Link href="/signup" className="text-accent hover:underline font-medium">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}