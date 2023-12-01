import React, { useState, useRef } from "react";

export const Mike1: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prevChunks) => [...prevChunks, event.data]);
        }
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);

        // Create a download link
        const a = document.createElement("a");
        a.href = audioUrl;
        a.download = "recorded-audio.wav";
        a.click();

        // Cleanup
        setAudioChunks([]);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div>
      <h2>Audio Recorder</h2>
      <main>
        <div className="audio-controls">
          {!isRecording ? (
            <button onClick={startRecording} type="button">
              Start Recording
            </button>
          ) : (
            <button onClick={stopRecording} type="button">
              Stop Recording
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

