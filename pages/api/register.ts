import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/libs/prismadb";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		if (req.method !== "POST") {
			return res.status(405).end();
		}

		const { email, name, password } = req.body;

		const existingUser = await prismadb.user.findUnique({
			where: {
				email,
			},
		});

		if (existingUser) {
			return res.status(422).json({ error: "Email taken" });
		}

		const hashedPassword = await bcrypt.hash(password, 12);

		const user = await prismadb.user.create({
			data: {
				email,
				name,
				hashedPassword,
				image: "",
				emailVerified: new Date(),
			},
		});

		// Check if user creation was successful
		if (!user) {
			throw new Error("User creation failed.");
		}

		// Create a profile for the new user
		const profile = await prismadb.profile.create({
			data: {
				name,
				image: "",
				userId: user.id,
			},
		});

		// Check if profile creation was successful
		if (!profile) {
			throw new Error("Profile creation failed.");
		}

		// Return both user and profile in the response
		return res.status(200).json(user);
	} catch (error) {
		return res
			.status(400)
			.json({ error: `Something went wrong: ${error}` });
	}
}
