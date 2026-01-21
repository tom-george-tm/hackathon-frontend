import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface TeamMember {
    name: String
    tms_id: String
    is_team_lead: boolean
}

interface TeamCardProps {
    team_name: string
    idea_description: string
    members: TeamMember[]
    impact_description: string
    track?: string // Optional until backend supports it
}

export function TeamCard({ team_name, idea_description, members, track = "General" }: TeamCardProps) {

    // Mock logic to determine track color/label if not provided
    const trackColor =
        track === "Healthcare" ? "bg-blue-600" :
            track === "Climate Tech" ? "bg-cyan-600" :
                track === "Finance" ? "bg-indigo-600" :
                    "bg-gray-600";

    return (
        <Card className="bg-[#1e2330] border-white/5 overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <Badge className={`${trackColor} hover:${trackColor} text-[10px] uppercase tracking-wider border-none rounded-sm`}>
                        {track}
                    </Badge>
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
                <p className="text-muted-foreground text-sm line-clamp-3 mb-6 h-[60px]">
                    {idea_description}
                </p>

                <div>
                    <div className="text-[10px] uppercase text-muted-foreground font-bold mb-3 tracking-wider">Team Members</div>
                    <div className="space-y-2">
                        {members.map((member, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                                <span className="text-white/80">{member.name}</span>
                                <span className="font-mono text-xs text-blue-400/70">{member.tms_id}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
