import { NextApiRequest, NextApiResponse } from "next";

import prismadb from "@/libs/prismadb";
import serverSession from "@/libs/serverProfile";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		if (req.method !== "GET") {
			return res.status(405).end();
		}

		const { userProfileList } = await serverSession(req, res);

		return res.status(200).json(userProfileList);
	} catch (error) {
		return res.status(500).end();
	}
}
