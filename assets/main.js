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
                        query: this.userSearch, // user's search --> see data
                        language: "it",
                    }
                }).then( (filmsList) => {
                    this.films = filmsList.data.results;
                })
            ;

            // reset the search
            this.userSearch = "";
        },
        newVote: function(filmIndex) {
            // local var
            let thisVote = app.films[filmIndex].vote_average; // old vote 0-10
            let newVote; // computed vote 1-5

            // new-vote function: from 0 to 5
            return newVote = Math.round(thisVote / 2);
        },
        setAltFlag: function(event) {
            let srcNoFlag = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/No_flag.svg/1280px-No_flag.svg.png";

            event.target.src = srcNoFlag;
        },
    },
    mounted: function() {
        this.searchFilm();
    },
});
