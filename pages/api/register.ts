import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import primsadb from "@/lib/prismadb";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).end();
    }

    try {
        const { email, username, password } = req.body;

        const existingUser = await primsadb.user.findFirst({
            where: {
                email,
            },
        });

        if (existingUser) {
            return res.status(422).json({ message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await primsadb.user.create({
            data: {
                email,
                username,
                hashedPassword: hashedPassword,
                image: "",
                emailVerified: new Date(),
            },
        });

        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(400).end();
    }
}
