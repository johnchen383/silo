export type BibleRouteParams = {
    book: string;
    chapter: string;
    verse: string;
};

export function IsBibleRouteParams(value: unknown): value is BibleRouteParams {
  return (
    typeof value === "object" &&
    value !== null &&
    "book" in value &&
    "chapter" in value &&
    typeof (value as any).book === "string" &&
    typeof (value as any).chapter === "string"
  );
}

export const DEFAULT_BIBLE_ROUTE: BibleRouteParams = {
    book: "GEN",
    chapter: "1",
    verse: '1'
}