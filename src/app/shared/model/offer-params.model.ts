

export class OfferParams {
  searchString: string | null;
  remotePossibilityEqual: boolean | null;
  anyCategoryIdEqual: number[] | null;
  anyLocalizationIdEqual: number[] | null;
  firstJobPossibilityEqual: boolean | null;
  currentPage: number;
}
