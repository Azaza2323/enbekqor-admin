import React, { useState } from "react";
import {createBrowserRouter, RouterProvider, Outlet, Navigate} from "react-router-dom";
import "./styles/global.scss";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import Menu from "./components/Base/Menu/menuBase"
import LoginPage from "./components/Page/LoginPage";
import Questions from "./components/Page/QuestionsPage";
import Category from "./components/Page/CategoryPage";
import All from "./components/Page/All";
const queryClient = new QueryClient()
function App(){
    const [auth, setAuth] = useState(null);
    const handleLogin = (username, password) => {
        setAuth({ username, password });
    };
    const Layout = () => {
        return (
            <div className="main">
                <div className="container">
                    <div className="menuContainer">
                        <Menu />
                    </div>
                    <div className="contentContainer">
                        <QueryClientProvider client={queryClient}>
                            <Outlet auth={auth}/>
                        </QueryClientProvider>
                    </div>
                </div>
            </div>
        );
    };

    const router = createBrowserRouter([
        {
            path: "/admin",
            element:
                auth ? <Layout auth = {auth} /> :<Navigate to="/"/>,
            children: [
                {
                    path: "/admin",
                    element: <All auth={auth}/>,
                },
                {
                    path: "/admin/questions/:id",
                    element: <Questions auth={auth} />,
                },
                {
                    path: "/admin/categories/:id",
                    element: <Category auth={auth} />,
                },
            ],
        },
        {
            path: "/",
            element: auth ? <Navigate to = "/admin"/> : <LoginPage onLogin={handleLogin}/>,
        },
    ]);
    return <RouterProvider router={router} />;
}
export default App;