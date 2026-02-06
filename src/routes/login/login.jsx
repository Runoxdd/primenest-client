import { useContext, useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("/auth/login", { username, password });
      updateUser(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed. Check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome Back</h1>
          <p className="subtitle">Securely sign in to your PrimeNest account.</p>
          <input
            name="username"
            required
            minLength={3}
            maxLength={20}
            type="text"
            placeholder="Username"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
          />
          <button disabled={isLoading}>
            {isLoading ? "Validating..." : "Sign In"}
          </button>
          {error && <span className="errorMessage">{error}</span>}
          <Link to="/register" className="switchAuth">
            New to the elite? <span>Create an account</span>
          </Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="PrimeNest Luxury View" />
        <div className="overlay"></div>
      </div>
    </div>
  );
}

export default Login;