"use client"
import { courseAction } from '@/app/action'
import { SubmitButton } from '@/app/components/global/SubmitButton'
import { courseSchema } from '@/app/lib/zodSchemas'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { PlusCircle } from 'lucide-react'
import { useFormState } from 'react-dom'

// Define a type for session
type Session = {
    userId: string;
    userName: string;
    // Add other session properties as needed
};

export const CreateCourse = ({ session }: { session: Session }) => {
    const [lastResult, action] = useFormState(courseAction, undefined);
    const [form, fields] = useForm({
        lastResult,
        onValidate({ formData }) {
            return parseWithZod(formData, { schema: courseSchema });
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    });

    return (
        <div className="p-8">
            <h1 className="text-3xl">Courses</h1>
            <form
                id={form.id}
                onSubmit={form.onSubmit}
                action={action}
                noValidate
            >
                <div className="grid gap-4 py-4">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        name={fields.title.name}
                        defaultValue={fields.title.initialValue}
                        key={fields.title.key}
                    />
                    <p className="text-red-500 text-sm">{fields.title.errors}</p>

                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        name={fields.description.name}
                        defaultValue={fields.description.initialValue}
                        key={fields.description.key}
                    />
                    <p className="text-red-500 text-sm">{fields.description.errors}</p>

                    <SubmitButton text="Create Course" />
                </div>
            </form>
        </div>
    );
};