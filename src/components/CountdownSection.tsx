import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function CountdownSection() {
    const targetDate = new Date("2026-02-21T15:00:00+05:30").getTime();

    const calculateTimeLeft = () => {
        const now = new Date().getTime()
        const difference = targetDate - now
        if (difference > 0) {
            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
                total: difference
            }
        }
        return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
    }

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
    const [hasEnded, setHasEnded] = useState(false)
    const [pulseKey, setPulseKey] = useState(0)
    const audioCtxRef = useRef<AudioContext | null>(null)

    const playBeep = (freq: number, duration: number) => {
        try {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
            }
            const ctx = audioCtxRef.current
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.frequency.value = freq
            osc.type = "sine"
            gain.gain.setValueAtTime(0.3, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
            osc.start(ctx.currentTime)
            osc.stop(ctx.currentTime + duration)
        } catch (e) { }
    }

    useEffect(() => {
        const timer = setInterval(() => {
            const t = calculateTimeLeft()
            setTimeLeft(t)
            setPulseKey(k => k + 1)

            const totalSecs = Math.floor(t.total / 1000)
            if (totalSecs <= 0) {
                setHasEnded(true)
                clearInterval(timer)
            } else if (totalSecs <= 10) {
                playBeep(totalSecs <= 3 ? 880 : 440, 0.15)
            }
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const totalSecs = Math.floor(timeLeft.total / 1000)
    const isLastTen = totalSecs <= 10 && totalSecs > 0

    const TimeUnit = ({ value, label }: { value: number; label: string }) => {
        const display = value.toString().padStart(2, "0")
        return (
            <motion.div
                key={`${label}-${display}`}
                className="relative flex flex-col items-center"
                animate={isLastTen ? {
                    scale: [1, 1.08, 1],
                    transition: { duration: 0.5, repeat: Infinity }
                } : {}}
            >
                <div
                    className="relative flex flex-col items-center justify-center"
                    style={{
                        width: "clamp(70px, 10vw, 110px)",
                        height: "clamp(80px, 12vw, 125px)",
                        background: isLastTen
                            ? "linear-gradient(135deg, rgba(220,38,38,0.25) 0%, rgba(239,68,68,0.1) 100%)"
                            : "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                        border: isLastTen
                            ? "1px solid rgba(239,68,68,0.6)"
                            : "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "16px",
                        backdropFilter: "blur(16px)",
                        transition: "background 0.3s, border 0.3s",
                        boxShadow: isLastTen
                            ? "0 0 30px rgba(239,68,68,0.3), inset 0 1px 0 rgba(255,255,255,0.1)"
                            : "0 0 20px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.07)",
                    }}
                >
                    {/* Divider line */}
                    <div style={{
                        position: "absolute",
                        left: "10%", right: "10%",
                        top: "50%",
                        height: "1px",
                        background: isLastTen ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.08)"
                    }} />

                    <AnimatePresence mode="popLayout">
                        <motion.span
                            key={display}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            style={{
                                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                                fontWeight: 800,
                                fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                                letterSpacing: "0.04em",
                                background: isLastTen
                                    ? "linear-gradient(180deg, #fca5a5 0%, #ef4444 100%)"
                                    : "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.5) 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                lineHeight: 1,
                            }}
                        >
                            {display}
                        </motion.span>
                    </AnimatePresence>
                </div>
                <span style={{
                    marginTop: "10px",
                    fontSize: "0.65rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    color: isLastTen ? "rgba(252,165,165,0.8)" : "rgba(148,163,184,0.7)",
                    fontFamily: "monospace",
                    transition: "color 0.3s"
                }}>
                    {label}
                </span>
            </motion.div>
        )
    }

    if (hasEnded) {
        return (
            <section style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "radial-gradient(ellipse at center, #0a0a1a 0%, #000000 100%)",
                position: "relative",
                overflow: "hidden",
                fontFamily: "system-ui, sans-serif"
            }}>
                {/* Firework-like particles */}
                {Array.from({ length: 24 }).map((_, i) => (
                    <motion.div
                        key={i}
                        style={{
                            position: "absolute",
                            width: 3,
                            height: 3,
                            borderRadius: "50%",
                            background: `hsl(${i * 15}, 90%, 65%)`,
                            left: "50%", top: "50%",
                        }}
                        animate={{
                            x: Math.cos((i / 24) * Math.PI * 2) * (150 + Math.random() * 200),
                            y: Math.sin((i / 24) * Math.PI * 2) * (150 + Math.random() * 200),
                            opacity: [1, 1, 0],
                            scale: [0, 1.5, 0],
                        }}
                        transition={{
                            duration: 2 + Math.random(),
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: "easeOut"
                        }}
                    />
                ))}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    style={{ textAlign: "center", zIndex: 10, padding: "2rem" }}
                >
                    <motion.div
                        animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        style={{ fontSize: "clamp(3rem, 10vw, 6rem)", marginBottom: "1rem" }}
                    >
                        🏆
                    </motion.div>
                    <h1 style={{
                        fontSize: "clamp(2rem, 8vw, 5rem)",
                        fontWeight: 900,
                        fontFamily: "'Bebas Neue', Impact, sans-serif",
                        letterSpacing: "0.1em",
                        background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 40%, #ffffff 60%, #60a5fa 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        lineHeight: 1,
                        marginBottom: "1rem"
                    }}>
                        HACKATHON COMPLETE
                    </h1>
                    <p style={{
                        color: "rgba(148,163,184,0.8)",
                        fontSize: "clamp(1rem, 2vw, 1.25rem)",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        fontFamily: "monospace"
                    }}>
                        Time's up — pencils down
                    </p>
                </motion.div>
            </section>
        )
    }

    return (
        <section style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: isLastTen
                ? "radial-gradient(ellipse at center, #1a0505 0%, #0d0000 60%, #000000 100%)"
                : "radial-gradient(ellipse at center, #060612 0%, #000000 100%)",
            position: "relative",
            overflow: "hidden",
            fontFamily: "system-ui, sans-serif",
            transition: "background 1s"
        }}>
            {/* Ambient glow */}
            <motion.div
                animate={isLastTen ? {
                    opacity: [0.15, 0.35, 0.15],
                    scale: [1, 1.1, 1]
                } : { opacity: 0.12 }}
                transition={{ duration: 0.8, repeat: isLastTen ? Infinity : 0 }}
                style={{
                    position: "absolute",
                    inset: 0,
                    background: isLastTen
                        ? "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(239,68,68,0.2) 0%, transparent 70%)"
                        : "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(59,130,246,0.15) 0%, transparent 70%)",
                    pointerEvents: "none",
                    transition: "background 1s"
                }}
            />

            {/* Scan lines */}
            <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)",
                zIndex: 1
            }} />

            {/* Last-10 flash overlay */}
            <AnimatePresence>
                {isLastTen && (
                    <motion.div
                        key={pulseKey}
                        initial={{ opacity: 0.25 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{
                            position: "absolute", inset: 0,
                            background: "rgba(220,38,38,0.12)",
                            pointerEvents: "none", zIndex: 2
                        }}
                    />
                )}
            </AnimatePresence>

            <div style={{
                position: "relative", zIndex: 10,
                textAlign: "center",
                padding: "2rem",
                maxWidth: "700px",
                width: "100%"
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {/* Label */}
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "6px 16px",
                        borderRadius: "999px",
                        border: "1px solid rgba(59,130,246,0.3)",
                        background: "rgba(59,130,246,0.08)",
                        marginBottom: "2rem"
                    }}>
                        <motion.span
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                            style={{
                                width: 6, height: 6,
                                borderRadius: "50%",
                                background: isLastTen ? "#ef4444" : "#22c55e",
                                display: "inline-block",
                                boxShadow: isLastTen ? "0 0 6px #ef4444" : "0 0 6px #22c55e"
                            }}
                        />
                        <span style={{
                            fontSize: "0.7rem",
                            letterSpacing: "0.25em",
                            textTransform: "uppercase",
                            color: "rgba(148,163,184,0.8)",
                            fontFamily: "monospace"
                        }}>
                            {isLastTen ? "FINAL SECONDS" : "LIVE"}
                        </span>
                    </div>

                    {/* Heading */}
                    <motion.h1
                        style={{
                            fontSize: "clamp(2rem, 7vw, 4.5rem)",
                            fontWeight: 900,
                            fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                            letterSpacing: "0.08em",
                            lineHeight: 1,
                            marginBottom: "0.5rem",
                            background: isLastTen
                                ? "linear-gradient(135deg, #fca5a5 0%, #ffffff 60%, #fca5a5 100%)"
                                : "linear-gradient(135deg, #e2e8f0 0%, #ffffff 50%, #93c5fd 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            transition: "all 0.3s"
                        }}
                        animate={isLastTen ? {
                            filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"],
                        } : {}}
                        transition={{ duration: 0.6, repeat: Infinity }}
                    >
                        HACKATHON ENDS IN
                    </motion.h1>

                    <p style={{
                        color: isLastTen ? "rgba(252,165,165,0.7)" : "rgba(96,165,250,0.7)",
                        fontSize: "0.8rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        fontFamily: "monospace",
                        marginBottom: "3rem",
                        transition: "color 0.3s"
                    }}>
                        Deadline · 21 Feb 2026 · 3:00 PM IST
                    </p>

                    {/* Countdown */}
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "clamp(4px, 1.5vw, 16px)",
                        flexWrap: "nowrap",
                        overflowX: "auto",
                    }}>
                        <TimeUnit value={timeLeft.days} label="Days" />
                        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "2rem", fontWeight: 100, marginBottom: "1.5rem", flexShrink: 0 }}>:</span>
                        <TimeUnit value={timeLeft.hours} label="Hours" />
                        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "2rem", fontWeight: 100, marginBottom: "1.5rem", flexShrink: 0 }}>:</span>
                        <TimeUnit value={timeLeft.minutes} label="Minutes" />
                        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "2rem", fontWeight: 100, marginBottom: "1.5rem", flexShrink: 0 }}>:</span>
                        <TimeUnit value={timeLeft.seconds} label="Seconds" />
                    </div>

                    {/* Bottom message */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        style={{
                            marginTop: "3rem",
                            color: "rgba(100,116,139,0.6)",
                            fontSize: "0.75rem",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            fontFamily: "monospace"
                        }}
                    >
                        {isLastTen ? "🔴 Wrap up and submit now!" : "Build something extraordinary"}
                    </motion.p>
                </motion.div>
            </div>

            {/* Floating particles */}
            {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                    key={i}
                    style={{
                        position: "absolute",
                        width: Math.random() * 3 + 1,
                        height: Math.random() * 3 + 1,
                        borderRadius: "50%",
                        background: isLastTen ? `rgba(239,68,68,${0.2 + Math.random() * 0.3})` : `rgba(59,130,246,${0.2 + Math.random() * 0.3})`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        pointerEvents: "none",
                    }}
                    animate={{
                        y: [0, -30 - Math.random() * 60, 0],
                        opacity: [0, 0.8, 0],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 4,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </section>
    )
}