"use client"
import React, { useEffect } from 'react'
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import useSWR from 'swr';


export default withPageAuthRequired(function OtherPage(){
    const fetcher = async (uri) => {
        const response = await fetch(uri);
        return response.json();
      };
    const { data, error } = useSWR('/api/test', fetcher);      
    return (
      <div>Other Page {data?data.message:"nothing to show"}</div>
    )
  }
);


