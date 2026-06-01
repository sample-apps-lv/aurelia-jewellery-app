import { Button } from "@/components/ui/button";

export function EnrollPlanSection() {
  return (
    <section className="py-4 px-4 md:px-6">
      <div className="max-w-[1440px] mx-auto overflow-hidden rounded-md">
        <div className="relative bg-gradient-to-r from-transparent via-[#fff1f2] to-transparent py-6 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center md:text-left border-y border-[#ffe4e6]">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
            <h3 className="text-[#001938] text-lg md:text-xl font-bold">
              Gold Mine <span className="text-destructive font-extrabold">10 + 1</span> Monthly Plan
            </h3>
            <p className="text-[#444] text-sm md:text-base font-medium">
              (Pay 10 installments, and get 100% off on the last one!)
            </p>
          </div>
          <Button 
            className="bg-[#fbcfe8] hover:bg-[#fda4af] text-[#001938] font-bold px-10 py-6 rounded-md shadow-sm border-none text-sm transition-all"
          >
            Enroll Now
          </Button>
        </div>
      </div>
    </section>
  );
}
