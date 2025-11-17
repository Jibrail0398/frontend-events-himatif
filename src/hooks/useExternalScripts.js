import { useEffect } from "react";

export const useExternalScripts = (scripts, appendIn = "body") => {
    useEffect(() => {
        scripts.forEach((src) => {
            const script = document.createElement("script");
            script.src = src;
            script.async = true;

            if (appendIn === "body") {
                document.body.appendChild(script);
            } else if (appendIn === "head") {
                document.head.appendChild(script);
            }
        });
        return () => {
            scripts.forEach((src) => {
                const script = document.querySelector(`script[src="${src}"]`);
                if (script) {
                    if (appendIn === "body") {
                        document.body.removeChild(script);
                    } else if (appendIn === "head") {
                        document.head.removeChild(script);
                    }
                }
            });
        };
    }, []);
};
