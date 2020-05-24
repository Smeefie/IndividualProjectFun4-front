import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            dark: {
                primary: '#333',
                primary_light: '#333',
                secondary: '#b0bec5',
                accepted: '#324d3d',
                pending: '#75664b',
                accent: '#222',
                accent_light: '#8c9eff',
                error: '#b71c1c',
                warning: '#482552',
            },
            light: {
                primary: '#3f51b5',
                primary_light: '#eee',
                secondary: '#b0bec5',
                accepted: '#61944d',
                pending: '#3f51b5',
                accent: '#3f51b5',
                accent_light: '#8c9eff',
                error: '#b71c1c',
            },
        },
    },
});