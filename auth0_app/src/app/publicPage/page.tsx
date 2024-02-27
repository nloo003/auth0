import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import React, { useEffect} from 'react'


export default withPageAuthRequired(async function page(){
    /*
    useEffect(()=>{
        async function fetchData(){
            const response = await fetch("http://localhost:3000/api/test")

        }
    },[])
    */
    const response = await fetch(
        "http://localhost:3000/api/test",
        {cache:"no-store"}
        )
    const data = await response.json()
    
  return (
    <div>public page : {data.message}</div>
  )
  }, { returnTo: '/publicPage' })