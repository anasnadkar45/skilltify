import prisma from '@/app/lib/db'
import { CreateCourse } from './CreateCourse'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const getCourses = async() =>{
    const data = await prisma.course.findMany({
        select:{
            id: true,
            title:true,
            description:true,
        }
    });

    return data;
}

const page = async() => {
    const courses = await getCourses();
    return (
        <div className='p-4 space-y-4'>
            <div className='flex justify-between'>
                <h1 className='text-3xl'>Courses</h1>
                <CreateCourse />
            </div>
            <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
                {courses.map((course) =>(
                    <Card key={course.id}>
                        <CardHeader>
                            <CardTitle>{course.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='text-muted-foreground'>{course.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default page