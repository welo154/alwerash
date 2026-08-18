import Image from "next/image";

export const LIBRARY_BOOK_WIDTH_PX = 194;
export const LIBRARY_BOOK_HEIGHT_PX = 294.464;
export const LIBRARY_BOOK_DETAIL_WIDTH_PX = 345.111;
export const LIBRARY_BOOK_DETAIL_HEIGHT_PX = 523.829;
const SPINE_LEFT_OFFSET_PX = 20;
const SPINE_LINE_HEIGHT_GRID_PX = 270;
const SPINE_LINE_HEIGHT_DETAIL_PX = 480;
const SPINE_LINE_WIDTH_PX = 1;

export type LibraryBookGridBoxProps = {
  imageSrc: string;
  imageAlt: string;
  size?: "grid" | "detail";
};

function getBookDimensions(size: "grid" | "detail") {
  if (size === "detail") {
    return {
      width: LIBRARY_BOOK_DETAIL_WIDTH_PX,
      height: LIBRARY_BOOK_DETAIL_HEIGHT_PX,
      spineHeight: SPINE_LINE_HEIGHT_DETAIL_PX,
    };
  }
  return {
    width: LIBRARY_BOOK_WIDTH_PX,
    height: LIBRARY_BOOK_HEIGHT_PX,
    spineHeight: SPINE_LINE_HEIGHT_GRID_PX,
  };
}

export function LibraryBookGridBox({
  imageSrc,
  imageAlt,
  size = "grid",
}: LibraryBookGridBoxProps) {
  const { width, height, spineHeight } = getBookDimensions(size);
  const bookSizeStyle = {
    width: `${width}px`,
    height: `${height}px`,
    minWidth: `${width}px`,
    maxWidth: `${width}px`,
    minHeight: `${height}px`,
    maxHeight: `${height}px`,
  } as const;

  return (
    <div className="relative shrink-0 overflow-hidden" style={bookSizeStyle}>
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes={`${width}px`}
        className="object-cover"
        draggable={false}
        unoptimized
      />
      <div
        className="pointer-events-none absolute top-0 flex"
        style={{ left: SPINE_LEFT_OFFSET_PX, height: spineHeight }}
        aria-hidden
      >
        <div
          style={{
            width: SPINE_LINE_WIDTH_PX,
            height: spineHeight,
            backgroundColor: "#616161",
          }}
        />
        <div
          style={{
            width: SPINE_LINE_WIDTH_PX,
            height: spineHeight,
            backgroundColor: "#FFFFFF",
          }}
        />
      </div>
    </div>
  );
}
