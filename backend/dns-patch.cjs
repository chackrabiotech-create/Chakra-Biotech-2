/**
 * dns-patch.cjs — loaded via node --require before server.js
 * Forces DNS queries through Google's public resolvers (8.8.8.8)
 * so MongoDB Atlas SRV lookups succeed in environments where the
 * local router DNS refuses to forward them.
 */
require('dotenv').config();

const dns = require('dns');

// Use Google and Cloudflare public DNS — resolves Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
