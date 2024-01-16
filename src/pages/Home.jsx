// import {useState} from 'react'
import { useEffect } from "react";
import supabase from "../config/supabse";
// import { selectAllClients} from "../features/clients/clientSlice";
// import { useSelector } from 'react-redux';
import { useGetAllClientsQuery } from "../features/api/apiSlice";

const Home = () => {

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data: orders , error} = await supabase.from('clients').select('*');
        console.log('orders:',orders)
        console.log('error:',error)
      } catch (error) {
        console.log(error)
      }
    }

    fetchClients();
  }, [])
  

  const {
    data: clients,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetAllClientsQuery();
  console.log(isSuccess, isError, error, clients)

  let content;
    if(isLoading) {
        content = <p>Loading...</p>;
    } else if(isSuccess){
        // content = allClients.map((client) => {
        //   return (
        //     <div key={client.id}>
        //   <p>{client.email}</p>
        // </div>
        //   ) });
    } else if(isError){
        content = <p>Failed to fetch</p>;
    }

  return (
    <div>
      <h1>Home</h1>
      {content}</div>

  )
}

export default Home