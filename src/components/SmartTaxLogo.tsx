import Image from "next/image";

const RATIO = 214 / 1640; // intrinsic aspect of the supplied logo artwork

/**
 * Official SmartTaxIQ lockup.
 * `light` = white wordmark, for navy / emerald backgrounds.
 * `dark`  = navy wordmark, for white / cream backgrounds.
 */
export default function SmartTaxLogo({
  variant = "dark",
  width = 240,
  className = "",
  priority = false,
  decorative = false,
}: {
  variant?: "dark" | "light";
  width?: number;
  className?: string;
  priority?: boolean;
  /**
   * Set when the brand name is already spelled out in adjacent text. The mark
   * then carries an empty alt so assistive tech reads the name once, not twice.
   */
  decorative?: boolean;
}) {
  return (
    <Image
      src={
        variant === "light"
          ? "/images/smarttaxiq-logo-light.png"
          : "/images/smarttaxiq-logo.png"
      }
      alt={decorative ? "" : "SmartTaxIQ"}
      width={width}
      height={Math.round(width * RATIO)}
      priority={priority}
      className={className}
      style={{ height: "auto" }}
    />
  );
}
