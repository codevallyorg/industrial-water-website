/**
 * pm2 process definitions for the VPS.
 *
 *   pm2 start ecosystem.config.js
 *   pm2 save && pm2 startup     # survive reboots
 *
 * Both apps bind to loopback only — nginx is the sole public entry point (see deploy/nginx.conf).
 * Secrets come from each app's own .env (backend/.env, frontend/.env.production), NOT from here —
 * this file is committed, so it must never contain a token or password.
 */
module.exports = {
  apps: [
    {
      name: 'forbes-strapi',
      cwd: './backend',
      script: 'npm',
      args: 'run start',
      env: { NODE_ENV: 'production', HOST: '127.0.0.1', PORT: '1337' },
      max_memory_restart: '600M',
      time: true,
    },
    {
      name: 'forbes-next',
      cwd: './frontend',
      script: 'npm',
      args: 'run start',
      // next start binds 127.0.0.1:3000; nginx proxies to it.
      env: { NODE_ENV: 'production', HOSTNAME: '127.0.0.1', PORT: '3000' },
      max_memory_restart: '500M',
      time: true,
    },
  ],
};
