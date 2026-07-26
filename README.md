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

Jugador 2:

- Flechas izquierda/derecha: moverse
- Flecha arriba: saltar
- Flecha abajo: ataque basico
- `Shift`: golpe fuerte
- `/`: habilidad 1
- `.`: habilidad 2

## Personajes

- Normal
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

Divine General se desbloquea completando los 7 sellos dificiles. El codigo `fulladapt` solo funciona despues de desbloquearlo. Su Q+F secreto activa Corte Mundial: carga 10 segundos y lanza un corte que escala hasta 100 dano segun sus adaptaciones.

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
- `overheat`: potencia a Fire Master
- `ironwall`: potencia a Living Tank
- `deadeye`: potencia a Cowboy
- `mirrorluck`: potencia a Reflecter
- `kaioken`: desbloquea Kaioken para Normal
- `upgrade`: convierte a Reflecter en Reflecter 2.0
- `prism`: potencia a Switcher
- `fulladapt`: requiere Divine General desbloqueado; le da 250 vida y 6 a 10 adaptaciones por tipo principal
- `lightsout`: desbloquea Dark Room por una partida
- `secretguide1`: abre la guia de codigos
- `secretguide2`: abre la guia de eventos
- `clear`: limpia codigos activos

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
- `game.js`: logica de combate, personajes, eventos, codigos y debug

Para subir cambios:

```powershell
git add .
git commit -m "Describe el cambio"
git push
```
