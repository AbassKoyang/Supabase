import { createBrowserRouter, Route, RouterProvider, createRoutesFromElements } from "react-router-dom"
import RootLayout from "./layout/RootLayout"
import Home from "./pages/Home"
import Create from "./pages/Create"
import Update from "./pages/Update"

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="create" element={<Create />} />
        <Route path="update/:id" element={<Update />} />
      </Route>
    )
  )
  return (
    <RouterProvider router={router}/>
  )
}

export default App
