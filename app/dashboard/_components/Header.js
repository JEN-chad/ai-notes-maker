"use client";

import { UserButton, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React from "react";

const Header = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();         // Sign the user out
    router.push("/sign-in"); // Force redirect immediately
  };

  return (
    <div className="shadow-md flex p-5 justify-end">
      {/* UserButton UI but with custom sign out */}
      <UserButton
        afterSignOutUrl="/sign-in"
        signOutCallback={handleSignOut}
      />
    </div>
  );
};

export default Header;
