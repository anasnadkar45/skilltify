"use client";

import { cn } from "@/lib/utils";
import { ArrowLeft, HomeIcon, ChartPie, Book, FileText, MessageSquare, Layout, CalendarIcon, ArrowRight, BookOpenCheckIcon, BrainCircuit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import Logo from '../../public/Logo.svg';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ModeToggle } from "./ModeToggle";

// Define the sidebar links with categories
export const dashboardLinks = [
  {
    category: "Dashboard",
    links: [
      {
        id: 0,
        name: "Home",
        href: "/home",
        icon: HomeIcon,
      },
      {
        id: 1,
        name: "Analytics",
        href: "/analytics",
        icon: ChartPie,
      },
    ],
  },
  {
    category: "Learning",
    links: [
      {
        id: 0,
        name: "Notes",
        href: "/notes",
        icon: BookOpenCheckIcon,
      },
      {
        id: 1,
        name: "Courses",
        href: "/courses",
        icon: Book,
      },
      {
        id: 2,
        name: "Flashcards",
        href: "/flashcards",
        icon: FileText,
      },
      {
        id: 3,
        name: "AI Tutor",
        href: "/ai-tutor",
        icon: MessageSquare,
      },
    ],
  },
  {
    category: "Planning",
    links: [
      {
        id: 0,
        name: "Tasks",
        href: "/tasks",
        icon: Layout,
      },
      {
        id: 1,
        name: "Calendar",
        href: "/calendar",
        icon: CalendarIcon,
      },
      {
        id: 2,
        name: "Study Plan",
        href: "/study-plan",
        icon: BrainCircuit,
      }
    ],
  },
];

export const Sidebar = () => {
  const [isExpand, setIsExpand] = useState(true);
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <div className={cn("hidden relative max-w-[300px] shrink-0 px-2 border-r md:block", { "w-fit": !isExpand })}>
        {/* Toggle button to collapse/expand the sidebar */}
        <Button
          size={"icon"}
          className="absolute size-6 -right-6 top-60"
          onClick={() => setIsExpand(!isExpand)}
        >
          {isExpand ? <ArrowLeft /> : <ArrowRight />}
        </Button>

        <div className="flex h-full max-h-screen flex-col gap-2 pt-2">
          {/* Logo section */}
          <div className="flex h-14 justify-center items-center border-b px-2 lg:h-[60px]">
            <Link href="/home" className="flex items-center gap-2 font-semibold">
              <Image src={Logo} alt="Logo" className="size-8" />
              {isExpand ? (
                <p className="text-xl font-bold">
                  Skilltify
                </p>
              ) : null}
            </Link>
            {/* <ModeToggle /> */}
          </div>

          {/* Navigation section */}
          <div className="flex-1">
            <ModeToggle />
            <nav className="grid items-start text-sm font-medium px-2">
              {dashboardLinks.map((category, index) => (
                <div key={index} className="mb-6">
                  <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                    {isExpand && category.category}
                  </p>
                  <div className="space-y-2">
                    {category.links.map((link) => (
                      <Tooltip key={link.id}>
                        <TooltipTrigger asChild>
                          <Link
                            href={link.href}
                            className={cn(
                              "flex items-center gap-3 p-2 rounded-md hover:bg-muted",
                              pathname === link.href ? "bg-muted" : ""
                            )}
                          >
                            <link.icon className="size-4" />
                            {isExpand && <span>{link.name}</span>}
                          </Link>
                        </TooltipTrigger>
                        {!isExpand && (
                          <TooltipContent>
                            <span>{link.name}</span>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
