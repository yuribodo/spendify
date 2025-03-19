import React from 'react';
import Image from "next/image";
import icon from '../../../public/icon.svg';

export const Header: React.FC = () => {
  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Image src={icon} alt="Spendify Logo" width={32} height={32} />
          <h1 className="text-xl font-bold">Spendify</h1>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            Transactions
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            Budget
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            Profile
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            Settings
          </button>
        </nav>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
          Get Started
        </button>
      </div>
    </header>
  );
};
