import { signOut } from "next-auth/react";
import React from "react";

import useCurrentUser from "@/hooks/useCurrentUser";
import useCurrentProfile from "@/hooks/useCurrentProfile";

interface AccountMenuProps {
	visible?: boolean;
}

const images = [
	"/images/default-blue.png",
	"/images/default-red.png",
	"/images/default-slate.png",
	"/images/default-green.png",
];

const AccountMenu: React.FC<AccountMenuProps> = ({ visible }) => {
	const { data: currentUser } = useCurrentUser();
	const { data: currentProfiles } = useCurrentProfile();

	const [imgSrc, setImgSrc] = React.useState("");



	React.useEffect(() => {

		if (!currentUser) {
			return;
		}

		if (currentUser[0]?.name) {
			setImgSrc(currentUser[0]?.name);
		} else {
			// use a simple hash function to get a somewhat random, but still deterministic, index
			let hash = 0;
			for (let i = 0; i < currentUser[0]?.name.length; i++) {
				hash = (31 * hash + currentUser[0]?.name.charCodeAt(i)) >>> 0; // >>> 0 forces to unsigned 32 bit number
			}
			const imageIndex = hash % images.length;
			setImgSrc(images[imageIndex]);
		}
	}, [currentUser?.name, currentUser?.image]);

	if (!visible) {
		return null;
	}

	if (!currentProfiles) {
		return null;
	}


	return (
		<div className="bg-black w-56 absolute top-14 right-0 py-5 flex-col border-2 border-gray-800 flex">
			<div className="flex flex-col gap-3">
				{currentProfiles.map((profile) => (
					<div className="px-3 group/item flex flex-row gap-3 items-center w-full" key={profile.id}>
						<img
							className="w-8 rounded-md"
							src={profile.image || imgSrc}
							alt=""
						/>
						<p className="text-white text-sm group-hover/item:underline">
							{profile.name}
						</p>
					</div>
				))}
			</div>
			<hr className="bg-gray-600 border-0 h-px my-4" />
			<div
				onClick={() => signOut()}
				className="px-3 text-center text-white text-sm hover:underline"
			>
				Sign out of Netflix
			</div>
		</div>
	);
};

export default AccountMenu;
