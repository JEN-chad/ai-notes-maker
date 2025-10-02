import { UserButton } from '@clerk/nextjs'
import React from 'react'

const Header = () => {
  return (
    <div className='shadow-md flex p-5  justify-end'>
      <UserButton />
    </div>
  )
}

export default Header