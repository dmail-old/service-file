import rest from '../node_modules/@dmail/rest/index.js';

var FileService = rest.createService({
	root: 'file:///',

	handleResponse(request, response){
		if( String(request.url).indexOf(this.root) === 0 ){
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
	}
});

export default FileService;