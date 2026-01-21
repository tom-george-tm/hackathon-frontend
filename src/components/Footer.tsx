export function Footer() {
    return (
        <footer className="py-12 border-t border-white/10 bg-black/40">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="size-6 bg-blue-600 rounded-lg flex items-center justify-center">
                                <div className="text-white font-bold text-sm">M</div>
                            </div>
                            <span className="font-bold text-lg">MindMesh</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Engineering the next generation of high-impact AI systems. Solve global problems with autonomous agents.
                        </p>
                        <div className="flex gap-4 mt-6">
                            {/* Social icons placeholders */}
                            <div className="size-8 rounded bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-white/10 cursor-pointer">𝕏</div>
                            <div className="size-8 rounded bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-white/10 cursor-pointer">D</div>
                            <div className="size-8 rounded bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-white/10 cursor-pointer">G</div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Impact Areas</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-white transition-colors">Healthcare AI</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Climate Tech</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Financial Systems</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Infrastructure</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Code of Conduct</a></li>
                        </ul>
                    </div>

                    <div className="md:col-span-1">
                        {/* Visual element or extra links */}
                    </div>

                </div>

                <div className="text-center pt-8 border-t border-white/5 text-xs text-muted-foreground">
                    © 2024 MindMesh. All rights reserved. <br />
                    Designed for Global Impact.
                </div>
            </div>
        </footer>
    )
}
