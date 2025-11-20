import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isVerifyStep, setIsVerifyStep] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    code: "",
    subscription: "Basic", // default subscription
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!formData.email) return toast.error("Email is required");
    if (!isVerifyStep && !formData.password)
      return toast.error("Password required");
    if (!isLogin && !isVerifyStep && !formData.name)
      return toast.error("Name required");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
if (isLogin) {
  try {
    const res = await axios.post("http://localhost:5000/user/login", {
      email: formData.email,
      password: formData.password,
    });

    toast.success(res?.data?.message || "Login Successful");

    const user = res.data.user;

    localStorage.setItem("email", formData.email);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", user.role);
    localStorage.setItem("user", JSON.stringify(user.id));

    //  Redirect based on role
    if (user?.role === "admin") {
      navigate("/admin-all-users");
    } else {
      navigate("/dashboard");
    }
  } catch (err) {
    handleError(err);
  }
} else {
        // SIGNUP
        const res = await axios.post("http://localhost:5000/user", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          subscription: formData.subscription, // send subscription type
        });

        toast.success(res?.data?.message || "Verification code sent to email");
        setIsVerifyStep(true);
      }
    } catch (err) {
      handleError(err);
    }
  };

  const verifyCode = async () => {
    if (!formData.code) return toast.error("Verification code required");

    try {
      const res = await axios.post("http://localhost:5000/user/verify", {
        email: formData.email,
        code: formData.code,
      });

      toast.success(res?.data?.message || "Email verified!");

      setIsVerifyStep(false);
      setIsLogin(true);
    } catch (err) {
      handleError(err);
    }
  };

  const handleError = (err) => {
    const msg = err?.response?.data?.message;
    const status = err?.response?.status;

    if (status === 400) return toast.error(msg || "Bad Request");
    if (status === 404) return toast.error(msg || "Not Found");
    if (status === 401) return toast.error(msg || "Unauthorized");
    if (status === 500) return toast.error("Server Error");

    toast.error(msg || "Something went wrong");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          {isVerifyStep
            ? "Verify Email"
            : isLogin
            ? "Welcome Back"
            : "Create an Account"}
        </h2>

        {!isVerifyStep ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Subscription Type
                  </label>
                  <select
                    name="subscription"
                    value={formData.subscription}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="Basic">Basic - $40</option>
                    <option value="Pro">Pro - $100</option>
                    <option value="Enterprise">Enterprise - $200</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="********"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Enter verification code
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="6-digit Code"
            />

            <button
              onClick={verifyCode}
              className="w-full py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              Verify
            </button>
          </div>
        )}

        {!isVerifyStep && (
          <div className="text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-500 hover:underline"
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
