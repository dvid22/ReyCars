export interface Instructor {
  id: string; name: string; role: string; specialty: string; description: string;
  photoUrl: string; experience?: string; certifications?: string[]; active: boolean; order: number;
}
