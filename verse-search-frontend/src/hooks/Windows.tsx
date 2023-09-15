import { useState, useEffect } from 'react';



export function useWindowSize() {
    const [windowSize, setWindowSize] = useState<number>(0);

    useEffect(() => {
        window.addEventListener("resize", () => {
            setWindowSize(window.innerWidth);
        });
        return () => {
            window.removeEventListener("resize", () => {
                setWindowSize(window.innerWidth);
            })
        }
    }, []);

    return windowSize;
}

export function useIsMobile(maxMobileSize: number) {
    const windowSize = useWindowSize();
    const [isMobile, setIsMobile] = useState<boolean>(true);
    useEffect(() => {
        setIsMobile(windowSize <= maxMobileSize);
    }, [windowSize])
    return isMobile;
}