import { cn } from "@/utils/cn";

interface ButtonProps {
  // fill?: boolean;
  // bg?: string;
  text: string;
  children?: React.ReactNode;
  className?: string;
  btnType?: "primary" | "secondary" | "ghost";
}
export const Button: React.FC<ButtonProps> = ({
  text,
  btnType = "primary",
  // bg = "bg-black",
  children,
  className,
}) => {
  const btnTypeStyle = {
    primary: "bg-black text-white",
    secondary: "bg-white text-black",
    ghost: "text-black ",

  }


  return (
    <button
      type="button"
      aria-label={text + "button"}
      className={cn(`flex justify-center items-center shrink-0 gap-2.5 h-14 px-6 py-4 rounded-full outline-none focus-visible:outline-black cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-black transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-lg active:scale-98 active:shadow-sm
              text-lg font-bold whitespace-nowrap`,
        btnTypeStyle[btnType],
        className)}
    >
      {children}
      <span>
        {text}
      </span>
    </button>
  );
};
