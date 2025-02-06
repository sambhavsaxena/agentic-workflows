import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bot } from "lucide-react";
import axios from "axios";

const Onboarding = () => {
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");
	const [message, setMessage] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const storedEmail = localStorage.getItem("userEmail");
		if (storedEmail) {
			navigate("/chat");
		}
	}, [navigate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus("loading");
		setMessage("");

		try {
			const response = await axios.post(`/api/login`, {
				email,
			});
			switch (response.status) {
				case 200:
					setStatus("success");
					localStorage.setItem("userEmail", email);
					setTimeout(() => navigate("/chat"), 10);
					break;
				case 201:
					setStatus("success");
					setMessage("User created. Awaiting approval.");
					break;
				default:
					setStatus("error");
					setMessage(`Unexpected status code: ${response.status}`);
			}
		} catch (error: unknown) {
			setStatus("error");

			if (axios.isAxiosError(error)) {
				if (error.response) {
					console.error(
						"Response error:",
						error.response.status,
						error.response.data
					);
					switch (error.response.status) {
						case 401:
							setMessage("User not approved.");
							break;
						case 400:
							setMessage("Bad Request. Please check your input.");
							break;
						default:
							setMessage(`Server Error: ${error.response.status}`);
					}
				} else if (error.request) {
					console.error("Request error:", error.message);
					setMessage("No response from the server.");
				} else {
					console.error("Setup error:", error.message);
					setMessage("Request setup failed.");
				}
			} else {
				console.error("Other error:", error);
				setMessage("An unexpected error occurred.");
			}
		} finally {
			// Any cleanup or final actions go here.
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
			<div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl">
				<div className="text-center">
					<Bot className="mx-auto h-12 w-12 text-emerald-500" />
					<h2 className="mt-6 text-3xl font-bold text-white">
						Welcome to AgentX
					</h2>
					<p className="mt-2 text-sm text-gray-400">
						Your AI agent communication companion <br />
					</p>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div>
						<label htmlFor="email" className="sr-only">
							Email address
						</label>
						<input
							id="email"
							name="email"
							type="email"
							required
							className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
							placeholder="Enter your email address"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={status === "loading"}
						/>
					</div>

					<div className="flex flex-col items-center">
						<button
							type="submit"
							disabled={status === "loading"}
							className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
								status === "loading"
									? "bg-gray-600"
									: status === "success"
									? "bg-emerald-600 hover:bg-emerald-700"
									: status === "error"
									? "bg-red-600 hover:bg-red-700"
									: "bg-emerald-600 hover:bg-emerald-700"
							} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500`}
						>
							{status === "loading" ? "Processing..." : "Get Started"}
						</button>
						{message && (
							<div
								className={`text-sm text-center ${
									status === "error" ? "text-red-400" : "text-emerald-400"
								}`}
							>
								{message}
							</div>
						)}
						<p className="mt-2 text-sm text-gray-400">
							Read{" "}
							<a
								className="text-emerald-500 my-8"
								target="blank"
								href="https://github.com/sambhavsaxena/agentic-workflows/blob/main/finance-agent/USECASES.md"
							>
								USECASES
							</a>{" "}
							before signing in.
						</p>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Onboarding;
