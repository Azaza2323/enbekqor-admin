import Login from "../Form/Login/LoginForm";

function LoginPage({ onLogin }) {
    return (
        <div>
            <Login onLogin={onLogin}/>
        </div>
    )
}

export default LoginPage;
