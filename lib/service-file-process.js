import getFile from './util/get.js';
import postFile from './util/post.js';

import rest from '../node_modules/@dmail/rest/index.js';

var FileService = rest.createService({
	name: 'service-file',
	canReadDirectory: false,
	root: 'file:///',

	match(request){
		return String(request.url).indexOf(this.root) === 0;
	},

	methods: {
		get(request){
			return getFile(this, request);
		},

		post(request){
			return postFile(this, request);
		}
	}
});

export default FileService;