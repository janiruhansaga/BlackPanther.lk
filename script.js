// 1. Plugin එක Register කිරීම
gsap.registerPlugin(ScrollTrigger);

// 2. Three.js Space Background
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg-canvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const starGeo = new THREE.BufferGeometry();
const starCount = 6000;
const posArray = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) posArray[i] = (Math.random() - 0.5) * 100;
starGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const starMat = new THREE.PointsMaterial({ size: 0.02, color: 0xffffff });
const starMesh = new THREE.Points(starGeo, starMat);
scene.add(starMesh);
camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    starMesh.rotation.y += 0.0005;
    starMesh.rotation.x += 0.0002;
    renderer.render(scene, camera);
}
animate();

// 3. Loader සහ Audio Logic
window.addEventListener('load', () => {
    const percentElement = document.getElementById('load-percentage');
    let count = 0;

    const counter = setInterval(() => {
        count++;
        if (percentElement) percentElement.innerText = count + "%";

        if (count >= 100) {
            clearInterval(counter);
            gsap.to("#loader", {
                opacity: 0,
                duration: 1,
                delay: 0.5,
                onComplete: () => {
                    document.querySelector("#loader").style.display = "none";
                    if (typeof typeLog === "function") setTimeout(typeLog, 500);
                    startAudioSequence();
                }
            });
        }
    }, 30);
});

function startAudioSequence() {
    const startupSound = document.getElementById('boot-sound');
    const welcomeVoice = document.getElementById('welcome-voice');
    const bgMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-control');
const musicIcon = document.getElementById('music-icon');
let isMuted = false; // මියුසික් එක නතර කරලාද කියලා බලන flag එක
// මියුසික් පාලනය කරන බටන් එකේ වැඩකිඩ
if (musicBtn) {
    musicBtn.addEventListener('click', () => {
        isMuted = !isMuted; // තත්ත්වය මාරු කරනවා (Toggle)

        if (isMuted) {
            // ඔක්කොම සද්ද නතර කරනවා
            if (startupSound) startupSound.pause();
            if (welcomeVoice) welcomeVoice.pause();
            if (bgMusic) bgMusic.pause();
            
            // Icon එක සහ පෙනුම වෙනස් කිරීම
            musicIcon.classList.replace('fa-volume-up', 'fa-volume-mute');
            musicBtn.style.borderColor = "#ff0000";
            musicBtn.style.color = "#ff0000";
            musicBtn.style.boxShadow = "0 0 10px #ff0000";
        } else {
            // ආයෙත් ප්ලේ කරනවා නම් (සාමාන්‍යයෙන් background music එක විතරක්)
            if (bgMusic) {
                bgMusic.volume = 0.2;
                bgMusic.play();
            }
            musicIcon.classList.replace('fa-volume-mute', 'fa-volume-up');
            musicBtn.style.borderColor = "#00ff00";
            musicBtn.style.color = "#00ff00";
            musicBtn.style.boxShadow = "0 0 10px #00ff00";
        }
    });
}
    if (startupSound) {
        startupSound.play().catch(() => console.log("Click page for audio"));
        setTimeout(() => {
            let fadeOut = setInterval(() => {
                if (startupSound.volume > 0.1) startupSound.volume -= 0.1;
                else { clearInterval(fadeOut); startupSound.pause(); }
            }, 200);
        }, 10000);
    }

    if (welcomeVoice) {
        welcomeVoice.play();
        welcomeVoice.onended = () => {
            if (bgMusic) { bgMusic.volume = 0.2; bgMusic.play(); }
        };
    }
}

// 4. Ability Bars Animation (වැදගත්ම කොටස)
// පේජ් එක load වුණාම සහ Scroll කරනකොට මේක වැඩ කරනවා
const initAnimations = () => {
    // Ability Bars පිරවීම
    gsap.utils.toArray(".fill, .bar-fill").forEach(bar => {
        const targetWidth = bar.getAttribute("data-width");
        gsap.to(bar, {
            scrollTrigger: {
                trigger: bar,
                start: "top 95%",
                toggleActions: "play none none reverse"
            },
            width: targetWidth,
            duration: 2,
            ease: "power4.out"
        });
    });

    // Reveal elements
    gsap.utils.toArray(".reveal").forEach(el => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: "top 85%" },
            opacity: 0, y: 50, duration: 1.2
        });
    });
};
window.addEventListener('load', initAnimations);

// 5. Custom Cursor Logic
window.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector(".custom-cursor");
    if (cursor) {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: "power2.out"
        });
    }
});

// 6. Terminal & Form Logic (පරණ කෝඩ් එකමයි)
const logs = ["Initializing Vibranium firewall...", "Scanning for threats...", "Status: OPTIMAL."];
let logIndex = 0, charIndex = 0;
function typeLog() {
    const el = document.getElementById("typewriter");
    if (el && logIndex < logs.length) {
        if (charIndex < logs[logIndex].length) {
            el.innerHTML += logs[logIndex].charAt(charIndex);
            charIndex++; setTimeout(typeLog, 50);
        } else { setTimeout(eraseLog, 2000); }
    }
}
function eraseLog() {
    const el = document.getElementById("typewriter");
    if (charIndex > 0) {
        el.innerHTML = logs[logIndex].substring(0, charIndex - 1);
        charIndex--; setTimeout(eraseLog, 20);
    } else { logIndex = (logIndex + 1) % logs.length; setTimeout(typeLog, 500); }
}