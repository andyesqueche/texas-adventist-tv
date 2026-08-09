import { supabase } from "@/lib/supabase/client";

type UploadFileOptions = {
  file: File;
  bucket: string;
  folder?: string;
};

export async function uploadFile({
  file,
  bucket,
  folder,
}: UploadFileOptions): Promise<string> {
  const extension =
    file.name.split(".").pop()?.toLowerCase() ?? "bin";

  const fileName = `${crypto.randomUUID()}.${extension}`;

  const filePath = folder
    ? `${folder}/${fileName}`
    : fileName;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      contentType: file.type || undefined,
      upsert: false,
    });

  if (error) {
    console.error("UPLOAD ERROR:", error);
    throw new Error(error.message);
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}