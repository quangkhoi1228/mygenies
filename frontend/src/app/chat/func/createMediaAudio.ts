export default async function createMediaAudio() {
  const streamObject: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  return streamObject;
}
