import { Entry } from 'webpack'

import { APP_DIR, resolve } from './path'

const Entries: Entry = {
    react_vendors: { import: ['react', 'react-dom'], runtime: 'runtime' },

    state: {
        import: resolve(APP_DIR, 'state'),
        dependOn: ['react_vendors'],
    },

    shared: {
        import: ['react-router-dom', '@00-team/utils'],
        dependOn: ['react_vendors', 'state'],
    },

    components: {
        import: resolve(APP_DIR, 'components'),
        dependOn: ['react_vendors'],
    },

    main: {
        import: APP_DIR,
        // dependOn: ['Home', 'Contact', 'About', 'Selling', 'layout'],
    },

    // Home: {
    //     import: resolve(APP_DIR, 'Home'),
    //     dependOn: ['shared', 'components'],
    // },

    // Contact: {
    //     import: resolve(APP_DIR, 'Contact'),
    //     dependOn: ['shared', 'components'],
    // },

    // About: {
    //     import: resolve(APP_DIR, 'About'),
    //     dependOn: ['shared', 'components'],
    // },

    // Selling: {
    //     import: resolve(APP_DIR, 'Selling'),
    //     dependOn: ['shared', 'components'],
    // },

    // layout: {
    //     import: resolve(APP_DIR, 'layout'),
    //     dependOn: ['shared'],
    // },
}

export default Entries
