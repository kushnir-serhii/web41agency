import { ICaseImage } from '@/content/caseStudiesContent';
import Image from 'next/image';

interface CaseGalleryProps {
  images: ICaseImage[];
}

export const CaseGallery: React.FC<CaseGalleryProps> = ({ images }) => {
  return (
    <section className="w-full max-w-[1440px] mx-auto flex flex-col gap-10 px-4 lg:px-20 py-10">
      {images.map(({ src, alt, caption }) => (
        <figure key={alt} className="flex flex-col gap-4 w-full">
          <div className="relative w-full aspect-[1280/720] rounded-lg overflow-hidden bg-bg_item">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 1024px) 100vw, 1280px"
              className="object-cover"
            />
          </div>
          {caption && <figcaption className="text-lg text-black/70">{caption}</figcaption>}
        </figure>
      ))}
    </section>
  );
};
