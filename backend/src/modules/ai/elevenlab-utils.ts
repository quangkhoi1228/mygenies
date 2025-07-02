/* eslint-disable no-restricted-syntax */
import { ElevenLabsClient } from 'elevenlabs';

import { Readable } from 'stream';

// Helper để convert Readable stream => Buffer
async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(Uint8Array.from(chunk));
  }
  return Buffer.concat(chunks);
}

export const generateSpeechFromTextEL = async (text: string) => {
  try {
    const client = new ElevenLabsClient();

    // 1. Generate audio from text
    const audioStream = await client.textToSpeech.convert(
      'Xb7hH8MSUJpSbSDYk0k2',
      {
        text,
        model_id: 'eleven_flash_v2_5',
        // model_id: "eleven_multilingual_v2",

        output_format: 'mp3_44100_128',
      },
    );

    const audioBuffer = await streamToBuffer(audioStream);

    return Buffer.from(audioBuffer);
  } catch (error) {
    console.error('Error in generateSpeechFromText:', error);
    throw error;
  }
};
