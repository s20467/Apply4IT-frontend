

export class OfferParams {
  searchString: string | null;
  remotePossibilityEqual: boolean | null;
  anyCategoryIdEqual: number[];
  anyLocalizationIdEqual: number[];
  firstJobPossibilityEqual: boolean | null;
  companyIdEqual: number | null;
  currentPage: number;
}
