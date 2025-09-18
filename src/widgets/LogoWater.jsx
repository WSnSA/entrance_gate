import logo from '../assets/logo.png';

function LogoWater() {
    return (
        <div className="flex items-center flex-col gap-2">
            <img src={logo} alt="Logo" className="w-40 mb-10" />
            <h1 className="text-xl font-bold uppercase text-slate-800 dark:text-slate-100">
                Ус сувгийн удирдах газар
            </h1>
        </div>
    );
}

export default LogoWater;
