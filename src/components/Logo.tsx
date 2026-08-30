import Image from "next/image";

const MARK_RATIO = 1357 / 3107; // intrinsic aspect of the supplied CCA artwork

/**
 * Carter Cole & Associates lockup.
 * `light` = white/green mark for navy backgrounds.
 * `dark`  = navy/green mark for white backgrounds.
 *
 * `showWordmark={false}` renders the CCA mark on its own — used in the
 * header, where the name is already carried by the page title and the mark
 * alone keeps the nav uncluttered. The footer keeps the full lockup.
 */
export default function Logo({
  variant = "dark",
  markWidth = 82,
  className = "",
  priority = false,
  showWordmark = true,
}: {
  variant?: "dark" | "light";
  markWidth?: number;
  className?: string;
  priority?: boolean;
  showWordmark?: boolean;
}) {
  const primary = variant === "light" ? "#ffffff" : "#0f1d44";
  const accent = "#ddb33c";

  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <Image
        src={variant === "light" ? "/images/cca-logo-light.png" : "/images/cca-logo.png"}
        alt="Carter Cole & Associates"
        width={markWidth}
        height={Math.round(markWidth * MARK_RATIO)}
        priority={priority}
        className="shrink-0"
        style={{ height: "auto" }}
      />
      {showWordmark && (
        <>
          <span
            aria-hidden
            className="h-8 w-px shrink-0"
            style={{
              background:
                variant === "light"
                  ? "rgba(255,255,255,0.22)"
                  : "rgba(15,29,68,0.15)",
            }}
          />
          <span className="leading-none">
            <span
              className="display block whitespace-nowrap text-[15.5px] font-semibold tracking-tight sm:text-[17.5px]"
              style={{ color: primary }}
            >
              Carter Cole <span style={{ color: accent }}>&amp;</span> Associates
            </span>
            <span
              className="mt-1.5 block whitespace-nowrap text-[8px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: variant === "light" ? "#ecd08a" : "#6b7789" }}
            >
              Clarity · Transformation · Legacy
            </span>
          </span>
        </>
      )}
    </span>
  );
}
