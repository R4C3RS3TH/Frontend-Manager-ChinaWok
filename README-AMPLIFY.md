# Guía de Deployment en AWS Amplify

Este documento describe cómo deployear el proyecto Frontend-Manager-ChinaWok en AWS Amplify.

## Pre-requisitos

- Cuenta de AWS con acceso a AWS Amplify
- Repositorio Git con el código del proyecto
- URL del WebSocket backend configurado en AWS

## Configuración Realizada

El proyecto ha sido configurado con:
- ✅ `@sveltejs/adapter-static` para generar archivos estáticos
- ✅ Configuración SPA con `fallback: 'index.html'` para routing del lado del cliente
- ✅ Archivo `amplify.yml` con build configuration

## Pasos para Deployear en AWS Amplify

### 1. Crear Nueva Aplicación en Amplify

1. Accede a la [Consola de AWS Amplify](https://console.aws.amazon.com/amplify/)
2. Haz clic en **"New app"** → **"Host web app"**
3. Selecciona tu proveedor de Git (GitHub, GitLab, Bitbucket, etc.)
4. Autoriza AWS Amplify para acceder a tu repositorio
5. Selecciona el repositorio: `Frontend-Manager-ChinaWok`
6. Selecciona la rama a deployear (generalmente `main` o `master`)

### 2. Configurar Build Settings

AWS Amplify debería detectar automáticamente el archivo `amplify.yml`. Verifica que:

- **App build specification**: Use el archivo `amplify.yml`
- **Build image**: Node.js 18 o superior
- **Build directory**: `build`

### 3. Configurar Variables de Entorno

**CRÍTICO**: Antes de deployear, configura las variables de entorno necesarias:

1. En la consola de Amplify, ve a **"Environment variables"**
2. Agrega la siguiente variable:

   | Variable | Valor | Descripción |
   |----------|-------|-------------|
   | `PUBLIC_WEBSOCKET_URL` | `wss://tu-api-id.execute-api.region.amazonaws.com/production` | URL del WebSocket backend |

> **⚠️ Importante**: Reemplaza `tu-api-id` y `region` con los valores de tu API Gateway WebSocket en AWS.

### 4. Deploy

1. Haz clic en **"Save and deploy"**
2. AWS Amplify comenzará el proceso de build
3. Espera a que el deployment se complete (generalmente 2-5 minutos)
4. Una vez completado, recibirás una URL de la forma: `https://branch-name.d12345.amplifyapp.com`

### 5. Verificar el Deployment

Prueba las siguientes funcionalidades:

- ✅ La página principal carga correctamente
- ✅ Login y registro funcionan
- ✅ La conexión WebSocket se establece (revisar DevTools → Network → WS)
- ✅ Navegación entre rutas funciona (`/manager/menu`, `/manager/orders`)
- ✅ No hay errores 404 al recargar páginas internas

## Configuración de Dominio Personalizado (Opcional)

1. En la consola de Amplify, ve a **"Domain management"**
2. Haz clic en **"Add domain"**
3. Sigue las instrucciones para configurar tu dominio personalizado
4. AWS Amplify configurará automáticamente el certificado SSL

## Actualizar la Aplicación

Cada vez que hagas push a la rama configurada, AWS Amplify:
1. Detectará automáticamente los cambios
2. Ejecutará el build
3. Deployará la nueva versión

Para deployear manualmente:
- Ve a la consola de Amplify → **"Redeploy this version"**

## Troubleshooting

### El build falla con error de memoria

Aumenta los recursos del build:
1. Ve a **"Build settings"** → **"Build image settings"**
2. Selecciona una imagen con más memoria

### WebSocket no se conecta

Verifica:
1. Que `PUBLIC_WEBSOCKET_URL` esté correctamente configurada
2. Que la URL incluya el protocolo `wss://` (no `ws://`)
3. Que el backend WebSocket esté funcionando
4. Las políticas CORS del backend permiten el dominio de Amplify

### Error 404 en rutas

Si obtienes 404 al acceder directamente a rutas como `/manager/menu`:
1. Verifica que `fallback: 'index.html'` esté en `svelte.config.js`
2. Verifica que el directorio de salida sea `build`
3. Re-deploya la aplicación

### Variables de entorno no se aplican

1. Asegúrate que las variables empiecen con `PUBLIC_`
2. Re-deploya después de agregar variables
3. Verifica en el build log que las variables estén disponibles

## Monitoreo

AWS Amplify proporciona:
- **Access logs**: Para ver tráfico
- **Error monitoring**: Para detectar errores
- **Performance metrics**: Para monitorear rendimiento

Accede a estos desde la consola de Amplify → **"Monitoring"**

## Costos

AWS Amplify cobra por:
- Build minutes (primeros 1,000 minutos/mes son gratis)
- Hosting (primeros 15 GB servidos/mes son gratis)
- Data transfer

Consulta la [página de precios de AWS Amplify](https://aws.amazon.com/amplify/pricing/) para más detalles.

## Soporte

- [Documentación oficial de AWS Amplify](https://docs.aws.amazon.com/amplify/)
- [Documentación de SvelteKit adapter-static](https://kit.svelte.dev/docs/adapter-static)
