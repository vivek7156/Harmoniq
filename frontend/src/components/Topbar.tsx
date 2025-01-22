import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButton from "./SignInOAuthButton";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";  

const Topbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await axiosInstance.get("/admin/check");
        setIsAdmin(response.data.admin);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, []);

  return (
    <div className="flex justify-between items-center p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10">
      <div className="flex items-center gap-2">
        <img src="/Harmoniq.png" alt="Harmoniq" className="size-8" />
        Harmoniq
      </div>
      <div className="flex items-center gap-4">
        {isAdmin && (
					<Link to={"/admin"} className={cn(buttonVariants({ variant: "outline" }))}>
            <LayoutDashboardIcon className='size-4  mr-2' />
            Admin Dashboard
          </Link>
        )}

        <SignedOut>
            <SignInOAuthButton />
        </SignedOut>

        <UserButton />
      </div>
    </div>
  )
}

export default Topbar
