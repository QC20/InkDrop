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

// Add this new code at the end of the file
const images = [
    'src/assets/img/1.jpg',
    'src/assets/img/2.png',
    'src/assets/img/3.jpg',
    'src/assets/img/4.jpg',
    'src/assets/img/5.jpg'
];

let currentImageIndex = 0;
const carouselImage = document.getElementById('carousel-image');

function changeImage() {
    const nextImageIndex = (currentImageIndex + 1) % images.length;
    const nextImage = new Image();
    nextImage.src = images[nextImageIndex];
    
    nextImage.onload = () => {
        // Fade out current image
        carouselImage.style.transition = 'opacity 1s';
        carouselImage.style.opacity = 0;
        
        setTimeout(() => {
            // Change image source
            carouselImage.setAttribute('href', images[nextImageIndex]);
            
            // Fade in new image
            carouselImage.style.opacity = 1;
            
            currentImageIndex = nextImageIndex;
        }, 1000);
    };
}

// Start the carousel
setInterval(changeImage, 7000);

// Trigger the displacement animation
if (isEdge) {
    const anima = animate({ attrName: "scale", dur, from, to, repeatCount: Infinity });
    anima(document.querySelector("#inkyFilter feDisplacementMap"));
} else {
    const feDM = document.querySelector("#inkyFilter feDisplacementMap");
    feDM.insertAdjacentHTML("beforeend", `<animate attributeType="XML" attributeName="scale" 
  from="${-from}" to="${-to}" dur="${dur}s" fill="freeze" repeatCount="indefinite"/>`);
}