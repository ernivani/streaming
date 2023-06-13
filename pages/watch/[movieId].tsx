import React, { useEffect } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import useMovie from "@/hooks/useMovie";
import VideoPlayer from "@/components/VideoPlayer";

const Watch: React.FC = () => {
	const router = useRouter();
	const { movieId } = router.query;
	const { data } = useMovie(movieId as string);

	return (
		<div className="h-screen w-screen bg-black">
			<div className="h-full w-full">
				<VideoPlayer src={data?.videoUrl} />
			</div>
		</div>
	);
};

export default Watch;
