import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { runtimeApi } from "@/services/instance/axios"
import tmLogo from "@/assets/tm-logo.svg"

export function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [teamCount, setTeamCount] = useState<number | null>(null);

    const navItems = [
        { name: "Teams Gallery", path: "/teams" },
        { name: "About", path: "/#about", isHash: true },
        { name: "Impact", path: "/#impact", isHash: true },
        { name: "Tracks", path: "/#tracks", isHash: true },
        { name: "Rules", path: "/#rules", isHash: true },
    ];

    const isActive = (path: string) => {
        if (path.startsWith('/#')) {
            return location.hash === path.slice(1);
        }
        return location.pathname === path;
    };

    useEffect(() => {
        const fetchTeamCount = async () => {
            try {
                const response = await runtimeApi.get("/teams", {
                    params: { page: 1, page_size: 1 }
                });
                setTeamCount(response.data.total);
            } catch (error) {
                console.error("Failed to fetch team count", error);
            }
        };

        fetchTeamCount();
    }, []);

    return (
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group transition-transform hover:scale-105 active:scale-95">
                    <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                        <div className="text-white font-bold text-xl">M</div>
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-indigo-500 transition-colors">
                            MindMesh
                        </span>
                        <div className="flex items-center text-[10px] font-bold text-white tracking-widest mt-0.5 ml-0.5 font-mono group-hover:text-blue-400 transition-colors uppercase">
                            TH <img src={tmLogo} alt="o" className="size-2.5 mx-[1px] mr-[2px] brightness-0 invert" /> UGHTMINDS
                        </div>
                    </div>
                </Link>

                <div className="hidden md:flex items-center gap-2">
                    {navItems.map((item) => (
                        <div key={item.name} className="relative px-3 py-2">
                            {item.isHash ? (
                                <a
                                    href={item.path}
                                    className={`relative z-10 text-sm font-medium transition-colors ${isActive(item.path) ? "text-blue-400" : "text-muted-foreground hover:text-blue-400"
                                        }`}
                                >
                                    {item.name}
                                </a>
                            ) : (
                                <Link
                                    to={item.path}
                                    className={`relative z-10 text-sm font-medium transition-colors ${isActive(item.path) ? "text-blue-400" : "text-muted-foreground hover:text-blue-400"
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            )}

                            {/* Active/Hover Highlight */}
                            {isActive(item.path) && (
                                <motion.div
                                    layoutId="nav-active"
                                    className="absolute inset-x-0 -bottom-1 h-0.5 bg-blue-500"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        variant="default"
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                        onClick={() => navigate('/register')}
                    >
                        Register Now
                    </Button>
                    <Link
                        to="/teams"
                        className="size-8 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-black font-bold text-xs shadow-inner cursor-pointer hover:scale-110 active:scale-95 transition-all hover:shadow-yellow-500/40"
                        title="View Registered Teams"
                    >
                        {teamCount !== null ? teamCount : '...'}
                    </Link>
                </div>
            </div>
        </nav>
    )
}
