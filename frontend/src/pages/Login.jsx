import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login(){
    const navigate = useNavigate();

    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");

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
        // alert("Login successful");
        navigate("/userstats");
      } else {
        alert(data.detail);
      }

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

    return (
    <div id="login">
        <h1>Login</h1>

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

        <button onClick={handleLogin}>Login</button>
    </div>
    )
}


export default Login