import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Logo from '../../public/Logo.svg'
import { ModeToggle } from '../global/ModeToggle'
import { Button } from '@/components/ui/button'

export const Navbar = () => {
    return (
        <div className='relative flex flex-col w-full py-5 mx-auto md:flex-row md:items-center md:justify-between'>
            <div className="flex flex-row items-center justify-between text-sm lg:justify-start">
                <Link href="/" className="flex items-center gap-2">
                    <Image src={Logo} className="size-10" alt="Logo" />

                    <h4 className="text-3xl font-semibold">
                        Skilltify
                    </h4>
                </Link>
                <div className="md:hidden">
                    <ModeToggle />
                </div>
            </div>

            <nav className="hidden md:flex md:justify-end md:space-x-4">
                <ModeToggle />

                <Link href={'/login'}>
                    <Button>Login</Button>
                </Link>
            </nav>
        </div>
    )
}