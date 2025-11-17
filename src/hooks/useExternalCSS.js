import { useEffect } from "react";

export const useExternalCSS = (hrefs = []) => {
    useEffect(() => {
        hrefs.forEach((href) => {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = href;
            document.head.appendChild(link);
        });
        return () => {
            hrefs.forEach((href) => {
                const link = document.querySelector(`link[href="${href}"]`);
                if (link) {
                    document.head.removeChild(link);
                }
            });
        };
    }, []);
};
