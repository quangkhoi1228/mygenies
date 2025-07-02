/* eslint-disable no-restricted-syntax */
import { ElevenLabsClient } from "elevenlabs";

import { Readable } from "stream";
import FormData from "form-data";
import { axiosExternalFormData } from "./axios-external";
import { generateUniqueId } from "./groq-utils";

// eslint-disable-next-line import/order

// Helper để convert Readable stream => Buffer
async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(Uint8Array.from(chunk));
  }
  return Buffer.concat(chunks);
}

export const generateSpeechFromTextEL = async (text: string, voice = "Arista-PlayAI") => {
  const filename: string = `${generateUniqueId(text)}.wav`;

  try {
    const client = new ElevenLabsClient();

    // 1. Generate audio from text
    const audioStream = await client.textToSpeech.convert("Xb7hH8MSUJpSbSDYk0k2", {
      text,
      model_id: "eleven_flash_v2_5",
      // model_id: "eleven_multilingual_v2",

      output_format: "mp3_44100_128",
    });

    const audioBuffer = await streamToBuffer(audioStream);

    const formData = new FormData();
    formData.append("file", audioBuffer, {
      filename,
      contentType: "audio/wav",
    });

    try {
      const { data } = await axiosExternalFormData.post("/audio/upload", formData);

      const result = { filename: data.url };
      return result;
    } catch (error) {
      throw new Error("Upload failed");
    }

    // // 2. Get Convex upload URL
    // const postUrl = await convexClient.mutation(api.chatMessages.generateUploadUrl, {});

    // // 3. Upload audio to Convex
    // const response = await fetch(postUrl, {
    //   method: "POST",
    //   headers: { "Content-Type": "audio/wav" },
    //   body: audioBuffer,
    // });

    // const { storageId } = response.data;

    // 4. Save media info to Convex database
    // const sendMediaResult = await convexClient.mutation(api.chatMessages.sendMedia, {
    //   storageId,
    //   name: filename,
    //   format: "audio",
    // });
  } catch (error) {
    console.error("Error in generateSpeechFromText:", error);
    throw error;
  }
};
