import { z } from "zod";

export const studyPlanSchema = z.object({
    title: z
        .string()
        .min(3, { message: "Title must be at least 3 characters long" })
        .max(50, { message: "Title must be no longer than 50 characters" }),
    // content: z
    //     .object({})
    //     .passthrough() // To allow any kind of content in the JSON
});

export const courseSchema = z.object({
    title: z
        .string()
        .min(3, { message: "Title must be at least 3 characters long" })
        .max(50, { message: "Title must be no longer than 50 characters" }),
    description: z
        .string()
        .min(3, { message: "Title must be at least 3 characters long" })
        .max(50, { message: "Title must be no longer than 50 characters" }),
});

