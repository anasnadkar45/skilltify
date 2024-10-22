import { StudyPlan } from '@/app/components/study-plan/StudyPlan';
import prisma from '@/app/lib/db';
import { requireUser } from '@/app/lib/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const getData = async (userId: string) => {
  const data = await prisma.studyPlan.findMany({
    where: {
      userId: userId
    },
    select: {
      id: true,
      title: true,
      content: true
    }
  });

  return data;
};

const page = async () => {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);

  // if (data.length === 0) {
  //   console.log("No study plans found for this user.");
  //   return <p>No study plans available.</p>;
  // }

  return (
    <div className='p-4 space-y-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl'>Study Plan</h1>
        <Link href={'/study-plan/create'}>
          <Button className='space-x-2'><span>Create StudyPlan</span> <Sparkles /></Button>
        </Link>
      </div>
      <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
        {data.map((plan) => (
          <Card>
            <CardHeader>
              <CardTitle>
                {plan.title}
              </CardTitle>
            </CardHeader>
            <CardFooter>
              <Link href={`/study-plan/${plan.id}`}>
                <Button>Show Study Plan</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default page;
