export default function Home() {
    return (
        <main className="bg-white min-h-screen">
            {/* Hero */}
            <div className="relative bg-primary">
                <div className="flex mx-auto py-10 max-w-7xl">
                    <div className="space-y-10 w-1/2 text-white">
                        <h1 className="font-extrabold text-5xl leading-tight">
                            <span className="text-white">Learning with </span>{' '}
                            <span className="text-orange-400"> Intelligent Tutoring Systems </span>{' '}
                            <span className="text-white">is now</span>{' '}
                            <span className="block text-white/90">easier than ever</span>
                        </h1>
                        <p className="mt-6 max-w-xl text-white/90">
                            ITS is an AI-powered tutoring platform designed to personalize learning and help every
                            student improve more effectively.
                        </p>

                        <div className="flex items-center gap-4 mt-8">
                            <a
                                href="#"
                                className="inline-block bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-full font-medium text-white"
                            >
                                Start now
                            </a>
                        </div>
                    </div>

                    <div className="flex justify-center lg:justify-end w-full lg:w-1/2">
                        <div className="relative w-[360px] lg:w-[480px] h-[480px] lg:h-[560px] overflow-hidden">
                            <img src="/people.png" alt="student" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Features */}
            <section className="pt-8 pb-20">
                <div className="mx-auto px-6 max-w-4xl text-center">
                    <h2 className="font-extrabold text-2xl sm:text-3xl">
                        All-In-One <span className="text-primary">Intelligent Learning Platform</span>.
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-slate-500 text-sm">
                        ITS provides a powerful suite of AI-driven tools that support personalized learning, automatic
                        assessment, progress tracking, and classroom management for schools, tutors, and students.
                    </p>
                </div>

                <div className="gap-8 grid grid-cols-1 sm:grid-cols-3 mx-auto mt-12 px-6 max-w-6xl">
                    <div className="bg-white shadow-lg p-8 rounded-2xl">
                        <h3 className="mb-2 font-semibold">Smart Assessments & Feedback</h3>
                        <p className="text-slate-500 text-sm">
                            Generate quizzes automatically, evaluate answers instantly, and give detailed AI feedback
                            tailored to each learner.
                        </p>
                    </div>

                    <div className="bg-white shadow-lg p-8 rounded-2xl">
                        <h3 className="mb-2 font-semibold">Adaptive Scheduling & Progress Tracking</h3>
                        <p className="text-slate-500 text-sm">
                            ITS tracks learning behavior and recommends the best study paths, helping teachers and
                            learners monitor improvement over time.
                        </p>
                    </div>

                    <div className="bg-white shadow-lg p-8 rounded-2xl">
                        <h3 className="mb-2 font-semibold">Student Performance Insights</h3>
                        <p className="text-slate-500 text-sm">
                            Understand strengths, weaknesses, study habits, and predicted outcomes through AI-based
                            analytics dashboards.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
