import { StudyPlan } from '@/app/components/study-plan/StudyPlan';
import prisma from '@/app/lib/db';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import React from 'react';

const getData = async (id: string) => {
    const data = await prisma.studyPlan.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            title: true,
            content: true
        }
    });

    return data;
};

const page = async ({
    params,
}: {
    params: { id: string };
}) => {
    const data = await getData(params.id);

    if (!data) {
        return (
            <div>
                <p>Study plan not found.</p>
            </div>
        );
    }

    return (
        <div>
            <StudyPlan plan={data} />
        </div>
    );
};

export default page;