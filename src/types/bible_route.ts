import { CONST_BOOK_SYMBOL_TO_NAME } from "../consts/bible_data";

export type BibleRouteParams = {
  book: string;
  chapter: string;
  verse: string;
};

export function TO_STRING(route: BibleRouteParams, shorten_book: boolean = true, end_verse: number | null = null) {
  const prefix = `${shorten_book ? route.book : CONST_BOOK_SYMBOL_TO_NAME[route.book]} ${route.chapter}:${route.verse}`;
  return end_verse ? `${prefix} - ${end_verse}` : prefix;
}

export function TO_STRING_DUAL(start: BibleRouteParams, end: BibleRouteParams, shorten_book: boolean = true) {
  return `${TO_STRING(start, shorten_book)} - ${TO_STRING(end, shorten_book)}`;
}

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