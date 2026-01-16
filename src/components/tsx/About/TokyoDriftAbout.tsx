import React from "react";
import { motion } from "framer-motion";
import { useYOLI } from "@/modules/YOLI/injector";

/**
 * TokyoDriftAbout Component
 * 
 * High-energy "Tokyo Drift" themed page for the "About Us" section.
 * Featuring neon effects, tilted sections (skew), and motion animations.
 * 
 * @component
 */
interface Props {
    lang: string;
}

const TokyoDriftAbout: React.FC<Props> = ({ lang }) => {
    const t = (key: string) => useYOLI(lang)(key);

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden relative font-sans selection:bg-yellow-400 selection:text-black">
            {/* Import Graffiti Font */}
            <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap" rel="stylesheet" />

            {/* Background Decor - Urban / Distressed */}
            <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#333_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                {/* Splatters */}
                <div className="absolute top-10 right-[-50px] w-64 h-64 bg-pink-600/20 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-20 left-[-50px] w-80 h-80 bg-cyan-600/20 blur-[100px] rounded-full"></div>
            </div>

            {/* Hero Section - GIF Background + Tagging */}
            <section className="relative h-[85vh] flex items-center justify-center border-b-[6px] border-double border-pink-600">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/img/about/drift_car.gif"
                        className="w-full h-full object-cover opacity-60 grayscale-[0.2]"
                        alt="Tokyo Drift Background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="z-10 text-center px-4"
                >
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none mb-4" style={{ fontFamily: "'Permanent Marker', cursive" }}>
                        <span className="relative inline-block transform -rotate-2 text-yellow-400 drop-shadow-[6px_6px_0px_rgba(255,0,0,1)]">
                            {t("about.title")}
                            {/* Drip Effect */}
                            <div className="absolute bottom-[-15px] left-4 w-2.5 h-14 bg-yellow-400 rounded-b-full animate-drip"></div>
                            <div className="absolute bottom-[-25px] left-24 w-2 h-20 bg-yellow-400 rounded-b-full animate-drip" style={{ animationDelay: '0.7s' }}></div>
                        </span>
                    </h1>
                    <div className="mt-12 bg-pink-600 inline-block px-6 py-2 skew-x-[-15deg] border-2 border-white shadow-[10px_10px_0px_#000]">
                        <p className="text-xl md:text-3xl font-black tracking-widest text-white uppercase italic">
                            {t("about.subtitle")}
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* Who We Are - Tagged Section */}
            <section className="relative py-32 px-6">
                <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute -top-16 -left-12 text-9xl opacity-10 font-black italic whitespace-nowrap pointer-events-none select-none uppercase" style={{ fontFamily: "'Permanent Marker', cursive" }}>
                            UNDERGROUND
                        </div>

                        <h2 className="text-6xl font-black mb-10 text-white uppercase italic tracking-tight" style={{ fontFamily: "'Permanent Marker', cursive" }}>
                            <span className="text-cyan-400">#</span> {t("about.who_we_are_title")}
                        </h2>
                        <div className="relative p-10 border-l-[6px] border-yellow-400 bg-white/5 backdrop-blur-md">
                            <p className="text-2xl leading-relaxed text-slate-100 font-medium">
                                {t("about.who_we_are_text")}
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        className="relative group"
                    >
                        <div className="absolute -inset-4 border-2 border-pink-500 rotate-3 translate-x-3 translate-y-3 opacity-60"></div>
                        <div className="absolute -inset-4 border-2 border-cyan-500 -rotate-2 -translate-x-2 translate-y-2 opacity-60"></div>

                        <div className="relative aspect-video overflow-hidden rounded-sm border-4 border-white shadow-[20px_20px_0px_rgba(236,72,153,0.4)]">
                            <img
                                src="/img/about/tokyo_walk.gif"
                                alt="Tokyo Streets Walking"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay"></div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-32 bg-[#080808] relative overflow-hidden border-t-2 border-slate-900 border-dashed">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
                    <motion.div
                        initial={{ rotate: -8, opacity: 0 }}
                        whileInView={{ rotate: -3, opacity: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute -inset-6 bg-yellow-400/5 -rotate-3"></div>
                        <img
                            src="/img/about/garage_1.png"
                            alt="The Hideout"
                            className="relative rounded-sm shadow-2xl border-4 border-slate-800 grayscale hover:grayscale-0 transition-all duration-700 brightness-75 group-hover:brightness-100"
                        />
                        <div className="absolute -top-6 -right-6 bg-yellow-400 text-black p-4 font-black italic text-xl border-4 border-black rotate-12 shadow-xl">
                            TOP SECRET
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl font-black mb-12 text-pink-500 uppercase italic tracking-widest flex items-center gap-6" style={{ fontFamily: "'Permanent Marker', cursive" }}>
                            <div className="w-16 h-1.5 bg-pink-500"></div>
                            {t("about.mission_title")}
                        </h2>
                        <p className="text-3xl font-black leading-tight text-white italic drop-shadow-md">
                            "{t("about.mission_text")}"
                        </p>
                        <div className="mt-12 flex gap-6">
                            <div className="w-4 h-4 rounded-sm bg-pink-600 animate-bounce"></div>
                            <div className="w-4 h-4 rounded-sm bg-cyan-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-4 h-4 rounded-sm bg-yellow-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Final Call */}
            <section className="relative py-56 text-center overflow-hidden border-t-[10px] border-double border-yellow-400">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/70 z-10"></div>
                    <img src="/img/about/city_1.png" className="w-full h-full object-cover grayscale brightness-[0.3]" alt="The City" />
                </div>

                <div className="container mx-auto px-6 relative z-20">
                    <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", bounce: 0.5 }}
                    >
                        <h2 className="text-8xl md:text-[10rem] font-black mb-12 text-white uppercase italic tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] leading-none" style={{ fontFamily: "'Permanent Marker', cursive" }}>
                            {t("about.join_title")}
                        </h2>
                        <div className="max-w-3xl mx-auto mb-20 relative transform rotate-1">
                            <div className="absolute -inset-4 bg-white z-0 -rotate-1 border-4 border-black"></div>
                            <p className="relative z-10 text-3xl text-black font-black uppercase italic p-6">
                                {t("about.join_text")}
                            </p>
                        </div>

                        <a
                            href={`/${lang}/products/allproducts`}
                            className="group relative inline-block px-20 py-8 bg-cyan-400 text-black font-black italic tracking-[0.3em] text-xl uppercase transition-all duration-300 transform border-[5px] border-black hover:bg-yellow-400 hover:-translate-y-4 hover:rotate-2 active:translate-y-0"
                        >
                            <span className="relative z-10">BURNOUT START</span>
                            <div className="absolute top-0 left-0 w-full h-full bg-pink-600 -z-10 transition-transform translate-x-3 translate-y-3 group-hover:translate-x-6 group-hover:translate-y-6"></div>
                        </a>
                    </motion.div>
                </div>

                {/* Spray Particles */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(40)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                bottom: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                width: `${Math.random() * 10 + 4}px`,
                                height: `${Math.random() * 10 + 4}px`,
                                backgroundColor: i % 3 === 0 ? '#ec4899' : (i % 3 === 1 ? '#22d3ee' : '#facc15'),
                                opacity: Math.random() * 0.4,
                                filter: 'blur(3px)',
                                animation: `spray ${Math.random() * 6 + 4}s linear infinite`
                            }}
                        />
                    ))}
                </div>
            </section>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes drip {
            0% { height: 0; opacity: 1; }
            70% { height: 80px; opacity: 1; }
            100% { height: 120px; opacity: 0; }
        }
        @keyframes spray {
            0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
            20% { opacity: 0.5; }
            80% { opacity: 0.5; }
            100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        .animate-drip {
            animation: drip 4s ease-in infinite;
        }
      `}} />
        </div>
    );
};

export default TokyoDriftAbout;
