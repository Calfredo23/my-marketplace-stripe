/* eslint-disable @next/next/no-img-element */
import type { ImgHTMLAttributes } from "react";

export function Photo({
  alt,
  loading = "lazy",
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  return <img alt={alt ?? ""} loading={loading} {...props} />;
}
