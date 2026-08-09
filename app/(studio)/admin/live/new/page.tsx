import { LiveForm } from "@/components/live/live-form";

export default function NewLiveBroadcastPage() {
  return (
    <div className="mx-auto max-w-5xl p-10">
      <h1 className="mb-8 text-3xl font-bold">
        New Broadcast
      </h1>

      <LiveForm />
    </div>
  );
}