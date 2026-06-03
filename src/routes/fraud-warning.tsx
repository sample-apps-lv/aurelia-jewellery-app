import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/fraud-warning")({
  head: () => ({ meta: [{ title: "Fraud Warning Disclaimer — Gajanand Jewellers" }] }),
  component: FraudWarningPage,
});

function FraudWarningPage() {
  return (
    <div className="pt-48 pb-20 px-6 lg:px-10 max-w-4xl mx-auto">
      <div className="mb-12 flex items-center gap-4">
        <AlertTriangle className="h-10 w-10 text-destructive" />
        <div>
          <h1 className="font-serif text-4xl mb-4">Fraud Warning Disclaimer</h1>
          <p className="text-muted-foreground text-sm">Protecting our customers from fraudulent activities.</p>
        </div>
      </div>

      <div className="prose prose-sm max-w-none text-muted-foreground space-y-8 bg-destructive/5 p-8 rounded-lg border border-destructive/20">
        <section>
          <h2 className="text-destructive font-serif text-2xl mb-4">Important Security Notice</h2>
          <p className="font-medium text-foreground">
            Gajanand Jewellers values your security. We want to ensure that your shopping experience is safe and secure. Please be aware of potential fraudulent activities that may target our customers.
          </p>
        </section>

        <section>
          <h2 className="text-foreground font-serif text-xl mb-3">1. Official Channels</h2>
          <p>
            Always ensure you are interacting with our official website: <span className="text-gold font-bold">www.gajanandjewellers.com</span>. We do not conduct sales or solicit personal information through unofficial third-party platforms or social media accounts not linked on our website.
          </p>
        </section>

        <section>
          <h2 className="text-foreground font-serif text-xl mb-3">2. Payment Security</h2>
          <p>
            Gajanand Jewellers will never ask you to make a payment directly into a personal bank account or via suspicious payment links sent through SMS or WhatsApp. All payments should be processed through our secure checkout on our website.
          </p>
        </section>

        <section>
          <h2 className="text-foreground font-serif text-xl mb-3">3. Phishing and Impersonation</h2>
          <p>
            Be cautious of emails, calls, or messages from individuals claiming to be representatives of Gajanand Jewellers asking for your passwords, credit card numbers, or other sensitive information. We will never ask for your password.
          </p>
        </section>

        <section>
          <h2 className="text-foreground font-serif text-xl mb-3">4. Reporting Fraud</h2>
          <p>
            If you encounter any suspicious activity or believe you have been a victim of fraud involving the Gajanand Jewellers brand, please report it immediately to our customer support at <span className="font-bold">security@gajanandjewellers.com</span> and your local authorities.
          </p>
        </section>
      </div>
    </div>
  );
}
