const { expect } = require('chai');
const { getNetworkUrls } = require('../src/env');

describe('getNetworkUrls', () => {

  it('should return an array of network URLs', () => {

    const content = `
module.exports = {
  networks: {
    development: {
      url: 'http://localhost:8545'
    },
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID'
    }
  }
}
  `;
  
    const urls = getNetworkUrls(content)

    expect(urls.length).to.equal(2)

    expect(urls).to.deep.equal([
      'http://localhost:8545',
      'https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID',
    ]);

  })

  it('should throw an error if no networks found in the configuration', async () => {

    const content = `
module.exports = {

}
  `;

  expect(() => {
    getNetworkUrls(content); 
  }).throw("No networks found in the configuration."); 

  });

  it('should throw an error if module.exports not found in the file', async () => {
    
    const content = `
Hello World
  `;

  expect(() => {
    getNetworkUrls(content); 
  }).throw("module.exports not found in the file."); 

  });
});
