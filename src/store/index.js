import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        isLoading: 0
    },
    mutations: {
        setLoading: function (state, loading) {
            state.isLoading = state.isLoading + loading
        }
    },
    actions: {
    },
    modules: {
    }
})
