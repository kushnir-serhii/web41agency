import { Button } from "../ui/Button";

interface IFact {
  value: string;
  label: string[];
  accent: boolean;
  /* Position inside the facts box, as a percentage of its width/height —
     the same staggered triangle on mobile and desktop. */
  position: string;
}

const facts: IFact[] = [
  {
    value: "30+",
    label: ["successful", "projects"],
    accent: true,
    position: "left-[65.1%] top-0",
  },
  {
    value: "4y",
    label: ["combined", "experience"],
    accent: true,
    position: "left-0 top-[36.4%]",
  },
  {
    value: "10+",
    label: ["industries", "expertise"],
    accent: false,
    position: "left-[34.9%] top-[64.7%]",
  },
];

export const About = () => {
  return (
    <section className="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row items-start gap-10 lg:gap-16 xl:gap-[223px] px-4 lg:px-20 py-20 lg:py-40">
      <div className="flex flex-col items-start w-full lg:w-[45%] xl:w-[428.53px] gap-6 lg:gap-10">
        <h2 className="w-full text-4xl lg:text-6xl font-bold text-left text-black">
          About Web41
        </h2>
        <div className="w-full flex flex-col gap-4 opacity-80 text-lg text-left text-black">
          <p>
            At Web41, we build high-performance web solutions tailored to your
            needs.
          </p>
          <p>
            Whether you need custom-coded precision or a no-code Webflow
            solution, we&rsquo;ve got you covered.
          </p>
        </div>
        <Button text="Free Consultation" fill />
      </div>

      {/* The circles run into the section's bottom padding, as in the design */}
      <div className="relative w-full lg:w-1/2 xl:w-[631px] aspect-[631/623] shrink-0 lg:-mb-40">
        {facts.map(({ value, label, accent, position }) => (
          <div
            key={value}
            className={`absolute flex flex-col justify-center items-center w-[34.9%] aspect-square rounded-full
              ${position} ${accent ? "bg-accent" : "bg-bg_item"}`}
          >
            <p className="w-full text-xl lg:text-[32px] font-bold text-center text-black">
              {value}
            </p>
            <p className="w-full text-xs lg:text-lg text-center text-black">
              {label[0]}
              <br />
              {label[1]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
