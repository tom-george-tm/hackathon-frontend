import { Routes, Route } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Landing } from "@/pages/Landing"
import { Register } from "@/pages/Register"
import { Teams } from "@/pages/Teams"

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/teams" element={<Teams />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
