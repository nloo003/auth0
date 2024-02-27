'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';
import { Payment, columns } from "./columns"
import { DataTable } from "./data-table"
import { Property, columns as columns2 } from './columns2';


export default function Home() {
  const { user, error, isLoading } = useUser();
  const [row,setRow] = useState<Payment>()
  const [selectedRows, setSelectedRows] = useState<Property[]>([])
  function getData() {
    // Fetch data from your API here.
    return [
      {
        id: "1",
        amount: 100,
        status: "completed",
        email: "m1@example.com",
      },
      {
        id: "2",
        amount: 300,
        status: "pending",
        email: "m2@example.com",
      },
      {
        id: "3",
        amount: 200,
        status: "pending",
        email: "m3@example.com",
      }
      // ...
    ]
  }
   
  useEffect(()=>{
    
    console.log(user)
  },[user])

  useEffect(()=>{
    
    console.log("rows",row)
  },[row])

  useEffect(()=>{
    
    console.log("selected rows",selectedRows)
  },[selectedRows])
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  
  const data=getData()

  const data2=[
    {
      id:"23",
      amount:123,
      name:"50 scotts road",
      year:2021
    },
    {
      id:"192",
      amount:2000,
      name:"71 robinson road",
      year:2023
    },
    {
      id:"982",
      amount:999,
      name:"pineapple street",
      year: 2025
    },
    {
      id: "321",
      amount:8212,
      name:"apple town",
      year:1999
    },
    {
      id:"768",
      amount:5000,
      name:"french alps",
      year:2008
    }
  ]
  return (
    <div>
      <div className="p-8">
      Home Page
      </div>

      <a href="/api/auth/login" className="p-8">Login</a>
      <a href="/api/auth/logout" className="p-8">Logout</a>
      {
        user &&
        <div className="flex space-x-10 pt-10">
          <img src='https://avatars.githubusercontent.com/u/104271175?v=4' className='h-12 w-12'/>
          <h1>Nickname:{user.nickname}</h1>
        </div>
      }
      <div className="container mx-auto py-10">
      <DataTable columns={columns2} data={data2} filterStrings={["name","amount","year"]} filterColumns={["name","year"]} setRow={setRow} setSelectedRows={setSelectedRows} />
      </div>
    </div>
  );
}
//<DataTable columns={columns2} data={data2} filterStrings={["name","amount","year"]} filterColumns={["name","year"]} setRow={setRow} setSelectedRows={setSelectedRows} />
//<DataTable columns={columns} data={data} filterStrings={["email","amount"]} filterColumns={["status","select","amount"]} setRow={setRow} setSelectedRows={setSelectedRows} />