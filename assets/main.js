// API VAR
const apiUrl = "https://api.themoviedb.org/3/";
const myApiKey = "f14b811e77f424ab83b5ac2e25d349b8"; // my api key

var app = new Vue({ // VUE INSTANCE
    el: "#root",
    data: {
        searchText: "",
        isLoading: false,
        films: [],
    },
    methods: {
        getFilms: function() {
            // local VAR
            let thisSearch = this.searchText.trim(); // user's search
            // reset the search
            this.searchText = "";

            // check: get api only if thisSearch != 0
            if (thisSearch) {
                // local VAR
                let currentList; // list of films from server
                this.isLoading = true; // START the loading-render

                // axios request --> films and tv series
                axios
                    .get(apiUrl + "search/multi", { params: {
                            api_key: myApiKey,
                            query: thisSearch, // user's search --> see data
                            language: "it",
                        }
                    }).then( (filmsResults) => {
                        currentList = filmsResults.data.results;

                        // filter the results: discard the person
                        currentList = currentList.filter( (item) => {
                            return item.media_type != "person";
                        });

                        this.films = currentList; // push the list into the data
                        this.isLoading = false; // END the loading-render
                    })
                ;
            } // END if: get films
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

    },
});
