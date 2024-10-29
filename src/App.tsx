import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

import AuthProvider from './contexts/authContext.tsx';

export function App() {
 return (
  <div>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </div>
 )
}

