# Moquete

Moquete es un juego de pelea local hecho con HTML, CSS y JavaScript. Tiene personajes con habilidades propias, mapas con eventos especiales, logros, estadisticas, codigos secretos, modo bot y una pantalla debug para probar balance.

## Jugar

Abri `index.html` en un navegador moderno.

Si el repositorio esta publicado con GitHub Pages, se puede jugar desde:

```text
https://somnus-py.github.io/Moquete/
```

## Controles

Jugador 1:

- `A` / `D`: moverse
- `W`: saltar
- `S`: ataque basico
- `E`: golpe fuerte
- `Q`: habilidad 1
- `F`: habilidad 2
- `R`: habilidad 3

Jugador 2:

- Flechas izquierda/derecha: moverse
- Flecha arriba: saltar
- Flecha abajo: ataque basico
- `Shift`: golpe fuerte
- `/`: habilidad 1
- `.`: habilidad 2
- `Enter`: habilidad 3

## Personajes

- Normal
- Light Warrior
- Fire Master
- Living Tank
- Cowboy
- Reflecter
- Switcher
- Sorcerer
- Gambler
- Chrono
- Ghost
- Divine General

Super Fire Master se desbloquea ganando Mana Meltdown con Fire Master en menos de 45 segundos y con 80+ vida. Despues se elige con click derecho sobre Fire Master.

Divine General se desbloquea completando los 7 sellos dificiles. El codigo `fulladapt` solo funciona despues de desbloquearlo. Su Q+F secreto activa Corte Mundial: carga 10 segundos y lanza un corte que hace 100 dano por cada adaptacion total.

## Mapas

- Alpha
- Foundry
- Desierto
- Neon
- Casino
- Estacion Militar
- Dark Room

Algunos mapas tienen reglas especiales, terreno activo o eventos ligados a enfrentamientos concretos.

## Codigos secretos

Los codigos se escriben directamente desde el menu:

- `cheater`: abre la Pantalla Debug
- `Old`: abre la version Alpha edition
- `blind`: activa modo guess who
- `clear`: limpia codigos activos

Hay mas codigos que puedes descubrirlos jugando o preguntandole a alguien

## Pantalla Debug

La Pantalla Debug permite modificar:

- dano
- vida
- velocidad
- cooldowns
- gravedad
- velocidad de proyectiles
- duracion de efectos
- empuje de golpes
- personajes afectados por el debug

Sirve para probar balance sin tocar el codigo.

## Eventos especiales

- Duelo del Desierto: Cowboy vs Cowboy en Desierto
- Choque de Titanes: Living Tank vs Living Tank en Estacion Militar
- Ruptura Arcana: Sorcerer vs Reflecter en Neon
- Colapso Espejo: Sorcerer vs Reflecter con orbe secreto reflejado
- Casino Royale: Gambler vs Gambler en Casino
- Mana Meltdown: Fire Master vs Sorcerer en Foundry
- Prism Overdrive: Switcher vs Switcher en Neon
- Absolute Adaptation: Divine General vs Chrono en Dark Room

## Desarrollo

El juego no necesita build ni dependencias. Los archivos principales son:

- `index.html`: estructura de menus, HUD y pantallas
- `style.css`: interfaz, personajes, mapas y efectos visuales
- `js/`: la logica del juego, dividida en partes que `index.html` carga en orden:
  - `01-setup.js`: canvas, constantes, estado global, guardado, monedas y logros
  - `02-scammer-shop.js`: la tienda de Scammer (el basurero del menu)
  - `03-unlocks-stats.js`: desbloqueos de personajes y estadisticas
  - `04-audio.js`: efectos de sonido y musica
  - `05-fighter.js`: la clase `Fighter` (cada luchador)
  - `06-projectiles.js`: proyectiles y efectos de habilidades
  - `07-combat-rules.js`: dano, variantes secretas, terrenos y eventos
  - `08-stages-cutscenes.js`: mapas, pantallas de victoria y cinematicas del Arcade
  - `09-game-loop-abilities.js`: bucle principal, HUD, habilidades y Shadow Jester
  - `10-controls-bot-menus.js`: controles, bot, menus e inicio

Los archivos comparten variables globales, asi que el orden de las etiquetas `<script>` importa: el codigo que se ejecuta al cargar solo puede usar funciones de su propio archivo o de archivos anteriores.

Para subir cambios:

```powershell
git add .
git commit -m "Describe el cambio"
git push
```
