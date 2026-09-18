import React from "react";

interface IconProps {
  id: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  /* Accessible name. Without it the icon is decorative and hidden from
     assistive tech — give the parent control an aria-label instead. */
  label?: string;
}

export const Icon: React.FC<IconProps> = ({
  id,
  width = "100%",
  height = "auto",
  className,
  label,
}) => {
  // "auto" is a valid CSS value but not a valid SVG attribute length, so it has
  // to go through a class instead of the height attribute.
  const isAutoHeight = height === "auto";

  const a11yProps = label
    ? { role: "img", "aria-label": label }
    : { "aria-hidden": true as const };

  return (
    <svg
      width={width}
      height={isAutoHeight ? undefined : height}
      focusable="false"
      {...a11yProps}
      className={`transition-all ease-in-out ${isAutoHeight ? "h-auto" : ""} ${
        className ?? ""
      }`}
    >
      <use xlinkHref={`/icons/sprite.svg#${id}`} />
    </svg>
  );
};
