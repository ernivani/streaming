import React, { useEffect, useRef, useState } from "react";
import {
	FiPlay,
	FiPause,
	FiArrowLeft,
	FiVolume2,
	FiVolumeX,
	FiMaximize2,
	FiMinimize2,
	FiChevronLeft,
	FiChevronRight,
} from "react-icons/fi";

interface VideoPlayerProps {
    src: string;
    router: any;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, router }) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const videoContainerRef = useRef<HTMLDivElement>(null);
	const [playing, setPlaying] = useState(false);
	const [progress, setProgress] = useState(0);
	const [volume, setVolume] = useState(1);
	const [fullscreen, setFullscreen] = useState(false);
	const [blobUrl, setBlobUrl] = useState("");
	const [loading, setLoading] = useState(true);

	const [dimensions, setDimensions] = useState({
		height: typeof window !== "undefined" ? window.innerHeight : 0,
		width: typeof window !== "undefined" ? window.innerWidth : 0,
	});

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
				setLoading(false);
			})
			.catch((error) => console.error("Error:", error));
	}, [src]);

	useEffect(() => {
		if (blobUrl && videoRef.current) {
			videoRef.current
				.play()
				.then(() => setPlaying(true))
				.catch((error) => console.error("Video play failed:", error));
		}
	}, [blobUrl]);

	useEffect(() => {
		const updateProgress = () => {
			if (videoRef.current) {
				setProgress(
					(videoRef.current.currentTime / videoRef.current.duration) *
						100
				);
			}
		};
		const interval = setInterval(updateProgress, 1000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		function handleResize() {
			setDimensions({
				height: window.innerHeight,
				width: window.innerWidth,
			});
		}

		if (typeof window !== "undefined") {
			window.addEventListener("resize", handleResize);
		}

		return () => {
			if (typeof window !== "undefined") {
				window.removeEventListener("resize", handleResize);
			}
		};
	}, []);

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

	const handleVolume = () => {
		if (videoRef.current) {
			setVolume((currentVolume) => {
				const newVolume = currentVolume ? 0 : 1;
				videoRef.current!.volume = newVolume;
				return newVolume;
			});
		}
	};

	const handleFullscreen = () => {
		if (videoContainerRef.current) {
			if (fullscreen) {
				document.exitFullscreen();
			} else {
				videoContainerRef.current.requestFullscreen();
			}

			setFullscreen((currentFullscreen) => !currentFullscreen);
		}
	};

	const handleSkip = (amount: number) => {
		if (videoRef.current) {
			videoRef.current.currentTime += amount;
		}
	};

	const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const clickedValue =
			e.nativeEvent.offsetX / e.currentTarget.offsetWidth;
		if (videoRef.current) {
			videoRef.current.currentTime =
				clickedValue * videoRef.current.duration;
		}
	};

	const handleContextMenu = (e: React.MouseEvent<HTMLVideoElement>) => {
		e.preventDefault();
	};

	const handleDoubleClick = () => {
		handleFullscreen();
	};

	const videoStyle = {
		maxHeight: dimensions.height,
		width: dimensions.width,
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen ">
				<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white" />
			</div>
		);
	}

	if (!blobUrl) {
		return null;
	}

	return (
		<div
			className="relative flex items-center justify-center h-screen"
			ref={videoContainerRef}
		>
			<div
				className="relative bg-black w-full h-full"
				onDoubleClick={handleDoubleClick}
			>
				<video
					onClick={handlePlayPause}
					ref={videoRef}
					onContextMenu={handleContextMenu}
					className="absolute top-1/2 left-1/2 max-w-full max-h-full object-contain transform -translate-x-1/2 -translate-y-1/2"
					src={blobUrl}
					style={videoStyle}
				/>
			</div>

			<div className="absolute bottom-0 bg-black bg-opacity-50 p-4 flex items-center w-full z-10">
				<button className="p-2" onClick={handlePlayPause}>
					{playing ? (
						<FiPause className="w-6 h-6 text-white" />
					) : (
						<FiPlay className="w-6 h-6 text-white" />
					)}
				</button>
				<button className="p-2" onClick={() => handleSkip(-10)}>
					<FiChevronLeft className="w-6 h-6 text-white" />
				</button>
				<button className="p-2" onClick={() => handleSkip(10)}>
					<FiChevronRight className="w-6 h-6 text-white" />
				</button>
				<button className="p-2 ml-auto" onClick={handleVolume}>
					{volume ? (
						<FiVolume2 className="w-6 h-6 text-white" />
					) : (
						<FiVolumeX className="w-6 h-6 text-white" />
					)}
				</button>
				<button className="p-2" onClick={handleFullscreen}>
					{fullscreen ? (
						<FiMinimize2 className="w-6 h-6 text-white" />
					) : (
						<FiMaximize2 className="w-6 h-6 text-white" />
					)}
				</button>
			</div>

			<button
				className="absolute left-0 m-4 p-2 bg-black bg-opacity-50 rounded-full top-0 cursor-pointer z-20"
				onClick={() => {
					router.push("/");
				}}
			>
				<FiArrowLeft className="w-6 h-6 text-white" />
			</button>

			<div
				onClick={handleProgressClick}
				className="w-full bg-gray-500 h-2 absolute bottom-0 z-10 cursor-pointer"
			>
				<div
					style={{ width: `${progress}%` }}
					className="bg-white h-2"
				/>
			</div>
		</div>
	);
};

export default VideoPlayer;
