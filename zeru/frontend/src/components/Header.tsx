export default function Header() {
    return (
        <header className="bg-white/5 backdrop-blur-sm border-b border-white/10">
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">Z</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Zeru</h1>
                                <p className="text-white/60 text-sm">Historical Token Price Oracle</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="hidden md:flex items-center space-x-2 text-white/60 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>API Connected</span>
                        </div>
                        <div className="bg-white/10 rounded-lg px-3 py-1">
                            <span className="text-white text-sm font-medium">v1.0.0</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
} 