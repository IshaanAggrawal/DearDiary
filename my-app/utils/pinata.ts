// src/utils/pinata.ts
const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

export async function uploadToIPFS(body: any) {
  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    throw new Error("Pinata keys are missing in .env.local");
  }

  const jsonBody = JSON.stringify({
    pinataMetadata: {
      name: "Diary Entry", 
    },
    pinataContent: body 
  });

  try {
    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY,
      },
      body: jsonBody
    });

    if (!res.ok) throw new Error("Failed to upload to Pinata");
    
    const data = await res.json();
    return data.IpfsHash;
  } catch (error) {
    console.error("IPFS Upload Error:", error);
    throw error;
  }
}