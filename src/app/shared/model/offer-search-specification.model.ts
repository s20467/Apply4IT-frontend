

export class OfferSearchSpecification {
  stringSearchSection: OfferSearchSpecificationStringSearchSection | null;
  remotePossibilityEqual: boolean | null;
  anyCategoryIdEqual: number[] | null;
  anyLocalizationIdEqual: number[] | null;
  firstJobPossibilityEqual: boolean | null;
  companyIdEqual: number | null;
}

export class OfferSearchSpecificationStringSearchSection {
  titleLike: string;
  descriptionLike: string;
  anyExpectationLike: string;
  anyOfferAdvantageLike: string;
  companyNameLike: string;
  anyCategoryNameLike: string;
}
