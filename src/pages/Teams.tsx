import { useState, useEffect, useMemo } from "react"
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
    created_at?: string // Assuming this exists for sorting
}

export function Teams() {
    const [allTeams, setAllTeams] = useState<Team[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [page, setPage] = useState(1)
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [sortOrder, setSortOrder] = useState("newest")
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
    const isAdmin = !!localStorage.getItem("admin_token")
    const PAGE_SIZE = 9

    // For rejection remarks in Modal
    const [modalRemarks, setModalRemarks] = useState("")
    const [showModalRemarks, setShowModalRemarks] = useState(false)

    const fetchTeams = async () => {
        setLoading(true)
        try {
            const response = await runtimeApi.get("/teams", {
                params: {
                    page: 1,
                    page_size: 200 // Fetch a reasonable batch for frontend filtering
                }
            })
            // Force status to be a string if it comes as an object/enum from backend
            const normalizedTeams = (response.data.teams || []).map((t: any) => ({
                ...t,
                status: typeof t.status === 'string' ? t.status : (Object.keys(t.status || {})[0] || "Pending")
            }))
            setAllTeams(normalizedTeams)
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

    const handleDeleteTeam = async (teamId: string) => {
        try {
            await runtimeApi.delete(`/admin/teams/${teamId}`)
            fetchTeams() // Refresh
        } catch (error) {
            console.error("Failed to delete team", error)
            alert("Error deleting team. Check console.")
        }
    }

    useEffect(() => {
        fetchTeams()
    }, [])

    const filteredAndSortedTeams = useMemo(() => {
        let result = [...allTeams]

        // 1. Filter by Status
        if (selectedStatus && selectedStatus !== "all") {
            const targetStatus = selectedStatus.toLowerCase()
            result = result.filter(team => {
                const currentStatus = String(team.status || "").toLowerCase()
                return currentStatus === targetStatus
            })
        }

        // 2. Filter by Search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            result = result.filter(team => {
                const nameMatch = String(team.team_name || "").toLowerCase().includes(query)
                const ideaMatch = String(team.idea_description || "").toLowerCase().includes(query)
                const impactMatch = String(team.impact_description || "").toLowerCase().includes(query)
                return nameMatch || ideaMatch || impactMatch
            })
        }

        // 3. Sort
        result.sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0

            if (sortOrder === "newest") return dateB - dateA
            if (sortOrder === "oldest") return dateA - dateB
            return 0
        })

        return result
    }, [allTeams, searchQuery, selectedStatus, sortOrder])

    const totalPages = Math.ceil(filteredAndSortedTeams.length / PAGE_SIZE)
    const paginatedTeams = filteredAndSortedTeams.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    // Reset to page 1 when filters change
    useEffect(() => {
        setPage(1)
    }, [searchQuery, selectedStatus, sortOrder])

    return (
        <div className="min-h-screen bg-[#0f111a] pt-24 pb-20">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <Badge variant="outline" className="text-blue-400 border-blue-400/30 mb-4">PUBLIC DIRECTORY</Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Registered Teams</h1>
                        <p className="text-muted-foreground max-w-xl">
                            Exploring the next generation of high-impact AI systems. Browse through {filteredAndSortedTeams.length} teams committed to solving global challenges.
                        </p>
                    </div>

                    <div className="bg-secondary/20 rounded-lg px-4 py-2 flex items-center gap-3 border border-white/5">
                        <div className="text-right">
                            <div className="text-2xl font-bold text-white leading-none">{allTeams.length}</div>
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
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="h-6 w-px bg-white/10 hidden md:block self-center" />
                    <div className="w-full md:w-[200px]">
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger className="bg-transparent border-none h-10 focus:ring-0 text-muted-foreground">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Approved">Approved</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="h-6 w-px bg-white/10 hidden md:block self-center" />
                    <div className="w-full md:w-[200px]">
                        <Select value={sortOrder} onValueChange={setSortOrder}>
                            <SelectTrigger className="bg-transparent border-none h-10 focus:ring-0 text-muted-foreground">
                                <SelectValue placeholder="Sort by: Newest" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Sort by: Newest</SelectItem>
                                <SelectItem value="oldest">Sort by: Oldest</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {(searchQuery || selectedStatus !== "all") && (
                        <Button
                            variant="ghost"
                            className="text-white/40 hover:text-white h-10 px-4"
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedStatus("all");
                                setPage(1);
                            }}
                        >
                            Clear
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        className="border-white/5 bg-white/5 hover:bg-white/10 text-white h-10"
                        onClick={fetchTeams}
                    >
                        <Filter className="size-4 mr-2" /> Refresh
                    </Button>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-[300px] rounded-xl bg-[#1e2330] animate-pulse" />
                        ))}
                    </div>
                ) : paginatedTeams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {paginatedTeams.map((team) => (
                            <TeamCard
                                key={team.id}
                                {...team}
                                isAdmin={isAdmin}
                                onStatusUpdate={(status, remarks) => handleStatusUpdate(team.id, status, remarks)}
                                onDelete={() => handleDeleteTeam(team.id)}
                                onClick={() => setSelectedTeam(team)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-[#1e2330]/50 rounded-2xl border border-dashed border-white/10 mb-12">
                        <div className="size-16 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-400 mb-6 font-bold text-2xl">?</div>
                        <h3 className="text-xl font-bold text-white mb-2">No builders found</h3>
                        <p className="text-muted-foreground text-center max-w-sm">
                            We couldn't find any teams matching your current filters. Try searching for something else or clearing the filters.
                        </p>
                        <Button
                            variant="link"
                            className="text-blue-400 mt-4 h-auto p-0"
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedStatus("all");
                            }}
                        >
                            Clear all filters
                        </Button>
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
