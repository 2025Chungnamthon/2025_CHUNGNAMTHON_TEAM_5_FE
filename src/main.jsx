import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./config/queryClient";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container, {
  onUncaughtError: (error, errorInfo) => {
    console.error("Uncaught error:", error, errorInfo);
  },
  onCaughtError: (error, errorInfo) => {
    console.error("Caught error:", error, errorInfo);
  },
  onRecoverableError: (error, errorInfo) => {
    console.warn("Recoverable error:", error, errorInfo);
  },
});

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      {/* 개발 환경에서만 React Query Devtools 표시 */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </React.StrictMode>
);
