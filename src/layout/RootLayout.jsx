import { NavLink, Outlet } from "react-router-dom"

const RootLayout = () => {
  return (
    <section className="root-layout">
        <header>
            <h1>Supabase</h1>
            <nav>
                <ul>
                    <li><NavLink to='/'>Home</NavLink></li>
                    <li><NavLink to='create'>Create</NavLink></li>
                </ul>
            </nav>
        </header>
        <main className="page">
            <Outlet />
        </main>
    </section>
  )
}

export default RootLayout