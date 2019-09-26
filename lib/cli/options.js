// Shield options
const shield = ['deployment', 'device', 'BuildNumber', 'var', 'runType', 'multidevice', 'retry', 'testTimeout', 'excludedCases'];

// Nightwatch options. Should be kept up to date with new releases.
const commandlineOptions = {
    string: [
        'config',
        'output',
        'reporter',
        'env',
        'test',
        'testcase',
        'group',
        'skipgroup',
        'filter',
        'tag',
        'skiptags',
    ],
    boolean: ['verbose', 'version']
};

// Expose combined Shield & options for correct arg parsing.
module.exports = {
    shield: shield,
    nw: commandlineOptions,
    cli: {
        string: commandlineOptions.string.concat(shield.string),
        boolean: commandlineOptions.boolean.concat(shield.boolean)
    }
};
