// src/utils/driveStorage.js

export async function loadUserData(token) {
  // Look for our JSON file in .appdata
  const listRes = await fetch(
    "https://www.googleapis.com/drive/v3/files?q='appDataFolder'+in+parents",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const listData = await listRes.json();
  if (!listData.files?.length) return null;

  // Load first (or only) appdata file
  const fileId = listData.files[0].id;
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return await res.json();
}

export async function saveUserData(token, data) {
  const body = JSON.stringify({
    name: "appdata.json",
    parents: ["appDataFolder"],
    mimeType: "application/json",
  });

  // Upload file contents
  await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body,
    }
  );
}
