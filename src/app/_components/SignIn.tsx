"use client";

import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useSessionStore } from "../_store/store";
import { redirect } from 'next/navigation'

function SignIn() {
    const setSession = useSessionStore((state) => state.setSession);

    const responseMessage = (response: CredentialResponse) => {
        console.log(response);

        if (response.credential) {
            setSession({
                clientId: response.clientId ?? "",
                credential: response.credential,
            });
            
            redirect('/');
        } else {
            console.error("Credential not available in the response:", response);
        }
    };

    const errorMessage = () => {
        console.log("Google Login failed");
    };

    return (
        <div>
            <h2>React Google Login</h2>
            <br />
            <br />
            <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
        </div>
    );
}

export default SignIn;
