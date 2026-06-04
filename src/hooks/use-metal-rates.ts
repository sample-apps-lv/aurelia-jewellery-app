import { useQuery } from "@tanstack/react-query";
import { getMetalRates, MetalRates } from "@/lib/shopify";
import { isMock } from "@/lib/fetch-api";

const MOCK_METAL_RATES: MetalRates = {
  gold_24k: 7250,
  gold_22k: 6650,
  gold_18k: 5450,
  gold_14k: 4250,
  silver: 92,
  lastUpdated: new Date().toISOString(),
};

export const useMetalRates = () => {
  return useQuery({
    queryKey: ["metal-rates"],
    queryFn: async () => {
      if (isMock()) {
        return MOCK_METAL_RATES;
      }
      const rates = await getMetalRates();
      // Merge with mock rates to ensure all fields are present if Shopify is missing some
      return { ...MOCK_METAL_RATES, ...rates };
    },
    refetchInterval: 1000 * 60 * 60, // Refetch every hour
  });
};
