import nodefs from 'node/fs';

import rest from '../node_modules/@dmail/rest/index.js';

import filesystem from './util/filesystem.js';
import mimetype from './util/mimetype.js';
import mkdirto from './util/mkdir-to.js';

function stripFileProtocol(url){
	if( url.indexOf('file:///') === 0 ){
		url = url.slice('file:///'.length);
	}
	return url;
}

function getFilePath(request){
	return stripFileProtocol(String(request.url));
}

var FileService = rest.createService({
	name: 'service-file',
	canReadDirectory: false,
	root: 'file:///',

	match(request){
		return String(request.url).startsWith(this.root);
	},

	readDirectory(location){
		if( this.canReadDirectory ){
			return filesystem('readdir', location).then(JSON.stringify).then(function(body){
				return {
					status: 200,
					headers: {
						'content-type': 'application/json',
						'content-length': body.length
					},
					body: body
				};
			});
		}
		else{
			return {
				status: 403
			};
		}
	},

	get(request){
		var filepath = getFilePath(request), promise;

		promise = filesystem('stat', filepath).then(function(stat){
			if( stat.isDirectory() ){
				return this.readDirectory(filepath);
			}

			if( request.headers.has('if-modified-since') ){
				// the request headers if-modified-since is not a valid date
				var mtime;

				try{
					mtime = new Date(request.headers.get('if-modified-since'));
				}
				catch(e){
					return 400;
				}

				if( stat.mtime <= mtime ){
					return {
						status: 304,
						headers: {
							'last-modified': stat.mtime.toUTCString()
						}
					};
				}
			}

			var properties = {
				status: 200,
				headers: {
					'last-modified': stat.mtime.toUTCString(),
					'content-type': mimetype(filepath),
					'content-length': stat.size
				}
			};

			if( request.method != 'HEAD' ){
				properties.body = nodefs.createReadStream(filepath);
			}

			return properties;
		}.bind(this));

		promise = promise.catch(function(error){
			if( error ){			
				// https://iojs.org/api/errors.html#errors_eacces_permission_denied
				if( error.code === 'EACCES' ){
					return {
						status: 403
					};
				}
				if( error.code === 'EPERM' ){
					return {
						status: 403
					};
				}
				if( error.code == 'ENOENT' ){
					return {
						status: 404
					};
				}
				// file access may be temporarily blocked
				// (by an antivirus scanning it because recently modified for instance)
				if( error.code === 'EBUSY' ){
					return {
						status: 503,
						headers: {
							'retry-after': 0.01 // retry in 10ms
						}
					};
				}
				// emfile means there is too many files currently opened
				if( error.code === 'EMFILE' ){
					return {
						status: 503,
						headers: {
							'retry-after': 0.1 // retry in 100ms
						}
					};
				}
			}
			return Promise.reject(error);
		});

		return promise;
	},

	post(request){
		var url = getFilePath(request), promise;

		// faudrais renvoyer last-modified, size et tout non?
		promise = mkdirto(url).then(function(){
			return request.body.pipeTo(nodefs.createWriteStream(url)).then(function(){
				return {
					status: 200
				};
			});
		});

		return promise;
	},

	methods: {
		get(request){
			return this.get(request);
		},

		post(request){
			return this.post(request);
		}
	}
});

export default FileService;