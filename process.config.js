module.exports = {
  apps: [
    {
      name: "BOOKSAW",
      cwd: "./",
      script: "./dist/server.js",
      watch: false,
      env_porduction: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
      instances: 1,
      exec_mode: "cluster",
    },
  ],
};
