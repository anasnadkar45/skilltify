"use client"
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { School, University } from 'lucide-react'
import React, { useState } from 'react'

const page = () => {
    const [isAddCourse, setIsAddCourse] = useState(false);
    return (
        <div className='p-8'>
            <>
                <h1 className='text-3xl'>Courses</h1>
                <div className='text-muted-foreground flex items-baseline gap-10'>
                    <p className='text-muted-foreground'>You currently have 3 active courses.</p>
                    <Button variant={'outline'} size={'sm'} onClick={()=>setIsAddCourse(true)}><School className='size-4 mr-2'/> New Course</Button>
                </div>
                <Dialog>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add a course</DialogTitle>
                        </DialogHeader>
                        <div>
                            
                        </div>
                    </DialogContent>
                </Dialog>
            </>
        </div>
    )
}

export default page