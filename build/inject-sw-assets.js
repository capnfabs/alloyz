#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const isProd = process.env.NODE_ENV === 'production';
const swPath = path.join(__dirname, '../dist', 'service-worker.js');
const distPath = path.join(__dirname, '../dist');

function getProdAssets() {
  // Get all files in dist except service-worker.js
  const files = fs.readdirSync(distPath)
    .filter(f => f !== 'service-worker.js' && !f.endsWith('.map'))
    .map(f => '/' + f);
  return files;
}

function getDevAssets() {
  // Static list for dev
  return [
    '/',
    '/index.html',
    '/index.js',
    '/style.css',
    '/manifest.json'
  ];
}

function injectAssets() {
  const swFile = fs.readFileSync(swPath, 'utf8');
  const assets = isProd ? getProdAssets() : getDevAssets();
  const assetsString = JSON.stringify(assets, null, 2);
  const replaced = swFile.replace('__PRECACHE_ASSETS__', assetsString);
  fs.writeFileSync(swPath, replaced, 'utf8');
  console.log(`Injected ${assets.length} assets into service-worker.js (${isProd ? 'production' : 'development'} mode)`);
}

injectAssets();
