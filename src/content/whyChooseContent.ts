import { IWhyChooseContent } from "@/components/whyChoose/WhyChoose";

export const whyChooseContent: IWhyChooseContent = {
  sectionTitle: "Why Choose Us",
  textButton: "Free Consultation",
  mainContent: [
    {
      iconId: "icon-fast",
      title: "Fast & Efficient",
      description: [
        {
          text: "Get your website up and running quickly—Webflow sites in ",
          highlight: false,
        },
        { text: "2–4 weeks,", highlight: true },
        {
          text: " and custom JavaScript solutions optimized for high performance.",
          highlight: false,
        },
      ],
    },
    {
      iconId: "icon-cost",
      title: "Cost-Effective",
      description: [
        {
          text: "We tailor our pricing to fit your needs, offering both affordable  ",
          highlight: false,
        },
        { text: "no-code options ", highlight: true },
        {
          text: "from just ",
          highlight: false,
        },
        {
          text: "800USD ",
          highlight: true,
        },
        {
          text: "and robust ",
          highlight: false,
        },
        {
          text: "custom-built applications ",
          highlight: true,
        },
        {
          text: "from ",
          highlight: false,
        },
        {
          text: "1600USD.",
          highlight: true,
        },
      ],
    },
    {
      iconId: "icon-flex",
      title: "Scalable & Flexible",
      description: [
        {
          text: "Whether you need a fully custom-coded platform or an easy-to-manage Webflow site, ",
          highlight: false,
        },
        { text: "we build solutions that grow ", highlight: true },
        {
          text: "with your business.",
          highlight: false,
        },
      ],
    },
    ,
  ] as {
    iconId: string;
    title: string;
    description: { text: string; highlight: boolean }[];
  }[],
};
