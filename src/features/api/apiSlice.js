import { createApi, fakeBaseQuery, } from '@reduxjs/toolkit/query/react';
import supabase from '../../config/supabse';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fakeBaseQuery,
    tagTypes: ['Clients'],
    endpoints: (builder) => ({
        getAllClients: builder.query({
            query: async () => {
                const { data } = await supabase.from('clients').select('*');
                console.log('Supabase Query Result:', data);
                return data;
              },
            }),
    })
})

export const {useGetAllClientsQuery} = apiSlice;