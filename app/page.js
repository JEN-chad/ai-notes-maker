import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default function Page() {
  const { userId } = auth();

  if (userId) {
    redirect("/dashboard"); // logged-in users go here
  } else {
    redirect("/sign-in"); // signed-out users go here
  }
}
