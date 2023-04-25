/* ----------- 
LOADING PAGE
----------- */

// Styles
import "../../styles/Loading.css";

export default function Loading({ show }) {
    return (
        // Loading Page gets prop "show". If it exists, the component appears
        <main className={show ? "loading-page show" : "loading-page"}>
            <section className="loader-circle">
                {/* create 12 lines that will move around a circle */}
                {Array.from({ length: 12 }, (_, i) => i + 1).map((loaderStick, i) => {
                    // angle to place each line around the center point
                    const rotateAngle = `${i * 30}deg`;
                    // delay to show/hide each loading line in sequence
                    const appearanceDelay = `${0.1 + i * 0.1}s`;
                    return (
                        <div
                            key={i}
                            className="loader-stick"
                            style={{
                                transform: `rotate(${rotateAngle}) translate(0, -130%)`,
                                animationDelay: `${appearanceDelay}`,
                            }}></div>
                    );
                })}
                <div className="loader-text">Loading...</div>
            </section>
        </main>
    );
}
