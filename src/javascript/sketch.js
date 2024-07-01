// shim svg smil anima
function animate({ attrName, from, to, dur /*s*/ = 1, repeatCount = 1 }) {
    return function (feElm) {
        let t0 = -1;
        let passed = 0;
        let repeated = 0;

        requestAnimationFrame(ts => {
            t0 = ts;
            requestAnimationFrame(function tick(ts) {

                if (repeated == repeatCount) {
                    return; // stop animation
                }

                requestAnimationFrame(tick);

                const dt = (ts - t0) / 1000;

                passed += dt;
                let ratio = passed / dur;
                if (ratio >= 1) {
                    ratio = 1;
                    passed = 0;
                    repeated += 1;
                }

                const value = (to - from) * ratio; // linear intepolation
                feElm.setAttribute(attrName, value.toString(10));

                t0 = ts;
            });
        });
    };
}

const isEdge = /Edge/.test(navigator.userAgent);
const from = 10;
const to = 500;
const dur = 3;

// displacement y is diff between edge and ff(&chrome)
// Two possible reasons
// - ff feColorMatrix is not clamped to 1 but repeated from 0 
//   so displacement y is upward due to R < 0.5
// - ff feDisplacementMap coord sys origin at bottom left

if (isEdge) {
    const anima = animate({ attrName: "scale", dur, from, to, repeatCount: 1 });
    anima(document.querySelector("#inkyFilter feDisplacementMap"));
} else {
    const feDM = document.querySelector("#inkyFilter feDisplacementMap");
    feDM.insertAdjacentHTML("beforeend", `<animate attributeType="XML" attributeName="scale" 
  from="${-from}" to="${-to}" dur="${dur}s" fill="freeze" repeatCount="1"/>`);
}
