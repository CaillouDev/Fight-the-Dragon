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

let archer = {
  name: "archer",
  pv: 80,
  critChance: 0.4,
  critDamage: 1.2,
};

let peasant = {
  name: "peasant",
  pv: 70,
  critChance: 0.1,
  critDamage: 1.2,
};

let classes = [
  {
    name: "knight",
    pv: 100,
    critChance: 0.2,
    critDamage: 1.2,
  },
  {
    name: "archer",
    pv: 80,
    critChance: 0.4,
    critDamage: 1.2,
  },
  {
    name: "peasant",
    pv: 70,
    critChance: 0.1,
    critDamage: 1.2,
  },
];

let weapons = [
  { name: "sword", baseDamage: 15, critDamage: 1.2 },
  { name: "dagger", baseDamage: 10, critDamage: 1.4 },
];

let players = [knight, dragon];

let attacks = ["heavy", "light"];

let heavy = "";

let heavyFailed = "";

const init = () => {
  document.getElementById("player-pv").innerText = knight.pv;
  document.getElementById("dragon-pv").innerText = dragon.pv;
  if (!matchMedia("(pointer:fine)").matches) {
    const lightInfoMobile = document.createElement("p");
    lightInfoMobile.id = "light-info-mobile";
    lightInfoMobile.innerText =
      "15 à 30 dégâts\nUn coup critique est possible.";
    lightInfoMobile.style.display = "none";
    document
      .getElementById("light-attack")
      .insertAdjacentElement("afterend", lightInfoMobile);
    document
      .getElementById("light-attack")
      .insertAdjacentElement(
        "afterend",
        document.getElementById("attack-info")
      );
    const heavyInfoMobile = document.createElement("p");
    heavyInfoMobile.id = "heavy-info-mobile";
    heavyInfoMobile.innerText =
      "Quitte ou double :\ndégats x2 ou contre-attaque ennemie";
    heavyInfoMobile.style.display = "none";
    document
      .getElementById("heavy-attack")
      .insertAdjacentElement("afterend", heavyInfoMobile);
  }
};

let i = 0;
const script = () => {
  const nextBtn = document.getElementById("begin");
  const gameMessage = document.getElementById("game-state");
  switch (i) {
    case 0:
      gameMessage.innerText =
        "La quiétude habituelle du Royaume est troublée par des rumeurs au sujet d'une étrange caverne.\nD'aucuns prétendent entendre de longs grognements en émaner.";
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
      // if (matchMedia("(pointer:not(:fine))").matches) {
      //   document.getElementById("light-info-mobile").style.display = "block";
      //   document.getElementById("heavy-info-mobile").style.display = "block";
      // }
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

const standardTurn = async (player, attack) => {
  document.getElementById("light-attack").setAttribute("disabled", "disabled");
  document.getElementById("heavy-attack").setAttribute("disabled", "disabled");
  let damage = Math.floor(Math.random() * 16) + 15;
  if (attack === "heavy") {
    console.log("heavy" + player);
    const random = Math.floor(Math.random() * 3);
    if (random !== 1) {
      heavy = " lourde";
      damage = Math.floor(damage * 1.8);
      communTurn(player, damage);
    } else {
      heavyFailed = true;
      document.getElementById("message").innerText =
        player === knight
          ? "Cette fois-ci le dragon est plus rapide que vous et en profite pour vous attaquer."
          : "Vous voyez le dragon préparer son attaque et en profitez pour lui bondire dessus.";
      setTimeout(() => {
        standardTurn(
          players.find((joueur) => joueur !== player),
          "light"
        );
      }, 2500);
    }
  } else {
    if (players[0].pv !== 0 || players[1].pv !== 0) {
      communTurn(player, damage);
    }
  }
};

const communTurn = (player, damage) => {
  if (player === knight) {
    addSoundEffect("./Media/sword.mp3", 1, 2500);
  } else {
    addSoundEffect("./Media/dragon.mp3", 1, 2500);
  }
  let crit = "";
  let heavyColor = "text-black";
  let classList = "text-black font-bold";
  if (isCrit(player)) {
    damage = Math.floor(damage * player.critDamage);
    crit = " critique";
    heavyColor = "text-yellow-500";
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
  ).outerHTML = `<p id="message" class="text-center text-lg mt-4">${currentPlayer} une attaque<span class="font-bold ${heavyColor}">${heavy}</span><span class=${classList}>${crit}</span> qui inflige <span class="${classList}">${damage}</span><i class="fa-solid fa-heart text-red-600 ml-2"></i>.</p>`;
  heavy = "";
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
    standardTurn(dragon, "light");
    addSoundEffect("./Media/dragon.mp3", 0.8, 2500);
    setTimeout(() => {
      document.getElementById("light-attack").removeAttribute("disabled");
      document.getElementById("heavy-attack").removeAttribute("disabled");
    }, 2500);
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

const victoryCondition = () => {
  document.getElementById("game-state").classList.contains("hidden")
    ? ""
    : document.getElementById("game-state").classList.add("hidden");
  if (players[0].pv === 0 || players[1].pv === 0) {
    displayVictory();
  } else {
    let timer;
    timer = heavyFailed === true ? 6000 : 3000;
    heavyFailed = "";
    setTimeout(() => {
      standardTurn(
        dragon,
        Math.floor(Math.random() * 3) === 2 ? "heavy" : "light"
      );
      setTimeout(() => {
        document.getElementById("light-attack").removeAttribute("disabled");
        document.getElementById("heavy-attack").removeAttribute("disabled");
      }, timer);
      if (players[0].pv === 0 || players[1].pv === 0) {
        displayVictory();
      }
    }, timer);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  init();
});
document.getElementById("begin").addEventListener("click", () => {
  script();
});
document.getElementById("light-attack").addEventListener("click", () => {
  standardTurn(knight, "light");
  victoryCondition();
  if (players[0].pv === 0 || players[1].pv === 0) {
    displayVictory();
  }
});
document.getElementById("heavy-attack").addEventListener("click", () => {
  standardTurn(knight, "heavy");
  victoryCondition();
  if (players[0].pv === 0 || players[1].pv === 0) {
    displayVictory();
  }
});

if (matchMedia("(pointer:fine)").matches) {
  document.getElementById("heavy-attack").addEventListener("mouseover", () => {
    document.getElementById("attack-info").innerText =
      "L'attaque lourde offre la possibilité de doubler les dégâts. Il est toutefois possible que l'ennemi ait le temps d'attaquer avant même que votre attaque ne touche ...";
    document.getElementById("attack-info").style.visibility = "visible";
  });
  document.getElementById("light-attack").addEventListener("mouseover", () => {
    document.getElementById("attack-info").innerText =
      "L'attaque légère est l'attaque de base. Ses dégats sont compris entre 15 et 30. Un coup critique est possible.";
    document.getElementById("attack-info").style.visibility = "visible";
  });
}

document.getElementById("heavy-attack").addEventListener("mouseout", () => {
  document.getElementById("attack-info").style.visibility = "hidden";
});

document.getElementById("light-attack").addEventListener("mouseout", () => {
  document.getElementById("attack-info").style.visibility = "hidden";
});
