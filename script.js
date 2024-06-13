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
  document.getElementById("game-state").innerText =
    "Vous pénétrez dans la grotte.\nAprès quelques pas, vous sentez un souffle chaud sur votre nuque et une forte odeur de souffre monte jusqu'à vos narines.";
  document.getElementById("player-pv").innerText = knight.pv;
  document.getElementById("dragon-pv").innerText = dragon.pv;
  //"Vous pénétrez dans la grotte. Après quelques pas, vous sentez un souffle chaud sur votre nuque et une forte odeur de souffre monte jusqu'à vos narines."
};

const standardTurn = (player) => {
  document.getElementById("light-attack").setAttribute("disabled", "disabled");
  document.getElementById("heavy-attack").setAttribute("disabled", "disabled");
  setTimeout(() => {
    document.getElementById("light-attack").removeAttribute("disabled");
    document.getElementById("heavy-attack").removeAttribute("disabled");
  }, 3000);
  let damage = Math.floor(Math.random() * 20) + 30;
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
      ? "Vous vous retourner brusquement et levez votre épée dans le même mouvement."
      : "Vous avez tout juste le temps de vous retourner pour apercevoir une énorme patte s'abattre dans votre direction.";
  document.getElementById("begin").classList.add("hidden");
  if (firstPlayer !== knight) {
    standardTurn(dragon);
    addSoundEffect("./Media/dragon.mp3", 1, 2500);
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

document.addEventListener("DOMContentLoaded", init);
document.getElementById("begin").addEventListener("click", startGame);
document.getElementById("light-attack").addEventListener("click", () => {
  document.getElementById("game-state").classList.contains("hidden")
    ? ""
    : document.getElementById("game-state").classList.add("hidden");
  standardTurn(knight);
  addSoundEffect("./Media/sword.mp3", 1, 2500);
  console.log(players);
  if (players[0].pv === 0 || players[1].pv === 0) {
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
      }, 1000);
    } else {
      document.getElementById("game-state").classList.add("text-red-500");
      setTimeout(() => {
        addSoundEffect("./Media/defeat.mp3", 1, 7000);
      }, 1000);
    }
    document.getElementById("game-state").classList.contains("hidden")
      ? document.getElementById("game-state").classList.remove("hidden")
      : "";
  } else {
    setTimeout(() => {
      standardTurn(dragon);
      addSoundEffect("./Media/dragon.mp3", 1, 2500);
    }, 3000);
  }
});
