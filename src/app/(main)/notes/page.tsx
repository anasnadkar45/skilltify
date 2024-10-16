"use client"
import { Button } from '@/components/ui/button'
import { FilePen } from 'lucide-react'
import React, { useState } from 'react'
// import parse from 'html-react-parser';
import Editor from '@/app/components/editor/advanced-editor';
// import {JSONContent} from 'novel'

const page = () => {
  const [value, setValue] = useState<string | undefined>(undefined);
  console.log(value);
  return (
    <div className='flex w-full'>
      <div className='h-[calc(100vh-1.55rem)] w-[20%] border-r p-4'>
        <div className='flex items-baseline gap-2'>
          <h1>Notes</h1>
          <Button variant={'outline'} size={'icon'} className='p-1'><FilePen className='size-4' /></Button>
        </div>
      </div>
      <div className="container p-4">
        <Editor initialValue={value} onChange={setValue} />
        {/* <div className="">{parse(`${value}`)}</div> */}
      </div>
    </div>
  )
}

export default page