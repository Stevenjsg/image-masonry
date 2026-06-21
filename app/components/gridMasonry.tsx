"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Photo } from "../types/photo";

interface Props {
  photos: Photo[];
}

const breakpoints = [
  { minWidth: 1536, col: 6 },
  { minWidth: 1280, col: 5 },
  { minWidth: 1024, col: 4 },
  { minWidth: 768, col: 3 },
];

function distributePhotos(photos: Photo[], ncol: number) {
  const distributed = Array.from({ length: ncol }, () => [] as Photo[]);
  photos.forEach((p, i) => {
    const pos = i % ncol;
    distributed[pos].push(p);
  });
  return distributed;
}

export default function GridMasonry({ photos }: Props) {
  const [ncols, setNcols] = useState(2);

  useEffect(() => {
    const handlerCols = () => {
      const newCols = breakpoints.find(
        (b) => matchMedia(`(min-width: ${b.minWidth}px)`).matches,
      );
      setNcols(newCols?.col ?? 2);
    };
    handlerCols();
    window.addEventListener("resize", handlerCols);
    return () => window.removeEventListener("resize", handlerCols);
  }, []);

  const arrayPhotos = distributePhotos(photos, ncols);
  return (
    <section
      className="w-full grid gap-4"
      style={{ gridTemplateColumns: `repeat(${ncols},1fr)` }}
    >
      {arrayPhotos.map((c, i) => (
        <ul key={i} className="grid gap-4 ">
          {c.map((p) => (
            <li key={p.id}>
              <figure
                className="w-full relative group"
                style={{ aspectRatio: `${p.width} / ${p.height}` }}
              >
                <figcaption className="opacity-0 absolute z-10 w-full place-content-center rounded-t-xl text-white/80 group-hover:inline-flex group-hover:scale-105 group-hover:opacity-100 group-hover:transition-opacity group-hover:duration-300">
                  {p.photographer}
                </figcaption>
                <Image
                  className="w-full rounded-xl border group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-white/20 group-hover:transition-all group-hover:duration-300 group-hover:ease-in-out "
                  src={p.src.large}
                  fill
                  alt={p.alt}
                  sizes="(max-width: 768px) 50vw, 25vw"
                  loading="eager"
                />
              </figure>
            </li>
          ))}
        </ul>
      ))}
    </section>
  );
}
