import Input from "@/components/Input";
import { useCallback, useState } from "react";
import axios from "axios";

const Auth = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [username, setUsername] = useState<string>("");

    const [variant, setVariant] = useState<string>("login");

    const toggleVariant = useCallback(() => {
        setVariant((prev) => (prev === "login" ? "register" : "login"));
    }, []);

    const register = useCallback(async () => {
        try {
            const res = await axios.post("/api/register", {
                email,
                password,
                username,
            });
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    }, [email, password, username]);

    return (
        <div className="relative h-full w-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
            <div className="bg-black w-full h-full lg:bg-opacity-50">
                <nav className="px-12 py-5">
                    <img src="/images/logo.png" alt="logo" className="h-12" />
                </nav>
                <div className="flex justify-center">
                    <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:max-w-md rounded-md w-full">
                        <h2 className="text-white text-4xl mb-8 font-semibold">
                            {variant === "login" ? "Sign in" : "Register"}
                        </h2>
                        <div className="flex flex-col gap-4">
                            {variant === "register" && (
                                <Input
                                    type="text"
                                    id="username"
                                    label="Username"
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    value={username}
                                />
                            )}
                            <Input
                                type="email"
                                id="email"
                                label="Email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                            <Input
                                type="password"
                                id="password"
                                label="Password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                        </div>
                        <button
                            onClick={register}
                            className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition "
                        >
                            {variant === "login" ? "Sign in" : "Register"}
                        </button>
                        <p className="text-neutral-500 mt-12">
                            Don't have an account?{" "}
                            <span
                                className="text-white font-semibold cursor-pointer hover:underline transition"
                                onClick={toggleVariant}
                            >
                                {variant === "login"
                                    ? "Register here"
                                    : "Sign in here"}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
