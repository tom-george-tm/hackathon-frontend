import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"

export function RulesSection() {
    const fadeInVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
    }

    return (
        <section className="py-20 bg-black/20" id="rules">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="lg:col-span-4"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Rules of Engagement</h2>
                        <p className="text-muted-foreground mb-8">
                            Excellence and real-world utility are the primary benchmarks of this hackathon's competitors.
                        </p>

                        <div className="p-6 rounded-xl bg-blue-900/10 border border-blue-500/20">
                            <h4 className="text-blue-400 font-bold mb-2">1. Impact First</h4>
                            <p className="text-sm text-muted-foreground">
                                Projects will be prioritized based on potential for real-world application. Purely academic toys will be disqualified.
                            </p>
                        </div>
                    </motion.div>

                    <div className="lg:col-span-8 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-indigo-400">⚖️</span>
                                <h3 className="text-xl font-bold">Judging Criteria</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { label: "40% Weighting", title: "Real-World Impact & Utility", color: "text-blue-400" },
                                    { label: "30% Weighting", title: "Technical Complexity", color: "text-indigo-400" },
                                    { label: "20% Weighting", title: "System Robustness", color: "text-purple-400" },
                                    { label: "10% Weighting", title: "Video Presentation", color: "text-green-400" }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -3, backgroundColor: "rgba(255,255,255,0.08)" }}
                                        className="bg-secondary/20 p-4 rounded-lg border border-white/5 transition-colors cursor-default"
                                    >
                                        <div className={`${item.color} text-sm font-bold mb-1`}>{item.label}</div>
                                        <div className="font-semibold text-sm">{item.title}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <Separator className="bg-white/10" />

                        <div className="space-y-6">
                            {[
                                {
                                    icon: "✓",
                                    color: "bg-blue-500/20 text-blue-400",
                                    title: "Eligibility",
                                    desc: "Open to global builders, no prior invites needed. Teams of 1-4. Focus on systems that can be piloted in real environments."
                                },
                                {
                                    icon: "</>",
                                    color: "bg-indigo-500/20 text-indigo-400",
                                    title: "Submission",
                                    desc: "Github repo with README, demo video, and an \"Impact Statement\" explaining how the system addresses a global challenge."
                                },
                                {
                                    icon: "!",
                                    color: "bg-red-500/20 text-red-400",
                                    title: "No LLM-Only Wrappers",
                                    desc: "Pure prompt-wrappers without autonomous system logic or tangible utility loops will be disqualified."
                                }
                            ].map((rule, i) => (
                                <motion.div
                                    key={i}
                                    variants={fadeInVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    className="flex gap-4"
                                >
                                    <div className="mt-1">
                                        <div className={`size-6 rounded-full ${rule.color} flex items-center justify-center text-xs font-bold`}>{rule.icon}</div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">{rule.title}</h4>
                                        <p className="text-sm text-muted-foreground">{rule.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
