import { useState } from "react";
import "./App.css";
import logo from "./assets/logo.png";
import InstructionPage from "./pages/instruction";
import RulesPage from "./pages/RulesCard";

export default function App() {
    const [page, setPage] = useState("instruction");

    const btnStyle = (active) =>
        `flex-1 py-2 text-sm font-medium rounded-lg ${
            active ? "bg-blue-600 text-white" : "bg-white text-blue-600 border border-blue-300"
        }`;

    return (
        <section className="min-h-[100dvh] w-full flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-100 p-4 font-sans">
            <div className="relative w-full max-w-lg">
                {/* Logo */}
                <div className="mb-5 flex items-center justify-center flex-col gap-2 text-blue-800">
                    <img src={logo} alt="Logo" className="w-24 drop-shadow" />
                    <div className="text-xl uppercase font-bold tracking-wide">Нэвтрэлтийн систем</div>
                    <div className="text-sm uppercase text-slate-600 -mt-1">Ус Сувгийн Удирдах Газар</div>
                </div>

                {/* Page switch */}
                <div className="flex gap-2 mb-4">
                    <button className={btnStyle(page === "instruction")} onClick={() => setPage("instruction")}>
                        📖 Заавар
                    </button>
                    <button className={btnStyle(page === "rules")} onClick={() => setPage("rules")}>
                        📜 Журам
                    </button>
                </div>

                {/* Content */}
                {page === "instruction" ? <InstructionPage /> : <RulesPage />}

                <p className="text-center text-xs text-slate-600 mt-6">
                    © {new Date().getFullYear()} Мэдээллийн Технологи Автоматжуулалтын Алба
                </p>
            </div>
        </section>
    );
}
