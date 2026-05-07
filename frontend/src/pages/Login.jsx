import { useNavigate } from "react-router-dom";

function Login(){
    const navigate = useNavigate();

    return (
    <div id="login">
        <h1>Login</h1>

        <input
            placeholder="Enter your email"
        />

        <input
            type="password"
            placeholder="Password"
        />

        <button onClick={() => navigate("/userstats")}>Login</button>
    </div>
    )
}


export default Login