const API_URL = "https://api.cloudflare.com/client/v4";

function getHeaders() {
  const token = process.env.CLOUDFLARE_STREAM_TOKEN;

  if (!token) {
    throw new Error(
      "Missing CLOUDFLARE_STREAM_TOKEN environment variable."
    );
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

function getAccountId() {
  const accountId =
    process.env.CLOUDFLARE_ACCOUNT_ID;

  if (!accountId) {
    throw new Error(
      "Missing CLOUDFLARE_ACCOUNT_ID environment variable."
    );
  }

  return accountId;
}

export async function createDirectUpload() {
  const accountId = getAccountId();

  const response = await fetch(
    `${API_URL}/accounts/${accountId}/stream/direct_upload`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        maxDurationSeconds: 14400,
      }),
    }
  );

  const json = await response.json();

  if (!response.ok || !json.success) {
    console.error(json);

    throw new Error(
      json.errors?.[0]?.message ??
        "Unable to create direct upload."
    );
  }

  return {
    uid: json.result.uid,
    uploadURL: json.result.uploadURL,
  };
}

export async function getVideo(uid: string) {
  const accountId = getAccountId();

  const response = await fetch(
    `${API_URL}/accounts/${accountId}/stream/${uid}`,
    {
      headers: getHeaders(),
      cache: "no-store",
    }
  );

  const json = await response.json();

  if (!response.ok || !json.success) {
    console.error(json);

    throw new Error(
      json.errors?.[0]?.message ??
        "Unable to retrieve video."
    );
  }

  return json.result;
}

export async function deleteVideo(uid: string) {
  const accountId = getAccountId();

  const response = await fetch(
    `${API_URL}/accounts/${accountId}/stream/${uid}`,
    {
      method: "DELETE",
      headers: getHeaders(),
    }
  );

  const json = await response.json();

  if (!response.ok || !json.success) {
    console.error(json);

    throw new Error(
      json.errors?.[0]?.message ??
        "Unable to delete video."
    );
  }

  return true;
}