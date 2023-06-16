import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import prismadb from "@/libs/prismadb";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        Credentials({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                },
                password: {
                    label: "Password",
                    type: "passord",
                },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password required");
                }

                const user = await prismadb.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                if (!user || !user.hashedPassword) {
                    throw new Error("Email does not exist");
                }

                const isCorrectPassword = await compare(
                    credentials.password,
                    user.hashedPassword
                );

                if (!isCorrectPassword) {
                    throw new Error("Incorrect password");
                }

                return user;
            },
        }),
    ],
    pages: {
        signIn: "/auth",
    },
    debug: process.env.NODE_ENV === "development",
    adapter: PrismaAdapter(prismadb),
    session: { strategy: "jwt" },
    jwt: {
        secret: process.env.NEXTAUTH_JWT_SECRET,
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            const isAllowedToSignIn = true;

            if (!profile) {
                return true;
            }

            // check if the user have profile and if it does not have we create one
            console.log(profile);

            // get the user id in account with providerAccountId
            const accountUser = await prismadb.account.findFirst({
                where: {
                    provider: account?.provider,
                    providerAccountId: account?.providerAccountId,
                },
                include: {
                    user: true,
                },
            });

            if (!accountUser) {
                throw new Error(
                    "No account found for this provider and provider account ID"
                );
            }

            console.log(accountUser.user.id); // This will log the user id

            // Check if a profile already exists for the user
            let userProfile = await prismadb.profile.findMany({
                where: {
                    userId: accountUser.user.id,
                },
            });

            // If no profile exists, create a new one
            if (!userProfile) {
                userProfile: userProfile = await prismadb.profile.create({
                    data: {
                        name: accountUser.user.name,
                        image: "",
                        userId: accountUser.user.id,
                    },
                });
            }

            console.log(userProfile); // This will log the user profile
            return isAllowedToSignIn;
        },
    },
};

export default NextAuth(authOptions);
