import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Edit from "~/icons/edit";
import Microphone from "~/icons/microphone";
import Trash from "~/icons/trash";

const TalktableTextarea = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  const { startListening, abortListening } = SpeechRecognition;
  const [value, setValue] = useState("");
  const [isEditable, setIsEditable] = useState(
    !(browserSupportsSpeechRecognition && isMicrophoneAvailable)
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let t: NodeJS.Timeout | null = null;
    if (isEditable) {
      t = setTimeout(() => {
        textareaRef.current?.focus();
        textareaRef.current?.setSelectionRange(value.length, value.length);
      }, 0);
    }

    return () => {
      t && clearTimeout(t);
    };
  }, [isEditable]);

  const startRecording = () => {
    startListening({ continuous: true });
  };

  const stopRecording = () => {
    abortListening();
    // console.log(listening);
    setValue((val) => val + (val && " ") + transcript);
    // console.log(value);
    resetTranscript();
    // console.log(transcript);
  };

  const removeLast = () => {
    if (value !== "") {
      setValue((val) => val.slice(0, val.search(/\w+$/g)).trim());
    }
  };

  const handleClickRecording = () => {
    if (listening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const toogleEditable = () => {
    setIsEditable((val) => !val);
  };

  return (
    <div className="speech-to-text w-9/12 rounded-md bg-gray-400 p-2">
      <div className="relative">
        {isEditable ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
            }}
            className="block h-[6em] w-full bg-transparent p-2"
          />
        ) : (
          <div className="h-[6em] w-full overflow-y-auto p-2">
            {!(value || transcript) ? (
              <span className="text-gray-600">
                Pulse el botón de grabar para agregar información
              </span>
            ) : (
              <>
                <span>{value}</span>
                <span>
                  {value && transcript && " "}
                  {transcript}
                </span>
              </>
            )}
          </div>
        )}

        {/* <div className="absolute inset-0 flex items-center justify-around bg-transparent"></div> */}
      </div>
      {browserSupportsSpeechRecognition && isMicrophoneAvailable && (
        <div className="flex w-full justify-around">
          <button
            onClick={toogleEditable}
            className={clsx(
              "w-12 cursor-pointer rounded-full p-1 ",
              "hover:bg-gray-900 hover:text-white",
              "disabled:cursor-not-allowed disabled:text-gray-600 disabled:hover:bg-transparent"
            )}
            disabled={listening}
          >
            <Edit />
          </button>
          <button
            onClick={handleClickRecording}
            disabled={isEditable}
            className={clsx(
              "w-12 cursor-pointer rounded-full p-1 ",
              "hover:bg-gray-900 hover:text-white",
              listening && "animate-recording",
              "disabled:cursor-not-allowed disabled:text-gray-600 disabled:hover:bg-transparent"
            )}
          >
            <Microphone />
          </button>
          <button
            onClick={removeLast}
            className={clsx(
              "w-12 cursor-pointer rounded-full p-1 ",
              "hover:bg-gray-900 hover:text-white",
              "disabled:cursor-not-allowed disabled:text-gray-600 disabled:hover:bg-transparent"
            )}
            disabled={listening || isEditable}
          >
            <Trash />
          </button>
        </div>
      )}
    </div>
  );
};

export default TalktableTextarea;
