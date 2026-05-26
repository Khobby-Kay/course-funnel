"use client";

import { GHANA_REGIONS } from "@/lib/geo/regions";
import { getCheckoutCountries, getDefaultCountry } from "@/lib/geo/countries";

type Props = {
  countryCode: string;
  onCountryChange: (code: string) => void;
  phone: string;
  onPhoneChange: (phone: string) => void;
  region: string;
  onRegionChange: (region: string) => void;
  paymentMethod?: "momo" | "card";
};

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-black/10 focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/20";

export default function CountryPhoneFields({
  countryCode,
  onCountryChange,
  phone,
  onPhoneChange,
  region,
  onRegionChange,
  paymentMethod = "momo",
}: Props) {
  const countries = getCheckoutCountries(paymentMethod);
  const selected = countries.find((c) => c.code === countryCode) ?? getDefaultCountry();
  const momoOnly = paymentMethod === "momo";

  return (
    <>
      <label className="block">
        <span className="text-sm font-medium mb-1 block">Country</span>
        <div className="flex gap-2">
          <select
            value={selected.code}
            onChange={(e) => onCountryChange(e.target.value)}
            disabled={momoOnly}
            className={`${inputClass} ${momoOnly ? "bg-gray-light text-gray-muted" : ""}`}
            aria-describedby={momoOnly ? "country-momo-hint" : undefined}
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name} ({c.dialCode})
              </option>
            ))}
          </select>
        </div>
        {momoOnly && (
          <p id="country-momo-hint" className="text-xs text-gray-muted mt-1">
            Mobile Money is available in Ghana. Card payments for other countries coming soon.
          </p>
        )}
      </label>

      <label className="block">
        <span className="text-sm font-medium mb-1 block">
          {momoOnly ? "MoMo phone number" : "Phone number"}
        </span>
        <div className="flex gap-2">
          <span className="px-3 py-3 rounded-xl border border-black/10 bg-gray-light text-sm text-gray-muted shrink-0">
            {selected.dialCode}
          </span>
          <input
            type="tel"
            name="phone"
            required
            autoComplete="tel-national"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            className={inputClass}
            placeholder={momoOnly ? "0241234567" : "Local number"}
          />
        </div>
      </label>

      <label className="block">
        <span className="text-sm font-medium mb-1 block">Region</span>
        <select
          name="region"
          required
          value={region}
          onChange={(e) => onRegionChange(e.target.value)}
          className={inputClass}
        >
          <option value="">Select your region</option>
          {GHANA_REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-muted mt-1">
          Helps us tailor support and future live sessions to your area.
        </p>
      </label>
    </>
  );
}
