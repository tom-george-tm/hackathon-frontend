import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function CountdownSection() {
    const targetDate = new Date("2026-02-20T00:00:00Z").getTime()

    const calculateTimeLeft = () => {
        const now = new Date().getTime()
        const difference = targetDate - now
        console.log(difference)
        if (difference > 0) {
            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            }
        }

        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const TimeUnit = ({ value, label }: { value: number, label: string }) => (
        <div className="flex flex-col items-center p-4 min-w-[100px] bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
            <span className="text-4xl md:text-5xl font-bold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                {value.toString().padStart(2, '0')}
            </span>
            <span className="text-xs uppercase tracking-widest text-muted-foreground mt-2">{label}</span>
        </div>
    )

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-full h-full bg-blue-900/10 blur-[100px] rounded-full" />

            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Registration Closes In</h2>
                    <p className="text-blue-400 font-medium mb-12">
                        Last date for registration is <span className="text-white">Sunday 8/02/2026</span>
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                        <TimeUnit value={timeLeft.days} label="Days" />
                        <TimeUnit value={timeLeft.hours} label="Hours" />
                        <TimeUnit value={timeLeft.minutes} label="Minutes" />
                        <TimeUnit value={timeLeft.seconds} label="Seconds" />
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 text-muted-foreground/60 text-sm"
                    >
                        Don't miss the chance to innovate and win.
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
