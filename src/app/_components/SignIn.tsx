"use client";

import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useSessionStore } from "../_store/store";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";


function SignIn() {
  const setSession = useSessionStore((state) => state.setSession);

  const responseMessage = (response: CredentialResponse) => {
    
    if(response.credential) {
      const decoded = jwtDecode(response.credential);
      console.log(decoded); //TODO - Email acquired pls put this into the session
    }
    console.log(response);

    if (response.credential) {
      setSession({
        clientId: response.clientId ?? "",
        credential: response.credential,
      });

      redirect("/new-event");
    } else {
      console.error("Credential not available in the response:", response);
    }
  };

  const guestButtonOnClick = () => {
    redirect('/new-event');
  }

  const errorMessage = () => {
    console.log("Google Login failed");
  };

  return (
    <>
      <h1>Welcome to Plan Pal</h1>
      <GoogleLogin auto_select={true} onSuccess={responseMessage} onError={errorMessage} />
      <h1>or</h1>
      <button 
        className="p-2 bg-cyan-500 rounded-md"
        onClick={guestButtonOnClick}
      >Continue as Guest</button>
    </>
  );
}

export default SignIn;
