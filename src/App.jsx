import React, { useEffect } from "react";
import GlobalStyles from "./styles/GlobalStyles";
import AppRouter from "./router/AppRouter";
import { ToastProvider } from "./components/ToastProvider";

function App() {
    useEffect(() => {
    }, []);

    return (
        <>
            <GlobalStyles />
            <ToastProvider>
                <AppRouter />
            </ToastProvider>
        </>
    );
}

export default App;