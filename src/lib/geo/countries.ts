/** Scaffold for card payments — MoMo checkout defaults to Ghana. */
export type CountryOption = {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  paymentMethods: ("momo" | "card")[];
};

export const COUNTRIES: CountryOption[] = [
  { code: "GH", name: "Ghana", dialCode: "+233", flag: "🇬🇭", paymentMethods: ["momo", "card"] },
  { code: "NG", name: "Nigeria", dialCode: "+234", flag: "🇳🇬", paymentMethods: ["card"] },
  { code: "KE", name: "Kenya", dialCode: "+254", flag: "🇰🇪", paymentMethods: ["card"] },
  { code: "ZA", name: "South Africa", dialCode: "+27", flag: "🇿🇦", paymentMethods: ["card"] },
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸", paymentMethods: ["card"] },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧", paymentMethods: ["card"] },
];

export const DEFAULT_COUNTRY_CODE = "GH";

export function getCountryByCode(code: string): CountryOption | undefined {
  return COUNTRIES.find((c) => c.code === code.toUpperCase());
}

export function getDefaultCountry(): CountryOption {
  return getCountryByCode(DEFAULT_COUNTRY_CODE) ?? COUNTRIES[0];
}

/** Countries available for the current checkout (MoMo = Ghana only until card gateway ships). */
export function getCheckoutCountries(method: "momo" | "card" = "momo"): CountryOption[] {
  return COUNTRIES.filter((c) => c.paymentMethods.includes(method));
}
