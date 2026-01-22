import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Lock, User, ArrowRight } from "lucide-react"
import { runtimeApi } from "@/services/instance/axios"

export function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const response = await runtimeApi.post("/admin/login", { username, password })
            localStorage.setItem("admin_token", response.data.token)
            navigate("/teams")
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid credentials")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="bg-[#1e2330] border-white/5 shadow-2xl overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600" />
                    <CardHeader className="pt-10 pb-6 text-center">
                        <div className="size-12 bg-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                            <Lock className="size-6 text-blue-400" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-white">Admin Login</CardTitle>
                        <CardDescription className="text-muted-foreground pt-1">
                            Enter your credentials to manage hackathon teams
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-10 px-8">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <div className="relative">
                                    <User className="absolute left-3 top-3 size-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Username"
                                        className="pl-10 bg-white/5 border-white/10 focus:border-blue-500 text-white"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 size-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        className="pl-10 bg-white/5 border-white/10 focus:border-blue-500 text-white"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-md border border-red-400/20"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 transition-all group shadow-[0_4px_20px_rgba(37,99,235,0.2)]"
                                disabled={loading}
                            >
                                {loading ? "Authenticating..." : (
                                    <span className="flex items-center gap-2">
                                        Sign In <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
