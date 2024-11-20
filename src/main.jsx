import "@style/reset.css";
import "@style/index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import About from "@pages/About/About.jsx";
import App from "@functional/App/App.jsx";
import Home from "./app/pages/Home/Home.jsx";
import Tanks from "./app/pages/Tanks/Tanks.jsx";
import TankDetail from "./app/pages/Tanks/Detail/TankDetail.jsx";

// Create a client
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/tanks",
        element: <Tanks />,
      },
      {
        path: "/tanks/:slug",
        element: <TankDetail />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
