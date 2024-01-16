import {useState} from 'react'
import { useEffect } from "react";
import supabase from "../config/supabse";


const Home = () => {
  const [fetchError, setFetchError] = useState(null);
  const [clients, setClients] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data: clients , error} = await supabase.from('clients').select('*');
        console.log('clients:', clients)
        setClients(clients);
        setFetchError(error);
      } catch (error) {
        console.log(error)
      }
    }

    fetchClients();
  }, [])
  


  let content;
    if(fetchError) {
      setFetchError('Error fetching clients.')
    } 
    if(clients){
        content = clients.map((client) => {
          return (
            <div key={client.id}>
              <p>{client.name}</p>
              <p>{client.email}</p>
            </div>
    ) });
    }

  return (
    <div>
      <h1>Home</h1>
      {clients && content}
      {fetchError && (<p>{fetchError}</p>)}
    </div>

  )
}

export default Home