type RecordAudioType = {
  (stream: MediaStream): Promise<Blob>;
  stop: () => void;
  currentRecorder?: MediaRecorder;
};

export const recordAudio = ((): RecordAudioType => {
  const startRecording = async (stream: MediaStream): Promise<Blob> => {
    try {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });
      const audioChunks: Blob[] = [];

      return await new Promise((resolve, reject) => {
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          resolve(audioBlob);
        };

        mediaRecorder.onerror = () => {
          reject(new Error('MediaRecorder error occurred'));
        };

        mediaRecorder.start(1000);
        (recordAudio as RecordAudioType).currentRecorder = mediaRecorder;
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to start recording: ${errorMessage}`);
    }
  };

  (startRecording as RecordAudioType).stop = () => {
    const recorder = (startRecording as RecordAudioType).currentRecorder;
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
    }
    delete (startRecording as RecordAudioType).currentRecorder;
  };

  return startRecording as RecordAudioType;
})();
