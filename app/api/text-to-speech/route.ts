import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { text, voiceId } = await request.json()

    // Use the provided API key or check for environment variable
    const apiKey = process.env.ELEVENLABS_API_KEY

    if (!apiKey) {
      return NextResponse.json({ fallback: true }, { status: 200 })
    }

    const voiceSettings = {
      stability: 0.5,
      similarity_boost: 0.5,
    }

    const apiResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: voiceSettings,
      }),
    })

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({}))

      // If ElevenLabs disabled the free tier or flagged unusual activity, instruct client to fallback
      if (
        errorData?.detail?.status === "detected_unusual_activity" ||
        apiResponse.status === 402 ||
        apiResponse.status === 429
      ) {
        return NextResponse.json({ fallback: true }, { status: 200 })
      }

      console.error("ElevenLabs API error:", errorData)
      return NextResponse.json({ error: "ElevenLabs API error", details: errorData }, { status: apiResponse.status })
    }

    // Get the audio data from the API response
    const audioData = await apiResponse.arrayBuffer()

    // Set the response headers
    const headers = new Headers()
    headers.append("Content-Type", "audio/mpeg")

    // Return the audio data as a response
    return new NextResponse(audioData, { headers })
  } catch (error) {
    console.error("Error processing text-to-speech request:", error)
    return NextResponse.json({ error: "Failed to process text-to-speech request" }, { status: 500 })
  }
}
