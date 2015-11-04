import filesystem from './filesystem.js';
import hasdir from './has-dir.js';

function createDirectory(dir){
	return hasdir(dir).then(function(has){
		if( has ) return;

		console.log('create directory', dir);
		return filesystem('mkdir', dir).catch(function(error){
			if( error && error.code === 'EEXIST' ) return;
			return Promise.reject(error);
		});
	});
}

function createDirectoriesTo(location){
	var directories = location.replace(/\\/g, '/').split('/');

	directories.pop();

	return directories.reduce(function(previous, directory, index){
		var directoryLocation = directories.slice(0, index + 1).join('/');

		return previous.then(function(){
			return createDirectory(directoryLocation);
		});
	}, Promise.resolve());
}

/*
Iterable.map(directories, function(directory, index){
	return
});
Iterable.reduceToThenable(directoriePromises)
*/

export default createDirectoriesTo;