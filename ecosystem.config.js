module.exports = {
  apps: [
    {
      name: 'dashboard-api-flypokhara',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 9001,
      },
    },
  ],
};
