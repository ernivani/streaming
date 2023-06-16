import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import prismadb from "@/libs/prismadb";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const getUserProfileList = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const Profile = await getServerSession(req, res, authOptions);

	if (!Profile?.user?.email) {
		throw new Error("Not signed in");
	}

	const currentUser = await prismadb.user.findUnique({
		where: {
			email: Profile.user.email,
		},
	});

	if (!currentUser) {
		throw new Error("Not signed in");
	}

	const userProfileList = await prismadb.profile.findMany({
		where: {
			userId: currentUser.id,
		},
	});

	return { userProfileList };
};

export default getUserProfileList;
