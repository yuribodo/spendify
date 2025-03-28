import { Button } from "@/components/ui/button";
import { BarChart4, ChevronRight, CreditCard, LineChart } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6 max-w-xl animate-slide-in-up">
            <h1 className="heading-xl text-gradient">
              Master Your Money, Unlock Your Future
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Take control of your finances with Spendify&#39;s intuitive tracking, intelligent insights, and beautiful visualizations.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto rounded-lg bg-accent hover:bg-accent/90 text-white cursor-pointer">
                  Get Started <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-lg cursor-pointer">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative w-full h-[380px] md:h-[450px] rounded-2xl overflow-hidden animate-fade-in">
              <div className="absolute -top-5 -right-5 w-64 h-64 md:w-72 md:h-72 bg-accent/10 rounded-full filter blur-3xl animate-pulse-gentle"></div>
              <div className="absolute -bottom-10 -left-10 w-72 h-72 md:w-80 md:h-80 bg-primary/10 rounded-full filter blur-3xl animate-pulse-gentle delay-700"></div>

              <div className="absolute left-[10%] top-10 glass-card rounded-xl p-4 shadow-card animate-float">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <LineChart className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Monthly Savings</p>
                    <p className="text-xl font-bold">$832.40</p>
                  </div>
                </div>
              </div>

              <div className="absolute right-[5%] bottom-20 glass-card rounded-xl p-4 shadow-card animate-float delay-500">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Last Transaction</p>
                    <p className="text-lg font-semibold">Grocery</p>
                    <p className="text-sm text-muted-foreground">-$47.80</p>
                  </div>
                </div>
              </div>

              <div className="absolute left-[20%] bottom-10 glass-card rounded-xl p-4 shadow-card animate-float delay-1000">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-teal-400/10 rounded-lg">
                    <BarChart4 className="h-6 w-6 text-teal-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Budget Status</p>
                    <div className="mt-1 w-36 h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                      <div className="h-2 w-3/4 bg-teal-500 rounded-full"></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">75% of monthly budget</p>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/50 to-background/90"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}