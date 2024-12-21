const $ = el => document.querySelector(el);
const $$ = el => document.querySelectorAll(el);
const $main = $('.container');

const nextImage = () => {
  const $cards = $$('.card');
  $main.appendChild($cards[0]);
};

const prevImage = () => {
  const $cards = $$('.card');
  const $lastCard = $cards[$cards.length - 1];
  $main.prepend($lastCard);
};

let lastime = 0;
let acumuladorTime = 0;
let bandera = true;

function comprobe(time = 0) {
  let deltaTime = time - lastime;
  lastime = time;

  acumuladorTime += deltaTime;
  if (acumuladorTime > 1000) {
    acumuladorTime = 0;
    bandera = true;
    cancelAnimationFrame(comprobe);
    return;
  }

  bandera = false;
  requestAnimationFrame(comprobe);
}

window.addEventListener('wheel', ({ deltaY }) => {
  if (deltaY > 0 && bandera) {
    prevImage();
    comprobe();
  } else if (deltaY < 0 && bandera) {
    nextImage();
    comprobe();
  }
});

document.addEventListener('keydown', ({ key }) => {
  if ((key == 'ArrowUp' || key === 'W' || key === 'w') && bandera) {
    nextImage();
    comprobe();
  } else if ((key === 'ArrowDown' || key === 'S' || key === 'w') && bandera) {
    prevImage();
    comprobe();
  }
});

document.addEventListener('touchstart', e => {
  const initialY = e.touches[0].clientY;

  const moveStart = e => {
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - initialY;
    const deltaDistance = Math.abs(currentY - initialY);
    const deltaDistanceAchieved = deltaDistance > 50;
    let up = deltaY > 0;
    let down = deltaY <= 0;
    if (up && deltaDistanceAchieved && bandera) {
      prevImage();
      comprobe();
    } else if (down && deltaDistanceAchieved && bandera) {
      nextImage();
      comprobe();
    }

    document.addEventListener('touchend', moveEnd);
  };

  document.addEventListener('touchmove', moveStart, { passive: true });

  const moveEnd = e => {
    document.removeEventListener('touchmove', moveStart);
    document.removeEventListener('touchend', moveEnd);
  };
});
