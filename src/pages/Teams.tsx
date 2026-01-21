import { useState, useEffect } from "react"
import { runtimeApi } from "@/services/instance/axios"
import { Search, Filter, LayoutGrid } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { TeamCard } from "@/components/TeamCard"
import { Badge } from "@/components/ui/badge"

interface Team {
    id: string
    team_name: string
    idea_description: string
    impact_description: string
    members: any[]
}

// Mock function to assign tracks randomly for UI demo (since backend doesn't have it)
const getMockTrack = (index: number) => {
    const tracks = ["Healthcare", "Climate Tech", "Finance", "Infrastructure"]
    return tracks[index % tracks.length]
}

export function Teams() {
    const [teams, setTeams] = useState<Team[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalTeams, setTotalTeams] = useState(0)


    // ... inside Teams component
    const fetchTeams = async () => {
        setLoading(true)
        try {
            const response = await runtimeApi.get("/teams", {
                params: {
                    page: page,
                    page_size: 9,
                    search: search || undefined
                }
            })
            setTeams(response.data.teams)
            setTotalPages(response.data.total_pages)
            setTotalTeams(response.data.total)
        } catch (error) {
            console.error("Failed to fetch teams", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchTeams()
        }, 300)
        return () => clearTimeout(debounce)
    }, [search, page])

    return (
        <div className="min-h-screen bg-[#0f111a] pt-24 pb-20">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <Badge variant="outline" className="text-blue-400 border-blue-400/30 mb-4">PUBLIC DIRECTORY</Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Registered Teams</h1>
                        <p className="text-muted-foreground max-w-xl">
                            Exploring the next generation of high-impact AI systems. Browse through {totalTeams > 0 ? totalTeams : '...'} teams committed to solving global challenges.
                        </p>
                    </div>

                    <div className="bg-secondary/20 rounded-lg px-4 py-2 flex items-center gap-3 border border-white/5">
                        <div className="text-right">
                            <div className="text-2xl font-bold text-white leading-none">{totalTeams}</div>
                            <div className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Total Builders</div>
                        </div>
                        <div className="size-8 rounded bg-blue-600/20 text-blue-400 flex items-center justify-center">
                            <LayoutGrid className="size-4" />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-[#1e2330] p-2 rounded-xl flex flex-col md:flex-row gap-4 mb-12 border border-white/5">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                        <Input
                            placeholder="Search teams or impact pitches..."
                            className="bg-transparent border-none pl-10 h-10 focus-visible:ring-0 text-white placeholder:text-muted-foreground/50"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="h-6 w-px bg-white/10 hidden md:block self-center" />
                    <div className="w-full md:w-[180px]">
                        <Select defaultValue="all">
                            <SelectTrigger className="bg-transparent border-none h-10 focus:ring-0 text-muted-foreground">
                                <SelectValue placeholder="All Tracks" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Tracks</SelectItem>
                                <SelectItem value="healthcare">Healthcare</SelectItem>
                                <SelectItem value="climate">Climate Tech</SelectItem>
                                <SelectItem value="finance">Finance</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="h-6 w-px bg-white/10 hidden md:block self-center" />
                    <div className="w-full md:w-[180px]">
                        <Select defaultValue="newest">
                            <SelectTrigger className="bg-transparent border-none h-10 focus:ring-0 text-muted-foreground">
                                <SelectValue placeholder="Sort by: Newest" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Sort by: Newest</SelectItem>
                                <SelectItem value="oldest">Sort by: Oldest</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white h-10">
                        <Filter className="size-4 mr-2" /> Filter
                    </Button>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-[300px] rounded-xl bg-[#1e2330] animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {teams.map((team, idx) => (
                            <TeamCard
                                key={team.id}
                                {...team}
                                track={getMockTrack(idx)} // Ensuring visual variety
                            />
                        ))}
                    </div>
                )}

                {/* Pagination (Only show if multiple pages) */}
                {totalPages > 1 && (
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); if (page > 1) setPage(p => p - 1) }}
                                    className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <PaginationItem key={p}>
                                    <PaginationLink
                                        href="#"
                                        isActive={page === p}
                                        onClick={(e) => { e.preventDefault(); setPage(p) }}
                                    >
                                        {p}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); if (page < totalPages) setPage(p => p + 1) }}
                                    className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}

            </div>
        </div>
    )
}
