var app = new Vue({ // VUE INSTANCE
    el: "#root",
    data: {
        userSearch: "batman",
        films: [],
    },
    methods: {
        searchFilm: function() {
            // axios request --> films and tv series
            axios
                .get("https://api.themoviedb.org/3/search/movie", { params: {
                        api_key: "f14b811e77f424ab83b5ac2e25d349b8", // api key
                        query: this.userSearch,
                        language: "it"
                    }
                }).then( (filmsList) => {
                    this.films = filmsList.data.results;
                    console.log(this.films);
                })
            ;

            // reset the search
            this.userSearch = "";
        },
    },
    mounted: function() {
        this.searchFilm();
    },
});
