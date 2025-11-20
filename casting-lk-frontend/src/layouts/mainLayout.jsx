import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-4 sm:p-6 md:px-16 lg:px-28 bg-gradient-to-br from-indigo-100 to-purple-50">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
