# 🧿 Mythic Totem — Editor 3D de Tótems para MythicMobs

Herramienta web SPA para diseñar tótems de invocación de **MythicMobs** (Minecraft) en un editor voxel 3D inspirado en Blockbench. Genera el YAML completo del mob en tiempo real.

**[🚀 Abrir la herramienta](https://chamo-dev.github.io/mythic_totem/)** (GitHub Pages)

## Características

- **Editor 3D completo**: Three.js r160 + OrbitControls para rotar, hacer zoom y panear
- **Construcción tipo Blockbench**: clic para colocar, Shift+clic o modo Borrar para eliminar
- **Previsualización 3D**: cubo semitransparente que sigue el ratón, adapta su tamaño si es cabeza o bloque
- **Cabezas a escala real**: miden la mitad que un bloque y aparecen centradas, igual que en Minecraft
- **Puntos cardinales (N/S/E/W)**: indicadores en la cuadrícula para orientarte según el sistema de coordenadas de MythicMobs (yaw=0)
- **Layout 3 columnas**: panel izquierdo (config, YAML, import/export), viewport central, panel derecho (paleta, cabezas, patrón, reemplazos)
- **Secciones colapsables**: clic en cualquier título de sección para expandir/colapsar
- **Paleta de 58 bloques** de Spigot con colores representativos
- **Soporte completo de cabezas**: vanilla (ZOMBIE_HEAD, CREEPER_HEAD, DRAGON_HEAD, PIGLIN_HEAD, SKELETON_SKULL, WITHER_SKELETON_SKULL) y custom (PLAYER_HEAD con PlayerName, SkinTexture Base64, SkinURL, SkinID)
- **Head vinculado a la selección de cabeza**: el `Head` del YAML se define automáticamente según la cabeza que elijas en la paleta
- **Carga de texturas 3D**: aplica skins reales de jugadores (vía minotar.net/mc-heads.net) o texturas Base64/URL en la escena
- **Generación YAML en tiempo real**: formato MythicMobs correcto con Pattern y Replacement
- **Importar/Exportar YAML**: pega configuraciones existentes y reconstrúyelas en 3D
- **Modo Reemplazo (Replacement)**: define qué bloques se sustituirán tras la invocación
- **Persistencia local**: guardado automático en localStorage + exportar/importar archivo .json
- **Modo oscuro/claro**: toggle con transición suave
- **Idiomas (ES / EN)**: cambio de idioma nativo con un clic — todas las etiquetas, toasts y secciones se traducen al instante
- **Atajos de teclado**: B (construir), E (borrar), R (reset), Ctrl+C (copiar YAML)

## Atajos de teclado

| Tecla | Acción |
|-------|--------|
| `B` | Modo Construir |
| `E` | Modo Borrar |
| `R` | Resetear escena |
| `Ctrl+C` | Copiar YAML al portapapeles |
| `+` / `-` | Zoom in / out |
| `Shift + Clic` | Borrar bloque (en modo construir) |

## Ejemplo de YAML generado

```yaml
TotemGuardian:
  Type: ZOMBIE
  Display: '&6Tótem Guardián'
  Totem:
    Head: PLAYER_HEAD
    Pattern:
    - 0,0,0 EMERALD_BLOCK
    - 1,0,0 DIAMOND_BLOCK
    - -1,0,0 DIAMOND_BLOCK
    - 0,1,0 PLAYER_HEAD Player:Notch
    - 0,-1,0 OBSIDIAN
    Replacement:
    - 0,0,0 AIR
```

## Tecnología

- **Three.js r160** (CDN via importmap)
- **Vanilla JS** (ES Modules)
- **CSS Custom Properties** para theming e i18n
- Cero dependencias de build — un solo archivo HTML

## Licencia

[GNU General Public License v3.0](LICENSE) — Software libre. Cuatro libertades fundamentales: ejecutar, estudiar, modificar y compartir. Cualquier versión derivada debe permanecer libre.
