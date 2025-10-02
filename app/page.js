"use client"

import { api } from '@/convex/_generated/api'
import { UserButton, useUser } from '@clerk/nextjs'
import { useMutation } from 'convex/react'
import React, { useEffect } from 'react'

const Home = () => {
  const {user} = useUser();
  const createUser = useMutation(api.user.createUser);

  useEffect(()=>{
     user && checkUser();
  },[user])

  const checkUser = async () => {
    const result = await createUser({
      email: user?.primaryEmailAddress?.emailAddress,
      userName: user?.fullName,
      imageUrl: user?.imageUrl
    })
    console.log(result);
  }
  return (
    <div ><h1 className='text-red-500 text-4xl'>Hi I am Jenish.J Learning Next.js now</h1>
    <UserButton />
    </div>
  )
}

export default Home