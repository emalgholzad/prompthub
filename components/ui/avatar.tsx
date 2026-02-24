import Image from "next/image";

export function Avatar({ image, name }: { image?: string | null; name?: string | null }) {
  if (image) {
    return <Image src={image} alt={name ?? "avatar"} width={32} height={32} className="size-8 rounded-full" />;
  }
  return <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs">{name?.[0]?.toUpperCase() ?? "U"}</div>;
}
