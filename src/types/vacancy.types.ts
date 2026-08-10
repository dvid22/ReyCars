export interface Vacancy {
  id: string; title: string; area: string; description: string; requirements: string[];
  location: string; modality?: string; active: boolean; order: number;
}
