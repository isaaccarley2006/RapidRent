import { cn } from "@/lib/utils";

interface Props {
  showHeading?: boolean;
  className?: string;
  align?: "left" | "center";
  maskBackgroundColor?:
    | "hsl(var(--background-default)"
    | "hsl(var(--background-alternative)";
}

const Logos: React.FC<Props> = ({
  className,
  showHeading = true,
  align = "center",
}) => {
  const gap = "gap-4 lg:gap-8";

  return (
    <div className={cn("py-16", className)} suppressHydrationWarning>
      <div className="max-w-md md:max-w-lg lg:max-w-2xl mx-auto">
        <div
          className={cn(
            "relative w-full mx-auto max-w-4xl opacity-90 dark:opacity-70",
            "overflow-hidden",
            "before:content[''] before:absolute before:inset-0 before:w-full before:bg-[linear-gradient(to_right,hsl(var(--background-default))_0%,transparent_10%,transparent_90%,hsl(var(--background-default))_100%)] before:z-10",
            "flex flex-nowrap justify-center",
            "px-5 lg:px-12",
            align === "left" ? "justify-start ml-0" : "justify-center",
            gap
          )}
        >
          {[0, 1, 2, 3].map((_, i) => (
            <LogosRow
              key={`logos-group-${i}`}
              className={cn(
                gap,
                "flex flex-nowrap w-fit",
                "animate-[marquee_90000ms_linear_both_infinite] will-change-transform",
                "motion-reduce:animate-none motion-reduce:will-change-none"
              )}
            />
          ))}
        </div>
      </div>
      {showHeading && (
        <p className="w-full text-center font-inter text-sm text-slate-500 mt-6 lg:mt-8">
          Powered by
        </p>
      )}
    </div>
  );
};

const logos = [
  {
    image: `https://supabase.com/images/logos/publicity/mozilla.svg`,
    alt: "mozilla",
    name: "mozilla",
  },
  {
    image: `https://supabase.com/images/logos/publicity/mozilla.svg`,
    alt: "github",
    name: "github",
  },
  {
    image: `https://supabase.com/images/logos/publicity/mozilla.svg`,
    alt: "1password",
    name: "1password",
  },
  {
    image: `https://supabase.com/images/logos/publicity/mozilla.svg`,
    alt: "pwc",
    name: "pwc",
  },
  {
    image: `https://supabase.com/images/logos/publicity/mozilla.svg`,
    alt: "pika",
    name: "pika",
  },
  {
    image: `https://supabase.com/images/logos/publicity/mozilla.svg`,
    alt: "humata",
    name: "humata",
  },
  {
    image: `https://supabase.com/images/logos/publicity/mozilla.svg`,
    alt: "mozilla",
    name: "mozilla",
  },
  {
    image: `https://supabase.com/images/logos/publicity/mozilla.svg`,
    alt: "github",
    name: "github",
  },
  {
    image: `https://supabase.com/images/logos/publicity/mozilla.svg`,
    alt: "1password",
    name: "1password",
  },
  {
    image: `https://supabase.com/images/logos/publicity/mozilla.svg`,
    alt: "pwc",
    name: "pwc",
  },
  {
    image: `https://supabase.com/images/logos/publicity/mozilla.svg`,
    alt: "pika",
    name: "pika",
  },
  {
    image: `https://supabase.com/images/logos/publicity/mozilla.svg`,
    alt: "humata",
    name: "humata",
  },
  {
    image: `https://supabase.com/images/logos/publicity/mozilla.svg`,
    alt: "mozilla",
    name: "mozilla",
  },
  {
    image: `https://supabase.com/images/logos/publicity/mozilla.svg`,
    alt: "github",
    name: "github",
  },
  {
    image: `https://supabase.com/images/logos/publicity/mozilla.svg`,
    alt: "1password",
    name: "1password",
  },
  {
    image: `https://supabase.com/images/logos/publicity/mozilla.svg`,
    alt: "pwc",
    name: "pwc",
  },
  {
    image: `https://supabase.com/images/logos/publicity/mozilla.svg`,
    alt: "pika",
    name: "pika",
  },
  {
    image: `https://supabase.com/images/logos/publicity/mozilla.svg`,
    alt: "humata",
    name: "humata",
  },
];

const LogosRow: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn(className)} suppressHydrationWarning>
    {logos.map((logo) => (
      <div
        key={`logos-group-${logo.name}`}
        className="h-12 lg:h-12 w-max !inline-block"
      >
        <img
          src={logo.image}
          alt={logo.alt}
          className={"h-12 lg:h-12 !min-h-12 lg:!min-h-12 w-auto block"}
          draggable={false}
        />
      </div>
    ))}
  </div>
);

export default Logos;
