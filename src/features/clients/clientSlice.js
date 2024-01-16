// import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
// import { apiSlice } from "../api/apiSlice";
// import supabase from "../../config/supabse";


// const clientssAdapter = createEntityAdapter({
//     sortComparer: (a,b) => b.date.localeCompare(a.date)
// })

// const initialState = clientssAdapter.getInitialState()

// export const extendedApiSlice = apiSlice.injectEndpoints({
    
// })


// const selectClientResult = apiSlice.endpoints.getAllClients.select();
// //Creates memoized selector
// export const selectClientsData = createSelector(
//     selectClientResult,
//     clientsResult => clientsResult.data //normalized state object with ids and entities
// )

// //getSlectors creates these selectors and we rename them with aliases using destructuring
// export const {
//     selectAll: selectAllClients,
//     selectById: selectClientById,
//     selectIds: selectClientIds,
//     //pass in a selector that returns the posts slice of state
// } = clientssAdapter.getSelectors(state => selectClientsData(state) ?? initialState);