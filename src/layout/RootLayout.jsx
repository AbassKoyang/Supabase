import { NavLink, Outlet } from "react-router-dom"

const RootLayout = () => {
  return (
    <section className="root-layout">
        <header>
            <h1>Supabase</h1>
            <nav>
                <ul>
                    <li><NavLink>Home</NavLink></li>
                    <li><NavLink>Create</NavLink></li>
                </ul>
            </nav>
        </header>
        <main>
            <Outlet />
        </main>
    </section>
  )
}

export default RootLayout