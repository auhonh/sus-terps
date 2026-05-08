import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login(){
    const navigate = useNavigate();

    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");

    const [statusMsg, setStatusMsg] = useState({text: "", isError: false});

    const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMsg({ text: "Login successful! Redirecting...", isError: false });
        localStorage.setItem("user", JSON.stringify(data));

        setTimeout(() => {
          navigate("/userstats");
        }, 1000);

      } else {
        setStatusMsg({ text: data.detail || "Login failed", isError: true });
      }

    } catch (error) {
      console.error(error);
      setStatusMsg({ text: "Server error. Please try again.", isError: true });
    }
  };

    return (
    <div id="login">
        <h1>Login</h1>

        {/* displaying status message if it's populated */}
        {statusMsg.text && (
          <p className = {statusMsg.isError ? "error-msg" : "success-msg"}>
            {statusMsg.text}
          </p>
        )}

        <input
            placeholder="Username"
            value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
            type="password"
            placeholder="Password"
            value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn-primary" onClick={handleLogin}>Login</button>
    </div>
    )
}


export default Login