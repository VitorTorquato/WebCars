import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

import AuthProvider from './contexts/authContext.tsx';
import { Toaster } from 'react-hot-toast'

export function App() {
 return (
  <div>
    <Toaster
    position="top-right"
    reverseOrder={false}
    />
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </div>
 )
}

