export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
}

export interface LegalDocument {
  title: string;
  description: string;
  lastUpdated: string;
  intro: string[];
  sections: LegalSection[];
}
