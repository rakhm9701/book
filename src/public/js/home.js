// console.log("Home frontend javascript file");

// function fitElementToParent(el, padding) {
//   let timeout = null;

//   function resize() {
//     if (timeout) clearTimeout(timeout);
//     anime.set(el, { scale: 1 });
//     let pad = padding || 0,
//       parentEl = el.parentNode,
//       elOffsetWidth = el.offsetWidth - pad,
//       parentOffsetWidth = parentEl.offsetWidth,
//       ratio = parentOffsetWidth / elOffsetWidth;
//     timeout = setTimeout(anime.set(el, { scale: ratio }), 10);
//   }

//   resize();
//   window.addEventListener("resize", resize);
// }

// (function () {
//   const sphereEl = document.querySelector(".sphere-animation"),
//     spherePathEls = sphereEl.querySelectorAll(".sphere path"),
//     pathLength = spherePathEls.length,
//     animations = [];

//   fitElementToParent(sphereEl);

//   const breathAnimation = anime({
//     begin: function () {
//       for (let i = 0; i < pathLength; i++) {
//         animations.push(
//           anime({
//             targets: spherePathEls[i],
//             stroke: {
//               value: ["rgba(255,75,75,1)", "rgba(80,80,80,.35)"],
//               duration: 500,
//             },
//             translateX: [2, -4],
//             translateY: [2, -4],
//             easing: "easeOutQuad",
//             autoplay: false,
//           })
//         );
//       }
//     },
//     update: function (ins) {
//       animations.forEach(function (animation, i) {
//         let percent = (1 - Math.sin(i * 0.35 + 0.0022 * ins.currentTime)) / 2;
//         animation.seek(animation.duration * percent);
//       });
//     },
//     duration: Infinity,
//     autoplay: false,
//   });

//   const introAnimation = anime
//     .timeline({
//       autoplay: false,
//     })
//     .add(
//       {
//         targets: spherePathEls,
//         strokeDashoffset: {
//           value: [anime.setDashoffset, 0],
//           duration: 3900,
//           easing: "easeInOutCirc",
//           delay: anime.stagger(190, { direction: "reverse" }),
//         },
//         duration: 2000,
//         delay: anime.stagger(60, { direction: "reverse" }),
//         easing: "linear",
//       },
//       0
//     );

//   const shadowAnimation = anime(
//     {
//       targets: "#sphereGradient",
//       x1: "25%",
//       x2: "25%",
//       y1: "0%",
//       y2: "75%",
//       duration: 30000,
//       easing: "easeOutQuint",
//       autoplay: false,
//     },
//     0
//   );

//   function init() {
//     introAnimation.play();
//     breathAnimation.play();
//     shadowAnimation.play();
//   }

//   init();
// })();


    const wrapperEl = document.querySelector(".wrapper");
    const numberOfEls = 90;
    const duration = 6000;
    const delay = duration / numberOfEls;

    let tl = anime.timeline({
      duration: delay,
      complete: function () {
        tl.restart();
      },
    });

    function createEl(i) {
      let el = document.createElement("div");
      const rotate = (360 / numberOfEls) * i;
      const translateY = -50;
      const hue = Math.round((360 / numberOfEls) * i);
      el.classList.add("el");
      el.style.backgroundColor = "hsl(" + hue + ", 40%, 60%)";
      el.style.transform =
        "rotate(" + rotate + "deg) translateY(" + translateY + "%)";
      tl.add({
        begin: function () {
          anime({
            targets: el,
            backgroundColor: [
              "hsl(" + hue + ", 40%, 60%)",
              "hsl(" + hue + ", 60%, 80%)",
            ],
            rotate: [rotate + "deg", rotate + 10 + "deg"],
            translateY: [translateY + "%", translateY + 10 + "%"],
            scale: [1, 1.25],
            easing: "easeInOutSine",
            direction: "alternate",
            duration: duration * 0.1,
          });
        },
      });
      wrapperEl.appendChild(el);
    }

    for (let i = 0; i < numberOfEls; i++) createEl(i);