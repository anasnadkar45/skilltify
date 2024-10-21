"use server"
import { redirect } from "next/navigation";
import prisma from "./lib/db";
import { requireUser } from "./lib/hooks";
import { parseWithZod } from '@conform-to/zod';
import { courseSchema, studyPlanSchema } from "./lib/zodSchemas";
import { toast } from "sonner";

export async function StudyPlanAction(prevState: any, formData: FormData) {
    const session = await requireUser();

    // Validate the form data using Zod schema
    const submission = parseWithZod(formData, {
        schema: studyPlanSchema,
    });

    // If validation fails, return the errors
    if (submission.status !== "success") {
        return submission.reply();
    }

    // Extract the validated data
    const { title,content } = submission.value;

    // Create a new study plan in the database
    await prisma.studyPlan.create({
        data: {
            title: title,
            content: content,  // Assuming `content` is already in a JSON format
            userId: session.user?.id,  // Link to the currently logged-in user
        }
    });

    // Redirect to the study plan overview page after successful creation
    return redirect("/study-plan");
}


export async function courseAction(prevState: any, formData: FormData) {
    const session = await requireUser();

    // Validate the form data using Zod schema
    const submission = parseWithZod(formData, {
        schema: courseSchema,
    });

    // If validation fails, return the errors
    if (submission.status !== "success") {
        return submission.reply();
    }

    // Extract the validated data
    const { title, description } = submission.value;

    try {
        // Create a new course in the database
        await prisma.course.create({
            data: {
                title: title,
                description: description,
                userId: session.user?.id,  // Link to the currently logged-in user
            }
        });

        toast.success("Course uploaded successfully!");
    } catch (error) {
        // toast.error("Course could not be uploaded!");
        console.error("Error creating course:", error);
    }

    // Redirect to the courses overview page after successful creation
    return redirect("/courses");
}