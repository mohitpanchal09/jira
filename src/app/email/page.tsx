

import RegistrationMailTemplate from '@/components/RegistrationMailTemplate'
import React from 'react'

type Props = {}

const obj = {
    recipientName:"Aniket",
    otp:"232453",
    expiryMinutes: 2,
    appName: "TrekFlow"
}

function page({}: Props) {
  return (
    <div>
        <RegistrationMailTemplate {...obj} />
    </div>
  )
}

export default page