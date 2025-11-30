export default function Home() {
    return (
        <main className="bg-white min-h-screen">
            {/* Hero */}
            <div className="relative bg-primary">
                <div className="flex lg:flex-row flex-col-reverse items-center gap-12 mx-auto px-6 py-10 max-w-7xl">
                    <div className="w-full lg:w-1/2 text-white">
                        <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-tight">
                            <span className="text-orange-400">Studying</span>{' '}
                            <span className="text-white">Online is now</span>{' '}
                            <span className="block text-white/90">much easier</span>
                        </h1>
                        <p className="mt-6 max-w-xl text-white/90 text-sm sm:text-base">
                            TOTC is an interesting platform that will teach you in more an interactive way
                        </p>

                        <div className="flex items-center gap-4 mt-8">
                            <a
                                href="#"
                                className="inline-block bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-full font-medium text-white"
                            >
                                Start now
                            </a>
                        </div>

                        {/* small stat cards */}
                        <div className="gap-4 grid grid-cols-2 mt-12 max-w-md">
                            <div className="bg-white/90 shadow-md p-4 rounded-xl text-teal-700">
                                <div className="font-semibold text-xs">250k</div>
                                <div className="text-slate-600 text-sm">Assisted Student</div>
                            </div>
                            <div className="bg-white/90 shadow-md p-4 rounded-xl text-slate-700">
                                <div className="font-semibold text-xs">User Experience Class</div>
                                <div className="text-slate-600 text-sm">Today at 12.00 PM</div>
                                <button className="inline-block bg-pink-500 mt-3 px-3 py-1 rounded-full text-white text-sm">
                                    Join Now
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center lg:justify-end w-full lg:w-1/2">
                        <div className="relative shadow-2xl rounded-[30%] w-[360px] lg:w-[480px] h-[480px] lg:h-[560px] overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=0b5b3b6d6b6ee6b8f4b6b6b6b6b6b6b6"
                                alt="student"
                                className="w-full h-full object-cover"
                            />

                            {/* floating notification */}
                            <div className="bottom-6 left-6 absolute bg-white shadow-md p-4 rounded-xl w-44">
                                <div className="font-semibold text-slate-800 text-sm">Congratulations</div>
                                <div className="text-slate-500 text-xs">Your admission completed</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features */}
            <section className="pt-8 pb-20">
                <div className="mx-auto px-6 max-w-4xl text-center">
                    <h2 className="font-extrabold text-2xl sm:text-3xl">
                        All-In-One <span className="text-teal-500">Cloud Software</span>.
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-slate-500 text-sm">
                        TOTC is one powerful online software suite that combines all the tools needed to run a
                        successful school or office.
                    </p>
                </div>

                <div className="gap-8 grid grid-cols-1 sm:grid-cols-3 mx-auto mt-12 px-6 max-w-6xl">
                    <div className="bg-white shadow-lg p-8 rounded-2xl">
                        <div className="flex justify-center items-center bg-indigo-100 mb-4 rounded-full w-12 h-12">
                            📄
                        </div>
                        <h3 className="mb-2 font-semibold">Online Billing, Invoicing, & Contracts</h3>
                        <p className="text-slate-500 text-sm">
                            Simple and secure control of your organization's financial and legal transactions. Send
                            customized invoices and contracts
                        </p>
                    </div>

                    <div className="bg-white shadow-lg p-8 rounded-2xl">
                        <div className="flex justify-center items-center bg-emerald-100 mb-4 rounded-full w-12 h-12">
                            📅
                        </div>
                        <h3 className="mb-2 font-semibold">Easy Scheduling & Attendance Tracking</h3>
                        <p className="text-slate-500 text-sm">
                            Schedule and reserve classrooms at one campus or multiple campuses. Keep detailed records of
                            student attendance
                        </p>
                    </div>

                    <div className="bg-white shadow-lg p-8 rounded-2xl">
                        <div className="flex justify-center items-center bg-sky-100 mb-4 rounded-full w-12 h-12">
                            👥
                        </div>
                        <h3 className="mb-2 font-semibold">Customer Tracking</h3>
                        <p className="text-slate-500 text-sm">
                            Automate and track emails to individuals or groups. Skilline's built-in system helps
                            organize your organization.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
