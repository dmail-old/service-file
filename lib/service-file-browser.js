import rest from '../node_modules/@dmail/rest/index.js';

// en fait ici il faudrais 

var FileService = rest.createService({
	name: 'service-file',
	root: 'file:///',

	match(request){
		return String(request.url).indexOf(this.root) === 0;
	},

	methods: {
		"*"(request){
			// must return httpService.tranport(request)
		}
	},

	// faudrais-t-il n'apeller cette fonction que si match ?
	// parce que le prob là c'est que cette fonction sera appelé tout le temps
	// je pense qu'ici intercept devrais se faire dans methods
	intercept(request, response){
		// fix for browsers returning status == 0 for local file request
		if( response.status === 0 ){
			if( response.body ){
				return response.body.readAsString().then(function(string){
					response.status = string ? 200 : 404;
					return response;
				});
			}
			else{
				response.status = 404;
			}
		}
	}
});

export default FileService;