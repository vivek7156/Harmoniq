import { useSignIn } from "@clerk/clerk-react"
import { Button } from "./ui/button";

const SignInOAuthButton = () => {
  const { signIn, isLoaded } = useSignIn();

    if (!isLoaded) {
        return null;
    }

    const signInWithGoogle = async () => {
        signIn.authenticateWithRedirect({
            strategy: "oauth_google",
            redirectUrl: "/sso-callback",
            redirectUrlComplete: "/auth-callback",
        });
    };

  return (
    <Button variant={"secondary"} onClick={signInWithGoogle} className="w- full text-white bg-zinc-800 h-11">
        Continue with Google
    </Button>
  )
};

export default SignInOAuthButton;
