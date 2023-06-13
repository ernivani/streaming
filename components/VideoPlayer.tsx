import React, { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
	src: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [playing, setPlaying] = useState(true);

	useEffect(() => {
		const playPromise = videoRef.current?.play();
		if (playPromise !== undefined) {
			playPromise
				.then(() => {
					videoRef.current!.muted = false; // unmute video after auto-play begins
				})
				.catch((error) => {
					// Auto-play was prevented
					// Show a UI element to let the user manually start playback
					setPlaying(false);
				});
		}
	}, []);

	const handlePlayPause = () => {
		if (videoRef.current) {
			if (playing) {
				videoRef.current.pause();
			} else {
				videoRef.current.play();
			}
			setPlaying(!playing);
		}
	};

	return (
		<div className="flex items-center justify-center h-screen">
			<video
				ref={videoRef}
				className="max-w-full h-full"
				src={src}
				onClick={handlePlayPause}
			/>
		</div>
	);
};

export default VideoPlayer;
