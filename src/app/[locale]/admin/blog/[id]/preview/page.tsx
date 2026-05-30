import { ArticlePreview } from "@/components/features/admin/blog/ArticlePreview";

export default async function ArticlePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ArticlePreview articleId={id} />;
}
