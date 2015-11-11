import Rest from '../node_modules/@dmail/rest/index.js';

import fileService from '../index.js';

var rest = Rest.create();
rest.use(fileService);

function getFileURL(filepath){
	return rest.locate('files/' + filepath);
}

function fetch(filepath){	
	return rest.fetch(getFileURL(filepath));
}

export function suite(add){

	add("status 200 for existing file", function(){
		return this.resolveWith(fetch('200.txt'), {status: 200});
	});

	add("status 403 for EPERM", function(){
		return this.resolveWith(fetch('EPERM'), {status: 403});
	});

	add("status 403 for EACCES", function(){

	}).skip('no idea how to trigger EACCES error');	

	add("status 404 for ENOENT", function(){
		return this.resolveWith(fetch('ENOENT'), {status: 404});
	});

	add("status 503 for EBUSY", function(){
		var fileURL = getFileURL('EBUSY');
		var filePath = String(fileURL).slice('file:///'.length);

		return this.resolveWith(fetch('EBUSY'), {status: 503});
	}).skip('no iead how to lock a file');

	add("status 503 for EMFILE", function(){

	}).skip('I wont open 2000 files to test this');

	add("response body is file content", function(){
		return this.resolveWith(fetch('200.txt').then(function(response){
			return response.text();
		}), 'Hello world');
	});

	add("content-type computed from file extension", function(){
		return this.resolveWith(fetch('200.txt').then(function(response){
			return response.headers.get('content-type');
		}), 'text/plain');
	});

	add("last-modified header", function(){
		return this.resolveWith(fetch('200.txt').then(function(response){
			return response.headers.has('last-modified');
		}), true);
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