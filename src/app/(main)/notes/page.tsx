"use client"
import { Button } from '@/components/ui/button'
import { FilePen } from 'lucide-react'
import React, { useState } from 'react'
// import parse from 'html-react-parser';
import Editor from '@/app/components/editor/advanced-editor';
import { ScrollArea } from '@/components/ui/scroll-area';
// import {JSONContent} from 'novel'

const page = () => {
  const [value, setValue] = useState<string | undefined>(undefined);
  console.log(value);
  return (
    <div className='flex w-full'>
      <div className='h-[calc(100vh-1.55rem)] w-[20%] border-r p-4'>
        <div className='flex items-center gap-2'>
          <h1>Notes</h1>
          <Button variant={'outline'} className='p-1 size-6'><FilePen className='size-4' /></Button>
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-1.75rem)] w-full">
        <div className="container">
          <Editor initialValue={value} onChange={setValue} />
          {/* <div className="">{parse(`${value}`)}</div> */}
        </div>
      </ScrollArea>
    </div>
  )
}

export default page