import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FAQSection() {
  const faqs = [
    {
      question: "Is Spendify free to use?",
      answer: "Yes, Spendify offers a free plan with all essential features. We also offer premium plans with advanced features and insights for power users."
    },
    {
      question: "How secure is my financial data?",
      answer: "We take security seriously. Your data is encrypted end-to-end and we never share your information with third parties. We use bank-level security protocols to ensure your data stays private and safe."
    },
    {
      question: "Can I sync with my bank accounts?",
      answer: "Yes, you can connect Spendify to over 10,000 financial institutions worldwide for automatic transaction imports and real-time balance updates."
    },
    {
      question: "Is there a mobile app available?",
      answer: "Yes, Spendify is available on iOS and Android, offering the same great experience with additional mobile-specific features like receipt scanning."
    },
    {
      question: "Can I export my financial data?",
      answer: "Yes, you can export your data anytime in various formats including CSV, Excel, and PDF for your records or further analysis."
    }
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-lg text-center mb-12">Frequently Asked Questions</h2>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white dark:bg-slate-900 rounded-lg mb-4 shadow-subtle border border-slate-200 dark:border-slate-800 overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}