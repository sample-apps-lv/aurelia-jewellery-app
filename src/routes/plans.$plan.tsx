import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Info, Calculator, ArrowRight, ShieldCheck, RefreshCw, Star, Zap, PieChart as PieChartIcon, TrendingUp, Clock } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useMetalRates } from "@/hooks/use-metal-rates";

import p1 from "@/assets/p1.jpg";
import p3 from "@/assets/p3.jpg";

export const Route = createFileRoute("/plans/$plan")({
  head: ({ params }) => ({
    meta: [
      { title: `${cap(params.plan)} Investment Plan — Gajanand Jewellers` },
      { name: "description", content: `Secure your future with our ${params.plan} monthly savings plan. Pay 10 installments and get the 11th on us!` },
    ],
  }),
  component: PlanPage,
});

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function MetalRateTicker() {
  const { data: rates, isLoading } = useMetalRates();

  if (isLoading || !rates) return null;

  const formatPrice = (val: number | undefined) => {
    return val?.toLocaleString() || "0";
  };

  return (
    <div className="bg-slate-900 text-white py-2 overflow-hidden border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between text-[10px] md:text-xs font-bold uppercase tracking-widest">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-amber-400">Gold 24K:</span>
            <span>₹{formatPrice(rates.gold_24k)}/g</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap border-l border-white/20 pl-6">
            <span className="text-amber-400">Gold 22K:</span>
            <span>₹{formatPrice(rates.gold_22k)}/g</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap border-l border-white/20 pl-6">
            <span className="text-amber-400">Gold 18K:</span>
            <span>₹{formatPrice(rates.gold_18k)}/g</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap border-l border-white/20 pl-6">
            <span className="text-amber-400">Gold 14K:</span>
            <span>₹{formatPrice(rates.gold_14k)}/g</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap border-l border-white/20 pl-6">
            <span className="text-slate-400">Silver:</span>
            <span>₹{formatPrice(rates.silver)}/g</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-slate-400">
          <Clock className="w-3 h-3" />
          <span>Rates as of {new Date(rates.lastUpdated).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

const PLAN_DATA = {
  gold: {
    title: "Gold Mine 10+1 Plan",
    tagline: "The Smartest Way to Own Gold",
    description: "Start your journey towards owning exquisite gold jewelry with our flexible monthly savings plan. Benefit from fixed rates and bonus installments.",
    color: "from-amber-200 to-yellow-500",
    textColor: "text-amber-700",
    chartColor: "#eab308",
    heroImage: p1,
    benefits: [
      { title: "Bonus Installment", desc: "Pay for 10 months and we contribute the 11th installment.", icon: <Star className="w-5 h-5" /> },
      { title: "Price Protection", desc: "Lock in gold rates at the time of enrollment to hedge against price hikes.", icon: <ShieldCheck className="w-5 h-5" /> },
      { title: "Zero Making Charges", desc: "Enjoy 0% making charges on selected jewelry collections.", icon: <Zap className="w-5 h-5" /> },
      { title: "Easy Redemption", desc: "Redeem your savings at any of our stores or online.", icon: <RefreshCw className="w-5 h-5" /> },
    ],
    steps: [
      { title: "Enroll", desc: "Choose your monthly installment amount starting from ₹2,000." },
      { title: "Save Monthly", desc: "Pay 10 consecutive monthly installments on time." },
      { title: "Get Bonus", desc: "We add the 11th installment to your account for free." },
      { title: "Redeem", desc: "Purchase your favorite jewelry with the total accumulated value." },
    ],
    rates: [
      { months: 10, contribution: "1 Month Bonus", makingCharges: "0%", discount: "100% on last EMI" }
    ],
    faqs: [
      { q: "What is the minimum installment amount?", a: "The minimum monthly installment starts from ₹2,000 and can go up in multiples of ₹1,000." },
      { q: "What happens if I miss an installment?", a: "To avail the 11th month bonus, all 10 installments must be paid consecutively. If missed, you can still redeem the accumulated amount without the bonus." },
      { q: "Can I redeem for gold coins?", a: "Yes, you can redeem your accumulated amount for gold jewelry or gold coins." },
    ]
  },
  silver: {
    title: "Silver Sparkle 10+1 Plan",
    tagline: "Celebrate Your Savings in Silver",
    description: "Build your collection of premium silver ornaments and articles with ease. Our silver plan offers unmatched benefits for every milestone.",
    color: "from-slate-200 to-slate-400",
    textColor: "text-slate-700",
    chartColor: "#94a3b8",
    heroImage: p3,
    benefits: [
      { title: "100% Bonus", desc: "We match your last installment, giving you more value for your silver.", icon: <Star className="w-5 h-5" /> },
      { title: "Purity Guarantee", desc: "All silver purchased is 925 Sterling certified.", icon: <ShieldCheck className="w-5 h-5" /> },
      { title: "Special Discounts", desc: "Exclusive 10% discount on silver articles for plan members.", icon: <Zap className="w-5 h-5" /> },
      { title: "Flexible Tenure", desc: "Redeem anytime after 6 months if needed (terms apply).", icon: <RefreshCw className="w-5 h-5" /> },
    ],
    steps: [
      { title: "Start Small", desc: "Enroll with as little as ₹500 per month." },
      { title: "Consistent Savings", desc: "Pay your monthly installments through our easy app or store." },
      { title: "Earn Rewards", desc: "Unlock exclusive member-only silver collections." },
      { title: "Shine Bright", desc: "Redeem for beautiful silver jewelry or silverware." },
    ],
    rates: [
      { months: 10, contribution: "1 Month Bonus", makingCharges: "Special Rates", discount: "Gift on Enrollment" }
    ],
    faqs: [
      { q: "Is there any registration fee?", a: "No, enrollment in our silver plan is completely free of charge." },
      { q: "Can I upgrade my plan later?", a: "You can start a new plan with a higher amount at any time, but current plan amounts cannot be changed mid-tenure." },
    ]
  }
};

function PlanPage() {
  const { plan } = useParams({ from: "/plans/$plan" });
  const data = PLAN_DATA[plan as keyof typeof PLAN_DATA] || PLAN_DATA.gold;

  return (
    <div className="bg-white min-h-screen">
      
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${data.color} opacity-10`} />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <span className={`text-xs font-bold tracking-widest uppercase ${data.textColor} mb-4 block`}>
                {data.tagline}
              </span>
              <h1 className="text-5xl md:text-7xl font-serif mb-6 text-slate-900 leading-tight">
                {data.title}
              </h1>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-xl">
                {data.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white px-8 rounded-full h-14">
                  Enroll Now <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8 h-14">
                  View Collections
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative aspect-[4/5] lg:aspect-square"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${data.color} rounded-[2rem] opacity-20 -rotate-3 scale-105`} />
              <img 
                src={data.heroImage} 
                alt={data.title} 
                className="w-full h-full object-cover rounded-[2rem] shadow-2xl relative z-10"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl z-20 border border-slate-100 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${data.color} flex items-center justify-center text-white`}>
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Bonus Contribution</p>
                    <p className={`text-xl font-serif font-bold ${data.textColor}`}>100% on 11th EMI</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <MetalRateTicker />

      {/* Benefits Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Why Choose the {cap(plan)} Plan?</h2>
            <p className="text-slate-500">Exceptional value and security for your hard-earned savings.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all"
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${data.color} flex items-center justify-center text-white mb-6 shadow-lg shadow-yellow-500/20`}>
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif mb-4">How does it work?</h2>
            <p className="text-slate-500">Four simple steps to your dream jewelry.</p>
          </div>
          
          <div className="relative">
            {/* Desktop Connector Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 hidden lg:block" />
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
              {data.steps.map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-16 h-16 rounded-full bg-white border-2 border-slate-900 text-slate-900 flex items-center justify-center font-serif text-2xl font-bold mb-6 group-hover:bg-slate-900 group-hover:text-white transition-colors shadow-xl">
                    {i + 1}
                  </div>
                  <h4 className="text-xl font-bold mb-3">{step.title}</h4>
                  <p className="text-slate-500 text-sm max-w-[200px] mx-auto">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Plan Calculator Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">Plan your future <br />investment today.</h2>
              <p className="text-slate-400 text-lg mb-12 max-w-lg">
                Use our interactive calculator to see how much you'll save and the bonus contribution you'll receive from Gajanand Jewellers.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                   <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${data.color} flex items-center justify-center`}>
                      <Star className="w-5 h-5 text-slate-900" />
                   </div>
                   <p className="text-sm font-medium">100% discount on the last installment value.</p>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                   <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${data.color} flex items-center justify-center`}>
                      <PieChartIcon className="w-5 h-5 text-slate-900" />
                   </div>
                   <p className="text-sm font-medium">Visual breakdown of your savings and benefits.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 text-slate-900 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 text-slate-200">
                  <Calculator className="w-8 h-8" />
               </div>
               <h3 className="text-2xl font-serif mb-8 text-center">Interactive Calculator</h3>
               <PlanCalculator plan={plan as 'gold' | 'silver'} color={data.color} textColor={data.textColor} chartColor={data.chartColor} />
            </div>
          </div>
        </div>
      </section>

      {/* Rates Table Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Plan Rates & Details</h2>
            <p className="text-slate-400">Clear and transparent pricing for your peace of mind.</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-6 px-8 text-slate-500 font-bold uppercase tracking-wider text-xs">Tenure</th>
                  <th className="py-6 px-8 text-slate-500 font-bold uppercase tracking-wider text-xs">Gajanand Contribution</th>
                  <th className="py-6 px-8 text-slate-500 font-bold uppercase tracking-wider text-xs">Making Charges</th>
                  <th className="py-6 px-8 text-slate-500 font-bold uppercase tracking-wider text-xs">Total Benefit</th>
                </tr>
              </thead>
              <tbody>
                {data.rates.map((rate, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-8 px-8 font-serif text-2xl text-slate-900">{rate.months} Months</td>
                    <td className={`py-8 px-8 font-bold ${data.textColor}`}>{rate.contribution}</td>
                    <td className="py-8 px-8 text-slate-600 font-medium">{rate.makingCharges}</td>
                    <td className="py-8 px-8">
                      <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
                        <Check className="w-4 h-4" />
                        {rate.discount}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Frequently Asked Questions</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {data.faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-slate-200 py-2">
                <AccordionTrigger className="text-left font-bold text-lg hover:no-underline hover:text-slate-600">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-slate-500 leading-relaxed text-base pt-2">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className={`rounded-[3rem] bg-gradient-to-r ${data.color} p-12 lg:p-20 text-center text-slate-900 shadow-2xl relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-serif mb-6 leading-tight">Ready to own <br />beautiful jewelry?</h2>
              <p className="text-xl mb-12 max-w-2xl mx-auto font-medium opacity-90">
                Join thousands of happy customers who are securing their future with Gajanand Jewellers. Start your savings journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white px-12 rounded-full h-16 text-lg shadow-xl">
                  Enroll Now
                </Button>
                <Button variant="outline" size="lg" className="bg-white/20 border-slate-900/10 backdrop-blur-md rounded-full px-12 h-16 text-lg hover:bg-white/40 transition-all">
                  Contact an Expert
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function PlanCalculator({ plan, color, textColor, chartColor }: { plan: 'gold' | 'silver', color: string, textColor: string, chartColor: string }) {
  const [amount, setAmount] = useState(plan === 'gold' ? 5000 : 1000);
  const { data: rates } = useMetalRates();
  
  const result = useMemo(() => {
    const totalPaid = amount * 10;
    const bonus = amount;
    const totalValue = totalPaid + bonus;
    return { totalPaid, bonus, totalValue };
  }, [amount]);

  const estimate = useMemo(() => {
    if (!rates) return null;
    const rate = plan === 'gold' ? rates.gold_22k : rates.silver;
    return (result.totalValue / rate).toFixed(3);
  }, [rates, plan, result.totalValue]);

  const chartData = [
    { name: 'Your Contribution', value: result.totalPaid, fill: '#f1f5f9' },
    { name: 'Gajanand Bonus', value: result.bonus, fill: chartColor },
  ];

  const config = {
    contribution: {
      label: "Your Contribution",
      color: "#f1f5f9",
    },
    bonus: {
      label: "Gajanand Bonus",
      color: chartColor,
    },
  };

  return (
    <div className="space-y-10 w-full max-w-md mx-auto text-left">
      <div className="space-y-4">
        <Label htmlFor="amount" className="text-sm font-bold uppercase tracking-widest text-slate-400">Monthly Installment Amount (₹)</Label>
        <div className="relative group">
          <Input 
            id="amount"
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(Number(e.target.value))}
            className="pl-12 h-16 border-slate-200 focus:ring-slate-900 rounded-2xl text-xl font-bold transition-all group-hover:border-slate-400"
          />
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl font-bold">₹</span>
        </div>
        <div className="flex justify-between px-1">
           <button onClick={() => setAmount(2000)} className="text-[10px] font-bold uppercase tracking-tighter bg-slate-100 px-3 py-1 rounded-full hover:bg-slate-200 transition-colors">₹2k</button>
           <button onClick={() => setAmount(5000)} className="text-[10px] font-bold uppercase tracking-tighter bg-slate-100 px-3 py-1 rounded-full hover:bg-slate-200 transition-colors">₹5k</button>
           <button onClick={() => setAmount(10000)} className="text-[10px] font-bold uppercase tracking-tighter bg-slate-100 px-3 py-1 rounded-full hover:bg-slate-200 transition-colors">₹10k</button>
           <button onClick={() => setAmount(25000)} className="text-[10px] font-bold uppercase tracking-tighter bg-slate-100 px-3 py-1 rounded-full hover:bg-slate-200 transition-colors">₹25k</button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_120px] gap-8 items-center bg-slate-50 p-6 rounded-3xl border border-slate-100">
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Total Payment</span>
            <span className="text-2xl font-bold">₹{(result.totalPaid || 0).toLocaleString()}</span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Bonus Earned</span>
            <span className={`text-2xl font-bold ${textColor}`}>+ ₹{(result.bonus || 0).toLocaleString()}</span>
          </div>
        </div>
        
        <div className="h-28 w-28 relative">
           <ChartContainer config={config} className="h-full w-full">
              <PieChart>
                 <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                 <Pie
                   data={chartData}
                   cx="50%"
                   cy="50%"
                   innerRadius={30}
                   outerRadius={45}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {chartData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                   ))}
                 </Pie>
              </PieChart>
           </ChartContainer>
           <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[8px] font-bold uppercase text-slate-400 leading-none">Total</span>
              <span className="text-xs font-bold leading-none">110%</span>
           </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100">
        <div className="flex justify-between items-end mb-8">
          <div className="space-y-1">
             <span className="text-sm font-medium text-slate-500">Total Redemption Value</span>
             <h4 className={`text-4xl font-serif font-bold ${textColor}`}>₹{(result.totalValue || 0).toLocaleString()}*</h4>
             {estimate && (
               <p className="text-xs font-bold text-slate-500 mt-1 flex items-center gap-1">
                 <TrendingUp className="w-3 h-3 text-green-500" />
                 Approx. {estimate}g of {plan === 'gold' ? '22K Gold' : 'Silver'}
               </p>
             )}
          </div>
          <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
             10 + 1 Benefit
          </div>
        </div>

        <Button className={`w-full bg-slate-900 hover:bg-slate-800 text-white rounded-[1.2rem] h-16 text-lg font-bold shadow-xl shadow-slate-900/20`}>
          Start Saving Today
        </Button>
        <p className="text-[10px] text-slate-400 text-center italic mt-4">
          *Calculated based on 10+1 plan benefits. Final value may vary based on gold rates at redemption.
        </p>
      </div>
    </div>
  );
}
