const assert = require('assert');

describe('JAGS test preview', () => {
    it('should print jags test preview', () => {
        const end = 'jags test preview'
        let combo = 'jags' + ' test preview'
        assert.strictEqual(end, combo);
    });
});
