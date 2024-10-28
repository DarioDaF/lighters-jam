# TheLighters

Project for a short game jam: [SoloDev Jam #5 - Spooky Jam](https://itch.io/jam/solo-dev-game-jam-5-spooky-jam)

Testable online at: https://dariodaf.itch.io/thelighters

Project is not finished at all, just a prototype for boolean geometry based interactions.

Due to the jagged lines and not enough simplification in this version a texture based overlap/kernel implementation might
result in better quality for the same performance (in modern hardware, mobile should be tested when quality has some workarounds).

This implementation is primed for distributing entities (enemies) on the border of polygons by length due to having a clear vector representation of the stage, also projection/ray actions can be performed (e.g. teleport to other side of the "dark").

To test performances with mutliple "light" sources constantly merging in both positive and negative polygons (dark trails from enemies and or safe bonfires providing a constant pushback to darkenss increase).
