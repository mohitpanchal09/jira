"use client"
import SignInCard from '@/components/SignInCard'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'



const page = () => {
  const {status} = useSession()
  const router = useRouter()
  useEffect(() => {
    if (status === "authenticated") {
      router.push('/')
    }
  }, [status, router])

  if (status === "loading") return null // optionally render a loader
  return (
    <SignInCard/>
  )
}

export default page