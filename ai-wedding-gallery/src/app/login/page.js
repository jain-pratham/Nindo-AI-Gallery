"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login",{
                method:"POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!data.success) {
                alert("Invalid email or password");
                setLoading(false);
                return;
            }

            localStorage.setItem("adminToken", data.token);
            router.push("/admin");
        } catch (error) {
            alert("Server error")
        } finally {
            setLoading(false);
        }
    }

    return(
        <div>
            <div>
                <h1>
                    Admin LoginPage
                </h1>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                    >{loading ? "Logging in..." : "Login"}</button>
                </form>
            </div>
        </div>
    )
}