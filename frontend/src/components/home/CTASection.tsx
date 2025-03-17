import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-5xl mx-auto glass rounded-2xl p-8 md:p-12 shadow-card overflow-hidden relative">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/10 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="heading-md mb-4">Ready to Transform Your Financial Future?</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Join thousands of users who have already taken control of their finances with Spendify.
                Get started today for free.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto rounded-lg bg-accent hover:bg-accent/90 text-white">
                    Get Started <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex flex-col space-y-4 text-center md:text-right">
              <div>
                <p className="text-3xl md:text-4xl font-bold">20K+</p>
                <p className="text-muted-foreground">Active Users</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold">$15M+</p>
                <p className="text-muted-foreground">Money Tracked</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}