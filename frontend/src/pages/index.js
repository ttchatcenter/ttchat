import React from "react"
import useUser from "@/hooks/common/useUser"

const Index = () => {
  useUser({
    redirectIfFound: '/brand-management',
    redirectIfNotFound: '/login',
    isIndexPage: true,
  })

  return (
    <div />
  )
}

export default Index