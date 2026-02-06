import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";

function Register() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      await apiRequest.post("/auth/register", inputs);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try a different handle.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registerPage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Join PrimeNest</h1>
          <p className="subtitle">Secure your place in the future of luxury living.</p>
          <input name="username" type="text" placeholder="Username" required minLength={3}/>
          <input name="email" type="email" placeholder="Email Address" required />
          <input name="password" type="password" placeholder="Password" required />
          <button disabled={isLoading}>
            {isLoading ? "Provisioning..." : "Create Account"}
          </button>
          {error && <span className="errorMsg">{error}</span>}
          <Link to="/login" className="switchAuth">
            Already part of the elite? <span>Sign in</span>
          </Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="Luxury Real Estate" />
        <div className="overlay"></div>
      </div>
    </div>
  );
}

export default Register;