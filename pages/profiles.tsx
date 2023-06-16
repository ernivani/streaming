import { NextPageContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useState, useEffect } from "react";

import useCurrentUser from "@/hooks/useCurrentUser";
import useCurrentProfile from "@/hooks/useCurrentProfile";

const images = [
	"/images/default-blue.png",
	"/images/default-red.png",
	"/images/default-slate.png",
	"/images/default-green.png",
];

interface UserCardProps {
	name: string;
	image: string;
}

interface Profile {
	id: string;
	name: string;
	image: string;
}
export async function getServerSideProps(context: NextPageContext) {
	const session = await getSession(context);

	if (!session) {
		return {
			redirect: {
				destination: "/auth",
				permanent: false,
			},
		};
	}

	return {
		props: {},
	};
}

const UserCard: React.FC<UserCardProps> = ({ name, image }) => {
	const [imgSrc, setImgSrc] = useState("");

	useEffect(() => {
		if (image) {
			setImgSrc(image);
		} else {
			// use a simple hash function to get a somewhat random, but still deterministic, index
			let hash = 0;
			for (let i = 0; i < name.length; i++) {
				hash = (31 * hash + name.charCodeAt(i)) >>> 0; // >>> 0 forces to unsigned 32 bit number
			}
			const imageIndex = hash % images.length;
			setImgSrc(images[imageIndex]);
		}
	}, [name, image]);

	return (
		<div className="group flex-row w-44 mx-auto">
			<div className="w-44 h-44 rounded-md flex items-center justify-center border-2 border-transparent group-hover:cursor-pointer group-hover:border-white overflow-hidden">
				<img
					draggable={false}
					className="w-max h-max object-contain"
					src={imgSrc}
					alt=""
				/>
			</div>
			<div className="mt-4 text-gray-400 text-2xl text-center group-hover:text-white">
				{name}
			</div>
		</div>
	);
};

const App = () => {
	const router = useRouter();
	const { data: currentProfiles } = useCurrentProfile();

	const selectProfile = useCallback(() => {
		router.push("/");
	}, [router]);

	if (!currentProfiles) {
		return null;
	}

	return (
		<div className="flex items-center h-full justify-center">
			<div className="flex flex-col">
				<h1 className="text-3xl md:text-6xl text-white text-center">
					Who&#39;s watching?
				</h1>
				<div className="flex items-center justify-center gap-8 mt-10">
					<div
						className="flex flex-wrap gap-4"
						onClick={() => selectProfile()}
					>
						{/* for profile in currentProfiles */}
						{currentProfiles.map((profile: Profile) => (
							<UserCard
								key={profile.id}
								name={profile.name}
								image={profile.image}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default App;
