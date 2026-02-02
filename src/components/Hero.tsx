import { Button } from "@/components/ui/button"
import { motion, type Variants } from "framer-motion"
import { useNavigate } from "react-router-dom"

export function Hero() {
    const navigate = useNavigate()
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    }

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    }

    return (
        <div className="relative pt-32 pb-20 overflow-hidden">
            {/* Background gradients */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute top-0 right-0 -z-10 w-1/2 h-1/2 bg-blue-900/20 blur-[120px] rounded-full"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                className="absolute bottom-0 left-0 -z-10 w-1/2 h-1/2 bg-indigo-900/20 blur-[120px] rounded-full"
            />

            <motion.div
                className="container mx-auto px-4 text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-800 text-blue-400 text-sm font-medium mb-8">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    I S S U E # 1 :   I M P A C T   I N     N O V A T I O N
                </motion.div>

                <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-bold tracking-tight mb-2">
                    <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">MindMesh</span>
                </motion.h1>
                <motion.div variants={itemVariants} className="flex justify-center items-center text-xs md:text-sm font-bold text-white tracking-[0.2em] font-mono mb-8 uppercase opacity-80">
                    TH<img src="/src/assets/tm-logo.svg" alt="o" className="size-3 md:size-4 mx-[1px] mr-[2px] brightness-0 invert" />UGHTMINDS
                </motion.div>

                <motion.p variants={itemVariants} className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
                    Building Intelligent Systems that solve <span className="text-white font-semibold">Global Challenges</span>.
                    <br />
                    Go beyond chatbots to engineer the future of high-impact AI.
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                    <Button
                        size="lg"
                        onClick={() => navigate('/register')}
                        className="bg-blue-600 hover:bg-blue-700 text-white min-w-[160px] h-12 text-base shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-shadow"
                    >
                        Register Now →
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={() => navigate('/teams')}
                        className="min-w-[160px] h-12 text-base bg-white/5 border-white/10 hover:bg-white/10 text-white transition-colors"
                    >
                        Teams Gallery →
                    </Button>
                </motion.div>

                {/* Stats Grid */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {[
                        { icon: "💰", label: "Impact Prize Pool", value: "₹50,000", color: "bg-blue-600/20" },
                        { icon: "🌏", label: "Target Industries", value: "Global Focus", color: "bg-indigo-600/20" },
                        { icon: "👥", label: "Team Size", value: "Max 4 Members", color: "bg-purple-600/20" }
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.08)" }}
                            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-4 transition-colors cursor-default"
                        >
                            <div className={`size-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                                <span className="text-2xl">{stat.icon}</span>
                            </div>
                            <div className="text-left">
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                                <div className="text-xl font-bold">{stat.value}</div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    )
}
