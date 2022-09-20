const { createApp, h } = Vue

const app = createApp({
    data() {
        return {
            message: 'Hello Vue!',
            pieChart: h("h1", {id : "123123"})
        }
    },
    computed: {

    },
    methods: {
        r() {
            return document.createElement("h1");
        }
    }
});

export default app;
