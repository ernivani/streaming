import React, { useEffect, useRef, useState } from "react";
import {
    PlayIcon,
    PauseIcon,
    ArrowLeftIcon,
} from "@heroicons/react/24/outline";

interface VideoPlayerProps {
    src: string;
    router: any;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, router }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState(false);
    const [blobUrl, setBlobUrl] = useState("");
    const [loading, setLoading] = useState(true); // Add a loading state

    useEffect(() => {
        fetch(src)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.blob();
            })
            .then((blob) => {
                const blobURL = URL.createObjectURL(blob);
                setBlobUrl(blobURL);
                console.log(blobURL);
                setLoading(false); // Set loading to false after Blob URL has been created
            })
            .catch((error) => {
                console.error("Error:", error);
                setLoading(false); // Also set loading to false if there's an error
            });
    }, [src]);

    useEffect(() => {
        if (blobUrl && videoRef.current) {
            videoRef.current
                .play()
                .then(() => setPlaying(true))
                .catch((error) => console.error("Video play failed:", error));
        }
    }, [blobUrl]);

    const handlePlayPause = () => {
        if (videoRef.current) {
            if (playing) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }

            setPlaying((currentPlaying) => !currentPlaying);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <h1 className="text-4xl text-white">Loading...</h1>
            </div>
        ); // Render a loading indication
    }

    if (!blobUrl) {
        return null;
    }

    return (
        <div className="flex items-center justify-center h-screen ">
            {/* pause button */}
            <button
                className="absolute left-0 m-4 p-2 bg-black bg-opacity-50 rounded-full bottom-0 cursor-pointer z-10"
                onClick={handlePlayPause}
            >
                {playing ? (
                    <PauseIcon className="w-6 h-6 text-white" />
                ) : (
                    <PlayIcon className="w-6 h-6 text-white" />
                )}
            </button>
            {/* exit button */}
            <button
                className="absolute left-0 m-4 p-2 bg-black bg-opacity-50 rounded-full top-0 cursor-pointer z-10"
                onClick={() => {
                    router.push("/");
                }}
            >
                <ArrowLeftIcon className="w-6 h-6 text-white" />
            </button>
            <video
                muted
                onClick={handlePlayPause}
                ref={videoRef}
                className="w-full h-full object-cover"
                src={blobUrl}
            />
            {!playing && (
                <div
                    onClick={handlePlayPause}
                    className="absolute inset-0 flex items-center justify-center text-white text-4xl bg-black bg-opacity-50 "
                >
                    <PlayIcon className="w-10 h-10" />
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;
