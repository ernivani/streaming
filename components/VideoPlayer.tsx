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
	const [playing, setPlaying] = useState(true);

	useEffect(() => {
		const playPromise = videoRef.current?.play();
		if (playPromise !== undefined) {
			playPromise
				.then(() => {
					videoRef.current!.muted = false;
				})
				.catch((error) => {
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
		<div
			className="flex items-center justify-center h-screen "
			onClick={handlePlayPause}
		>
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
				ref={videoRef}
				className="w-full h-full object-cover"
				src={src}
			/>
			{!playing && (
				<div className="absolute inset-0 flex items-center justify-center text-white text-4xl bg-black bg-opacity-50 ">
					<PlayIcon className="w-10 h-10" />
				</div>
			)}
		</div>
	);
};

export default VideoPlayer;
