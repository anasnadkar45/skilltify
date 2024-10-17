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
                {children}
            </div>
        </div>
    );
}