import { useRef } from "react";
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useMotionValue,
    useVelocity,
    useAnimationFrame
} from "framer-motion";

// Helper for wrapping logic
const wrap = (min: number, max: number, v: number) => {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

interface ParallaxTextProps {
    children: string;
    baseVelocity: number;
}

function ParallaxText({ children, baseVelocity = 100 }: ParallaxTextProps) {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false
    });

    /**
     * This is a magic wrapping for the length of the text - you
     * have to replace for wrapping that works for you or dynamically
     * calculate
     */
    const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

    const directionFactor = useRef<number>(1);
    useAnimationFrame((_, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

        /**
         * This is what changes the direction of the scroll once we
         * switch scrolling directions.
         */
        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();

        baseX.set(baseX.get() + moveBy);
    });

    /**
     * The number of times to repeat the child text should be dynamic based on
     * screen size. For simplicity, we repeat 4 times here.
     */
    return (
        <div className="parallax overflow-hidden flex flex-nowrap whitespace-nowrap m-0 tracking-tighter leading-[0.8]">
            <motion.div className="scroller font-display font-bold text-6xl md:text-8xl flex whitespace-nowrap flex-nowrap uppercase" style={{ x, color: 'var(--text-primary)', opacity: 0.1 }}>
                <span className="block mr-12">{children} </span>
                <span className="block mr-12">{children} </span>
                <span className="block mr-12">{children} </span>
                <span className="block mr-12">{children} </span>
            </motion.div>
        </div>
    );
}

export const ThinkingMarquee = () => {
    return (
        <section id="thinking" className="py-24 bg-bg-main border-y overflow-hidden" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="relative rotate-[-2deg] scale-110">
                <ParallaxText baseVelocity={-2}>Runway • Commercials • Music Videos • Ushering • </ParallaxText>
                <ParallaxText baseVelocity={2}>Fashion Shows • Acting • Model Training • Content Creation •</ParallaxText>
            </div>
        </section>
    );
};
