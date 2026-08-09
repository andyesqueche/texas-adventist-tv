import { notFound } from "next/navigation";

import { LiveForm } from "@/components/live/live-form";
import { getLiveBroadcastById } from "@/lib/repositories/live.repository";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditLiveBroadcastPage({
  params,
}: Props) {
  const { id } = await params;

  let broadcast;

  try {
    broadcast = await getLiveBroadcastById(id);
  } catch (error) {
    console.error(
      "GET LIVE BROADCAST ERROR:",
      error
    );

    notFound();
  }

  if (!broadcast) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl p-10">
      <h1 className="mb-2 text-3xl font-bold">
        Edit Broadcast
      </h1>

      <p className="mb-8 text-zinc-500">
        Manage stream, schedule, artwork and broadcast status.
      </p>

      <LiveForm
        initialData={broadcast}
      />
    </div>
  );
}