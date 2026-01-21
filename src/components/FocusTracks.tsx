import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, Network, Cpu } from "lucide-react"
import { motion } from "framer-motion"

const tracks = [
    {
        icon: <Bot className="size-6 text-blue-400" />,
        title: "Autonomous Agents",
        description: "Build agents that can independently identify goals and execute complex real-world workflows without human intervention.",
        tags: ["Agent Pattern", "Auto-Correction"]
    },
    {
        icon: <Network className="size-6 text-indigo-400" />,
        title: "Multi-Agent Swarms",
        description: "Orchestrate multiple specialized agents working in tandem. Focus on communication protocols for collaborative problem solving.",
        tags: ["Swarm Intelligence", "Protocols"]
    },
    {
        icon: <Cpu className="size-6 text-purple-400" />,
        title: "System Integration",
        description: "Embed AI deep into global infrastructure. Develop native AI kernels or hardware-aware agent drivers for legacy systems.",
        tags: ["Infrastructure", "IoA & IIoT"]
    }
]

export function FocusTracks() {
    return (
        <section className="py-20 bg-background" id="tracks">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-2xl mx-auto mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Focus Tracks</h2>
                    <p className="text-muted-foreground">Choose a path that pushes your technical boundaries for tangible results.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {tracks.map((track, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="bg-secondary/20 border-white/5 backdrop-blur-sm group hover:bg-secondary/30 transition-all h-full">
                                <CardHeader>
                                    <div className="size-12 rounded-lg bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors flex items-center justify-center mb-4">
                                        {track.icon}
                                    </div>
                                    <CardTitle className="text-xl mb-2">{track.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                                        {track.description}
                                    </p>
                                </CardContent>
                                <CardFooter className="flex gap-2 flex-wrap">
                                    {track.tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="bg-white/5 hover:bg-white/10 text-xs font-normal text-muted-foreground border-white/10">{tag}</Badge>
                                    ))}
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
