import { motion } from "framer-motion"

export function ChallengeSection() {
    return (
        <section className="py-20 bg-background overflow-hidden" id="about">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            The Challenge: <br />
                            <span className="text-blue-500">Tangible Global Impact</span>
                        </h2>
                        <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                            The era of specific chatbots is over. MindMesh challenges builders to develop intelligent systems with <span className="text-white font-semibold">real-world utility</span>. We are looking for high-impact tools that address critical bottlenecks in global infrastructure.
                        </p>
                        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                            Your mission is to architect agents that solve complex problems in <span className="text-white font-semibold">Healthcare</span> (improving diagnostic access), <span className="text-white font-semibold">Climate</span> (optimizing energy grids), and <span className="text-white font-semibold">Finance</span> (democratizing secure economic access).
                        </p>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-secondary/30 border border-border rounded-lg p-6 transition-colors"
                        >
                            <p className="font-mono text-sm text-blue-400 mb-2">" Innovation is measured by the number of lives it improves, not the complexity of its code. "</p>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-blue-600/20 blur-[80px] rounded-full" />
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/50 aspect-video flex items-center justify-center">
                            {/* Placeholder for abstract visualization */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-indigo-900/40" />
                            <div className="relative z-10 text-center">
                                <div className="inline-block px-4 py-1 rounded-full bg-blue-600 text-white text-xs font-bold mb-2">
                                    HARD SCOP E
                                </div>
                                <p className="text-white font-bold text-xl">Solving Real-World Human Needs</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
