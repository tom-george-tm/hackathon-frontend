import { Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Landing } from "@/pages/Landing"
import { Register } from "@/pages/Register"
import { Teams } from "@/pages/Teams"
import { Login } from "@/pages/Login"

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <Toaster richColors position="top-right" />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
