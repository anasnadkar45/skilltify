import { auth } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import React from 'react'

const Home = async() => {
  const session = await auth();
  if (!session?.user) {
    return redirect('/');
  }
  return (
    <div>page</div>
  )
}

export default Home