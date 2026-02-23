/**
 * Subscription bundles - access to ALL courses.
 * Duration determines how long the user has access.
 * No single-course purchase - only bundles.
 */
export type BundleDuration = "1month" | "6months" | "12months";

export interface Bundle {
  id: string;
  name: string;
  durationMonths: number;
  price: number;
  currency: string;
  pricePerMonth: number;
  features: string[];
  popular?: boolean;
}

export const BUNDLES: Bundle[] = [
  {
    id: "1month",
    name: "1 Month",
    durationMonths: 1,
    price: 299,
    currency: "EGP",
    pricePerMonth: 299,
    features: [
      "Access to all tracks",
      "All courses included",
      "Download resources",
      "Community support",
    ],
  },
  {
    id: "6months",
    name: "6 Months",
    durationMonths: 6,
    price: 1_399,
    currency: "EGP",
    pricePerMonth: 233,
    features: [
      "Everything in 1 Month",
      "Save 22%",
      "Access for 6 months",
      "Early access to new courses",
    ],
    popular: true,
  },
  {
    id: "12months",
    name: "1 Year",
    durationMonths: 12,
    price: 2_199,
    currency: "EGP",
    pricePerMonth: 183,
    features: [
      "Everything in 6 Months",
      "Best value - save 39%",
      "Access for 12 months",
      "Priority support",
    ],
  },
];
