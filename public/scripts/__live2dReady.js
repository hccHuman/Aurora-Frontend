window.__live2dReady = new Promise((resolve) => {
    const checkLive2D = () => {
        if (
            typeof window.Live2D !== "undefined" &&
            typeof window.Live2DCubismCore !== "undefined"
        ) {
            console.log("✅ Live2D globals initialized");
            resolve(true);
        } else {
            setTimeout(checkLive2D, 50);
        }
    };
    checkLive2D();
});