const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = true;

// Fix applied https://github.com/expo/expo/issues/36384#issuecomment-2854467986
config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (moduleName === 'zustand' || moduleName.startsWith('zustand/')) {
        //? Resolve to its CommonJS entry (fallback to main/index.js)
        return {
            type: 'sourceFile',
            //? require.resolve will pick up the CJS entry (index.js) since "exports" is bypassed
            filePath: require.resolve(moduleName),
        };
    }
    return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;