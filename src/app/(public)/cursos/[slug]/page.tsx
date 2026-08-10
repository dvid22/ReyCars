import { CursoDetallePage } from "@/modules/public/cursos/CursoDetallePage";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CursoDetallePage slug={slug} />;
}
