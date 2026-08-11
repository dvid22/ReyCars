export interface HomeHeroBenefit {
  title: string;
  description: string;
}

export interface HomeHeroContent {
  eyebrow: string;
  title: string;
  highlightedText: string;
  description: string;

  primaryCtaLabel: string;
  secondaryCtaLabel: string;

  heroImageUrl: string;

  benefits: HomeHeroBenefit[];
}

export interface HomeSectionHeaderContent {
  eyebrow: string;
  title: string;
  highlightedText: string;
  description: string;
  ctaLabel?: string;
}

export interface HomeHoursSectionContent {
  eyebrow: string;
  title: string;
  highlightedText: string;
  description: string;
}

export interface HomeContent {
  hero: HomeHeroContent;
  coursesSection: HomeSectionHeaderContent;
  processSection: HomeSectionHeaderContent;
  faqSection: HomeSectionHeaderContent;
  hoursSection: HomeHoursSectionContent;
}

export interface HomeContentDocument extends HomeContent {
  updatedAt?: unknown;
  updatedByUid?: string;
  updatedByEmail?: string;
}