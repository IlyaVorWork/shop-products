const nextConfig = {
  webpack: (config) => {
    config.node = {
      fs: 'empty',
    }
    return config
  },
}

module.exports = nextConfig
