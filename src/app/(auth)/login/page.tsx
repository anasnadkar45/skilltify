import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { BadgeCheck, BrainCircuit, Flame, NotebookPen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/Logo.svg";
import { auth, signIn } from "@/app/lib/auth";
import { GitHubAuthButton, GoogleAuthButton } from "@/app/components/global/SubmitButton";
import React from "react";
import { redirect } from "next/navigation";

export default async function SkilltifyLogin() {
    const session = await auth();
    if (session?.user) {
        return redirect('/home');
    }
    return (
        <div className="min-h-screen w-full mx-auto flex flex-col md:flex-row animate-fade-in">
            {/* Left side */}
            <div className="flex-1 p-8 flex flex-col items-center justify-center bg-secondary animate-slide-in-left">
                <div className="max-w-md text-center md:text-left">
                    <Link href="/" className="flex items-center gap-2 mb-4">
                        <Image src={Logo} className="size-10" alt="Logo" />
                        <h4 className="text-4xl font-semibold">Skilltify</h4>
                    </Link>
                    <h1 className="text-3xl font-bold mb-4">AI-Driven Productivity for Students</h1>
                    <p className="text-muted-foreground mb-8">Start optimizing your study process</p>
                    <div className="space-y-6">
                        <Feature icon={NotebookPen} title="Course Management" description="Track your courses, assignments, and class schedules with real-time sync." />
                        <Feature icon={BrainCircuit} title="AI Task Management" description="AI generates personalized study tasks based on your workload and deadlines." />
                        <Feature icon={Flame} title="Performance Insights" description="Track your progress and get insights on areas of improvement." />
                        <Feature icon={BadgeCheck} title="Gamified Learning" description="Earn rewards and badges for meeting goals, enhancing study engagement." />
                    </div>
                </div>
            </div>

            {/* Right side */}
            <div className="flex-1 p-8 flex items-center justify-center animate-slide-in-right">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <h2 className="text-lg font-semibold mb-2">Sign Up with Skilltify</h2>
                        <div className="grid grid-cols-2 gap-2">
                            <form
                                className="w-full"
                                action={async () => {
                                    "use server";
                                    await signIn("google");
                                }}
                            >
                                <GoogleAuthButton />
                            </form>

                            <form
                                className="w-full"
                                action={async () => {
                                    "use server";
                                    await signIn("github");
                                }}
                            >
                                <GitHubAuthButton />
                            </form>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center text-sm text-muted-foreground my-4">Or</div>
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name</label>
                                    <Input id="firstName" placeholder="First Name" />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name</label>
                                    <Input id="lastName" placeholder="Last Name" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
                                <Input id="username" placeholder="Username" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                                <Input id="email" type="email" placeholder="Email" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                                <Input id="password" type="password" placeholder="Password" />
                            </div>
                            <p className="text-xs text-muted-foreground">Minimum length is 8 characters.</p>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                        <Button className="w-full">Sign Up</Button>
                        <p className="text-xs text-muted-foreground mt-4">
                            By creating an account, you agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a>. We'll occasionally send you account-related emails.
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

function Feature({ icon: Icon, title, description }: { icon: React.ComponentType | null; title: string; description: string }) {
    return (
        <div className="flex items-start">
            <div className="text-2xl mr-4">{Icon && <Icon />}</div>
            <div>
                <h3 className="font-semibold mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}
