let knight = {
  name: "knight",
  pv: 100,
  critChance: 0.2,
  critDamage: 1.2,
};

let dragon = {
  name: "dragon",
  pv: 100,
  critChance: 0.2,
  critDamage: 1.2,
};

let players = [knight, dragon];

const init = () => {
  document.getElementById("player-pv").innerText = knight.pv;
  document.getElementById("dragon-pv").innerText = dragon.pv;
};

let i = 0;
const script = () => {
  const nextBtn = document.getElementById("begin");
  const gameMessage = document.getElementById("game-state");
  switch (i) {
    case 0:
      gameMessage.innerText =
        "La quiétude habituelle du Royaume est troublé par des rumeurs au sujet d'une étrange caverne.\nD'aucun prétendent entendre de longs grognements en émaner.";
      nextBtn.innerText = "Sottises que cela !";
      const soundHome = document.createElement("audio");
      soundHome.id = "soundHome";
      soundHome.src = "./Media/homeSound.mp3";
      soundHome.volume = 0.8;
      soundHome.loop = "loop";
      soundHome.style.display = "none";
      soundHome.setAttribute("autoplay", "autoplay");
      document.getElementById("game-screen").appendChild(soundHome);
      i++;
      break;
    case 1:
      gameMessage.innerText =
        "La Reine a sollicité les Chevaliers de sa Cour afin de mener l'enquête.";
      nextBtn.innerText = "Se porter volontaire";
      i++;
      break;
    case 2:
      document.getElementById("player-card").classList.remove("invisible");
      gameMessage.innerText =
        "Vous traversez la moitié du Royaume pour enfin découvrir la fameuse caverne.";
      nextBtn.innerText = "S'y engouffrer sans hésiter";
      i++;
      break;
    case 3:
      gameMessage.innerText =
        "Après quelques pas, vous sentez un souffle chaud sur votre nuque et une forte odeur de souffre monte jusqu'à vos narines.";
      nextBtn.innerText = "S'arrêter brusquement";
      fadeOut(0.8);
      i++;
      break;
    case 4:
      document.getElementById("dragon-card").classList.remove("invisible");
      startGame();
  }
};

const fadeOut = (volume) => {
  setInterval(() => {
    if (volume > 0.01) {
      volume -= 0.01;
      document.getElementById("soundHome").volume = volume;
    }
  }, 35);
  setTimeout(() => {
    document.getElementById("soundHome").remove();
  }, 5000);
};

const standardTurn = (player, attack) => {
  document.getElementById("light-attack").setAttribute("disabled", "disabled");
  document.getElementById("heavy-attack").setAttribute("disabled", "disabled");
  setTimeout(() => {
    document.getElementById("light-attack").removeAttribute("disabled");
    document.getElementById("heavy-attack").removeAttribute("disabled");
  }, 3000);
  let damage = Math.floor(Math.random() * 16) + 15;
  if (attack === "heavy") {
    const random = Math.floor(Math.random() * 3);
    if (random !== 1) {
      damage = Math.floor(damage * 1.8);
      communTurn(player, damage);
    } else {
      standardTurn(dragon, "light");
    }
  } else {
    communTurn(player, damage);
  }
};

const communTurn = (player, damage) => {
  if (player === knight) {
    addSoundEffect("./Media/sword.mp3", 1, 2500);
  } else {
    addSoundEffect("./Media/dragon.mp3", 1, 2500);
  }
  let crit = "";
  let classList = "text-black font-bold";
  if (isCrit(player)) {
    damage = Math.floor(damage * player.critDamage);
    crit = " critique";
    classList = "text-yellow-500 font-bold";
  }
  let currentPlayer = "Le <span class='text-red-500'>dragon</span> lance";
  players.indexOf(player) === 0
    ? ((players[1].pv -= damage),
      (players[1].pv =
        players[1].pv <= 0 ? (players[1].pv = 0) : players[1].pv),
      (document.getElementById("dragon-pv").innerText = dragon.pv),
      (currentPlayer = "Vous lancez"))
    : ((players[0].pv -= damage),
      (players[0].pv =
        players[0].pv <= 0 ? (players[0].pv = 0) : players[0].pv),
      (document.getElementById("player-pv").innerText = knight.pv));
  document.getElementById(
    "message"
  ).outerHTML = `<p id="message" class="text-center text-lg mt-4">${currentPlayer} une attaque${crit} qui inflige <span class="${classList}">${damage}</span><i class="fa-solid fa-heart text-red-600 ml-2"></i>.</p>`;
};

const isCrit = (player) => {
  if (Math.floor((Math.random() * 1) / player.critChance) === 0) {
    return true;
  } else {
    return false;
  }
};

const startGame = () => {
  const firstPlayer = players[Math.floor(Math.random() * players.length)];
  document.getElementById("game-state").innerText =
    firstPlayer === knight
      ? "Vous vous retournez brusquement et levez votre épée dans le même mouvement."
      : "Vous avez tout juste le temps de vous retourner pour apercevoir une énorme patte s'abattre dans votre direction.";
  document.getElementById("begin").classList.add("hidden");
  if (firstPlayer !== knight) {
    standardTurn(dragon);
    addSoundEffect("./Media/dragon.mp3", 0.8, 2500);
  }
  document.getElementById("light-attack").classList.remove("hidden");
  document.getElementById("heavy-attack").classList.remove("hidden");
};

const addSoundEffect = (sound, volume, timer) => {
  const soundEffect = document.createElement("audio");
  soundEffect.src = sound;
  soundEffect.volume = volume;
  soundEffect.style.display = "none";
  soundEffect.setAttribute("autoplay", "autoplay");
  document.getElementById("game-screen").appendChild(soundEffect);
  setTimeout(() => {
    soundEffect.remove();
  }, timer);
};

const displayVictory = () => {
  document.getElementById("light-attack").classList.add("hidden");
  document.getElementById("heavy-attack").classList.add("hidden");
  document.getElementById("game-state").innerText =
    players[0].pv === 0 ? "Défaite" : "Victoire";
  document.getElementById("game-state").classList.add("text-6xl");
  document.getElementById("game-state").classList.add("font-bold");
  if (document.getElementById("game-state").innerText === "Victoire") {
    document.getElementById("game-state").classList.add("text-green-500");
    setTimeout(() => {
      addSoundEffect("./Media/victory.mp3", 1, 7000);
    }, 1500);
  } else {
    document.getElementById("game-state").classList.add("text-red-500");
    setTimeout(() => {
      addSoundEffect("./Media/defeat.mp3", 1, 25000);
    }, 1500);
  }
  document.getElementById("game-state").classList.contains("hidden")
    ? document.getElementById("game-state").classList.remove("hidden")
    : "";
};

const victoryCondition=()=>{
    document.getElementById("game-state").classList.contains("hidden")
    ? ""
    : document.getElementById("game-state").classList.add("hidden");
    if (players[0].pv === 0 || players[1].pv === 0) {
        displayVictory();
      } else {
        setTimeout(() => {
          standardTurn(dragon, "light");
          if (players[0].pv === 0 || players[1].pv === 0) {
            displayVictory();
          }
        }, 3000);
      }
}

document.addEventListener("DOMContentLoaded", init);
document.getElementById("begin").addEventListener("click", () => {
  script();
});
document.getElementById("light-attack").addEventListener("click", () => {
  standardTurn(knight, "light");
  victoryCondition()
});
document.getElementById("heavy-attack").addEventListener("click", () => {
  standardTurn(knight, "heavy");
  victoryCondition()
});

document.getElementById("heavy-attack").addEventListener("mouseover", () => {
  document.getElementById("attack-info").innerText =
    "L'attaque lourde offre la possibilité de doubler les dégâts. Il est toutefois possible que l'ennemi ait le temps d'attaquer avant même que votre attaque ne touche ...";
  document.getElementById("attack-info").style.visibility = "visible";
});

document.getElementById("heavy-attack").addEventListener("mouseout", () => {
  document.getElementById("attack-info").style.visibility = "hidden";
});

document.getElementById("light-attack").addEventListener("mouseover", () => {
  document.getElementById("attack-info").innerText =
    "L'attaque légère est l'attaque de base. Ses dégats sont compris entre 15 et 30. Un coup critique est possible.";
  document.getElementById("attack-info").style.visibility = "visible";
});

document.getElementById("light-attack").addEventListener("mouseout", () => {
  document.getElementById("attack-info").style.visibility = "hidden";
});
