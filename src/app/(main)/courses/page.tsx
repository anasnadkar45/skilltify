"use client"
import { courseAction } from '@/app/action'
import { SubmitButton } from '@/app/components/global/SubmitButton'
import { courseSchema } from '@/app/lib/zodSchemas'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { PlusCircle } from 'lucide-react'
import { useFormState } from 'react-dom'

const page = () => {
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
    return (
        <div className='p-8'>
            <>
                <h1 className='text-3xl'>Courses</h1>
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
                        <SubmitButton className="w-full" text="Create Course" />
                    </div>
                </form>
            </>
        </div>
    )
}

export default page