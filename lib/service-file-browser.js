import rest from '../node_modules/@dmail/rest/index.js';
import httpService from '../node_modules/@dmail/service-http/index.js';

var FileService = rest.createService({
	name: 'service-file',
	root: 'file:///',

	match(request){
		return String(request.url).startsWith(this.root);
	},

	methods: {
		"*"(request){
			var httpResponsePromise = httpService.tranport(request);

			// fix for browsers returning status == 0 for local file request
			httpResponsePromise = httpResponsePromise.then(function(response){
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

				return response;
			});

			return httpResponsePromise;
		}
	}
});

export default FileService;