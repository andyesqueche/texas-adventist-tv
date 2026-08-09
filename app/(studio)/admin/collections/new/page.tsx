import { CollectionForm } from "@/components/collections/collection-form";

export default function NewCollectionPage() {
  return (
    <div className="mx-auto max-w-5xl p-10">

      <h1 className="mb-8 text-3xl font-bold">
        New Collection
      </h1>

      <CollectionForm />

    </div>
  );
}