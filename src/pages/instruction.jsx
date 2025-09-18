import { useState } from "react";

export default function InstructionPage() {
    const [sub, setSub] = useState("employee");

    const btnStyle = (active) =>
        `flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg ${
            active ? "bg-blue-600 text-white" : "bg-white text-blue-600 border border-blue-300"
        }`;

    return (
        <div className="rounded-2xl border border-blue-200 bg-white/80 shadow-lg backdrop-blur px-4 py-5 space-y-4 text-slate-800 text-sm leading-relaxed max-h-[70vh] overflow-y-auto">
            <h2 className="font-semibold text-lg">📖 Нэвтрэх зааварчилгаа</h2>

            {/* Sub Tabs */}
            <div className="grid grid-cols-2 gap-2 sticky top-0 bg-white/80 backdrop-blur py-1 z-10">
                <button className={btnStyle(sub === "employee")} onClick={() => setSub("employee")}>
                    👤 Ажилтан
                </button>
                <button className={btnStyle(sub === "guest")} onClick={() => setSub("guest")}>
                    🧾 Зочин
                </button>
                <button className={btnStyle(sub === "forbidden")} onClick={() => setSub("forbidden")}>
                    🚫 Хориглосон
                </button>
                <button className={btnStyle(sub === "unit")} onClick={() => setSub("unit")}>
                    🏢 Хариуцлага
                </button>
            </div>

            {/* Content */}
            {sub === "employee" && (
                <ul className="list-disc pl-5 space-y-1">
                    <li>МТАА нь ажилтны царайг төхөөрөмжинд бүртгэнэ.</li>
                    <li>Ажилтан зөвхөн өөрийн ажлын давхарт, цайны газар, хурлын танхимд нэвтэрнэ.</li>
                    <li>Нэмэлт давхрын эрхийг хүсэлт гарган нэмүүлж болно.</li>
                </ul>
            )}

            {sub === "guest" && (
                <ul className="list-disc pl-5 space-y-1">
                    <li>Зочин иргэний үнэмлэх эсвэл бичиг баримтаа үзүүлж түр бүртгүүлнэ.</li>
                    <li>Хүлээн авагч ажилтан уулзах ажилтнаас зөвшөөрөл авсны дараа карт олгоно.</li>
                    <li>Зөвшөөрөгдсөн давхарт л нэвтэрнэ.</li>
                    <li>Хурал, уулзалт дууссаны дараа картыг буцаана.</li>
                </ul>
            )}

            {sub === "forbidden" && (
                <ul className="list-disc pl-5 space-y-1">
                    <li>Бусдын зураг, бичлэг ашиглах.</li>
                    <li>Нэг хүн ардаа бусдыг дагуулж нэвтрэх.</li>
                    <li>Төхөөрөмжийг гэмтээх, хүчээр онгойлгох.</li>
                    <li>Гарах товчийг хүчтэй дарах.</li>
                </ul>
            )}

            {sub === "unit" && (
                <ul className="list-disc pl-5 space-y-1">
                    <li>МТАА — системийн бүртгэл, нэвтрэх эрхийн удирдлага.</li>
                    <li>Үүдний хүлээн авагч — зочдын бүртгэл, карт олгох, буцаах.</li>
                    <li>Зөрчил гаргавал сахилгын арга хэмжээ авна.</li>
                </ul>
            )}
        </div>
    );
}
