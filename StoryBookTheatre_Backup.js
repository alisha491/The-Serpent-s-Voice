// --- Component: Interactive Storybook Theatre ---
const StoryBookTheatre = ({ snakes }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(1); // 1 = next, -1 = prev
    const stageRef = useRef(null);

    // Asset Mapping (Normalized logic based on file structure)
    const assets = [
        { folder: '白梅花蛇', bg: '2背景.png', back: '3後面植物.png', snake: '5蛇.png', front: '6前面植物.png' }, // 0: 白梅花
        { folder: '赤尾青竹絲', bg: '2背景.png', back: '3後植物.png', snake: '5蛇.png', front: '6前植物.png' },   // 1: 赤尾 (Check index mapping!)
        { folder: '百步蛇', bg: '1地板.png', back: '2後植物.png', snake: '5蛇.png', front: '6前植物.png' },        // 2: 百步 (Actually bg might be 2背景 if available, but list said 1地板)
        { folder: '眼鏡蛇', bg: '2背景.png', back: '3後植物.png', snake: '6蛇.png', front: '8前植物.png' },        // 3: 眼鏡 (Snake is 6, Front is 8)
        { folder: '鎖鏈蛇', bg: '1背景.png', back: '3後面植物.png', snake: '5蛇.png', front: '8最前面植物.png' },   // 4: 鎖鏈
        { folder: '紅竹', bg: '2背景.png', back: '3後面植物.png', snake: '5蛇.png', front: '6前面植物.png' },        // 5: 紅竹
        { folder: '金絲蛇', bg: '1背景.png', back: '3後面植物_2.png', snake: '5蛇.png', front: '6前植物.png' },     // 6: 金絲
    ];

    // Ensure we don't crash if index mismatch
    const currentAssets = assets[currentIndex] || assets[0];
    const currentSnake = snakes[currentIndex];

    // Animation for Scene Switch
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Reset elements
            gsap.set(".theater-layer", { clearProps: "all" });

            // Entrance Animation
            const tl = gsap.timeline();

            // 1. Background Fade In
            tl.fromTo(".layer-bg",
                { opacity: 0, scale: 1.1 },
                { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }
            );

            // 2. Plants "Grow" (Pop up)
            tl.fromTo(".layer-back",
                { y: 100, opacity: 0, scaleY: 0, transformOrigin: "bottom center" },
                { y: 0, opacity: 1, scaleY: 1, duration: 0.8, ease: "back.out(1.7)" },
                "-=0.8"
            );

            tl.fromTo(".layer-front",
                { y: 150, opacity: 0, scaleY: 0, transformOrigin: "bottom center" },
                { y: 0, opacity: 1, scaleY: 1, duration: 0.8, ease: "back.out(1.7)" },
                "-=0.6"
            );

            // 3. Snake Float
            tl.fromTo(".layer-snake",
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
                "-=0.6"
            );

            // Continuous Float for snake
            gsap.to(".layer-snake", {
                y: -15,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: 1
            });

        }, stageRef);
        return () => ctx.revert();
    }, [currentIndex]);

    // Mouse Parallax
    const handleMouseMove = (e) => {
        if (!stageRef.current) return;
        const { left, top, width, height } = stageRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;

        gsap.to(".layer-back", { x: x * -30, y: y * -10, duration: 1 });
        gsap.to(".layer-snake", { x: x * -50, y: y * -20, duration: 1 });
        gsap.to(".layer-front", { x: x * -80, y: y * -30, duration: 1 });
    };

    const nextScene = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % snakes.length);
    };

    const prevScene = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + snakes.length) % snakes.length);
    };

    return (
        <div
            ref={stageRef}
            className="relative w-full h-[90vh] overflow-hidden bg-[#0F1115] select-none"
            onMouseMove={handleMouseMove}
        >
            {/* Atmospheric Gradient Background (Changes with snake color) */}
            <div
                className="absolute inset-0 transition-colors duration-1000"
                style={{
                    background: `radial-gradient(circle at center, ${currentSnake.color}20 0%, #0F1115 80%)`
                }}
            />

            {/* Stage Layers Container */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full max-w-7xl mx-auto theater-stage">

                    {/* 1. Background Layer */}
                    <div className="theater-layer layer-bg absolute inset-0 flex items-center justify-center">
                        <img
                            src={`./${currentAssets.folder}/${currentAssets.bg}`}
                            className="w-full h-full object-cover opacity-60 mix-blend-screen"
                            alt="background"
                        />
                    </div>

                    {/* 2. Back Plants */}
                    <div className="theater-layer layer-back absolute inset-0 flex items-end justify-center pb-20 z-10">
                        <img
                            src={`./${currentAssets.folder}/${currentAssets.back}`}
                            className="w-[90%] md:w-[70%] object-contain max-h-[70vh]"
                            alt="habitat"
                        />
                    </div>

                    {/* 3. Snake (Hero) */}
                    <div className="theater-layer layer-snake absolute inset-0 flex items-center justify-center z-20 pt-10">
                        <img
                            src={`./${currentAssets.folder}/${currentAssets.snake}`}
                            className="w-[80%] md:w-[50%] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                            alt="snake"
                        />
                    </div>

                    {/* 4. Front Plants */}
                    <div className="theater-layer layer-front absolute inset-0 flex items-end justify-center z-30 pointer-events-none">
                        <img
                            src={`./${currentAssets.folder}/${currentAssets.front}`}
                            className="w-full md:w-[90%] object-contain max-h-[60vh] translate-y-20 blur-[1px]"
                            alt="foreground"
                        />
                    </div>

                </div>
            </div>

            {/* UI Overlay: Dialogue Box */}
            <div className="absolute bottom-10 right-10 md:bottom-20 md:right-20 z-40 max-w-md">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group hover:bg-white/20 transition-all">
                    <div className="absolute top-0 left-0 w-2 h-full transition-colors duration-500" style={{ background: currentSnake.color }}></div>
                    <Quote size={48} className="text-white/20 absolute top-4 right-4" />

                    <h3 className="text-2xl font-bold text-white mb-2">{currentSnake.name}</h3>
                    <p className="text-gray-300 font-mono text-sm leading-relaxed min-h-[80px]">
                        {currentSnake.intro || "..."}
                    </p>

                    <div className="flex justify-between items-center mt-6">
                        <span className="text-xs text-white/40 tracking-widest uppercase">{currentSnake.eng}</span>
                        <div className="flex gap-2">
                            <button onClick={prevScene} className="p-2 rounded-full hover:bg-white/20 text-white transition-all"><ChevronLeft /></button>
                            <button onClick={nextScene} className="p-2 rounded-full hover:bg-white/20 text-white transition-all"><ChevronRight /></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Title / Chapter Indicator */}
            <div className="absolute top-10 left-10 z-40">
                <div className="text-white/30 font-bold text-6xl md:text-8xl opacity-10 select-none">
                    0{currentIndex + 1}
                </div>
                <div className="text-white font-serif italic text-xl -mt-4 ml-2">The Habitat</div>
            </div>
        </div>
    );
};
