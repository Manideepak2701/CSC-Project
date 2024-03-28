import { useEffect, useRef, useState} from "react";
import {AiFillPlayCircle} from 'react-icons/ai';
import {BsPauseCircleFill} from 'react-icons/bs';
import {BiSolidDownload} from 'react-icons/bi';

const AudioPlayer = ({ audioFile }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef();
    const progressBarRef = useRef();

    useEffect(() => {
        if(audioFile){
            const audioArrayBuffer = audioFile.AudioStream.buffer;
            const audioURL = URL.createObjectURL(new Blob([audioArrayBuffer], {type: "audio/mpeg"}));

            const audio = audioRef.current;
            audio.src = audioURL;

            audio.addEventListener('loaddate', () => {
                setDuration(audio.duration);
            })
            audio.addEventListener('timeupdate', updateProgressBar);

            return () =>{
                URL.revokeObjectURL(audioURL);
            }
        }
    }, [audioFile])

    const updateProgressBar = () => {
        const audio = audioRef.current;
        const progress = (audio.currentTime / audio.duration) * 100;

        setCurrentTime(audio.currentTime);
        progressBarRef.current.style.width = `${progress}%`
    }

    const tooglePlay = () => {
        const audio = audioRef.current;
        if(isPlaying)
        {
            audio.pause();
        }
        else
        {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    }
    const downloadAudio = () => {
        if(audioFile){
            const audioArrayBuffer = audioFile.AudioStream.buffer;
            const audiURL = URL.createObjectURL(new Blob([audioArrayBuffer], {type: "audio/mpeg"}));

            const a = document.createElement(`a`);
            a.href = audiURL;
            a.download = "audio.mp3";
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(audiURL);
        }
    }

    return(
        <div className="audio-container">
            <audio ref={audioRef}/>
            <div className="progress-container">
                <div 
                    ref={progressBarRef} 
                    className="progress-bar"
                    style={{width: `${(currentTime / duration) * 100}%`}}
                />
            </div>
            <div >
            <button 
                className="audio-button" 
                disabled = {!audioFile}
                onClick={() => tooglePlay()}
            >
                {
                    isPlaying ?
                        <BsPauseCircleFill className="icon-btn"/> :
                        <AiFillPlayCircle className="icon-btn"/>
                }
                </button>
                <button 
                className="audio-button" 
                disabled = {!audioFile}
                onClick={() => downloadAudio()}
                >
                    <BiSolidDownload className="icon-btn"/>
                </button>
            </div>
        </div>
    )
}

export default AudioPlayer;