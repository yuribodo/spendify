const LoadingTable = () => {
    return (
      <div className="glass-card rounded-xl overflow-hidden animate-pulse">
        <div className="h-12 bg-secondary/50 w-full"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 w-full border-b border-border flex items-center px-6">
            <div className="w-8 h-8 rounded-full bg-muted mr-3"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-3 bg-muted/50 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default LoadingTable;
  