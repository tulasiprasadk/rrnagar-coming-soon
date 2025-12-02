import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { QuickCartProvider } from "./contexts/QuickCartContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import QuickCartSidebar from "./components/QuickCartSidebar";
import FloatingMessageButton from "./components/FloatingMessageButton";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NotificationProvider>
      <QuickCartProvider>
        <App />
        <QuickCartSidebar />
        <FloatingMessageButton />
      </QuickCartProvider>
    </NotificationProvider>
  </React.StrictMode>
);
