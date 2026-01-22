import { useState, useEffect } from "react"
import { runtimeApi } from "@/services/instance/axios"
import { Search, Filter, LayoutGrid } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { TeamCard } from "@/components/TeamCard"
import { Badge } from "@/components/ui/badge"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Users, Target, Rocket, MessageSquare, CheckCircle, XCircle } from "lucide-react"

interface Team {
    id: string
    team_name: string
    idea_description: string
    impact_description: string
    members: any[]
    status: "Pending" | "Approved" | "Rejected"
    admin_remarks: string | null
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
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
    const isAdmin = !!localStorage.getItem("admin_token")

    // For rejection remarks in Modal
    const [modalRemarks, setModalRemarks] = useState("")
    const [showModalRemarks, setShowModalRemarks] = useState(false)


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

    const handleStatusUpdate = async (teamId: string, status: string, remarks?: string) => {
        try {
            await runtimeApi.post(`/admin/teams/${teamId}/status`, { status, remarks })
            fetchTeams() // Refresh
        } catch (error) {
            console.error("Failed to update status", error)
            alert("Error updating status. Check console.")
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
                                track={getMockTrack(idx)}
                                isAdmin={isAdmin}
                                onStatusUpdate={(status, remarks) => handleStatusUpdate(team.id, status, remarks)}
                                onClick={() => setSelectedTeam(team)}
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

                {/* Team Detail Sheet */}
                <Sheet open={!!selectedTeam} onOpenChange={(open) => { if (!open) { setSelectedTeam(null); setShowModalRemarks(false); setModalRemarks(""); } }}>
                    <SheetContent className="sm:max-w-xl bg-[#0f111a] border-white/5 text-white overflow-y-auto">
                        {selectedTeam && (
                            <div className="space-y-8 py-6">
                                <SheetHeader className="text-left">
                                    <div className="flex gap-2 mb-4">
                                        <Badge className="bg-blue-600 hover:bg-blue-600 text-[10px] uppercase tracking-wider border-none rounded-sm">
                                            {getMockTrack(teams.indexOf(selectedTeam))}
                                        </Badge>
                                        <Badge variant="outline" className={`text-[10px] uppercase tracking-wider rounded-sm ${selectedTeam.status === "Pending" ? "bg-yellow-600/20 text-yellow-400 border-yellow-500/30" :
                                            selectedTeam.status === "Approved" ? "bg-green-600/20 text-green-400 border-green-500/30" :
                                                "bg-red-600/20 text-red-400 border-red-400/30"
                                            }`}>
                                            {selectedTeam.status}
                                        </Badge>
                                    </div>
                                    <SheetTitle className="text-3xl font-bold text-white mb-2">{selectedTeam.team_name}</SheetTitle>
                                    <SheetDescription className="text-blue-400/60 font-mono text-xs uppercase tracking-widest">
                                        Team ID: {selectedTeam.id}
                                    </SheetDescription>
                                </SheetHeader>

                                <div className="space-y-6">
                                    <section>
                                        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">
                                            <Rocket className="size-4 text-blue-400" />
                                            The Idea
                                        </div>
                                        <p className="text-lg text-white/90 leading-relaxed font-light italic">
                                            "{selectedTeam.idea_description}"
                                        </p>
                                    </section>

                                    <Separator className="bg-white/5" />

                                    <section>
                                        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">
                                            <Target className="size-4 text-indigo-400" />
                                            Impact & Vision
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {selectedTeam.impact_description}
                                        </p>
                                    </section>

                                    <Separator className="bg-white/5" />

                                    <section>
                                        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">
                                            <Users className="size-4 text-cyan-400" />
                                            Building Crew
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            {selectedTeam.members.map((member, i) => (
                                                <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center group hover:border-blue-500/30 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-10 rounded-lg bg-blue-600/20 flex items-center justify-center font-bold text-blue-400">
                                                            {member.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-white">{member.name}</div>
                                                            <div className="text-[10px] text-muted-foreground uppercase tracking-tighter">Contributor</div>
                                                        </div>
                                                    </div>
                                                    {member.is_team_lead && (
                                                        <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-400 border-blue-500/20">Team Lead</Badge>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {selectedTeam.admin_remarks && (
                                        <section className="bg-red-400/5 p-4 rounded-xl border border-red-400/10">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">
                                                <MessageSquare className="size-3" />
                                                Feedback from Admin
                                            </div>
                                            <p className="text-sm text-red-400/80 italic">"{selectedTeam.admin_remarks}"</p>
                                        </section>
                                    )}
                                </div>

                                {isAdmin && selectedTeam.status === "Pending" && (
                                    <SheetFooter className="pt-8 flex-col sm:flex-col gap-4 mt-8 border-t border-white/5">
                                        {!showModalRemarks ? (
                                            <div className="flex gap-4 w-full">
                                                <Button
                                                    className="flex-1 bg-green-600 hover:bg-green-700 h-12"
                                                    onClick={() => {
                                                        handleStatusUpdate(selectedTeam.id, "Approved");
                                                        setSelectedTeam(null);
                                                    }}
                                                >
                                                    <CheckCircle className="size-4 mr-2" /> Approve Project
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10 h-12"
                                                    onClick={() => setShowModalRemarks(true)}
                                                >
                                                    <XCircle className="size-4 mr-2" /> Need Refinement
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="w-full space-y-4 pt-4">
                                                <div className="text-xs font-bold text-muted-foreground uppercase">Provide Feedback for Rejection</div>
                                                <Input
                                                    placeholder="Enter details on what needs to be improved..."
                                                    className="bg-white/5 border-white/10 h-12 focus:border-red-500"
                                                    value={modalRemarks}
                                                    onChange={(e) => setModalRemarks(e.target.value)}
                                                />
                                                <div className="flex gap-3">
                                                    <Button
                                                        className="flex-1 bg-red-600 hover:bg-red-700 h-10"
                                                        onClick={() => {
                                                            if (modalRemarks) {
                                                                handleStatusUpdate(selectedTeam.id, "Rejected", modalRemarks);
                                                                setSelectedTeam(null);
                                                            }
                                                        }}
                                                    >
                                                        Confirm Rejection
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-10 text-white/50"
                                                        onClick={() => setShowModalRemarks(false)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </SheetFooter>
                                )}
                            </div>
                        )}
                    </SheetContent>
                </Sheet>

            </div>
        </div>
    )
}
