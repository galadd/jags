const fs = require('fs');
// const { readFile } = require('./fileOperation');

// Specify the path to the file you want to read
const filePath = 'hardhat.config.js';

function getNetworkUrls(data) {
  const moduleExportsRegex = /module\.exports\s*=\s*({[\s\S]*?\n})/g;
  const matches = moduleExportsRegex.exec(data);

  if (matches && matches.length > 0) {
    const moduleExportsString = matches[1];
    const moduleExports = eval('(' + moduleExportsString + ')');

    if (moduleExports && moduleExports.networks) {
      const networkKeys = Object.keys(moduleExports.networks);
      const urls = [];

      for (let i = 0; i < networkKeys.length; i++) {
        const network = moduleExports.networks[networkKeys[i]];
        if (network && network.url) {
          urls.push(network.url);
        }
      }

      return urls;
    } else {
      throw new Error('No networks found in the configuration.');
    }
  } else {
    throw new Error('module.exports not found in the file.');
  }
}

module.export = getNetworkUrls

// // Usage
// readFile(filePath)
//   .then(data => {
//     console.log(getNetworkUrls(data))
//   })
//   .catch(err => {
//     console.error(`Error reading file: ${err}`);
// });
