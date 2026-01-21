import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Users, TrendingUp, Leaf } from "lucide-react"
import { motion } from "framer-motion"

const impacts = [
    {
        icon: <Users className="size-6 text-blue-400" />,
        title: "Societal Scale",
        description: "Addressing fundamental human needs through accessible AI. Focus on education, accessibility, and universal healthcare assistance."
    },
    {
        icon: <TrendingUp className="size-6 text-indigo-400" />,
        title: "Economic Efficiency",
        description: "Transforming core industries through intelligent automation. Optimizing supply chains, logistics, and resource allocation globally."
    },
    {
        icon: <Leaf className="size-6 text-green-400" />,
        title: "Sustainable Future",
        description: "Environmental solutions that matter. Building AI systems for carbon tracking, renewable energy management, and conservation."
    }
]

export function ImpactSection() {
    return (
        <section className="py-20 bg-background/50 relative overflow-hidden" id="impact">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-96 bg-blue-900/10 blur-[100px] rounded-full -z-10" />

            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-2xl mx-auto mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Impact-Driven Innovation</h2>
                    <p className="text-muted-foreground">We aren't just building software; we're building solutions for the world's most pressing challenges.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {impacts.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="bg-secondary/20 border-white/5 backdrop-blur-sm hover:border-blue-500/30 transition-all h-full">
                                <CardHeader>
                                    <div className="size-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                                        {item.icon}
                                    </div>
                                    <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {item.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
