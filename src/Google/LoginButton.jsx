import { useEffect } from "react";

export default function LoginButton({ onLogin }) {
    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: (response) => onLogin(response),
        });
        google.accounts.id.renderButton(
            document.getElementById("loginDiv"),
            { theme: "outline", size: "medium" }
        );
    }, [onLogin]);

    return <div id="loginDiv" style={{ position: "absolute", top: 10, right: 10 }}></div>;
}
