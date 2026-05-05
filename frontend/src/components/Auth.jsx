import { useNavigate } from "react-router-dom";

function Auth(){
    const navigate = useNavigate();

    return(
        <div id="Auth">
            <h2>Login to Get Started</h2>

            <button onClick={() => navigate("/login")}>
                Login
            </button>
            <button onClick={() => navigate("/newuser")}>
                New User
            </button>
        </div>
    )
}

export default Auth