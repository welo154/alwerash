/**
 * The watermark's starting anchor is staggered per viewer, so two students
 * watching the same lesson do not carry the marker in the same place.
 */
import { describe, expect, it } from "vitest";
import { startIndex, WATERMARK_POSITION_COUNT } from "./VideoWatermark";

describe("startIndex", () => {
  it("always returns a valid anchor index", () => {
    for (const text of ["A1B2C-D3E4F", "", "x", "00000-00000", "ZZZZZ-ZZZZZ"]) {
      const index = startIndex(text);
      expect(Number.isInteger(index)).toBe(true);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(WATERMARK_POSITION_COUNT);
    }
  });

  it("is deterministic for the same marker", () => {
    expect(startIndex("A1B2C-D3E4F")).toBe(startIndex("A1B2C-D3E4F"));
  });

  it("spreads different markers across anchors rather than collapsing to one", () => {
    const markers = Array.from({ length: 60 }, (_, i) =>
      `M${i.toString().padStart(4, "0")}-${(i * 7).toString().padStart(5, "0")}`
    );
    const used = new Set(markers.map(startIndex));
    // A hash that always returned the same slot would defeat the staggering.
    expect(used.size).toBeGreaterThan(1);
  });

  it("is sensitive to character order", () => {
    // Individual pairs collide by chance with only 6 anchors, so compare many:
    // a plain character-sum hash would place every anagram in the same slot.
    const pairs = Array.from({ length: 40 }, (_, i) => {
      const a = `AB${i.toString().padStart(3, "0")}C-D${i}E`;
      return [a, [...a].reverse().join("")] as const;
    });
    const differing = pairs.filter(([a, b]) => startIndex(a) !== startIndex(b));
    expect(differing.length).toBeGreaterThan(pairs.length / 3);
  });
});
