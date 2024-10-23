"use client"
import { courseAction } from '@/app/action'
import { SubmitButton } from '@/app/components/global/SubmitButton'
import { courseSchema } from '@/app/lib/zodSchemas'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { useEffect } from 'react'
import { useFormState } from 'react-dom'
import { toast } from 'sonner'

export const CreateCourse = () => {
    const [lastResult, action] = useFormState(courseAction, undefined);

    const [form, fields] = useForm({
        lastResult,

        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: courseSchema
            })
        },

        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput'
    })

    // Use useEffect to trigger the toast notification
    useEffect(() => {
        if (lastResult?.status === 'success') {
            toast.success('Course created successfully!');  // Success toast
        } else if (lastResult?.status === 'error' && 'message' in lastResult) {
            toast.error("Failed to create course.");  // Error toast
        }
    }, [lastResult]);  // Listen for changes in lastResult
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Create Course</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form
                    className="flex flex-col gap-y-5"
                    id={form.id}
                    onSubmit={form.onSubmit}
                    action={action}
                    noValidate
                >
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <Input
                                name={fields.title.name}
                                defaultValue={fields.title.initialValue}
                                key={fields.title.key}
                                className="col-span-3"
                            />
                            <p className="text-red-500 text-sm">{fields.title.errors}</p>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Textarea
                                name={fields.description.name}
                                defaultValue={fields.description.initialValue}
                                key={fields.description.key}
                                className="col-span-3"
                            />
                            <p className="text-red-500 text-sm">{fields.description.errors}</p>
                        </div>

                        <DialogFooter>
                            <SubmitButton className="w-full" text="Create Course" />
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}