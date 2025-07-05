"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CreditCard, PiggyBank } from "lucide-react";

const menuItems = [
    {
        name: "Dashboard",
        href: "/",
        icon: Home,
    },
    {
        name: "Transactions",
        href: "/transactions",
        icon: CreditCard,
    },
    {
        name: "Budgets",
        href: "/budgets",
        icon: PiggyBank,
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">💰 Yardstick</h1>
                <p className="text-sm text-gray-600">Personal Finance Visualizer</p>
            </div>

            <nav className="space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
} 