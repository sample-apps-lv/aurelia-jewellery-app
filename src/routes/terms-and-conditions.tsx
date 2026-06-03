import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => ({ meta: [{ title: "Terms and Conditions — Gajanand Jewellers" }] }),
  component: TermsAndConditionsPage,
});

function TermsAndConditionsPage() {
  return (
    <div className="pt-48 pb-20 px-6 lg:px-10 max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="font-serif text-4xl mb-4">Terms and Conditions</h1>
        <p className="text-muted-foreground text-sm">Last Updated: June 1, 2024</p>
      </div>

      <div className="prose prose-sm max-w-none text-muted-foreground space-y-8">
        <section>
          <h2 className="text-foreground font-serif text-2xl mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using this website, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section>
          <h2 className="text-foreground font-serif text-2xl mb-4">2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) on Gajanand Jewellers' website for personal, non-commercial transitory viewing only.
          </p>
        </section>

        <section>
          <h2 className="text-foreground font-serif text-2xl mb-4">3. Products and Pricing</h2>
          <p>
            All products are subject to availability. We reserve the right to discontinue any product at any time. Prices for our products are subject to change without notice. While we make every effort to display the colors and images of our products accurately, we cannot guarantee that your computer monitor's display will be accurate.
          </p>
        </section>

        <section>
          <h2 className="text-foreground font-serif text-2xl mb-4">4. Shipping and Returns</h2>
          <p>
            Shipping costs and delivery times vary based on location. Please refer to our Shipping Policy for more details. For information regarding returns and exchanges, please consult our Return Policy.
          </p>
        </section>

        <section>
          <h2 className="text-foreground font-serif text-2xl mb-4">5. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
          </p>
        </section>
      </div>
    </div>
  );
}
