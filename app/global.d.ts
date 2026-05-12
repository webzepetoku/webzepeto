// app/global.d.ts
import {} from 'hono'

declare module 'hono' {
  interface Env {
    Bindings: {
      DB: D1Database;
      MY_BUCKET: R2Bucket;
      // Konfigurasi rahasia jika diperlukan
      JWT_SECRET?: string; 
    }
  }
}

// Global variable untuk mengenali JSX Hono
declare module 'hono/jsx' {
  namespace JSX {
    interface HTMLAttributes extends preact.JSX.HTMLAttributes {}
  }
}
