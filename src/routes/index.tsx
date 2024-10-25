import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../layout";
import { Home } from "../pages/home";
import { Details } from "../pages/details";
import { DashBoard } from "../pages/dashboard";
import { SignIn } from "../pages/signIn";
import { SignUp } from "../pages/signUp";
import { DashoardNew } from "../pages/dashboard/new";



const router = createBrowserRouter([
    
    {
        element:<Layout/>,
        children:[
            {
                path:'/',
                element:<Home/>
            },
            {
                path:'/details/:id',
                element:<Details/>
            },
            {
                path:'/dashboard',
                element:<DashBoard/>
            },

            {
                path:'/new',
                element:<DashoardNew/>
            },
        ]
    },
    {
        path:'/signin',
        element:<SignIn/>
    },
    {
        path:'/register',
        element:<SignUp/>
    },
])

export {router}