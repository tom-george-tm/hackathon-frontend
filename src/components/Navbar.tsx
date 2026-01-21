import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"

export function Navbar() {
    const navigate = useNavigate();

    return (
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <div className="text-white font-bold text-xl">M</div>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">
                        MindMesh
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link to="/teams" className="text-sm font-medium hover:text-primary transition-colors text-blue-400">Teams Gallery</Link>
                    <a href="/#about" className="text-sm font-medium hover:text-primary transition-colors">About</a>
                    <a href="/#impact" className="text-sm font-medium hover:text-primary transition-colors">Impact</a>
                    <a href="/#tracks" className="text-sm font-medium hover:text-primary transition-colors">Tracks</a>
                    <a href="/#rules" className="text-sm font-medium hover:text-primary transition-colors">Rules</a>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        variant="default"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => navigate('/register')}
                    >
                        Register Now
                    </Button>
                    <div className="size-8 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold">
                        1
                    </div>
                </div>
            </div>
        </nav>
    )
}
