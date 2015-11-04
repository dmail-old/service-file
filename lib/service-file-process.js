import getFile from './util/get.js';
import postFile from './util/post.js';

import http from '../node_modules/@dmail/http/index.js';

var FileService = http.createService({
	canReadDirectory: false,
	root: 'file:///',

	handleRequest(request){
		if( String(request.url).indexOf(this.root) === 0 ){
			if( request.method === 'GET' ){
				return getFile(this, request);
			}
			else if( request.method === 'POST' ){
				return postFile(this, request);
			}
		}
	}
});

export default FileService;