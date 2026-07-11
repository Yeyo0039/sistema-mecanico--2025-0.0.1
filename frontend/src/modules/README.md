# Guía de módulos

Cada carpeta dentro de `src/modules` es autónoma. Su única API pública es `index.ts`.

```ts
// Correcto: consumir únicamente la API pública.
import InventarioModule from '@/modules/inventario'

// Incorrecto: acoplar otro módulo a una implementación privada.
import InventarioPage from '@/modules/inventario/Page.vue'
```

Para crear un módulo:

1. Crea `modules/nombre/{index.ts,Page.vue,components,services,store}`.
2. Exporta `{ Page, afterMount?, destroy? }` desde `index.ts`.
3. Añádelo a `app/ModuleRegistry.ts`.
4. Conserva o crea su ruta en `router/routes.ts` usando `meta: { module: 'nombre' }`.

`ModuleManager` destruye el módulo anterior, deja vacío el host del Workspace y espera el siguiente render antes de ejecutar `afterMount`. No se utiliza `KeepAlive`; al cambiar de ruta Vue desmonta la página anterior y libera su estado local. Los módulos deben cancelar sus peticiones y listeners en `onBeforeUnmount`.
