import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TeamMember {
    name: string
    tms_id: string
    is_team_lead: boolean
}

interface TeamCardProps {
    team_name: string
    idea_description: string
    members: TeamMember[]
    impact_description: string
    track?: string
    status?: "Pending" | "Approved" | "Rejected"
    admin_remarks?: string | null
    isAdmin?: boolean
    onStatusUpdate?: (status: "Approved" | "Rejected", remarks?: string) => void
    onClick?: () => void
}

export function TeamCard({
    team_name, idea_description, members, track = "General",
    status = "Pending", admin_remarks, isAdmin, onStatusUpdate,
    onClick
}: TeamCardProps) {

    const [remarks, setRemarks] = useState("")
    const [showRemarks, setShowRemarks] = useState(false)

    const statusColors: Record<string, string> = {
        Pending: "bg-yellow-600/20 text-yellow-400 border-yellow-500/30",
        Approved: "bg-green-600/20 text-green-400 border-green-500/30",
        Rejected: "bg-red-600/20 text-red-400 border-red-400/30"
    }

    const trackColor =
        track === "Healthcare" ? "bg-blue-600" :
            track === "Climate Tech" ? "bg-cyan-600" :
                track === "Finance" ? "bg-indigo-600" :
                    "bg-gray-600";

    return (
        <Card
            className="bg-[#1e2330] border-white/5 overflow-hidden group hover:border-blue-500/30 transition-all duration-300 cursor-pointer"
            onClick={onClick}
        >
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2">
                        <Badge className={`${trackColor} hover:${trackColor} text-[10px] uppercase tracking-wider border-none rounded-sm`}>
                            {track}
                        </Badge>
                        <Badge variant="outline" className={`text-[10px] uppercase tracking-wider rounded-sm ${statusColors[status]}`}>
                            {status}
                        </Badge>
                    </div>
                    <div className="flex -space-x-2">
                        {members.slice(0, 3).map((m, i) => (
                            <Avatar key={i} className="size-6 border border-[#1e2330]">
                                <AvatarFallback className="bg-white/10 text-[10px] text-white">
                                    {m.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        ))}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{team_name}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4 h-[40px]">
                    {idea_description}
                </p>

                <div className="mb-6">
                    <div className="text-[10px] uppercase text-muted-foreground font-bold mb-3 tracking-wider">Team Members</div>
                    <div className="space-y-1.5">
                        {members.map((member, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs">
                                <span className="text-white/70">{member.name}</span>
                                <span className="font-mono text-[10px] text-blue-400/50">{member.tms_id}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {admin_remarks && (
                    <div className="mb-6 p-3 rounded-lg bg-red-900/10 border border-red-900/20">
                        <div className="text-[10px] uppercase text-red-400 font-bold mb-1 tracking-wider">Admin Remarks</div>
                        <p className="text-xs text-red-400/80 italic">"{admin_remarks}"</p>
                    </div>
                )}

                {isAdmin && status === "Pending" && (
                    <div className="mt-auto pt-4 border-t border-white/5 space-y-3" onClick={(e) => e.stopPropagation()}>
                        {!showRemarks ? (
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white h-8 text-xs font-bold"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onStatusUpdate?.("Approved");
                                    }}
                                >
                                    Approve
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10 h-8 text-xs font-bold"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowRemarks(true);
                                    }}
                                >
                                    Reject
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Input
                                    placeholder="Add rejection remark..."
                                    className="text-xs h-8 bg-white/5 border-white/10"
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white h-8 text-xs font-bold"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (remarks) onStatusUpdate?.("Rejected", remarks);
                                        }}
                                    >
                                        Confirm Reject
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="px-2 h-8 text-xs"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowRemarks(false);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
