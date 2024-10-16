import Image from "next/image";
import { auth } from "./lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "./components/landingPage/Navbar";

export default async function Home() {
  const session = await auth();
  if(session?.user){
    return redirect('/home');
  }
  return (
    <div className="max-w-7xl mx-auto">
      <Navbar />
    </div>
  );
}
