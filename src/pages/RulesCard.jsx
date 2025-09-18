import { useState } from "react";

export default function RulesPage() {
    const [sub, setSub] = useState("goal");

    const btnStyle = (active) =>
        `flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg ${
            active
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 border border-blue-300"
        }`;

    return (
        <div className="rounded-2xl border border-blue-200 bg-white/80 shadow-lg backdrop-blur px-4 py-5 space-y-4 text-slate-800 text-sm leading-relaxed max-h-[60vh] overflow-y-auto">
            <h2 className="font-semibold text-lg">📜 Нэвтрэх системийн журам</h2>

            {/* Sub Tabs */}
            <div className="grid grid-cols-2 gap-2 sticky top-0 bg-white/80 backdrop-blur py-1 z-10">
                <button className={btnStyle(sub === "goal")} onClick={() => setSub("goal")}>
                    🎯 Зорилго
                </button>
                <button className={btnStyle(sub === "principle")} onClick={() => setSub("principle")}>
                    ⚙️ Зарчим
                </button>
                <button className={btnStyle(sub === "employee")} onClick={() => setSub("employee")}>
                    👤 Ажилтан
                </button>
                <button className={btnStyle(sub === "guest")} onClick={() => setSub("guest")}>
                    🧾 Зочин
                </button>
                <button className={btnStyle(sub === "meeting")} onClick={() => setSub("meeting")}>
                    🏛 Хурал
                </button>
                <button className={btnStyle(sub === "forbidden")} onClick={() => setSub("forbidden")}>
                    🚫 Хориглосон
                </button>
                <button className={btnStyle(sub === "notice")} onClick={() => setSub("notice")}>
                    ⚠️ Анхаарах
                </button>
                <button className={btnStyle(sub === "maintenance")} onClick={() => setSub("maintenance")}>
                    🔧 Засвар
                </button>
                <button className={btnStyle(sub === "responsibility")} onClick={() => setSub("responsibility")}>
                    📝 Хариуцлага
                </button>
                <button className={btnStyle(sub === "pdf")} onClick={() => setSub("pdf")}>
                    📂 Журам (PDF)
                </button>
            </div>

            {/* Content */}
            {sub === "goal" && <p>Байгууллагын аюулгүй ажиллагаа, эмх цэгцийг хангаж зөвхөн эрх бүхий ажилтан, зочдыг нэвтрүүлэх.</p>}
            {sub === "principle" && (
                <ul className="list-disc pl-5 space-y-1">
                    <li>Нүүр таних камер ашиглана.</li>
                    <li>Бүртгэлтэй бол хаалга онгойно, бүртгэлгүй бол "not registered".</li>
                    <li>0.3 сек таних хурд, масктай үед ч танина.</li>
                    <li>Цаг бүртгэлийн системтэй холбогдоно.</li>
                </ul>
            )}
            {sub === "employee" && <p>Ажилтан зөвхөн өөрийн давхарт, цайны газар, хурлын танхим, газрын даргын давхарт нэвтэрнэ. Нэмэлт эрх хүсэлтээр олгогдоно.</p>}
            {sub === "guest" && <p>Зочид иргэний үнэмлэхээ үзүүлж бүртгүүлнэ, зөвшөөрөл авсны дараа түр карт авч зөвшөөрөгдсөн давхарт нэвтэрнэ, карт буцаана.</p>}
            {sub === "meeting" && <p>Хурлын үед МТАА тухайн давхрын түгжээг түр идэвхгүй болгож зочдыг чөлөөтэй нэвтрүүлнэ, дуусмагц сэргээж идэвхжүүлнэ.</p>}
            {sub === "forbidden" && (
                <ul className="list-disc pl-5 space-y-1">
                    <li>Бусдын зураг ашиглан хуурах.</li>
                    <li>Ардаа бусдыг дагуулж оруулах.</li>
                    <li>Төхөөрөмжийг гэмтээх.</li>
                    <li>Карт дамжуулах.</li>
                </ul>
            )}
            {sub === "notice" && (
                <ul className="list-disc pl-5 space-y-1">
                    <li>Мэдрэгч товчийг ойроос дарахгүй байх.</li>
                    <li>Хаалгыг орж, гарах бүрдээ хаах.</li>
                    <li>Эвдрэл гарвал МТАА-нд даруй мэдэгдэх.</li>
                </ul>
            )}
            {sub === "maintenance" && <p>Электрон системийг МТАА, механик засварыг Нийтлэг үйлчилгээний алба хариуцна. Эвдрэл мэдээллийг нэгжийн дарга/инженер дамжуулна.</p>}
            {sub === "responsibility" && <p>Журам зөрчсөн тохиолдолд сахилгын шийтгэл, давтан зөрчилд эрх хасах, санаатай эвдрэлд зардлыг нөхөн төлүүлнэ.</p>}

            {sub === "pdf" && (
                <div className="w-full h-[25vh]">
                    <iframe
                        src="/docs/rules.pdf"
                        title="Rules PDF"
                        className="w-full h-full rounded-lg border"
                    ></iframe>
                </div>
            )}
        </div>
    );
}
