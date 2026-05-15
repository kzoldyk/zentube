export default async function CollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="flex flex-1 flex-col p-6">
      <h2 className="text-2xl font-semibold">Collection</h2>
      <p className="mt-2 text-zinc-500 dark:text-zinc-400">{id}</p>
    </div>
  );
}
