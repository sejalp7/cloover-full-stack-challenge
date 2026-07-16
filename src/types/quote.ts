export type QuoteOffer = {
  termYears: number;
  apr: number;
  principalUsed: number;
  monthlyPayment: number;
};

export type QuoteRecord = {
  id: string;
  userId: string;
  address: string;
  monthlyConsumptionKwh: number;
  systemSizeKw: number;
  downPayment: number | null;
  systemPrice: number;
  principal: number;
  riskBand: "A" | "B" | "C";
  offers: QuoteOffer[];
  createdAt: string;
};

export type QuoteResponse = {
  id: string;
  inputs: {
    address: string;
    monthlyConsumptionKwh: number;
    systemSizeKw: number;
    downPayment: number | null;
  };
  derived: {
    systemPrice: number;
    principal: number;
    riskBand: "A" | "B" | "C";
  };
  offers: QuoteOffer[];
  createdAt: string;
};

export type QuoteRow = {
  id: string;
  user_id: string;
  address: string;
  monthly_consumption_kwh: string;
  system_size_kw: string;
  down_payment: string | null;
  system_price: string;
  principal: string;
  risk_band: "A" | "B" | "C";
  offers: QuoteRecord["offers"];
  created_at: Date;
};