import Image from "next/image";

export default function Photo({ src, alt, className = "cover", ...rest }) {
  return <Image src={src} alt={alt} className={className} unoptimized={src.startsWith("http")} {...rest} />;
}
