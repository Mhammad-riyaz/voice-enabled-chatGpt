import React from "react";

import { Button, Box } from "@mui/material";

import axios from "axios";

export const Mike: React.FC = () => {
  const [isRecording, setIsRecording] = React.useState(false);
  const mediaRecorder = React.useRef<MediaRecorder | null>(null);
  const audioChunks = React.useRef<Blob[]>([]);

  React.useEffect(() => {
    async function init() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.ondataavailable = (event) => {
            console.log('data avaialble: ',event.data)
          if (event.data.size > 0) audioChunks.current.push(event.data);
        };
        mediaRecorder.current.onstop = () => {
          const audioBlob: Blob = new Blob(audioChunks.current, {
            type: "audio/wav",
          });
          console.log(audioBlob);
          savetheBlob(audioBlob)
        };
      } catch {
        console.log("Error initializing");
      }
    }
    init();
    return () =>{
        if(mediaRecorder.current){
            mediaRecorder.current.ondataavailable = null
            mediaRecorder.current.onstop = null
        }
    }

  }, []);

  const startRecording = async () => {

    if (mediaRecorder.current) {
      mediaRecorder.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = async ()=>{
    if(mediaRecorder.current){
        mediaRecorder.current.stop()
        setIsRecording(false)
    }
  }

  const savetheBlob =async (blob:Blob) => {
    const a = document.createElement('a');
  document.body.appendChild(a);

  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = 'audio-wav-file';
  a.click();
  window.URL.revokeObjectURL(url);

  document.body.removeChild(a);

  }


const getTranscription = async()=>{

    const filePath = '/audio-wav-file.wav'
    console.log(filePath)
    const formData = new FormData();
      formData.append('model', 'whisper-1');
      formData.append('file', filePath);


    const headers =  {
        'Authorization' : 'Bearer   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',
        'Content-Type': 'multipart/form-data'
      }
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      body: filePath,
      headers: headers,
    });
      console.log(response)

}


console.log(audioChunks)
console.log(isRecording)
  return (
    <Box>
      <Button onClick={!isRecording? startRecording : stopRecording }
        sx={{ padding: "2.5em 1em", borderRadius: "100px", fontWeight: "bold" }}
        variant="contained"
      >
        {!isRecording?"Turn on":"Turn off"}
      </Button>
      <Button onClick={getTranscription }
        sx={{ padding: "2.5em 1em", borderRadius: "100px", fontWeight: "bold" }}
        variant="contained"
      >
        transcribe
      </Button>
    </Box>
  );
};
