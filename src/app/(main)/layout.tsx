import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar } from "../components/global/Sidebar";

export default async function ProjectLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-screen h-screen flex custom-scrollbar scroll-smooth">
            <Sidebar />
            <div className="m-[0.75rem] rounded-md border w-full bg-secondary">
                <ScrollArea className="h-[calc(100vh-1.65rem)]">
                    {children}
                </ScrollArea>
            </div>
        </div>
    );
}