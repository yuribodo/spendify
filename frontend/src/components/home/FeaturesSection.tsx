import { 
    Layers, ChartPieIcon, Wallet, Banknote, 
    Clock, BarChart4, Target, ArrowUpDown
  } from "lucide-react";
  
  export function FeaturesSection() {
    const features = [
      {
        title: "Expense Tracking",
        description: "Effortlessly record and categorize your daily expenses with just a few taps.",
        icon: <Wallet className="h-6 w-6 text-accent" />
      },
      {
        title: "Income Management",
        description: "Keep track of all your income sources in one organized dashboard.",
        icon: <Banknote className="h-6 w-6 text-accent" />
      },
      {
        title: "Visual Reports",
        description: "Get beautiful visualizations of your spending habits for better insights.",
        icon: <ChartPieIcon className="h-6 w-6 text-accent" />
      },
      {
        title: "Budgeting Tools",
        description: "Set and track budgets for different categories to control spending.",
        icon: <Target className="h-6 w-6 text-accent" />
      },
      {
        title: "Transaction History",
        description: "Access your complete financial history with powerful filtering options.",
        icon: <Clock className="h-6 w-6 text-accent" />
      },
      {
        title: "Financial Insights",
        description: "Receive personalized insights to improve your financial decisions.",
        icon: <Layers className="h-6 w-6 text-accent" />
      },
      {
        title: "Spending Analysis",
        description: "Identify spending patterns and find opportunities to save money.",
        icon: <BarChart4 className="h-6 w-6 text-accent" />
      },
      {
        title: "Cash Flow Tracking",
        description: "Monitor money coming in and going out for better financial awareness.",
        icon: <ArrowUpDown className="h-6 w-6 text-accent" />
      }
    ];
  
    return (
      <section id="features" className="py-16 md:py-24 bg-secondary/50 dark:bg-secondary/10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="heading-lg mb-4">Everything You Need to Take Control</h2>
            <p className="text-lg text-muted-foreground">
              Spendify provides all the tools you need to understand and improve your financial health.
            </p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="glass-card p-6 rounded-xl card-hover animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-3 bg-accent/10 rounded-lg w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }