import Rest from '../node_modules/@dmail/rest/index.js';

import fileService from '../index.js';

var rest = Rest.create();
rest.use(fileService);

function fetch(filepath){	
	return rest.fetch(rest.locate('files/' + filepath));
}

export function suite(add){

	add("status 200 for existing file", function(){
		return this.resolveWith(fetch('200.txt'), {status: 200});
	});

	add("status 403 for EACCES", function(){

	});

	add("status 403 for EPERM", function(){

	});

	add("status 404 for ENONENT", function(){

	});

	add("status 503 for EBUSY", function(){

	});

	add("status 503 for EMFILE", function(){

	});	

	add("response body is file content", function(){

	});

	add("content-type computed from file extension", function(){

	});

	add("last-modified header", function(){

	});

	/*
	add("directory when canReadDirectory is false", function(){
		var rest = Rest.create();

		rest.use(fileService);

		return this.resolveWith(rest.fetch('file:///').then(function(response){
			return response.text();
		}), 'export default true');
	});

	add("directory when canReadDirectory is true", function(){
		var rest = Rest.create();

		rest.use(fileService);

		return this.resolveWith(rest.fetch('file:///').then(function(response){
			return response.text();
		}), 'export default true');
	});

	add("request not handled when file outise of fileService.root", function(){

	});
	*/
}