var app = new Vue({ // VUE INSTANCE
    el: "#root",
    data: {
        userSearch: "",
    },
    methods: {
        searchFilm: function() {
            let currentSearch = this.userSearch;

            // axios request --> films and tv series
            axios
                .get("https://api.themoviedb.org/3/search/movie?api_key=f14b811e77f424ab83b5ac2e25d349b8&query=batman")
                .then( (filmsList) => {
                    console.log(filmsList);
                })
            ;

            // reset the search
            this.userSearch = "";
        },
    },
});
