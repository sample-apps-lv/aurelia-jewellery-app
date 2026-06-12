import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

interface EnrollPlanSectionProps {
  data: {
    title: string;
    highlight: string;
    description: string;
    ctaText: string;
  };
}

export function EnrollPlanSection({ data }: EnrollPlanSectionProps) {
  if (!data) return null;

  return (
    <section className="py-8 px-4 md:px-6">
      <div className="max-w-[1440px] mx-auto overflow-hidden rounded-md">
        <div className="relative bg-gradient-to-r from-transparent via-[#fff1f2] to-transparent py-10 md:py-12 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-center md:text-left border-y border-[#ffe4e6]">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <h3 className="text-[#001938] text-xl md:text-2xl font-bold">
              {data.title && data.highlight && data.title.includes(data.highlight) ? (
                <>
                  {data.title.split(data.highlight)[0]}
                  <span className="text-destructive font-extrabold">{data.highlight}</span>
                  {data.title.split(data.highlight)[1]}
                </>
              ) : (
                data.title || "Our Monthly Plan"
              )}
            </h3>
            <p className="text-[#444] text-base md:text-lg font-medium max-w-sm md:max-w-none">
              {data.description}
            </p>
          </div>
          <Link to="/plans/$plan" params={{ plan: "gold" }}>
            <Button 
              className="bg-[#fbcfe8] hover:bg-[#fda4af] text-[#001938] font-bold px-8 py-5 md:px-12 md:py-7 rounded-md shadow-sm border-none text-sm md:text-base transition-all"
            >
              {data.ctaText}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

