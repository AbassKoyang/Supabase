import { createApi, fakeBaseQuery, } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fakeBaseQuery,
    tagTypes: ['Clients'],
    endpoints: (builder) => ({
        getAllClients: builder.query({
            query: async () => {
                
            },
            providesTags: () => [
                // Used for optimistic updates in the store
                {type: 'Clients', id: 'ALL'}
                ]
            }),
    })
})