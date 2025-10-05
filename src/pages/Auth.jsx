import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../axios";
import { toast } from "react-toastify";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AuthPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const initialMode = location.pathname === "/signup" ? "signup" : "login";
    const [mode, setMode] = useState(initialMode);
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const toggleMode = () => {
        if (mode === "login") {
            setMode("signup");
            navigate("/signup");
        } else {
            setMode("login");
            navigate("/login");
        }
    };

    const validateForm = () => {
        console.log("entering insid validate form");
        let valid = true;
        let newErrors = {};

        if (mode === "signup") {
            if (!form.fullName.trim()) {
                newErrors.fullName = "Full Name is required";
                valid = false;
            }
        }

        if (!form.email.trim()) {
            newErrors.email = "Email is required";
            valid = false;
        }

        if (!form.password.trim()) {
            newErrors.password = "Password is required";
            valid = false;
        } else if (form.password.trim().length < 8 || form.password.trim().length > 12) {
            newErrors.password = "Password must be 8-12 characters";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        console.log("entering submit");
        setErrors({});
        e.preventDefault();
        const validate = validateForm();
        if (!validate) return;
        let payload = {};

        try {
            payload = {
                email: form.email,
                password: form.password,
            };
            if (mode === "login") {
                const res = await api.post("/auth/login", payload);
                if (res?.data?.status === "Success") {
                    const token = res.data.access_token;
                    localStorage.setItem("authToken", token);
                    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                    navigate("/home");
                    setForm({
                        fullName: "",
                        email: "",
                        password: "",
                    });
                }
                console.log(res, "login response");
            } else {
                const res = await api.post("/auth/signup", form);
                if (res?.data?.status === "Success") {
                    toast.success(res?.data?.message);
                    setMode("login");
                    navigate("/login");
                }
                console.log(res, "signup response");
            }
        } catch (err) {
            console.log(err, "error");
            if (err.response && err.response.data.message) {
                toast.error(err.response.data.message);
            }
        }
    };

    useEffect(() => {
        setForm({ fullName: "", email: "", password: "" });
        setErrors({});
    }, [mode]);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            navigate("/home", { replace: true });
        }
    }, [navigate]);

    useEffect(() => {
        if (location.pathname === "/signup" && mode !== "signup") setMode("signup");
        if (location.pathname === "/login" && mode !== "login") setMode("login");
    }, [location.pathname, mode]);

    return (
        <div className="w-md p-8 border border-gray-300 rounded-lg shadow-md bg-white">
            <h2 className="text-2xl mb-6 text-center text-black font-medium">{mode === "login" ? "Login" : "Signup"}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                {mode === "signup" && (
                    <div>
                        <label htmlFor="fullName" className="flex items-center mb-1 font-medium text-gray-700">
                            Full Name <p className="text-red-500">*</p>
                        </label>
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            value={form.fullName}
                            onChange={handleChange}
                            autoComplete="off"
                            className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                        />
                        {errors.fullName && <span className="text-sm text-red-600">{errors.fullName}</span>}
                    </div>
                )}
                <div>
                    <label htmlFor="email" className="flex items-center mb-1 font-medium text-gray-700">
                        Email<p className="text-red-500">*</p>
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="off"
                        className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                    />
                    {errors.email && <span className="text-sm text-red-600">{errors.email}</span>}
                </div>
                <div>
                    <label htmlFor="password" className="flex items-center mb-1 font-medium text-gray-700">
                        Password<p className="text-red-500">*</p>
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="off"
                        className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                    />
                    {errors.password && <span className="text-sm text-red-600">{errors.password}</span>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200"
                >
                    {mode === "login" ? "Log in" : "Sign up"}
                </button>
            </form>
            <p className="text-sm mt-6 text-center text-gray-600">
                {mode === "login" ? (
                    <>
                        Don't have an account?{" "}
                        <button
                            onClick={toggleMode}
                            className="text-indigo-600 hover:underline focus:outline-none"
                            type="button"
                        >
                            Signup here
                        </button>
                    </>
                ) : (
                    <>
                        Already have an account?{" "}
                        <button
                            onClick={toggleMode}
                            className="text-indigo-600 hover:underline focus:outline-none"
                            type="button"
                        >
                            Login here
                        </button>
                    </>
                )}
            </p>
            <ToastContainer />
        </div>
    );
}
