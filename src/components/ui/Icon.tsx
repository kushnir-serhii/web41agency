import React from "react";

interface IconProps {
  id: string;
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({
  id,
  width = "100%",
  height = "auto",
  className,
}) => {
  // "auto" is a valid CSS value but not a valid SVG attribute length, so it has
  // to go through a class instead of the height attribute.
  const isAutoHeight = height === "auto";

  return (
    <svg
      width={width}
      height={isAutoHeight ? undefined : height}
      aria-label={id}
      className={`transition-all ease-in-out ${isAutoHeight ? "h-auto" : ""} ${
        className ?? ""
      }`}
    >
      <use xlinkHref={`/icons/sprite.svg#${id}`} />
    </svg>
  );
};
