export interface Transaction {
    id: number;
    title: string;
    category: string;
    date: string;
    amount: number;
    icon: string;
  }
  
  export interface MetricCardProps {
    title: string;
    value: string;
    percentChange: number;
    icon: React.ReactNode;
  }