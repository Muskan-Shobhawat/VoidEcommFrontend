import Image from 'next/image';

/** Product photo with a consistent crop; `sizes` keeps next/image from over-fetching. */
export default function ProductImage({ src, alt = '', sizes = '(max-width: 768px) 50vw, 25vw', priority = false, className = '' }) {
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} />;
}
