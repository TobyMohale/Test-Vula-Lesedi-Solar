import React from "react";

interface LogoProps {
  variant?: "horizontal" | "stacked" | "iconOnly";
  size?: "sm" | "md" | "lg";
  light?: boolean;
}

export default function Logo({ variant = "horizontal", size = "md", light = false }: LogoProps) {
  // Determine dimensions based on size
  const iconSizeClass = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-20 w-20",
  }[size];

  const textPrimaryColor = light ? "text-white" : "text-[#0a2240]";
  const textSecondaryColor = light ? "text-[#4ade80]" : "text-[#16a34a]";
  const textSloganColor = light ? "text-slate-300" : "text-slate-500";

  const renderIcon = () => (
    <img
      src="https://res.cloudinary.com/dagphoc0j/image/upload/v1783014307/Vual_Lesedi_Favicon_ug2wd6.png"
      alt="Vula Lesedi Power Solutions Logo"
      className={`${iconSizeClass} shrink-0 object-contain`}
      aria-label="Vula Lesedi Power Solutions Logo Icon"
    />
  );

  if (variant === "iconOnly") {
    return renderIcon();
  }

  if (variant === "stacked") {
    return (
      <div className="flex flex-col items-center text-center">
        {renderIcon()}
        <div className="mt-4">
          <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${textPrimaryColor}`}>
            VULA LESEDI
          </h1>
          <div className="flex items-center justify-center gap-2 mt-0.5">
            <span className="w-4 h-[2px] bg-[#16a34a]"></span>
            <p className={`text-xs md:text-sm font-bold tracking-[0.25em] ${textSecondaryColor}`}>
              POWER SOLUTIONS
            </p>
            <span className="w-4 h-[2px] bg-[#16a34a]"></span>
          </div>
          <p className={`text-[10px] md:text-xs font-semibold tracking-wider mt-1 uppercase ${textSloganColor}`}>
            Powering a Brighter Tomorrow • VLPS
          </p>
        </div>
      </div>
    );
  }

  // Horizontal variant (default)
  return (
    <div className="flex items-center gap-3">
      {renderIcon()}
      <div className="flex flex-col">
        <span className={`text-lg md:text-xl font-extrabold tracking-tight leading-none ${textPrimaryColor}`}>
          VULA LESEDI
        </span>
        <span className={`text-[10px] md:text-xs font-bold tracking-[0.18em] leading-none mt-1 ${textSecondaryColor}`}>
          POWER SOLUTIONS
        </span>
        <span className={`text-[8px] font-semibold tracking-widest leading-none mt-0.5 text-slate-400 uppercase hidden sm:inline`}>
          Gauteng Power Specialists
        </span>
      </div>
    </div>
  );
}
