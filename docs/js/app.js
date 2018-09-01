/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "eca2d6329755784a0108"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(382)(__webpack_require__.s = 382);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var global = __webpack_require__(2);
var core = __webpack_require__(22);
var hide = __webpack_require__(11);
var redefine = __webpack_require__(12);
var ctx = __webpack_require__(19);
var PROTOTYPE = 'prototype';

var $export = function $export(type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1; // forced
$export.G = 2; // global
$export.S = 4; // static
$export.P = 8; // proto
$export.B = 16; // bind
$export.W = 32; // wrap
$export.U = 64; // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isObject = __webpack_require__(4);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self
// eslint-disable-next-line no-new-func
: Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function (it) {
  return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) === 'object' ? it !== null : typeof it === 'function';
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var store = __webpack_require__(62)('wks');
var uid = __webpack_require__(41);
var _Symbol = __webpack_require__(2).Symbol;
var USE_SYMBOL = typeof _Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] = USE_SYMBOL && _Symbol[name] || (USE_SYMBOL ? _Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(3)(function () {
  return Object.defineProperty({}, 'a', { get: function get() {
      return 7;
    } }).a != 7;
});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__(1);
var IE8_DOM_DEFINE = __webpack_require__(107);
var toPrimitive = __webpack_require__(26);
var dP = Object.defineProperty;

exports.f = __webpack_require__(6) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) {/* empty */}
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 7.1.15 ToLength
var toInteger = __webpack_require__(25);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 7.1.13 ToObject(argument)
var defined = __webpack_require__(23);
module.exports = function (it) {
  return Object(defined(it));
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var dP = __webpack_require__(7);
var createDesc = __webpack_require__(37);
module.exports = __webpack_require__(6) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var global = __webpack_require__(2);
var hide = __webpack_require__(11);
var has = __webpack_require__(14);
var SRC = __webpack_require__(41)('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__(22).inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
var fails = __webpack_require__(3);
var defined = __webpack_require__(23);
var quot = /"/g;
// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
var createHTML = function createHTML(string, tag, attribute, value) {
  var S = String(defined(string));
  var p1 = '<' + tag;
  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};
module.exports = function (NAME, exec) {
  var O = {};
  O[NAME] = exec(createHTML);
  $export($export.P + $export.F * fails(function () {
    var test = ''[NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  }), 'String', O);
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var pIE = __webpack_require__(48);
var createDesc = __webpack_require__(37);
var toIObject = __webpack_require__(17);
var toPrimitive = __webpack_require__(26);
var has = __webpack_require__(14);
var IE8_DOM_DEFINE = __webpack_require__(107);
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(6) ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) {/* empty */}
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(14);
var toObject = __webpack_require__(9);
var IE_PROTO = __webpack_require__(82)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  }return O instanceof Object ? ObjectProto : null;
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(47);
var defined = __webpack_require__(23);
module.exports = function (it) {
  return IObject(defined(it));
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// optional / simple context binding
var aFunction = __webpack_require__(10);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1:
      return function (a) {
        return fn.call(that, a);
      };
    case 2:
      return function (a, b) {
        return fn.call(that, a, b);
      };
    case 3:
      return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
  }
  return function () /* ...args */{
    return fn.apply(that, arguments);
  };
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var fails = __webpack_require__(3);

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () {/* empty */}, 1) : method.call(null);
  });
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__(19);
var IObject = __webpack_require__(47);
var toObject = __webpack_require__(9);
var toLength = __webpack_require__(8);
var asc = __webpack_require__(67);
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (; length > index; index++) {
      if (NO_HOLES || index in self) {
        val = self[index];
        res = f(val, index, O);
        if (TYPE) {
          if (IS_MAP) result[index] = res; // map
          else if (res) switch (TYPE) {
              case 3:
                return true; // some
              case 5:
                return val; // find
              case 6:
                return index; // findIndex
              case 2:
                result.push(val); // filter
            } else if (IS_EVERY) return false; // every
        }
      }
    }return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var core = module.exports = { version: '2.5.5' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(0);
var core = __webpack_require__(22);
var fails = __webpack_require__(3);
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () {
    fn(1);
  }), 'Object', exp);
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(4);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Map = __webpack_require__(128);
var $export = __webpack_require__(0);
var shared = __webpack_require__(62)('metadata');
var store = shared.store || (shared.store = new (__webpack_require__(131))());

var getOrCreateMetadataMap = function getOrCreateMetadataMap(target, targetKey, create) {
  var targetMetadata = store.get(target);
  if (!targetMetadata) {
    if (!create) return undefined;
    store.set(target, targetMetadata = new Map());
  }
  var keyMetadata = targetMetadata.get(targetKey);
  if (!keyMetadata) {
    if (!create) return undefined;
    targetMetadata.set(targetKey, keyMetadata = new Map());
  }return keyMetadata;
};
var ordinaryHasOwnMetadata = function ordinaryHasOwnMetadata(MetadataKey, O, P) {
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? false : metadataMap.has(MetadataKey);
};
var ordinaryGetOwnMetadata = function ordinaryGetOwnMetadata(MetadataKey, O, P) {
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? undefined : metadataMap.get(MetadataKey);
};
var ordinaryDefineOwnMetadata = function ordinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
  getOrCreateMetadataMap(O, P, true).set(MetadataKey, MetadataValue);
};
var ordinaryOwnMetadataKeys = function ordinaryOwnMetadataKeys(target, targetKey) {
  var metadataMap = getOrCreateMetadataMap(target, targetKey, false);
  var keys = [];
  if (metadataMap) metadataMap.forEach(function (_, key) {
    keys.push(key);
  });
  return keys;
};
var toMetaKey = function toMetaKey(it) {
  return it === undefined || (typeof it === 'undefined' ? 'undefined' : _typeof(it)) == 'symbol' ? it : String(it);
};
var exp = function exp(O) {
  $export($export.S, 'Reflect', O);
};

module.exports = {
  store: store,
  map: getOrCreateMetadataMap,
  has: ordinaryHasOwnMetadata,
  get: ordinaryGetOwnMetadata,
  set: ordinaryDefineOwnMetadata,
  keys: ordinaryOwnMetadataKeys,
  key: toMetaKey,
  exp: exp
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

if (__webpack_require__(6)) {
  var LIBRARY = __webpack_require__(33);
  var global = __webpack_require__(2);
  var fails = __webpack_require__(3);
  var $export = __webpack_require__(0);
  var $typed = __webpack_require__(64);
  var $buffer = __webpack_require__(88);
  var ctx = __webpack_require__(19);
  var anInstance = __webpack_require__(31);
  var propertyDesc = __webpack_require__(37);
  var hide = __webpack_require__(11);
  var redefineAll = __webpack_require__(38);
  var toInteger = __webpack_require__(25);
  var toLength = __webpack_require__(8);
  var toIndex = __webpack_require__(126);
  var toAbsoluteIndex = __webpack_require__(40);
  var toPrimitive = __webpack_require__(26);
  var has = __webpack_require__(14);
  var classof = __webpack_require__(46);
  var isObject = __webpack_require__(4);
  var toObject = __webpack_require__(9);
  var isArrayIter = __webpack_require__(74);
  var create = __webpack_require__(34);
  var getPrototypeOf = __webpack_require__(16);
  var gOPN = __webpack_require__(35).f;
  var getIterFn = __webpack_require__(91);
  var uid = __webpack_require__(41);
  var wks = __webpack_require__(5);
  var createArrayMethod = __webpack_require__(21);
  var createArrayIncludes = __webpack_require__(51);
  var speciesConstructor = __webpack_require__(63);
  var ArrayIterators = __webpack_require__(92);
  var Iterators = __webpack_require__(42);
  var $iterDetect = __webpack_require__(57);
  var setSpecies = __webpack_require__(39);
  var arrayFill = __webpack_require__(66);
  var arrayCopyWithin = __webpack_require__(99);
  var $DP = __webpack_require__(7);
  var $GOPD = __webpack_require__(15);
  var dP = $DP.f;
  var gOPD = $GOPD.f;
  var RangeError = global.RangeError;
  var TypeError = global.TypeError;
  var Uint8Array = global.Uint8Array;
  var ARRAY_BUFFER = 'ArrayBuffer';
  var SHARED_BUFFER = 'Shared' + ARRAY_BUFFER;
  var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
  var PROTOTYPE = 'prototype';
  var ArrayProto = Array[PROTOTYPE];
  var $ArrayBuffer = $buffer.ArrayBuffer;
  var $DataView = $buffer.DataView;
  var arrayForEach = createArrayMethod(0);
  var arrayFilter = createArrayMethod(2);
  var arraySome = createArrayMethod(3);
  var arrayEvery = createArrayMethod(4);
  var arrayFind = createArrayMethod(5);
  var arrayFindIndex = createArrayMethod(6);
  var arrayIncludes = createArrayIncludes(true);
  var arrayIndexOf = createArrayIncludes(false);
  var arrayValues = ArrayIterators.values;
  var arrayKeys = ArrayIterators.keys;
  var arrayEntries = ArrayIterators.entries;
  var arrayLastIndexOf = ArrayProto.lastIndexOf;
  var arrayReduce = ArrayProto.reduce;
  var arrayReduceRight = ArrayProto.reduceRight;
  var arrayJoin = ArrayProto.join;
  var arraySort = ArrayProto.sort;
  var arraySlice = ArrayProto.slice;
  var arrayToString = ArrayProto.toString;
  var arrayToLocaleString = ArrayProto.toLocaleString;
  var ITERATOR = wks('iterator');
  var TAG = wks('toStringTag');
  var TYPED_CONSTRUCTOR = uid('typed_constructor');
  var DEF_CONSTRUCTOR = uid('def_constructor');
  var ALL_CONSTRUCTORS = $typed.CONSTR;
  var TYPED_ARRAY = $typed.TYPED;
  var VIEW = $typed.VIEW;
  var WRONG_LENGTH = 'Wrong length!';

  var $map = createArrayMethod(1, function (O, length) {
    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
  });

  var LITTLE_ENDIAN = fails(function () {
    // eslint-disable-next-line no-undef
    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
  });

  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function () {
    new Uint8Array(1).set({});
  });

  var toOffset = function toOffset(it, BYTES) {
    var offset = toInteger(it);
    if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset!');
    return offset;
  };

  var validate = function validate(it) {
    if (isObject(it) && TYPED_ARRAY in it) return it;
    throw TypeError(it + ' is not a typed array!');
  };

  var allocate = function allocate(C, length) {
    if (!(isObject(C) && TYPED_CONSTRUCTOR in C)) {
      throw TypeError('It is not a typed array constructor!');
    }return new C(length);
  };

  var speciesFromList = function speciesFromList(O, list) {
    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
  };

  var fromList = function fromList(C, list) {
    var index = 0;
    var length = list.length;
    var result = allocate(C, length);
    while (length > index) {
      result[index] = list[index++];
    }return result;
  };

  var addGetter = function addGetter(it, key, internal) {
    dP(it, key, { get: function get() {
        return this._d[internal];
      } });
  };

  var $from = function from(source /* , mapfn, thisArg */) {
    var O = toObject(source);
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iterFn = getIterFn(O);
    var i, length, values, result, step, iterator;
    if (iterFn != undefined && !isArrayIter(iterFn)) {
      for (iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++) {
        values.push(step.value);
      }O = values;
    }
    if (mapping && aLen > 2) mapfn = ctx(mapfn, arguments[2], 2);
    for (i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++) {
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var $of = function of() /* ...items */{
    var index = 0;
    var length = arguments.length;
    var result = allocate(this, length);
    while (length > index) {
      result[index] = arguments[index++];
    }return result;
  };

  // iOS Safari 6.x fails here
  var TO_LOCALE_BUG = !!Uint8Array && fails(function () {
    arrayToLocaleString.call(new Uint8Array(1));
  });

  var $toLocaleString = function toLocaleString() {
    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
  };

  var proto = {
    copyWithin: function copyWithin(target, start /* , end */) {
      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function every(callbackfn /* , thisArg */) {
      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function fill(value /* , start, end */) {
      // eslint-disable-line no-unused-vars
      return arrayFill.apply(validate(this), arguments);
    },
    filter: function filter(callbackfn /* , thisArg */) {
      return speciesFromList(this, arrayFilter(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function find(predicate /* , thisArg */) {
      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function findIndex(predicate /* , thisArg */) {
      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function forEach(callbackfn /* , thisArg */) {
      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function indexOf(searchElement /* , fromIndex */) {
      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function includes(searchElement /* , fromIndex */) {
      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function join(separator) {
      // eslint-disable-line no-unused-vars
      return arrayJoin.apply(validate(this), arguments);
    },
    lastIndexOf: function lastIndexOf(searchElement /* , fromIndex */) {
      // eslint-disable-line no-unused-vars
      return arrayLastIndexOf.apply(validate(this), arguments);
    },
    map: function map(mapfn /* , thisArg */) {
      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function reduce(callbackfn /* , initialValue */) {
      // eslint-disable-line no-unused-vars
      return arrayReduce.apply(validate(this), arguments);
    },
    reduceRight: function reduceRight(callbackfn /* , initialValue */) {
      // eslint-disable-line no-unused-vars
      return arrayReduceRight.apply(validate(this), arguments);
    },
    reverse: function reverse() {
      var that = this;
      var length = validate(that).length;
      var middle = Math.floor(length / 2);
      var index = 0;
      var value;
      while (index < middle) {
        value = that[index];
        that[index++] = that[--length];
        that[length] = value;
      }return that;
    },
    some: function some(callbackfn /* , thisArg */) {
      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function sort(comparefn) {
      return arraySort.call(validate(this), comparefn);
    },
    subarray: function subarray(begin, end) {
      var O = validate(this);
      var length = O.length;
      var $begin = toAbsoluteIndex(begin, length);
      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(O.buffer, O.byteOffset + $begin * O.BYTES_PER_ELEMENT, toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - $begin));
    }
  };

  var $slice = function slice(start, end) {
    return speciesFromList(this, arraySlice.call(validate(this), start, end));
  };

  var $set = function set(arrayLike /* , offset */) {
    validate(this);
    var offset = toOffset(arguments[1], 1);
    var length = this.length;
    var src = toObject(arrayLike);
    var len = toLength(src.length);
    var index = 0;
    if (len + offset > length) throw RangeError(WRONG_LENGTH);
    while (index < len) {
      this[offset + index] = src[index++];
    }
  };

  var $iterators = {
    entries: function entries() {
      return arrayEntries.call(validate(this));
    },
    keys: function keys() {
      return arrayKeys.call(validate(this));
    },
    values: function values() {
      return arrayValues.call(validate(this));
    }
  };

  var isTAIndex = function isTAIndex(target, key) {
    return isObject(target) && target[TYPED_ARRAY] && (typeof key === 'undefined' ? 'undefined' : _typeof(key)) != 'symbol' && key in target && String(+key) == String(key);
  };
  var $getDesc = function getOwnPropertyDescriptor(target, key) {
    return isTAIndex(target, key = toPrimitive(key, true)) ? propertyDesc(2, target[key]) : gOPD(target, key);
  };
  var $setDesc = function defineProperty(target, key, desc) {
    if (isTAIndex(target, key = toPrimitive(key, true)) && isObject(desc) && has(desc, 'value') && !has(desc, 'get') && !has(desc, 'set')
    // TODO: add validation descriptor w/o calling accessors
    && !desc.configurable && (!has(desc, 'writable') || desc.writable) && (!has(desc, 'enumerable') || desc.enumerable)) {
      target[key] = desc.value;
      return target;
    }return dP(target, key, desc);
  };

  if (!ALL_CONSTRUCTORS) {
    $GOPD.f = $getDesc;
    $DP.f = $setDesc;
  }

  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
    getOwnPropertyDescriptor: $getDesc,
    defineProperty: $setDesc
  });

  if (fails(function () {
    arrayToString.call({});
  })) {
    arrayToString = arrayToLocaleString = function toString() {
      return arrayJoin.call(this);
    };
  }

  var $TypedArrayPrototype$ = redefineAll({}, proto);
  redefineAll($TypedArrayPrototype$, $iterators);
  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
  redefineAll($TypedArrayPrototype$, {
    slice: $slice,
    set: $set,
    constructor: function constructor() {/* noop */},
    toString: arrayToString,
    toLocaleString: $toLocaleString
  });
  addGetter($TypedArrayPrototype$, 'buffer', 'b');
  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
  addGetter($TypedArrayPrototype$, 'length', 'e');
  dP($TypedArrayPrototype$, TAG, {
    get: function get() {
      return this[TYPED_ARRAY];
    }
  });

  // eslint-disable-next-line max-statements
  module.exports = function (KEY, BYTES, wrapper, CLAMPED) {
    CLAMPED = !!CLAMPED;
    var NAME = KEY + (CLAMPED ? 'Clamped' : '') + 'Array';
    var GETTER = 'get' + KEY;
    var SETTER = 'set' + KEY;
    var TypedArray = global[NAME];
    var Base = TypedArray || {};
    var TAC = TypedArray && getPrototypeOf(TypedArray);
    var FORCED = !TypedArray || !$typed.ABV;
    var O = {};
    var TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
    var getter = function getter(that, index) {
      var data = that._d;
      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
    };
    var setter = function setter(that, index, value) {
      var data = that._d;
      if (CLAMPED) value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
    };
    var addElement = function addElement(that, index) {
      dP(that, index, {
        get: function get() {
          return getter(this, index);
        },
        set: function set(value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };
    if (FORCED) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME, '_d');
        var index = 0;
        var offset = 0;
        var buffer, byteLength, length, klass;
        if (!isObject(data)) {
          length = toIndex(data);
          byteLength = length * BYTES;
          buffer = new $ArrayBuffer(byteLength);
        } else if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          buffer = data;
          offset = toOffset($offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - offset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + offset > $len) throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (TYPED_ARRAY in data) {
          return fromList(TypedArray, data);
        } else {
          return $from.call(TypedArray, data);
        }
        hide(that, '_d', {
          b: buffer,
          o: offset,
          l: byteLength,
          e: length,
          v: new $DataView(buffer)
        });
        while (index < length) {
          addElement(that, index++);
        }
      });
      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
      hide(TypedArrayPrototype, 'constructor', TypedArray);
    } else if (!fails(function () {
      TypedArray(1);
    }) || !fails(function () {
      new TypedArray(-1); // eslint-disable-line no-new
    }) || !$iterDetect(function (iter) {
      new TypedArray(); // eslint-disable-line no-new
      new TypedArray(null); // eslint-disable-line no-new
      new TypedArray(1.5); // eslint-disable-line no-new
      new TypedArray(iter); // eslint-disable-line no-new
    }, true)) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME);
        var klass;
        // `ws` module bug, temporarily remove validation length for Uint8Array
        // https://github.com/websockets/ws/pull/645
        if (!isObject(data)) return new Base(toIndex(data));
        if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          return $length !== undefined ? new Base(data, toOffset($offset, BYTES), $length) : $offset !== undefined ? new Base(data, toOffset($offset, BYTES)) : new Base(data);
        }
        if (TYPED_ARRAY in data) return fromList(TypedArray, data);
        return $from.call(TypedArray, data);
      });
      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function (key) {
        if (!(key in TypedArray)) hide(TypedArray, key, Base[key]);
      });
      TypedArray[PROTOTYPE] = TypedArrayPrototype;
      if (!LIBRARY) TypedArrayPrototype.constructor = TypedArray;
    }
    var $nativeIterator = TypedArrayPrototype[ITERATOR];
    var CORRECT_ITER_NAME = !!$nativeIterator && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined);
    var $iterator = $iterators.values;
    hide(TypedArray, TYPED_CONSTRUCTOR, true);
    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
    hide(TypedArrayPrototype, VIEW, true);
    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

    if (CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)) {
      dP(TypedArrayPrototype, TAG, {
        get: function get() {
          return NAME;
        }
      });
    }

    O[NAME] = TypedArray;

    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

    $export($export.S, NAME, {
      BYTES_PER_ELEMENT: BYTES
    });

    $export($export.S + $export.F * fails(function () {
      Base.of.call(TypedArray, 1);
    }), NAME, {
      from: $from,
      of: $of
    });

    if (!(BYTES_PER_ELEMENT in TypedArrayPrototype)) hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

    $export($export.P, NAME, proto);

    setSpecies(NAME);

    $export($export.P + $export.F * FORCED_SET, NAME, { set: $set });

    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

    if (!LIBRARY && TypedArrayPrototype.toString != arrayToString) TypedArrayPrototype.toString = arrayToString;

    $export($export.P + $export.F * fails(function () {
      new TypedArray(1).slice();
    }), NAME, { slice: $slice });

    $export($export.P + $export.F * (fails(function () {
      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString();
    }) || !fails(function () {
      TypedArrayPrototype.toLocaleString.call([1, 2]);
    })), NAME, { toLocaleString: $toLocaleString });

    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
    if (!LIBRARY && !CORRECT_ITER_NAME) hide(TypedArrayPrototype, ITERATOR, $iterator);
  };
} else module.exports = function () {/* empty */};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__(5)('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__(11)(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var META = __webpack_require__(41)('meta');
var isObject = __webpack_require__(4);
var has = __webpack_require__(14);
var setDesc = __webpack_require__(7).f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__(3)(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function setMeta(it) {
  setDesc(it, META, { value: {
      i: 'O' + ++id, // object ID
      w: {} // weak collections IDs
    } });
};
var fastKey = function fastKey(it, create) {
  // return primitive with prefix
  if (!isObject(it)) return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
    // return object ID
  }return it[META].i;
};
var getWeak = function getWeak(it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
    // return hash weak collections IDs
  }return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function onFreeze(it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || forbiddenField !== undefined && forbiddenField in it) {
    throw TypeError(name + ': incorrect invocation!');
  }return it;
};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ctx = __webpack_require__(19);
var call = __webpack_require__(110);
var isArrayIter = __webpack_require__(74);
var anObject = __webpack_require__(1);
var toLength = __webpack_require__(8);
var getIterFn = __webpack_require__(91);
var BREAK = {};
var RETURN = {};
var _exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () {
    return iterable;
  } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
_exports.BREAK = BREAK;
_exports.RETURN = RETURN;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = false;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(1);
var dPs = __webpack_require__(116);
var enumBugKeys = __webpack_require__(70);
var IE_PROTO = __webpack_require__(82)('IE_PROTO');
var Empty = function Empty() {/* empty */};
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var _createDict = function createDict() {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(69)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(72).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  _createDict = iframeDocument.F;
  while (i--) {
    delete _createDict[PROTOTYPE][enumBugKeys[i]];
  }return _createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = _createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__(118);
var hiddenKeys = __webpack_require__(70).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(118);
var enumBugKeys = __webpack_require__(70);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var redefine = __webpack_require__(12);
module.exports = function (target, src, safe) {
  for (var key in src) {
    redefine(target, key, src[key], safe);
  }return target;
};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var global = __webpack_require__(2);
var dP = __webpack_require__(7);
var DESCRIPTORS = __webpack_require__(6);
var SPECIES = __webpack_require__(5)('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function get() {
      return this;
    }
  });
};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toInteger = __webpack_require__(25);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {};

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var def = __webpack_require__(7).f;
var has = __webpack_require__(14);
var TAG = __webpack_require__(5)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
var defined = __webpack_require__(23);
var fails = __webpack_require__(3);
var spaces = __webpack_require__(86);
var space = '[' + spaces + ']';
var non = '\u200B\x85';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function exporter(KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isObject = __webpack_require__(4);
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(18);
var TAG = __webpack_require__(5)('toStringTag');
// ES3 wrong here
var ARG = cof(function () {
  return arguments;
}()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function tryGet(it, key) {
  try {
    return it[key];
  } catch (e) {/* empty */}
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
  // @@toStringTag case
  : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
  // builtinTag case
  : ARG ? cof(O)
  // ES3 arguments fallback
  : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(18);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.f = {}.propertyIsEnumerable;

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if (item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function (modules, mediaQuery) {
		if (typeof modules === "string") modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for (var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if (typeof id === "number") alreadyImportedModules[id] = true;
		}
		for (i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if (mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if (mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(17);
var toLength = __webpack_require__(8);
var toAbsoluteIndex = __webpack_require__(40);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
    } else for (; length > index; index++) {
      if (IS_INCLUDES || index in O) {
        if (O[index] === el) return IS_INCLUDES || index || 0;
      }
    }return !IS_INCLUDES && -1;
  };
};

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var global = __webpack_require__(2);
var $export = __webpack_require__(0);
var redefine = __webpack_require__(12);
var redefineAll = __webpack_require__(38);
var meta = __webpack_require__(30);
var forOf = __webpack_require__(32);
var anInstance = __webpack_require__(31);
var isObject = __webpack_require__(4);
var fails = __webpack_require__(3);
var $iterDetect = __webpack_require__(57);
var setToStringTag = __webpack_require__(43);
var inheritIfRequired = __webpack_require__(73);

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  var fixMethod = function fixMethod(KEY) {
    var fn = proto[KEY];
    redefine(proto, KEY, KEY == 'delete' ? function (a) {
      return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
    } : KEY == 'has' ? function has(a) {
      return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
    } : KEY == 'get' ? function get(a) {
      return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
    } : KEY == 'add' ? function add(a) {
      fn.call(this, a === 0 ? 0 : a);return this;
    } : function set(a, b) {
      fn.call(this, a === 0 ? 0 : a, b);return this;
    });
  };
  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance = new C();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () {
      instance.has(1);
    });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    var ACCEPT_ITERABLES = $iterDetect(function (iter) {
      new C(iter);
    }); // eslint-disable-line no-new
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new C();
      var index = 5;
      while (index--) {
        $instance[ADDER](index, index);
      }return !$instance.has(-0);
    });
    if (!ACCEPT_ITERABLES) {
      C = wrapper(function (target, iterable) {
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base(), target, C);
        if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
    // weak collections should not contains .clear method
    if (IS_WEAK && proto.clear) delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hide = __webpack_require__(11);
var redefine = __webpack_require__(12);
var fails = __webpack_require__(3);
var defined = __webpack_require__(23);
var wks = __webpack_require__(5);

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);
  var fns = exec(defined, SYMBOL, ''[KEY]);
  var strfn = fns[0];
  var rxfn = fns[1];
  if (fails(function () {
    var O = {};
    O[SYMBOL] = function () {
      return 7;
    };
    return ''[KEY](O) != 7;
  })) {
    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
    // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
    // 21.2.5.11 RegExp.prototype[@@split](string, limit)
    ? function (string, arg) {
      return rxfn.call(string, this, arg);
    }
    // 21.2.5.6 RegExp.prototype[@@match](string)
    // 21.2.5.9 RegExp.prototype[@@search](string)
    : function (string) {
      return rxfn.call(string, this);
    });
  }
};

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.2.5.3 get RegExp.prototype.flags

var anObject = __webpack_require__(1);
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 7.2.2 IsArray(argument)
var cof = __webpack_require__(18);
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 7.2.8 IsRegExp(argument)
var isObject = __webpack_require__(4);
var cof = __webpack_require__(18);
var MATCH = __webpack_require__(5)('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ITERATOR = __webpack_require__(5)('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () {
    SAFE_CLOSING = true;
  };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () {
    throw 2;
  });
} catch (e) {/* empty */}

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () {
      return { done: safe = true };
    };
    arr[ITERATOR] = function () {
      return iter;
    };
    exec(arr);
  } catch (e) {/* empty */}
  return safe;
};

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// Forced replacement prototype accessors methods

module.exports = __webpack_require__(33) || !__webpack_require__(3)(function () {
  var K = Math.random();
  // In FF throws only define methods
  // eslint-disable-next-line no-undef, no-useless-call
  __defineSetter__.call(null, K, function () {/* empty */});
  delete __webpack_require__(2)[K];
});

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.f = Object.getOwnPropertySymbols;

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-setmap-offrom/

var $export = __webpack_require__(0);
var aFunction = __webpack_require__(10);
var ctx = __webpack_require__(19);
var forOf = __webpack_require__(32);

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { from: function from(source /* , mapFn, thisArg */) {
      var mapFn = arguments[1];
      var mapping, A, n, cb;
      aFunction(this);
      mapping = mapFn !== undefined;
      if (mapping) aFunction(mapFn);
      if (source == undefined) return new this();
      A = [];
      if (mapping) {
        n = 0;
        cb = ctx(mapFn, arguments[2], 2);
        forOf(source, false, function (nextItem) {
          A.push(cb(nextItem, n++));
        });
      } else {
        forOf(source, false, A.push, A);
      }
      return new this(A);
    } });
};

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-setmap-offrom/

var $export = __webpack_require__(0);

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { of: function of() {
      var length = arguments.length;
      var A = new Array(length);
      while (length--) {
        A[length] = arguments[length];
      }return new this(A);
    } });
};

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var global = __webpack_require__(2);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__(1);
var aFunction = __webpack_require__(10);
var SPECIES = __webpack_require__(5)('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var global = __webpack_require__(2);
var hide = __webpack_require__(11);
var uid = __webpack_require__(41);
var TYPED = uid('typed_array');
var VIEW = uid('view');
var ABV = !!(global.ArrayBuffer && global.DataView);
var CONSTR = ABV;
var i = 0;
var l = 9;
var Typed;

var TypedArrayConstructors = 'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'.split(',');

while (i < l) {
  if (Typed = global[TypedArrayConstructors[i++]]) {
    hide(Typed.prototype, TYPED, true);
    hide(Typed.prototype, VIEW, true);
  } else CONSTR = false;
}

module.exports = {
  ABV: ABV,
  CONSTR: CONSTR,
  TYPED: TYPED,
  VIEW: VIEW
};

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		// Test for IE <= 9 as proposed by Browserhacks
		// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
		// Tests for existence of standard globals is to allow style-loader 
		// to operate correctly into non-standard environments
		// @see https://github.com/webpack-contrib/style-loader/issues/177
		return window && document && document.all && !window.atob;
	}),
	getElement = (function(fn) {
		var memo = {};
		return function(selector) {
			if (typeof memo[selector] === "undefined") {
				memo[selector] = fn.call(this, selector);
			}
			return memo[selector]
		};
	})(function (styleTarget) {
		return document.querySelector(styleTarget)
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [],
	fixUrls = __webpack_require__(361);

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (typeof options.insertInto === "undefined") options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var styleTarget = getElement(options.insertInto)
	if (!styleTarget) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			styleTarget.insertBefore(styleElement, styleTarget.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			styleTarget.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		styleTarget.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	options.attrs.type = "text/css";

	attachTagAttrs(styleElement, options.attrs);
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	attachTagAttrs(linkElement, options.attrs);
	insertStyleElement(options, linkElement);
	return linkElement;
}

function attachTagAttrs(element, attrs) {
	Object.keys(attrs).forEach(function (key) {
		element.setAttribute(key, attrs[key]);
	});
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement, options);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
	and there is no publicPath defined then lets turn convertToAbsoluteUrls
	on by default.  Otherwise default to the convertToAbsoluteUrls option
	directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls){
		css = fixUrls(css);
	}

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)


var toObject = __webpack_require__(9);
var toAbsoluteIndex = __webpack_require__(40);
var toLength = __webpack_require__(8);
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var aLen = arguments.length;
  var index = toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
  var end = aLen > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) {
    O[index++] = value;
  }return O;
};

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__(148);

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $defineProperty = __webpack_require__(7);
var createDesc = __webpack_require__(37);

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));else object[index] = value;
};

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isObject = __webpack_require__(4);
var document = __webpack_require__(2).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// IE 8- don't enum bug keys
module.exports = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var MATCH = __webpack_require__(5)('match');
module.exports = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch (f) {/* empty */}
  }return true;
};

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var document = __webpack_require__(2).document;
module.exports = document && document.documentElement;

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isObject = __webpack_require__(4);
var setPrototypeOf = __webpack_require__(81).set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  }return that;
};

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// check on default Array iterator
var Iterators = __webpack_require__(42);
var ITERATOR = __webpack_require__(5)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var create = __webpack_require__(34);
var descriptor = __webpack_require__(37);
var setToStringTag = __webpack_require__(43);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(11)(IteratorPrototype, __webpack_require__(5)('iterator'), function () {
  return this;
});

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var LIBRARY = __webpack_require__(33);
var $export = __webpack_require__(0);
var redefine = __webpack_require__(12);
var hide = __webpack_require__(11);
var Iterators = __webpack_require__(42);
var $iterCreate = __webpack_require__(75);
var setToStringTag = __webpack_require__(43);
var getPrototypeOf = __webpack_require__(16);
var ITERATOR = __webpack_require__(5)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function returnThis() {
  return this;
};

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function getMethod(kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS:
        return function keys() {
          return new Constructor(this, kind);
        };
      case VALUES:
        return function values() {
          return new Constructor(this, kind);
        };
    }return function entries() {
      return new Constructor(this, kind);
    };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() {
      return $native.call(this);
    };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.2.2.14 Math.expm1(x)
var $expm1 = Math.expm1;
module.exports = !$expm1
// Old FF bug
|| $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
// Tor Browser bug
|| $expm1(-2e-17) != -2e-17 ? function expm1(x) {
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
} : $expm1;

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x) {
  // eslint-disable-next-line no-self-compare
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var global = __webpack_require__(2);
var macrotask = __webpack_require__(87).set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__(18)(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function flush() {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();else last = undefined;
        throw e;
      }
    }last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function notify() {
      process.nextTick(flush);
    };
    // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function notify() {
      node.data = toggle = !toggle;
    };
    // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    var promise = Promise.resolve();
    notify = function notify() {
      promise.then(flush);
    };
    // for other environments - macrotask based on:
    // - setImmediate
    // - MessageChannel
    // - window.postMessag
    // - onreadystatechange
    // - setTimeout
  } else {
    notify = function notify() {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    }last = task;
  };
};

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)

var aFunction = __webpack_require__(10);

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(4);
var anObject = __webpack_require__(1);
var check = function check(O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
  function (test, buggy, set) {
    try {
      set = __webpack_require__(19)(Function.call, __webpack_require__(15).f(Object.prototype, '__proto__').set, 2);
      set(test, []);
      buggy = !(test instanceof Array);
    } catch (e) {
      buggy = true;
    }
    return function setPrototypeOf(O, proto) {
      check(O, proto);
      if (buggy) O.__proto__ = proto;else set(O, proto);
      return O;
    };
  }({}, false) : undefined),
  check: check
};

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var shared = __webpack_require__(62)('keys');
var uid = __webpack_require__(41);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toInteger = __webpack_require__(25);
var defined = __webpack_require__(23);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// helper for String#{startsWith, endsWith, includes}
var isRegExp = __webpack_require__(56);
var defined = __webpack_require__(23);

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toInteger = __webpack_require__(25);
var defined = __webpack_require__(23);

module.exports = function repeat(count) {
  var str = String(defined(this));
  var res = '';
  var n = toInteger(count);
  if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");
  for (; n > 0; (n >>>= 1) && (str += str)) {
    if (n & 1) res += str;
  }return res;
};

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = '\t\n\x0B\f\r \xA0\u1680\u180E\u2000\u2001\u2002\u2003' + '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ctx = __webpack_require__(19);
var invoke = __webpack_require__(108);
var html = __webpack_require__(72);
var cel = __webpack_require__(69);
var global = __webpack_require__(2);
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function run() {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function listener(event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) {
      args.push(arguments[i++]);
    }queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__(18)(process) == 'process') {
    defer = function defer(id) {
      process.nextTick(ctx(run, id, 1));
    };
    // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function defer(id) {
      Dispatch.now(ctx(run, id, 1));
    };
    // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
    // Browsers with postMessage, skip WebWorkers
    // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function defer(id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
    // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function defer(id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
    // Rest old browsers
  } else {
    defer = function defer(id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var global = __webpack_require__(2);
var DESCRIPTORS = __webpack_require__(6);
var LIBRARY = __webpack_require__(33);
var $typed = __webpack_require__(64);
var hide = __webpack_require__(11);
var redefineAll = __webpack_require__(38);
var fails = __webpack_require__(3);
var anInstance = __webpack_require__(31);
var toInteger = __webpack_require__(25);
var toLength = __webpack_require__(8);
var toIndex = __webpack_require__(126);
var gOPN = __webpack_require__(35).f;
var dP = __webpack_require__(7).f;
var arrayFill = __webpack_require__(66);
var setToStringTag = __webpack_require__(43);
var ARRAY_BUFFER = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE = 'prototype';
var WRONG_LENGTH = 'Wrong length!';
var WRONG_INDEX = 'Wrong index!';
var $ArrayBuffer = global[ARRAY_BUFFER];
var $DataView = global[DATA_VIEW];
var Math = global.Math;
var RangeError = global.RangeError;
// eslint-disable-next-line no-shadow-restricted-names
var Infinity = global.Infinity;
var BaseBuffer = $ArrayBuffer;
var abs = Math.abs;
var pow = Math.pow;
var floor = Math.floor;
var log = Math.log;
var LN2 = Math.LN2;
var BUFFER = 'buffer';
var BYTE_LENGTH = 'byteLength';
var BYTE_OFFSET = 'byteOffset';
var $BUFFER = DESCRIPTORS ? '_b' : BUFFER;
var $LENGTH = DESCRIPTORS ? '_l' : BYTE_LENGTH;
var $OFFSET = DESCRIPTORS ? '_o' : BYTE_OFFSET;

// IEEE754 conversions based on https://github.com/feross/ieee754
function packIEEE754(value, mLen, nBytes) {
  var buffer = new Array(nBytes);
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0;
  var i = 0;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  var e, m, c;
  value = abs(value);
  // eslint-disable-next-line no-self-compare
  if (value != value || value === Infinity) {
    // eslint-disable-next-line no-self-compare
    m = value != value ? 1 : 0;
    e = eMax;
  } else {
    e = floor(log(value) / LN2);
    if (value * (c = pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }
    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * pow(2, eBias - 1) * pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8) {}
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8) {}
  buffer[--i] |= s * 128;
  return buffer;
}
function unpackIEEE754(buffer, mLen, nBytes) {
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = eLen - 7;
  var i = nBytes - 1;
  var s = buffer[i--];
  var e = s & 127;
  var m;
  s >>= 7;
  for (; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8) {}
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8) {}
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : s ? -Infinity : Infinity;
  } else {
    m = m + pow(2, mLen);
    e = e - eBias;
  }return (s ? -1 : 1) * m * pow(2, e - mLen);
}

function unpackI32(bytes) {
  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
}
function packI8(it) {
  return [it & 0xff];
}
function packI16(it) {
  return [it & 0xff, it >> 8 & 0xff];
}
function packI32(it) {
  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
}
function packF64(it) {
  return packIEEE754(it, 52, 8);
}
function packF32(it) {
  return packIEEE754(it, 23, 4);
}

function addGetter(C, key, internal) {
  dP(C[PROTOTYPE], key, { get: function get() {
      return this[internal];
    } });
}

function get(view, bytes, index, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = store.slice(start, start + bytes);
  return isLittleEndian ? pack : pack.reverse();
}
function set(view, bytes, index, conversion, value, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = conversion(+value);
  for (var i = 0; i < bytes; i++) {
    store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
  }
}

if (!$typed.ABV) {
  $ArrayBuffer = function ArrayBuffer(length) {
    anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
    var byteLength = toIndex(length);
    this._b = arrayFill.call(new Array(byteLength), 0);
    this[$LENGTH] = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = buffer[$LENGTH];
    var offset = toInteger(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset!');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
    this[$BUFFER] = buffer;
    this[$OFFSET] = offset;
    this[$LENGTH] = byteLength;
  };

  if (DESCRIPTORS) {
    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
    addGetter($DataView, BUFFER, '_b');
    addGetter($DataView, BYTE_LENGTH, '_l');
    addGetter($DataView, BYTE_OFFSET, '_o');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset) {
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
    },
    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
    },
    setInt8: function setInt8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packF32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
      set(this, 8, byteOffset, packF64, value, arguments[2]);
    }
  });
} else {
  if (!fails(function () {
    $ArrayBuffer(1);
  }) || !fails(function () {
    new $ArrayBuffer(-1); // eslint-disable-line no-new
  }) || fails(function () {
    new $ArrayBuffer(); // eslint-disable-line no-new
    new $ArrayBuffer(1.5); // eslint-disable-line no-new
    new $ArrayBuffer(NaN); // eslint-disable-line no-new
    return $ArrayBuffer.name != ARRAY_BUFFER;
  })) {
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer);
      return new BaseBuffer(toIndex(length));
    };
    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
    for (var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j;) {
      if (!((key = keys[j++]) in $ArrayBuffer)) hide($ArrayBuffer, key, BaseBuffer[key]);
    }
    if (!LIBRARY) ArrayBufferProto.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var view = new $DataView(new $ArrayBuffer(2));
  var $setInt8 = $DataView[PROTOTYPE].setInt8;
  view.setInt8(0, 2147483648);
  view.setInt8(1, 2147483649);
  if (view.getInt8(0) || !view.getInt8(1)) redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, true);
}
setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);
hide($DataView[PROTOTYPE], $typed.VIEW, true);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var global = __webpack_require__(2);
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var global = __webpack_require__(2);
var core = __webpack_require__(22);
var LIBRARY = __webpack_require__(33);
var wksExt = __webpack_require__(127);
var defineProperty = __webpack_require__(7).f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var classof = __webpack_require__(46);
var ITERATOR = __webpack_require__(5)('iterator');
var Iterators = __webpack_require__(42);
module.exports = __webpack_require__(22).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
};

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var addToUnscopables = __webpack_require__(29);
var step = __webpack_require__(111);
var Iterators = __webpack_require__(42);
var toIObject = __webpack_require__(17);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(76)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0; // next index
  this._k = kind; // kind
  // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function get() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(49)(false);
// imports


// module
exports.push([module.i, "/* Default Print Stylesheet Template\n   by Rob Glazebrook of CSSnewbie.com\n   Last Updated: June 4, 2008\n\n   Feel free (nay, compelled) to edit, append, and\n   manipulate this file as you see fit. */\n\n\n@media print {\n\n\t/* SECTION 1: Set default width, margin, float, and\n\t   background. This prevents elements from extending\n\t   beyond the edge of the printed page, and prevents\n\t   unnecessary background images from printing */\n\thtml {\n\t\tbackground: #fff;\n\t\twidth: auto;\n\t\theight: auto;\n\t\toverflow: visible;\n\t}\n\tbody {\n\t\tbackground: #fff;\n\t\tfont-size: 20pt;\n\t\twidth: auto;\n\t\theight: auto;\n\t\tborder: 0;\n\t\tmargin: 0 5%;\n\t\tpadding: 0;\n\t\toverflow: visible;\n\t\tfloat: none !important;\n\t}\n\n\t/* SECTION 2: Remove any elements not needed in print.\n\t   This would include navigation, ads, sidebars, etc. */\n\t.nestedarrow,\n\t.controls,\n\t.fork-reveal,\n\t.share-reveal,\n\t.state-background,\n\t.reveal .progress,\n\t.reveal .backgrounds,\n\t.reveal .slide-number {\n\t\tdisplay: none !important;\n\t}\n\n\t/* SECTION 3: Set body font face, size, and color.\n\t   Consider using a serif font for readability. */\n\tbody, p, td, li, div {\n\t\tfont-size: 20pt!important;\n\t\tfont-family: Georgia, \"Times New Roman\", Times, serif !important;\n\t\tcolor: #000;\n\t}\n\n\t/* SECTION 4: Set heading font face, sizes, and color.\n\t   Differentiate your headings from your body text.\n\t   Perhaps use a large sans-serif for distinction. */\n\th1,h2,h3,h4,h5,h6 {\n\t\tcolor: #000!important;\n\t\theight: auto;\n\t\tline-height: normal;\n\t\tfont-family: Georgia, \"Times New Roman\", Times, serif !important;\n\t\ttext-shadow: 0 0 0 #000 !important;\n\t\ttext-align: left;\n\t\tletter-spacing: normal;\n\t}\n\t/* Need to reduce the size of the fonts for printing */\n\th1 { font-size: 28pt !important;  }\n\th2 { font-size: 24pt !important; }\n\th3 { font-size: 22pt !important; }\n\th4 { font-size: 22pt !important; font-variant: small-caps; }\n\th5 { font-size: 21pt !important; }\n\th6 { font-size: 20pt !important; font-style: italic; }\n\n\t/* SECTION 5: Make hyperlinks more usable.\n\t   Ensure links are underlined, and consider appending\n\t   the URL to the end of the link for usability. */\n\ta:link,\n\ta:visited {\n\t\tcolor: #000 !important;\n\t\tfont-weight: bold;\n\t\ttext-decoration: underline;\n\t}\n\t/*\n\t.reveal a:link:after,\n\t.reveal a:visited:after {\n\t\tcontent: \" (\" attr(href) \") \";\n\t\tcolor: #222 !important;\n\t\tfont-size: 90%;\n\t}\n\t*/\n\n\n\t/* SECTION 6: more reveal.js specific additions by @skypanther */\n\tul, ol, div, p {\n\t\tvisibility: visible;\n\t\tposition: static;\n\t\twidth: auto;\n\t\theight: auto;\n\t\tdisplay: block;\n\t\toverflow: visible;\n\t\tmargin: 0;\n\t\ttext-align: left !important;\n\t}\n\t.reveal pre,\n\t.reveal table {\n\t\tmargin-left: 0;\n\t\tmargin-right: 0;\n\t}\n\t.reveal pre code {\n\t\tpadding: 20px;\n\t\tborder: 1px solid #ddd;\n\t}\n\t.reveal blockquote {\n\t\tmargin: 20px 0;\n\t}\n\t.reveal .slides {\n\t\tposition: static !important;\n\t\twidth: auto !important;\n\t\theight: auto !important;\n\n\t\tleft: 0 !important;\n\t\ttop: 0 !important;\n\t\tmargin-left: 0 !important;\n\t\tmargin-top: 0 !important;\n\t\tpadding: 0 !important;\n\t\tzoom: 1 !important;\n\n\t\toverflow: visible !important;\n\t\tdisplay: block !important;\n\n\t\ttext-align: left !important;\n\t\t-webkit-perspective: none;\n\t\t   -moz-perspective: none;\n\t\t    -ms-perspective: none;\n\t\t        perspective: none;\n\n\t\t-webkit-perspective-origin: 50% 50%;\n\t\t   -moz-perspective-origin: 50% 50%;\n\t\t    -ms-perspective-origin: 50% 50%;\n\t\t        perspective-origin: 50% 50%;\n\t}\n\t.reveal .slides section {\n\t\tvisibility: visible !important;\n\t\tposition: static !important;\n\t\twidth: auto !important;\n\t\theight: auto !important;\n\t\tdisplay: block !important;\n\t\toverflow: visible !important;\n\n\t\tleft: 0 !important;\n\t\ttop: 0 !important;\n\t\tmargin-left: 0 !important;\n\t\tmargin-top: 0 !important;\n\t\tpadding: 60px 20px !important;\n\t\tz-index: auto !important;\n\n\t\topacity: 1 !important;\n\n\t\tpage-break-after: always !important;\n\n\t\t-webkit-transform-style: flat !important;\n\t\t   -moz-transform-style: flat !important;\n\t\t    -ms-transform-style: flat !important;\n\t\t        transform-style: flat !important;\n\n\t\t-webkit-transform: none !important;\n\t\t   -moz-transform: none !important;\n\t\t    -ms-transform: none !important;\n\t\t        transform: none !important;\n\n\t\t-webkit-transition: none !important;\n\t\t   -moz-transition: none !important;\n\t\t    -ms-transition: none !important;\n\t\t        transition: none !important;\n\t}\n\t.reveal .slides section.stack {\n\t\tpadding: 0 !important;\n\t}\n\t.reveal section:last-of-type {\n\t\tpage-break-after: avoid !important;\n\t}\n\t.reveal section .fragment {\n\t\topacity: 1 !important;\n\t\tvisibility: visible !important;\n\n\t\t-webkit-transform: none !important;\n\t\t   -moz-transform: none !important;\n\t\t    -ms-transform: none !important;\n\t\t        transform: none !important;\n\t}\n\t.reveal section img {\n\t\tdisplay: block;\n\t\tmargin: 15px 0px;\n\t\tbackground: rgba(255,255,255,1);\n\t\tborder: 1px solid #666;\n\t\tbox-shadow: none;\n\t}\n\n\t.reveal section small {\n\t\tfont-size: 0.8em;\n\t}\n\n}\n", ""]);

// exports


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(49)(false);
// imports
exports.i(__webpack_require__(367), "");

// module
exports.push([module.i, "/**\n * Black theme for reveal.js. This is the opposite of the 'white' theme.\n *\n * By Hakim El Hattab, http://hakim.se\n */\nsection.has-light-background, section.has-light-background h1, section.has-light-background h2, section.has-light-background h3, section.has-light-background h4, section.has-light-background h5, section.has-light-background h6 {\n  color: #222; }\n\n/*********************************************\n * GLOBAL STYLES\n *********************************************/\nbody {\n  background: #222;\n  background-color: #222; }\n\n.reveal {\n  font-family: \"Source Sans Pro\", Helvetica, sans-serif;\n  font-size: 42px;\n  font-weight: normal;\n  color: #fff; }\n\n::selection {\n  color: #fff;\n  background: #bee4fd;\n  text-shadow: none; }\n\n::-moz-selection {\n  color: #fff;\n  background: #bee4fd;\n  text-shadow: none; }\n\n.reveal .slides > section,\n.reveal .slides > section > section {\n  line-height: 1.3;\n  font-weight: inherit; }\n\n/*********************************************\n * HEADERS\n *********************************************/\n.reveal h1,\n.reveal h2,\n.reveal h3,\n.reveal h4,\n.reveal h5,\n.reveal h6 {\n  margin: 0 0 20px 0;\n  color: #fff;\n  font-family: \"Source Sans Pro\", Helvetica, sans-serif;\n  font-weight: 600;\n  line-height: 1.2;\n  letter-spacing: normal;\n  text-transform: uppercase;\n  text-shadow: none;\n  word-wrap: break-word; }\n\n.reveal h1 {\n  font-size: 2.5em; }\n\n.reveal h2 {\n  font-size: 1.6em; }\n\n.reveal h3 {\n  font-size: 1.3em; }\n\n.reveal h4 {\n  font-size: 1em; }\n\n.reveal h1 {\n  text-shadow: none; }\n\n/*********************************************\n * OTHER\n *********************************************/\n.reveal p {\n  margin: 20px 0;\n  line-height: 1.3; }\n\n/* Ensure certain elements are never larger than the slide itself */\n.reveal img,\n.reveal video,\n.reveal iframe {\n  max-width: 95%;\n  max-height: 95%; }\n\n.reveal strong,\n.reveal b {\n  font-weight: bold; }\n\n.reveal em {\n  font-style: italic; }\n\n.reveal ol,\n.reveal dl,\n.reveal ul {\n  display: inline-block;\n  text-align: left;\n  margin: 0 0 0 1em; }\n\n.reveal ol {\n  list-style-type: decimal; }\n\n.reveal ul {\n  list-style-type: disc; }\n\n.reveal ul ul {\n  list-style-type: square; }\n\n.reveal ul ul ul {\n  list-style-type: circle; }\n\n.reveal ul ul,\n.reveal ul ol,\n.reveal ol ol,\n.reveal ol ul {\n  display: block;\n  margin-left: 40px; }\n\n.reveal dt {\n  font-weight: bold; }\n\n.reveal dd {\n  margin-left: 40px; }\n\n.reveal blockquote {\n  display: block;\n  position: relative;\n  width: 70%;\n  margin: 20px auto;\n  padding: 5px;\n  font-style: italic;\n  background: rgba(255, 255, 255, 0.05);\n  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2); }\n\n.reveal blockquote p:first-child,\n.reveal blockquote p:last-child {\n  display: inline-block; }\n\n.reveal q {\n  font-style: italic; }\n\n.reveal pre {\n  display: block;\n  position: relative;\n  width: 90%;\n  margin: 20px auto;\n  text-align: left;\n  font-size: 0.55em;\n  font-family: monospace;\n  line-height: 1.2em;\n  word-wrap: break-word;\n  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.3); }\n\n.reveal code {\n  font-family: monospace;\n  text-transform: none; }\n\n.reveal pre code {\n  display: block;\n  padding: 5px;\n  overflow: auto;\n  max-height: 400px;\n  word-wrap: normal; }\n\n.reveal table {\n  margin: auto;\n  border-collapse: collapse;\n  border-spacing: 0; }\n\n.reveal table th {\n  font-weight: bold; }\n\n.reveal table th,\n.reveal table td {\n  text-align: left;\n  padding: 0.2em 0.5em 0.2em 0.5em;\n  border-bottom: 1px solid; }\n\n.reveal table th[align=\"center\"],\n.reveal table td[align=\"center\"] {\n  text-align: center; }\n\n.reveal table th[align=\"right\"],\n.reveal table td[align=\"right\"] {\n  text-align: right; }\n\n.reveal table tbody tr:last-child th,\n.reveal table tbody tr:last-child td {\n  border-bottom: none; }\n\n.reveal sup {\n  vertical-align: super; }\n\n.reveal sub {\n  vertical-align: sub; }\n\n.reveal small {\n  display: inline-block;\n  font-size: 0.6em;\n  line-height: 1.2em;\n  vertical-align: top; }\n\n.reveal small * {\n  vertical-align: top; }\n\n/*********************************************\n * LINKS\n *********************************************/\n.reveal a {\n  color: #42affa;\n  text-decoration: none;\n  -webkit-transition: color .15s ease;\n  -moz-transition: color .15s ease;\n  transition: color .15s ease; }\n\n.reveal a:hover {\n  color: #8dcffc;\n  text-shadow: none;\n  border: none; }\n\n.reveal .roll span:after {\n  color: #fff;\n  background: #068de9; }\n\n/*********************************************\n * IMAGES\n *********************************************/\n.reveal section img {\n  margin: 15px 0px;\n  background: rgba(255, 255, 255, 0.12);\n  border: 4px solid #fff;\n  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); }\n\n.reveal section img.plain {\n  border: 0;\n  box-shadow: none; }\n\n.reveal a img {\n  -webkit-transition: all .15s linear;\n  -moz-transition: all .15s linear;\n  transition: all .15s linear; }\n\n.reveal a:hover img {\n  background: rgba(255, 255, 255, 0.2);\n  border-color: #42affa;\n  box-shadow: 0 0 20px rgba(0, 0, 0, 0.55); }\n\n/*********************************************\n * NAVIGATION CONTROLS\n *********************************************/\n.reveal .controls {\n  color: #42affa; }\n\n/*********************************************\n * PROGRESS BAR\n *********************************************/\n.reveal .progress {\n  background: rgba(0, 0, 0, 0.2);\n  color: #42affa; }\n\n.reveal .progress span {\n  -webkit-transition: width 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985);\n  -moz-transition: width 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985);\n  transition: width 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985); }\n", ""]);

// exports


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(49)(false);
// imports


// module
exports.push([module.i, "/*!\n * reveal.js\n * http://revealjs.com\n * MIT licensed\n *\n * Copyright (C) 2017 Hakim El Hattab, http://hakim.se\n */\n/*********************************************\n * RESET STYLES\n *********************************************/\nhtml, body, .reveal div, .reveal span, .reveal applet, .reveal object, .reveal iframe,\n.reveal h1, .reveal h2, .reveal h3, .reveal h4, .reveal h5, .reveal h6, .reveal p, .reveal blockquote, .reveal pre,\n.reveal a, .reveal abbr, .reveal acronym, .reveal address, .reveal big, .reveal cite, .reveal code,\n.reveal del, .reveal dfn, .reveal em, .reveal img, .reveal ins, .reveal kbd, .reveal q, .reveal s, .reveal samp,\n.reveal small, .reveal strike, .reveal strong, .reveal sub, .reveal sup, .reveal tt, .reveal var,\n.reveal b, .reveal u, .reveal center,\n.reveal dl, .reveal dt, .reveal dd, .reveal ol, .reveal ul, .reveal li,\n.reveal fieldset, .reveal form, .reveal label, .reveal legend,\n.reveal table, .reveal caption, .reveal tbody, .reveal tfoot, .reveal thead, .reveal tr, .reveal th, .reveal td,\n.reveal article, .reveal aside, .reveal canvas, .reveal details, .reveal embed,\n.reveal figure, .reveal figcaption, .reveal footer, .reveal header, .reveal hgroup,\n.reveal menu, .reveal nav, .reveal output, .reveal ruby, .reveal section, .reveal summary,\n.reveal time, .reveal mark, .reveal audio, .reveal video {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  font-size: 100%;\n  font: inherit;\n  vertical-align: baseline;\n}\n\n.reveal article, .reveal aside, .reveal details, .reveal figcaption, .reveal figure,\n.reveal footer, .reveal header, .reveal hgroup, .reveal menu, .reveal nav, .reveal section {\n  display: block;\n}\n\n/*********************************************\n * GLOBAL STYLES\n *********************************************/\nhtml,\nbody {\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n}\n\nbody {\n  position: relative;\n  line-height: 1;\n  background-color: #fff;\n  color: #000;\n}\n\n/*********************************************\n * VIEW FRAGMENTS\n *********************************************/\n.reveal .slides section .fragment {\n  opacity: 0;\n  visibility: hidden;\n  transition: all .2s ease;\n}\n\n.reveal .slides section .fragment.visible {\n  opacity: 1;\n  visibility: inherit;\n}\n\n.reveal .slides section .fragment.grow {\n  opacity: 1;\n  visibility: inherit;\n}\n\n.reveal .slides section .fragment.grow.visible {\n  transform: scale(1.3);\n}\n\n.reveal .slides section .fragment.shrink {\n  opacity: 1;\n  visibility: inherit;\n}\n\n.reveal .slides section .fragment.shrink.visible {\n  transform: scale(0.7);\n}\n\n.reveal .slides section .fragment.zoom-in {\n  transform: scale(0.1);\n}\n\n.reveal .slides section .fragment.zoom-in.visible {\n  transform: none;\n}\n\n.reveal .slides section .fragment.fade-out {\n  opacity: 1;\n  visibility: inherit;\n}\n\n.reveal .slides section .fragment.fade-out.visible {\n  opacity: 0;\n  visibility: hidden;\n}\n\n.reveal .slides section .fragment.semi-fade-out {\n  opacity: 1;\n  visibility: inherit;\n}\n\n.reveal .slides section .fragment.semi-fade-out.visible {\n  opacity: 0.5;\n  visibility: inherit;\n}\n\n.reveal .slides section .fragment.strike {\n  opacity: 1;\n  visibility: inherit;\n}\n\n.reveal .slides section .fragment.strike.visible {\n  text-decoration: line-through;\n}\n\n.reveal .slides section .fragment.fade-up {\n  transform: translate(0, 20%);\n}\n\n.reveal .slides section .fragment.fade-up.visible {\n  transform: translate(0, 0);\n}\n\n.reveal .slides section .fragment.fade-down {\n  transform: translate(0, -20%);\n}\n\n.reveal .slides section .fragment.fade-down.visible {\n  transform: translate(0, 0);\n}\n\n.reveal .slides section .fragment.fade-right {\n  transform: translate(-20%, 0);\n}\n\n.reveal .slides section .fragment.fade-right.visible {\n  transform: translate(0, 0);\n}\n\n.reveal .slides section .fragment.fade-left {\n  transform: translate(20%, 0);\n}\n\n.reveal .slides section .fragment.fade-left.visible {\n  transform: translate(0, 0);\n}\n\n.reveal .slides section .fragment.current-visible {\n  opacity: 0;\n  visibility: hidden;\n}\n\n.reveal .slides section .fragment.current-visible.current-fragment {\n  opacity: 1;\n  visibility: inherit;\n}\n\n.reveal .slides section .fragment.highlight-red,\n.reveal .slides section .fragment.highlight-current-red,\n.reveal .slides section .fragment.highlight-green,\n.reveal .slides section .fragment.highlight-current-green,\n.reveal .slides section .fragment.highlight-blue,\n.reveal .slides section .fragment.highlight-current-blue {\n  opacity: 1;\n  visibility: inherit;\n}\n\n.reveal .slides section .fragment.highlight-red.visible {\n  color: #ff2c2d;\n}\n\n.reveal .slides section .fragment.highlight-green.visible {\n  color: #17ff2e;\n}\n\n.reveal .slides section .fragment.highlight-blue.visible {\n  color: #1b91ff;\n}\n\n.reveal .slides section .fragment.highlight-current-red.current-fragment {\n  color: #ff2c2d;\n}\n\n.reveal .slides section .fragment.highlight-current-green.current-fragment {\n  color: #17ff2e;\n}\n\n.reveal .slides section .fragment.highlight-current-blue.current-fragment {\n  color: #1b91ff;\n}\n\n/*********************************************\n * DEFAULT ELEMENT STYLES\n *********************************************/\n/* Fixes issue in Chrome where italic fonts did not appear when printing to PDF */\n.reveal:after {\n  content: '';\n  font-style: italic;\n}\n\n.reveal iframe {\n  z-index: 1;\n}\n\n/** Prevents layering issues in certain browser/transition combinations */\n.reveal a {\n  position: relative;\n}\n\n.reveal .stretch {\n  max-width: none;\n  max-height: none;\n}\n\n.reveal pre.stretch code {\n  height: 100%;\n  max-height: 100%;\n  box-sizing: border-box;\n}\n\n/*********************************************\n * CONTROLS\n *********************************************/\n@keyframes bounce-right {\n  0%, 10%, 25%, 40%, 50% {\n    transform: translateX(0);\n  }\n  20% {\n    transform: translateX(10px);\n  }\n  30% {\n    transform: translateX(-5px);\n  }\n}\n\n@keyframes bounce-down {\n  0%, 10%, 25%, 40%, 50% {\n    transform: translateY(0);\n  }\n  20% {\n    transform: translateY(10px);\n  }\n  30% {\n    transform: translateY(-5px);\n  }\n}\n\n.reveal .controls {\n  display: none;\n  position: absolute;\n  top: auto;\n  bottom: 12px;\n  right: 12px;\n  left: auto;\n  z-index: 1;\n  color: #000;\n  pointer-events: none;\n  font-size: 10px;\n}\n\n.reveal .controls button {\n  position: absolute;\n  padding: 0;\n  background-color: transparent;\n  border: 0;\n  outline: 0;\n  cursor: pointer;\n  color: currentColor;\n  transform: scale(0.9999);\n  transition: color 0.2s ease, opacity 0.2s ease, transform 0.2s ease;\n  z-index: 2;\n  pointer-events: auto;\n  font-size: inherit;\n  visibility: hidden;\n  opacity: 0;\n  -webkit-appearance: none;\n  -webkit-tap-highlight-color: transparent;\n}\n\n.reveal .controls .controls-arrow:before,\n.reveal .controls .controls-arrow:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 2.6em;\n  height: 0.5em;\n  border-radius: 0.25em;\n  background-color: currentColor;\n  transition: all 0.15s ease, background-color 0.8s ease;\n  transform-origin: 0.2em 50%;\n  will-change: transform;\n}\n\n.reveal .controls .controls-arrow {\n  position: relative;\n  width: 3.6em;\n  height: 3.6em;\n}\n\n.reveal .controls .controls-arrow:before {\n  transform: translateX(0.5em) translateY(1.55em) rotate(45deg);\n}\n\n.reveal .controls .controls-arrow:after {\n  transform: translateX(0.5em) translateY(1.55em) rotate(-45deg);\n}\n\n.reveal .controls .controls-arrow:hover:before {\n  transform: translateX(0.5em) translateY(1.55em) rotate(40deg);\n}\n\n.reveal .controls .controls-arrow:hover:after {\n  transform: translateX(0.5em) translateY(1.55em) rotate(-40deg);\n}\n\n.reveal .controls .controls-arrow:active:before {\n  transform: translateX(0.5em) translateY(1.55em) rotate(36deg);\n}\n\n.reveal .controls .controls-arrow:active:after {\n  transform: translateX(0.5em) translateY(1.55em) rotate(-36deg);\n}\n\n.reveal .controls .navigate-left {\n  right: 6.4em;\n  bottom: 3.2em;\n  transform: translateX(-10px);\n}\n\n.reveal .controls .navigate-right {\n  right: 0;\n  bottom: 3.2em;\n  transform: translateX(10px);\n}\n\n.reveal .controls .navigate-right .controls-arrow {\n  transform: rotate(180deg);\n}\n\n.reveal .controls .navigate-right.highlight {\n  animation: bounce-right 2s 50 both ease-out;\n}\n\n.reveal .controls .navigate-up {\n  right: 3.2em;\n  bottom: 6.4em;\n  transform: translateY(-10px);\n}\n\n.reveal .controls .navigate-up .controls-arrow {\n  transform: rotate(90deg);\n}\n\n.reveal .controls .navigate-down {\n  right: 3.2em;\n  bottom: 0;\n  transform: translateY(10px);\n}\n\n.reveal .controls .navigate-down .controls-arrow {\n  transform: rotate(-90deg);\n}\n\n.reveal .controls .navigate-down.highlight {\n  animation: bounce-down 2s 50 both ease-out;\n}\n\n.reveal .controls[data-controls-back-arrows=\"faded\"] .navigate-left.enabled,\n.reveal .controls[data-controls-back-arrows=\"faded\"] .navigate-up.enabled {\n  opacity: 0.3;\n}\n\n.reveal .controls[data-controls-back-arrows=\"faded\"] .navigate-left.enabled:hover,\n.reveal .controls[data-controls-back-arrows=\"faded\"] .navigate-up.enabled:hover {\n  opacity: 1;\n}\n\n.reveal .controls[data-controls-back-arrows=\"hidden\"] .navigate-left.enabled,\n.reveal .controls[data-controls-back-arrows=\"hidden\"] .navigate-up.enabled {\n  opacity: 0;\n  visibility: hidden;\n}\n\n.reveal .controls .enabled {\n  visibility: visible;\n  opacity: 0.9;\n  cursor: pointer;\n  transform: none;\n}\n\n.reveal .controls .enabled.fragmented {\n  opacity: 0.5;\n}\n\n.reveal .controls .enabled:hover,\n.reveal .controls .enabled.fragmented:hover {\n  opacity: 1;\n}\n\n.reveal:not(.has-vertical-slides) .controls .navigate-left {\n  bottom: 1.4em;\n  right: 5.5em;\n}\n\n.reveal:not(.has-vertical-slides) .controls .navigate-right {\n  bottom: 1.4em;\n  right: 0.5em;\n}\n\n.reveal:not(.has-horizontal-slides) .controls .navigate-up {\n  right: 1.4em;\n  bottom: 5em;\n}\n\n.reveal:not(.has-horizontal-slides) .controls .navigate-down {\n  right: 1.4em;\n  bottom: 0.5em;\n}\n\n.reveal.has-dark-background .controls {\n  color: #fff;\n}\n\n.reveal.has-light-background .controls {\n  color: #000;\n}\n\n.reveal.no-hover .controls .controls-arrow:hover:before,\n.reveal.no-hover .controls .controls-arrow:active:before {\n  transform: translateX(0.5em) translateY(1.55em) rotate(45deg);\n}\n\n.reveal.no-hover .controls .controls-arrow:hover:after,\n.reveal.no-hover .controls .controls-arrow:active:after {\n  transform: translateX(0.5em) translateY(1.55em) rotate(-45deg);\n}\n\n@media screen and (min-width: 500px) {\n  .reveal .controls[data-controls-layout=\"edges\"] {\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n  }\n  .reveal .controls[data-controls-layout=\"edges\"] .navigate-left,\n  .reveal .controls[data-controls-layout=\"edges\"] .navigate-right,\n  .reveal .controls[data-controls-layout=\"edges\"] .navigate-up,\n  .reveal .controls[data-controls-layout=\"edges\"] .navigate-down {\n    bottom: auto;\n    right: auto;\n  }\n  .reveal .controls[data-controls-layout=\"edges\"] .navigate-left {\n    top: 50%;\n    left: 8px;\n    margin-top: -1.8em;\n  }\n  .reveal .controls[data-controls-layout=\"edges\"] .navigate-right {\n    top: 50%;\n    right: 8px;\n    margin-top: -1.8em;\n  }\n  .reveal .controls[data-controls-layout=\"edges\"] .navigate-up {\n    top: 8px;\n    left: 50%;\n    margin-left: -1.8em;\n  }\n  .reveal .controls[data-controls-layout=\"edges\"] .navigate-down {\n    bottom: 8px;\n    left: 50%;\n    margin-left: -1.8em;\n  }\n}\n\n/*********************************************\n * PROGRESS BAR\n *********************************************/\n.reveal .progress {\n  position: absolute;\n  display: none;\n  height: 3px;\n  width: 100%;\n  bottom: 0;\n  left: 0;\n  z-index: 10;\n  background-color: rgba(0, 0, 0, 0.2);\n  color: #fff;\n}\n\n.reveal .progress:after {\n  content: '';\n  display: block;\n  position: absolute;\n  height: 10px;\n  width: 100%;\n  top: -10px;\n}\n\n.reveal .progress span {\n  display: block;\n  height: 100%;\n  width: 0px;\n  background-color: currentColor;\n  transition: width 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985);\n}\n\n/*********************************************\n * SLIDE NUMBER\n *********************************************/\n.reveal .slide-number {\n  position: fixed;\n  display: block;\n  right: 8px;\n  bottom: 8px;\n  z-index: 31;\n  font-family: Helvetica, sans-serif;\n  font-size: 12px;\n  line-height: 1;\n  color: #fff;\n  background-color: rgba(0, 0, 0, 0.4);\n  padding: 5px;\n}\n\n.reveal .slide-number-delimiter {\n  margin: 0 3px;\n}\n\n/*********************************************\n * SLIDES\n *********************************************/\n.reveal {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  touch-action: none;\n}\n\n@media only screen and (orientation: landscape) {\n  .reveal.ua-iphone {\n    position: fixed;\n  }\n}\n\n.reveal .slides {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  pointer-events: none;\n  overflow: visible;\n  z-index: 1;\n  text-align: center;\n  perspective: 600px;\n  perspective-origin: 50% 40%;\n}\n\n.reveal .slides > section {\n  -ms-perspective: 600px;\n}\n\n.reveal .slides > section,\n.reveal .slides > section > section {\n  display: none;\n  position: absolute;\n  width: 100%;\n  padding: 20px 0px;\n  pointer-events: auto;\n  z-index: 10;\n  transform-style: flat;\n  transition: transform-origin 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985), transform 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985), visibility 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985), opacity 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985);\n}\n\n/* Global transition speed settings */\n.reveal[data-transition-speed=\"fast\"] .slides section {\n  transition-duration: 400ms;\n}\n\n.reveal[data-transition-speed=\"slow\"] .slides section {\n  transition-duration: 1200ms;\n}\n\n/* Slide-specific transition speed overrides */\n.reveal .slides section[data-transition-speed=\"fast\"] {\n  transition-duration: 400ms;\n}\n\n.reveal .slides section[data-transition-speed=\"slow\"] {\n  transition-duration: 1200ms;\n}\n\n.reveal .slides > section.stack {\n  padding-top: 0;\n  padding-bottom: 0;\n}\n\n.reveal .slides > section.present,\n.reveal .slides > section > section.present {\n  display: block;\n  z-index: 11;\n  opacity: 1;\n}\n\n.reveal .slides > section:empty,\n.reveal .slides > section > section:empty,\n.reveal .slides > section[data-background-interactive],\n.reveal .slides > section > section[data-background-interactive] {\n  pointer-events: none;\n}\n\n.reveal.center,\n.reveal.center .slides,\n.reveal.center .slides section {\n  min-height: 0 !important;\n}\n\n/* Don't allow interaction with invisible slides */\n.reveal .slides > section.future,\n.reveal .slides > section > section.future,\n.reveal .slides > section.past,\n.reveal .slides > section > section.past {\n  pointer-events: none;\n}\n\n.reveal.overview .slides > section,\n.reveal.overview .slides > section > section {\n  pointer-events: auto;\n}\n\n.reveal .slides > section.past,\n.reveal .slides > section.future,\n.reveal .slides > section > section.past,\n.reveal .slides > section > section.future {\n  opacity: 0;\n}\n\n/*********************************************\n * Mixins for readability of transitions\n *********************************************/\n/*********************************************\n * SLIDE TRANSITION\n * Aliased 'linear' for backwards compatibility\n *********************************************/\n.reveal.slide section {\n  backface-visibility: hidden;\n}\n\n.reveal .slides > section[data-transition=slide].past,\n.reveal .slides > section[data-transition~=slide-out].past,\n.reveal.slide .slides > section:not([data-transition]).past {\n  transform: translate(-150%, 0);\n}\n\n.reveal .slides > section[data-transition=slide].future,\n.reveal .slides > section[data-transition~=slide-in].future,\n.reveal.slide .slides > section:not([data-transition]).future {\n  transform: translate(150%, 0);\n}\n\n.reveal .slides > section > section[data-transition=slide].past,\n.reveal .slides > section > section[data-transition~=slide-out].past,\n.reveal.slide .slides > section > section:not([data-transition]).past {\n  transform: translate(0, -150%);\n}\n\n.reveal .slides > section > section[data-transition=slide].future,\n.reveal .slides > section > section[data-transition~=slide-in].future,\n.reveal.slide .slides > section > section:not([data-transition]).future {\n  transform: translate(0, 150%);\n}\n\n.reveal.linear section {\n  backface-visibility: hidden;\n}\n\n.reveal .slides > section[data-transition=linear].past,\n.reveal .slides > section[data-transition~=linear-out].past,\n.reveal.linear .slides > section:not([data-transition]).past {\n  transform: translate(-150%, 0);\n}\n\n.reveal .slides > section[data-transition=linear].future,\n.reveal .slides > section[data-transition~=linear-in].future,\n.reveal.linear .slides > section:not([data-transition]).future {\n  transform: translate(150%, 0);\n}\n\n.reveal .slides > section > section[data-transition=linear].past,\n.reveal .slides > section > section[data-transition~=linear-out].past,\n.reveal.linear .slides > section > section:not([data-transition]).past {\n  transform: translate(0, -150%);\n}\n\n.reveal .slides > section > section[data-transition=linear].future,\n.reveal .slides > section > section[data-transition~=linear-in].future,\n.reveal.linear .slides > section > section:not([data-transition]).future {\n  transform: translate(0, 150%);\n}\n\n/*********************************************\n * CONVEX TRANSITION\n * Aliased 'default' for backwards compatibility\n *********************************************/\n.reveal .slides section[data-transition=default].stack,\n.reveal.default .slides section.stack {\n  transform-style: preserve-3d;\n}\n\n.reveal .slides > section[data-transition=default].past,\n.reveal .slides > section[data-transition~=default-out].past,\n.reveal.default .slides > section:not([data-transition]).past {\n  transform: translate3d(-100%, 0, 0) rotateY(-90deg) translate3d(-100%, 0, 0);\n}\n\n.reveal .slides > section[data-transition=default].future,\n.reveal .slides > section[data-transition~=default-in].future,\n.reveal.default .slides > section:not([data-transition]).future {\n  transform: translate3d(100%, 0, 0) rotateY(90deg) translate3d(100%, 0, 0);\n}\n\n.reveal .slides > section > section[data-transition=default].past,\n.reveal .slides > section > section[data-transition~=default-out].past,\n.reveal.default .slides > section > section:not([data-transition]).past {\n  transform: translate3d(0, -300px, 0) rotateX(70deg) translate3d(0, -300px, 0);\n}\n\n.reveal .slides > section > section[data-transition=default].future,\n.reveal .slides > section > section[data-transition~=default-in].future,\n.reveal.default .slides > section > section:not([data-transition]).future {\n  transform: translate3d(0, 300px, 0) rotateX(-70deg) translate3d(0, 300px, 0);\n}\n\n.reveal .slides section[data-transition=convex].stack,\n.reveal.convex .slides section.stack {\n  transform-style: preserve-3d;\n}\n\n.reveal .slides > section[data-transition=convex].past,\n.reveal .slides > section[data-transition~=convex-out].past,\n.reveal.convex .slides > section:not([data-transition]).past {\n  transform: translate3d(-100%, 0, 0) rotateY(-90deg) translate3d(-100%, 0, 0);\n}\n\n.reveal .slides > section[data-transition=convex].future,\n.reveal .slides > section[data-transition~=convex-in].future,\n.reveal.convex .slides > section:not([data-transition]).future {\n  transform: translate3d(100%, 0, 0) rotateY(90deg) translate3d(100%, 0, 0);\n}\n\n.reveal .slides > section > section[data-transition=convex].past,\n.reveal .slides > section > section[data-transition~=convex-out].past,\n.reveal.convex .slides > section > section:not([data-transition]).past {\n  transform: translate3d(0, -300px, 0) rotateX(70deg) translate3d(0, -300px, 0);\n}\n\n.reveal .slides > section > section[data-transition=convex].future,\n.reveal .slides > section > section[data-transition~=convex-in].future,\n.reveal.convex .slides > section > section:not([data-transition]).future {\n  transform: translate3d(0, 300px, 0) rotateX(-70deg) translate3d(0, 300px, 0);\n}\n\n/*********************************************\n * CONCAVE TRANSITION\n *********************************************/\n.reveal .slides section[data-transition=concave].stack,\n.reveal.concave .slides section.stack {\n  transform-style: preserve-3d;\n}\n\n.reveal .slides > section[data-transition=concave].past,\n.reveal .slides > section[data-transition~=concave-out].past,\n.reveal.concave .slides > section:not([data-transition]).past {\n  transform: translate3d(-100%, 0, 0) rotateY(90deg) translate3d(-100%, 0, 0);\n}\n\n.reveal .slides > section[data-transition=concave].future,\n.reveal .slides > section[data-transition~=concave-in].future,\n.reveal.concave .slides > section:not([data-transition]).future {\n  transform: translate3d(100%, 0, 0) rotateY(-90deg) translate3d(100%, 0, 0);\n}\n\n.reveal .slides > section > section[data-transition=concave].past,\n.reveal .slides > section > section[data-transition~=concave-out].past,\n.reveal.concave .slides > section > section:not([data-transition]).past {\n  transform: translate3d(0, -80%, 0) rotateX(-70deg) translate3d(0, -80%, 0);\n}\n\n.reveal .slides > section > section[data-transition=concave].future,\n.reveal .slides > section > section[data-transition~=concave-in].future,\n.reveal.concave .slides > section > section:not([data-transition]).future {\n  transform: translate3d(0, 80%, 0) rotateX(70deg) translate3d(0, 80%, 0);\n}\n\n/*********************************************\n * ZOOM TRANSITION\n *********************************************/\n.reveal .slides section[data-transition=zoom],\n.reveal.zoom .slides section:not([data-transition]) {\n  transition-timing-function: ease;\n}\n\n.reveal .slides > section[data-transition=zoom].past,\n.reveal .slides > section[data-transition~=zoom-out].past,\n.reveal.zoom .slides > section:not([data-transition]).past {\n  visibility: hidden;\n  transform: scale(16);\n}\n\n.reveal .slides > section[data-transition=zoom].future,\n.reveal .slides > section[data-transition~=zoom-in].future,\n.reveal.zoom .slides > section:not([data-transition]).future {\n  visibility: hidden;\n  transform: scale(0.2);\n}\n\n.reveal .slides > section > section[data-transition=zoom].past,\n.reveal .slides > section > section[data-transition~=zoom-out].past,\n.reveal.zoom .slides > section > section:not([data-transition]).past {\n  transform: translate(0, -150%);\n}\n\n.reveal .slides > section > section[data-transition=zoom].future,\n.reveal .slides > section > section[data-transition~=zoom-in].future,\n.reveal.zoom .slides > section > section:not([data-transition]).future {\n  transform: translate(0, 150%);\n}\n\n/*********************************************\n * CUBE TRANSITION\n *\n * WARNING:\n * this is deprecated and will be removed in a\n * future version.\n *********************************************/\n.reveal.cube .slides {\n  perspective: 1300px;\n}\n\n.reveal.cube .slides section {\n  padding: 30px;\n  min-height: 700px;\n  backface-visibility: hidden;\n  box-sizing: border-box;\n  transform-style: preserve-3d;\n}\n\n.reveal.center.cube .slides section {\n  min-height: 0;\n}\n\n.reveal.cube .slides section:not(.stack):before {\n  content: '';\n  position: absolute;\n  display: block;\n  width: 100%;\n  height: 100%;\n  left: 0;\n  top: 0;\n  background: rgba(0, 0, 0, 0.1);\n  border-radius: 4px;\n  transform: translateZ(-20px);\n}\n\n.reveal.cube .slides section:not(.stack):after {\n  content: '';\n  position: absolute;\n  display: block;\n  width: 90%;\n  height: 30px;\n  left: 5%;\n  bottom: 0;\n  background: none;\n  z-index: 1;\n  border-radius: 4px;\n  box-shadow: 0px 95px 25px rgba(0, 0, 0, 0.2);\n  transform: translateZ(-90px) rotateX(65deg);\n}\n\n.reveal.cube .slides > section.stack {\n  padding: 0;\n  background: none;\n}\n\n.reveal.cube .slides > section.past {\n  transform-origin: 100% 0%;\n  transform: translate3d(-100%, 0, 0) rotateY(-90deg);\n}\n\n.reveal.cube .slides > section.future {\n  transform-origin: 0% 0%;\n  transform: translate3d(100%, 0, 0) rotateY(90deg);\n}\n\n.reveal.cube .slides > section > section.past {\n  transform-origin: 0% 100%;\n  transform: translate3d(0, -100%, 0) rotateX(90deg);\n}\n\n.reveal.cube .slides > section > section.future {\n  transform-origin: 0% 0%;\n  transform: translate3d(0, 100%, 0) rotateX(-90deg);\n}\n\n/*********************************************\n * PAGE TRANSITION\n *\n * WARNING:\n * this is deprecated and will be removed in a\n * future version.\n *********************************************/\n.reveal.page .slides {\n  perspective-origin: 0% 50%;\n  perspective: 3000px;\n}\n\n.reveal.page .slides section {\n  padding: 30px;\n  min-height: 700px;\n  box-sizing: border-box;\n  transform-style: preserve-3d;\n}\n\n.reveal.page .slides section.past {\n  z-index: 12;\n}\n\n.reveal.page .slides section:not(.stack):before {\n  content: '';\n  position: absolute;\n  display: block;\n  width: 100%;\n  height: 100%;\n  left: 0;\n  top: 0;\n  background: rgba(0, 0, 0, 0.1);\n  transform: translateZ(-20px);\n}\n\n.reveal.page .slides section:not(.stack):after {\n  content: '';\n  position: absolute;\n  display: block;\n  width: 90%;\n  height: 30px;\n  left: 5%;\n  bottom: 0;\n  background: none;\n  z-index: 1;\n  border-radius: 4px;\n  box-shadow: 0px 95px 25px rgba(0, 0, 0, 0.2);\n  -webkit-transform: translateZ(-90px) rotateX(65deg);\n}\n\n.reveal.page .slides > section.stack {\n  padding: 0;\n  background: none;\n}\n\n.reveal.page .slides > section.past {\n  transform-origin: 0% 0%;\n  transform: translate3d(-40%, 0, 0) rotateY(-80deg);\n}\n\n.reveal.page .slides > section.future {\n  transform-origin: 100% 0%;\n  transform: translate3d(0, 0, 0);\n}\n\n.reveal.page .slides > section > section.past {\n  transform-origin: 0% 0%;\n  transform: translate3d(0, -40%, 0) rotateX(80deg);\n}\n\n.reveal.page .slides > section > section.future {\n  transform-origin: 0% 100%;\n  transform: translate3d(0, 0, 0);\n}\n\n/*********************************************\n * FADE TRANSITION\n *********************************************/\n.reveal .slides section[data-transition=fade],\n.reveal.fade .slides section:not([data-transition]),\n.reveal.fade .slides > section > section:not([data-transition]) {\n  transform: none;\n  transition: opacity 0.5s;\n}\n\n.reveal.fade.overview .slides section,\n.reveal.fade.overview .slides > section > section {\n  transition: none;\n}\n\n/*********************************************\n * NO TRANSITION\n *********************************************/\n.reveal .slides section[data-transition=none],\n.reveal.none .slides section:not([data-transition]) {\n  transform: none;\n  transition: none;\n}\n\n/*********************************************\n * PAUSED MODE\n *********************************************/\n.reveal .pause-overlay {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: black;\n  visibility: hidden;\n  opacity: 0;\n  z-index: 100;\n  transition: all 1s ease;\n}\n\n.reveal.paused .pause-overlay {\n  visibility: visible;\n  opacity: 1;\n}\n\n/*********************************************\n * FALLBACK\n *********************************************/\n.no-transforms {\n  overflow-y: auto;\n}\n\n.no-transforms .reveal .slides {\n  position: relative;\n  width: 80%;\n  height: auto !important;\n  top: 0;\n  left: 50%;\n  margin: 0;\n  text-align: center;\n}\n\n.no-transforms .reveal .controls,\n.no-transforms .reveal .progress {\n  display: none !important;\n}\n\n.no-transforms .reveal .slides section {\n  display: block !important;\n  opacity: 1 !important;\n  position: relative !important;\n  height: auto;\n  min-height: 0;\n  top: 0;\n  left: -50%;\n  margin: 70px 0;\n  transform: none;\n}\n\n.no-transforms .reveal .slides section section {\n  left: 0;\n}\n\n.reveal .no-transition,\n.reveal .no-transition * {\n  transition: none !important;\n}\n\n/*********************************************\n * PER-SLIDE BACKGROUNDS\n *********************************************/\n.reveal .backgrounds {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  perspective: 600px;\n}\n\n.reveal .slide-background {\n  display: none;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  opacity: 0;\n  visibility: hidden;\n  overflow: hidden;\n  background-color: transparent;\n  background-position: 50% 50%;\n  background-repeat: no-repeat;\n  background-size: cover;\n  transition: all 800ms cubic-bezier(0.26, 0.86, 0.44, 0.985);\n}\n\n.reveal .slide-background.stack {\n  display: block;\n}\n\n.reveal .slide-background.present {\n  opacity: 1;\n  visibility: visible;\n  z-index: 2;\n}\n\n.print-pdf .reveal .slide-background {\n  opacity: 1 !important;\n  visibility: visible !important;\n}\n\n/* Video backgrounds */\n.reveal .slide-background video {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  max-width: none;\n  max-height: none;\n  top: 0;\n  left: 0;\n  object-fit: cover;\n}\n\n.reveal .slide-background[data-background-size=\"contain\"] video {\n  object-fit: contain;\n}\n\n/* Immediate transition style */\n.reveal[data-background-transition=none] > .backgrounds .slide-background,\n.reveal > .backgrounds .slide-background[data-background-transition=none] {\n  transition: none;\n}\n\n/* Slide */\n.reveal[data-background-transition=slide] > .backgrounds .slide-background,\n.reveal > .backgrounds .slide-background[data-background-transition=slide] {\n  opacity: 1;\n  backface-visibility: hidden;\n}\n\n.reveal[data-background-transition=slide] > .backgrounds .slide-background.past,\n.reveal > .backgrounds .slide-background.past[data-background-transition=slide] {\n  transform: translate(-100%, 0);\n}\n\n.reveal[data-background-transition=slide] > .backgrounds .slide-background.future,\n.reveal > .backgrounds .slide-background.future[data-background-transition=slide] {\n  transform: translate(100%, 0);\n}\n\n.reveal[data-background-transition=slide] > .backgrounds .slide-background > .slide-background.past,\n.reveal > .backgrounds .slide-background > .slide-background.past[data-background-transition=slide] {\n  transform: translate(0, -100%);\n}\n\n.reveal[data-background-transition=slide] > .backgrounds .slide-background > .slide-background.future,\n.reveal > .backgrounds .slide-background > .slide-background.future[data-background-transition=slide] {\n  transform: translate(0, 100%);\n}\n\n/* Convex */\n.reveal[data-background-transition=convex] > .backgrounds .slide-background.past,\n.reveal > .backgrounds .slide-background.past[data-background-transition=convex] {\n  opacity: 0;\n  transform: translate3d(-100%, 0, 0) rotateY(-90deg) translate3d(-100%, 0, 0);\n}\n\n.reveal[data-background-transition=convex] > .backgrounds .slide-background.future,\n.reveal > .backgrounds .slide-background.future[data-background-transition=convex] {\n  opacity: 0;\n  transform: translate3d(100%, 0, 0) rotateY(90deg) translate3d(100%, 0, 0);\n}\n\n.reveal[data-background-transition=convex] > .backgrounds .slide-background > .slide-background.past,\n.reveal > .backgrounds .slide-background > .slide-background.past[data-background-transition=convex] {\n  opacity: 0;\n  transform: translate3d(0, -100%, 0) rotateX(90deg) translate3d(0, -100%, 0);\n}\n\n.reveal[data-background-transition=convex] > .backgrounds .slide-background > .slide-background.future,\n.reveal > .backgrounds .slide-background > .slide-background.future[data-background-transition=convex] {\n  opacity: 0;\n  transform: translate3d(0, 100%, 0) rotateX(-90deg) translate3d(0, 100%, 0);\n}\n\n/* Concave */\n.reveal[data-background-transition=concave] > .backgrounds .slide-background.past,\n.reveal > .backgrounds .slide-background.past[data-background-transition=concave] {\n  opacity: 0;\n  transform: translate3d(-100%, 0, 0) rotateY(90deg) translate3d(-100%, 0, 0);\n}\n\n.reveal[data-background-transition=concave] > .backgrounds .slide-background.future,\n.reveal > .backgrounds .slide-background.future[data-background-transition=concave] {\n  opacity: 0;\n  transform: translate3d(100%, 0, 0) rotateY(-90deg) translate3d(100%, 0, 0);\n}\n\n.reveal[data-background-transition=concave] > .backgrounds .slide-background > .slide-background.past,\n.reveal > .backgrounds .slide-background > .slide-background.past[data-background-transition=concave] {\n  opacity: 0;\n  transform: translate3d(0, -100%, 0) rotateX(-90deg) translate3d(0, -100%, 0);\n}\n\n.reveal[data-background-transition=concave] > .backgrounds .slide-background > .slide-background.future,\n.reveal > .backgrounds .slide-background > .slide-background.future[data-background-transition=concave] {\n  opacity: 0;\n  transform: translate3d(0, 100%, 0) rotateX(90deg) translate3d(0, 100%, 0);\n}\n\n/* Zoom */\n.reveal[data-background-transition=zoom] > .backgrounds .slide-background,\n.reveal > .backgrounds .slide-background[data-background-transition=zoom] {\n  transition-timing-function: ease;\n}\n\n.reveal[data-background-transition=zoom] > .backgrounds .slide-background.past,\n.reveal > .backgrounds .slide-background.past[data-background-transition=zoom] {\n  opacity: 0;\n  visibility: hidden;\n  transform: scale(16);\n}\n\n.reveal[data-background-transition=zoom] > .backgrounds .slide-background.future,\n.reveal > .backgrounds .slide-background.future[data-background-transition=zoom] {\n  opacity: 0;\n  visibility: hidden;\n  transform: scale(0.2);\n}\n\n.reveal[data-background-transition=zoom] > .backgrounds .slide-background > .slide-background.past,\n.reveal > .backgrounds .slide-background > .slide-background.past[data-background-transition=zoom] {\n  opacity: 0;\n  visibility: hidden;\n  transform: scale(16);\n}\n\n.reveal[data-background-transition=zoom] > .backgrounds .slide-background > .slide-background.future,\n.reveal > .backgrounds .slide-background > .slide-background.future[data-background-transition=zoom] {\n  opacity: 0;\n  visibility: hidden;\n  transform: scale(0.2);\n}\n\n/* Global transition speed settings */\n.reveal[data-transition-speed=\"fast\"] > .backgrounds .slide-background {\n  transition-duration: 400ms;\n}\n\n.reveal[data-transition-speed=\"slow\"] > .backgrounds .slide-background {\n  transition-duration: 1200ms;\n}\n\n/*********************************************\n * OVERVIEW\n *********************************************/\n.reveal.overview {\n  perspective-origin: 50% 50%;\n  perspective: 700px;\n}\n\n.reveal.overview .slides {\n  -moz-transform-style: preserve-3d;\n}\n\n.reveal.overview .slides section {\n  height: 100%;\n  top: 0 !important;\n  opacity: 1 !important;\n  overflow: hidden;\n  visibility: visible !important;\n  cursor: pointer;\n  box-sizing: border-box;\n}\n\n.reveal.overview .slides section:hover,\n.reveal.overview .slides section.present {\n  outline: 10px solid rgba(150, 150, 150, 0.4);\n  outline-offset: 10px;\n}\n\n.reveal.overview .slides section .fragment {\n  opacity: 1;\n  transition: none;\n}\n\n.reveal.overview .slides section:after,\n.reveal.overview .slides section:before {\n  display: none !important;\n}\n\n.reveal.overview .slides > section.stack {\n  padding: 0;\n  top: 0 !important;\n  background: none;\n  outline: none;\n  overflow: visible;\n}\n\n.reveal.overview .backgrounds {\n  perspective: inherit;\n  -moz-transform-style: preserve-3d;\n}\n\n.reveal.overview .backgrounds .slide-background {\n  opacity: 1;\n  visibility: visible;\n  outline: 10px solid rgba(150, 150, 150, 0.1);\n  outline-offset: 10px;\n}\n\n.reveal.overview .backgrounds .slide-background.stack {\n  overflow: visible;\n}\n\n.reveal.overview .slides section,\n.reveal.overview-deactivating .slides section {\n  transition: none;\n}\n\n.reveal.overview .backgrounds .slide-background,\n.reveal.overview-deactivating .backgrounds .slide-background {\n  transition: none;\n}\n\n/*********************************************\n * RTL SUPPORT\n *********************************************/\n.reveal.rtl .slides,\n.reveal.rtl .slides h1,\n.reveal.rtl .slides h2,\n.reveal.rtl .slides h3,\n.reveal.rtl .slides h4,\n.reveal.rtl .slides h5,\n.reveal.rtl .slides h6 {\n  direction: rtl;\n  font-family: sans-serif;\n}\n\n.reveal.rtl pre,\n.reveal.rtl code {\n  direction: ltr;\n}\n\n.reveal.rtl ol,\n.reveal.rtl ul {\n  text-align: right;\n}\n\n.reveal.rtl .progress span {\n  float: right;\n}\n\n/*********************************************\n * PARALLAX BACKGROUND\n *********************************************/\n.reveal.has-parallax-background .backgrounds {\n  transition: all 0.8s ease;\n}\n\n/* Global transition speed settings */\n.reveal.has-parallax-background[data-transition-speed=\"fast\"] .backgrounds {\n  transition-duration: 400ms;\n}\n\n.reveal.has-parallax-background[data-transition-speed=\"slow\"] .backgrounds {\n  transition-duration: 1200ms;\n}\n\n/*********************************************\n * LINK PREVIEW OVERLAY\n *********************************************/\n.reveal .overlay {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  z-index: 1000;\n  background: rgba(0, 0, 0, 0.9);\n  opacity: 0;\n  visibility: hidden;\n  transition: all 0.3s ease;\n}\n\n.reveal .overlay.visible {\n  opacity: 1;\n  visibility: visible;\n}\n\n.reveal .overlay .spinner {\n  position: absolute;\n  display: block;\n  top: 50%;\n  left: 50%;\n  width: 32px;\n  height: 32px;\n  margin: -16px 0 0 -16px;\n  z-index: 10;\n  background-image: url(data:image/gif;base64,R0lGODlhIAAgAPMAAJmZmf%2F%2F%2F6%2Bvr8nJybW1tcDAwOjo6Nvb26ioqKOjo7Ozs%2FLy8vz8%2FAAAAAAAAAAAACH%2FC05FVFNDQVBFMi4wAwEAAAAh%2FhpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh%2BQQJCgAAACwAAAAAIAAgAAAE5xDISWlhperN52JLhSSdRgwVo1ICQZRUsiwHpTJT4iowNS8vyW2icCF6k8HMMBkCEDskxTBDAZwuAkkqIfxIQyhBQBFvAQSDITM5VDW6XNE4KagNh6Bgwe60smQUB3d4Rz1ZBApnFASDd0hihh12BkE9kjAJVlycXIg7CQIFA6SlnJ87paqbSKiKoqusnbMdmDC2tXQlkUhziYtyWTxIfy6BE8WJt5YJvpJivxNaGmLHT0VnOgSYf0dZXS7APdpB309RnHOG5gDqXGLDaC457D1zZ%2FV%2FnmOM82XiHRLYKhKP1oZmADdEAAAh%2BQQJCgAAACwAAAAAIAAgAAAE6hDISWlZpOrNp1lGNRSdRpDUolIGw5RUYhhHukqFu8DsrEyqnWThGvAmhVlteBvojpTDDBUEIFwMFBRAmBkSgOrBFZogCASwBDEY%2FCZSg7GSE0gSCjQBMVG023xWBhklAnoEdhQEfyNqMIcKjhRsjEdnezB%2BA4k8gTwJhFuiW4dokXiloUepBAp5qaKpp6%2BHo7aWW54wl7obvEe0kRuoplCGepwSx2jJvqHEmGt6whJpGpfJCHmOoNHKaHx61WiSR92E4lbFoq%2BB6QDtuetcaBPnW6%2BO7wDHpIiK9SaVK5GgV543tzjgGcghAgAh%2BQQJCgAAACwAAAAAIAAgAAAE7hDISSkxpOrN5zFHNWRdhSiVoVLHspRUMoyUakyEe8PTPCATW9A14E0UvuAKMNAZKYUZCiBMuBakSQKG8G2FzUWox2AUtAQFcBKlVQoLgQReZhQlCIJesQXI5B0CBnUMOxMCenoCfTCEWBsJColTMANldx15BGs8B5wlCZ9Po6OJkwmRpnqkqnuSrayqfKmqpLajoiW5HJq7FL1Gr2mMMcKUMIiJgIemy7xZtJsTmsM4xHiKv5KMCXqfyUCJEonXPN2rAOIAmsfB3uPoAK%2B%2BG%2Bw48edZPK%2BM6hLJpQg484enXIdQFSS1u6UhksENEQAAIfkECQoAAAAsAAAAACAAIAAABOcQyEmpGKLqzWcZRVUQnZYg1aBSh2GUVEIQ2aQOE%2BG%2BcD4ntpWkZQj1JIiZIogDFFyHI0UxQwFugMSOFIPJftfVAEoZLBbcLEFhlQiqGp1Vd140AUklUN3eCA51C1EWMzMCezCBBmkxVIVHBWd3HHl9JQOIJSdSnJ0TDKChCwUJjoWMPaGqDKannasMo6WnM562R5YluZRwur0wpgqZE7NKUm%2BFNRPIhjBJxKZteWuIBMN4zRMIVIhffcgojwCF117i4nlLnY5ztRLsnOk%2BaV%2BoJY7V7m76PdkS4trKcdg0Zc0tTcKkRAAAIfkECQoAAAAsAAAAACAAIAAABO4QyEkpKqjqzScpRaVkXZWQEximw1BSCUEIlDohrft6cpKCk5xid5MNJTaAIkekKGQkWyKHkvhKsR7ARmitkAYDYRIbUQRQjWBwJRzChi9CRlBcY1UN4g0%2FVNB0AlcvcAYHRyZPdEQFYV8ccwR5HWxEJ02YmRMLnJ1xCYp0Y5idpQuhopmmC2KgojKasUQDk5BNAwwMOh2RtRq5uQuPZKGIJQIGwAwGf6I0JXMpC8C7kXWDBINFMxS4DKMAWVWAGYsAdNqW5uaRxkSKJOZKaU3tPOBZ4DuK2LATgJhkPJMgTwKCdFjyPHEnKxFCDhEAACH5BAkKAAAALAAAAAAgACAAAATzEMhJaVKp6s2nIkolIJ2WkBShpkVRWqqQrhLSEu9MZJKK9y1ZrqYK9WiClmvoUaF8gIQSNeF1Er4MNFn4SRSDARWroAIETg1iVwuHjYB1kYc1mwruwXKC9gmsJXliGxc%2BXiUCby9ydh1sOSdMkpMTBpaXBzsfhoc5l58Gm5yToAaZhaOUqjkDgCWNHAULCwOLaTmzswadEqggQwgHuQsHIoZCHQMMQgQGubVEcxOPFAcMDAYUA85eWARmfSRQCdcMe0zeP1AAygwLlJtPNAAL19DARdPzBOWSm1brJBi45soRAWQAAkrQIykShQ9wVhHCwCQCACH5BAkKAAAALAAAAAAgACAAAATrEMhJaVKp6s2nIkqFZF2VIBWhUsJaTokqUCoBq%2BE71SRQeyqUToLA7VxF0JDyIQh%2FMVVPMt1ECZlfcjZJ9mIKoaTl1MRIl5o4CUKXOwmyrCInCKqcWtvadL2SYhyASyNDJ0uIiRMDjI0Fd30%2FiI2UA5GSS5UDj2l6NoqgOgN4gksEBgYFf0FDqKgHnyZ9OX8HrgYHdHpcHQULXAS2qKpENRg7eAMLC7kTBaixUYFkKAzWAAnLC7FLVxLWDBLKCwaKTULgEwbLA4hJtOkSBNqITT3xEgfLpBtzE%2FjiuL04RGEBgwWhShRgQExHBAAh%2BQQJCgAAACwAAAAAIAAgAAAE7xDISWlSqerNpyJKhWRdlSAVoVLCWk6JKlAqAavhO9UkUHsqlE6CwO1cRdCQ8iEIfzFVTzLdRAmZX3I2SfZiCqGk5dTESJeaOAlClzsJsqwiJwiqnFrb2nS9kmIcgEsjQydLiIlHehhpejaIjzh9eomSjZR%2BipslWIRLAgMDOR2DOqKogTB9pCUJBagDBXR6XB0EBkIIsaRsGGMMAxoDBgYHTKJiUYEGDAzHC9EACcUGkIgFzgwZ0QsSBcXHiQvOwgDdEwfFs0sDzt4S6BK4xYjkDOzn0unFeBzOBijIm1Dgmg5YFQwsCMjp1oJ8LyIAACH5BAkKAAAALAAAAAAgACAAAATwEMhJaVKp6s2nIkqFZF2VIBWhUsJaTokqUCoBq%2BE71SRQeyqUToLA7VxF0JDyIQh%2FMVVPMt1ECZlfcjZJ9mIKoaTl1MRIl5o4CUKXOwmyrCInCKqcWtvadL2SYhyASyNDJ0uIiUd6GGl6NoiPOH16iZKNlH6KmyWFOggHhEEvAwwMA0N9GBsEC6amhnVcEwavDAazGwIDaH1ipaYLBUTCGgQDA8NdHz0FpqgTBwsLqAbWAAnIA4FWKdMLGdYGEgraigbT0OITBcg5QwPT4xLrROZL6AuQAPUS7bxLpoWidY0JtxLHKhwwMJBTHgPKdEQAACH5BAkKAAAALAAAAAAgACAAAATrEMhJaVKp6s2nIkqFZF2VIBWhUsJaTokqUCoBq%2BE71SRQeyqUToLA7VxF0JDyIQh%2FMVVPMt1ECZlfcjZJ9mIKoaTl1MRIl5o4CUKXOwmyrCInCKqcWtvadL2SYhyASyNDJ0uIiUd6GAULDJCRiXo1CpGXDJOUjY%2BYip9DhToJA4RBLwMLCwVDfRgbBAaqqoZ1XBMHswsHtxtFaH1iqaoGNgAIxRpbFAgfPQSqpbgGBqUD1wBXeCYp1AYZ19JJOYgH1KwA4UBvQwXUBxPqVD9L3sbp2BNk2xvvFPJd%2BMFCN6HAAIKgNggY0KtEBAAh%2BQQJCgAAACwAAAAAIAAgAAAE6BDISWlSqerNpyJKhWRdlSAVoVLCWk6JKlAqAavhO9UkUHsqlE6CwO1cRdCQ8iEIfzFVTzLdRAmZX3I2SfYIDMaAFdTESJeaEDAIMxYFqrOUaNW4E4ObYcCXaiBVEgULe0NJaxxtYksjh2NLkZISgDgJhHthkpU4mW6blRiYmZOlh4JWkDqILwUGBnE6TYEbCgevr0N1gH4At7gHiRpFaLNrrq8HNgAJA70AWxQIH1%2BvsYMDAzZQPC9VCNkDWUhGkuE5PxJNwiUK4UfLzOlD4WvzAHaoG9nxPi5d%2BjYUqfAhhykOFwJWiAAAIfkECQoAAAAsAAAAACAAIAAABPAQyElpUqnqzaciSoVkXVUMFaFSwlpOCcMYlErAavhOMnNLNo8KsZsMZItJEIDIFSkLGQoQTNhIsFehRww2CQLKF0tYGKYSg%2BygsZIuNqJksKgbfgIGepNo2cIUB3V1B3IvNiBYNQaDSTtfhhx0CwVPI0UJe0%2Bbm4g5VgcGoqOcnjmjqDSdnhgEoamcsZuXO1aWQy8KAwOAuTYYGwi7w5h%2BKr0SJ8MFihpNbx%2B4Erq7BYBuzsdiH1jCAzoSfl0rVirNbRXlBBlLX%2BBP0XJLAPGzTkAuAOqb0WT5AH7OcdCm5B8TgRwSRKIHQtaLCwg1RAAAOwAAAAAAAAAAAA%3D%3D);\n  visibility: visible;\n  opacity: 0.6;\n  transition: all 0.3s ease;\n}\n\n.reveal .overlay header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 40px;\n  z-index: 2;\n  border-bottom: 1px solid #222;\n}\n\n.reveal .overlay header a {\n  display: inline-block;\n  width: 40px;\n  height: 40px;\n  line-height: 36px;\n  padding: 0 10px;\n  float: right;\n  opacity: 0.6;\n  box-sizing: border-box;\n}\n\n.reveal .overlay header a:hover {\n  opacity: 1;\n}\n\n.reveal .overlay header a .icon {\n  display: inline-block;\n  width: 20px;\n  height: 20px;\n  background-position: 50% 50%;\n  background-size: 100%;\n  background-repeat: no-repeat;\n}\n\n.reveal .overlay header a.close .icon {\n  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABkklEQVRYR8WX4VHDMAxG6wnoJrABZQPYBCaBTWAD2g1gE5gg6OOsXuxIlr40d81dfrSJ9V4c2VLK7spHuTJ/5wpM07QXuXc5X0opX2tEJcadjHuV80li/FgxTIEK/5QBCICBD6xEhSMGHgQPgBgLiYVAB1dpSqKDawxTohFw4JSEA3clzgIBPCURwE2JucBR7rhPJJv5OpJwDX+SfDjgx1wACQeJG1aChP9K/IMmdZ8DtESV1WyP3Bt4MwM6sj4NMxMYiqUWHQu4KYA/SYkIjOsm3BXYWMKFDwU2khjCQ4ELJUJ4SmClRArOCmSXGuKma0fYD5CbzHxFpCSGAhfAVSSUGDUk2BWZaff2g6GE15BsBQ9nwmpIGDiyHQddwNTMKkbZaf9fajXQca1EX44puJZUsnY0ObGmITE3GVLCbEhQUjGVt146j6oasWN+49Vph2w1pZ5EansNZqKBm1txbU57iRRcZ86RWMDdWtBJUHBHwoQPi1GV+JCbntmvok7iTX4/Up9mgyTc/FJYDTcndgH/AA5A/CHsyEkVAAAAAElFTkSuQmCC);\n}\n\n.reveal .overlay header a.external .icon {\n  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAcElEQVRYR+2WSQoAIQwEzf8f7XiOMkUQxUPlGkM3hVmiQfQR9GYnH1SsAQlI4DiBqkCMoNb9y2e90IAEJPAcgdznU9+engMaeJ7Azh5Y1U67gAho4DqBqmB1buAf0MB1AlVBek83ZPkmJMGc1wAR+AAqod/B97TRpQAAAABJRU5ErkJggg==);\n}\n\n.reveal .overlay .viewport {\n  position: absolute;\n  display: flex;\n  top: 40px;\n  right: 0;\n  bottom: 0;\n  left: 0;\n}\n\n.reveal .overlay.overlay-preview .viewport iframe {\n  width: 100%;\n  height: 100%;\n  max-width: 100%;\n  max-height: 100%;\n  border: 0;\n  opacity: 0;\n  visibility: hidden;\n  transition: all 0.3s ease;\n}\n\n.reveal .overlay.overlay-preview.loaded .viewport iframe {\n  opacity: 1;\n  visibility: visible;\n}\n\n.reveal .overlay.overlay-preview.loaded .viewport-inner {\n  position: absolute;\n  z-index: -1;\n  left: 0;\n  top: 45%;\n  width: 100%;\n  text-align: center;\n  letter-spacing: normal;\n}\n\n.reveal .overlay.overlay-preview .x-frame-error {\n  opacity: 0;\n  transition: opacity 0.3s ease 0.3s;\n}\n\n.reveal .overlay.overlay-preview.loaded .x-frame-error {\n  opacity: 1;\n}\n\n.reveal .overlay.overlay-preview.loaded .spinner {\n  opacity: 0;\n  visibility: hidden;\n  transform: scale(0.2);\n}\n\n.reveal .overlay.overlay-help .viewport {\n  overflow: auto;\n  color: #fff;\n}\n\n.reveal .overlay.overlay-help .viewport .viewport-inner {\n  width: 600px;\n  margin: auto;\n  padding: 20px 20px 80px 20px;\n  text-align: center;\n  letter-spacing: normal;\n}\n\n.reveal .overlay.overlay-help .viewport .viewport-inner .title {\n  font-size: 20px;\n}\n\n.reveal .overlay.overlay-help .viewport .viewport-inner table {\n  border: 1px solid #fff;\n  border-collapse: collapse;\n  font-size: 16px;\n}\n\n.reveal .overlay.overlay-help .viewport .viewport-inner table th,\n.reveal .overlay.overlay-help .viewport .viewport-inner table td {\n  width: 200px;\n  padding: 14px;\n  border: 1px solid #fff;\n  vertical-align: middle;\n}\n\n.reveal .overlay.overlay-help .viewport .viewport-inner table th {\n  padding-top: 20px;\n  padding-bottom: 20px;\n}\n\n/*********************************************\n * PLAYBACK COMPONENT\n *********************************************/\n.reveal .playback {\n  position: absolute;\n  left: 15px;\n  bottom: 20px;\n  z-index: 30;\n  cursor: pointer;\n  transition: all 400ms ease;\n  -webkit-tap-highlight-color: transparent;\n}\n\n.reveal.overview .playback {\n  opacity: 0;\n  visibility: hidden;\n}\n\n/*********************************************\n * ROLLING LINKS\n *********************************************/\n.reveal .roll {\n  display: inline-block;\n  line-height: 1.2;\n  overflow: hidden;\n  vertical-align: top;\n  perspective: 400px;\n  perspective-origin: 50% 50%;\n}\n\n.reveal .roll:hover {\n  background: none;\n  text-shadow: none;\n}\n\n.reveal .roll span {\n  display: block;\n  position: relative;\n  padding: 0 2px;\n  pointer-events: none;\n  transition: all 400ms ease;\n  transform-origin: 50% 0%;\n  transform-style: preserve-3d;\n  backface-visibility: hidden;\n}\n\n.reveal .roll:hover span {\n  background: rgba(0, 0, 0, 0.5);\n  transform: translate3d(0px, 0px, -45px) rotateX(90deg);\n}\n\n.reveal .roll span:after {\n  content: attr(data-title);\n  display: block;\n  position: absolute;\n  left: 0;\n  top: 0;\n  padding: 0 2px;\n  backface-visibility: hidden;\n  transform-origin: 50% 0%;\n  transform: translate3d(0px, 110%, 0px) rotateX(-90deg);\n}\n\n/*********************************************\n * SPEAKER NOTES\n *********************************************/\n.reveal aside.notes {\n  display: none;\n}\n\n.reveal .speaker-notes {\n  display: none;\n  position: absolute;\n  width: 25vw;\n  height: 100%;\n  top: 0;\n  left: 100%;\n  padding: 14px 18px 14px 18px;\n  z-index: 1;\n  font-size: 18px;\n  line-height: 1.4;\n  border: 1px solid rgba(0, 0, 0, 0.05);\n  color: #222;\n  background-color: #f5f5f5;\n  overflow: auto;\n  box-sizing: border-box;\n  text-align: left;\n  font-family: Helvetica, sans-serif;\n  -webkit-overflow-scrolling: touch;\n}\n\n.reveal .speaker-notes .notes-placeholder {\n  color: #ccc;\n  font-style: italic;\n}\n\n.reveal .speaker-notes:focus {\n  outline: none;\n}\n\n.reveal .speaker-notes:before {\n  content: 'Speaker notes';\n  display: block;\n  margin-bottom: 10px;\n  opacity: 0.5;\n}\n\n.reveal.show-notes {\n  max-width: 75vw;\n  overflow: visible;\n}\n\n.reveal.show-notes .speaker-notes {\n  display: block;\n}\n\n@media screen and (min-width: 1600px) {\n  .reveal .speaker-notes {\n    font-size: 20px;\n  }\n}\n\n@media screen and (max-width: 1024px) {\n  .reveal.show-notes {\n    border-left: 0;\n    max-width: none;\n    max-height: 70%;\n    overflow: visible;\n  }\n  .reveal.show-notes .speaker-notes {\n    top: 100%;\n    left: 0;\n    width: 100%;\n    height: 42.85714%;\n  }\n}\n\n@media screen and (max-width: 600px) {\n  .reveal.show-notes {\n    max-height: 60%;\n  }\n  .reveal.show-notes .speaker-notes {\n    top: 100%;\n    height: 66.66667%;\n  }\n  .reveal .speaker-notes {\n    font-size: 14px;\n  }\n}\n\n/*********************************************\n * ZOOM PLUGIN\n *********************************************/\n.zoomed .reveal *,\n.zoomed .reveal *:before,\n.zoomed .reveal *:after {\n  backface-visibility: visible !important;\n}\n\n.zoomed .reveal .progress,\n.zoomed .reveal .controls {\n  opacity: 0;\n}\n\n.zoomed .reveal .roll span {\n  background: none;\n}\n\n.zoomed .reveal .roll span:after {\n  visibility: hidden;\n}\n", ""]);

// exports


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(132);
exports = module.exports = __webpack_require__(49)(false);
// imports
exports.push([module.i, "@import url(http://fonts.googleapis.com/css?family=Gentium+Book+Basic:400italic,400);", ""]);

// module
exports.push([module.i, "/*\n\nZenburn style from voldmar.ru (c) Vladimir Epifanov <voldmar@voldmar.ru>\nbased on dark.css by Ivan Sagalaev\n\n*/\n.hljs {\n  display: block;\n  padding: 0.5em;\n  background: #3F3F3F;\n  color: #DCDCDC;\n}\n\n.hljs-keyword,\n.hljs-tag,\n.css .hljs-class,\n.css .hljs-id,\n.lisp .hljs-title,\n.nginx .hljs-title,\n.hljs-request,\n.hljs-status,\n.clojure .hljs-attribute {\n  color: #E3CEAB;\n}\n\n.django .hljs-template_tag,\n.django .hljs-variable,\n.django .hljs-filter .hljs-argument {\n  color: #DCDCDC;\n}\n\n.hljs-number,\n.hljs-date {\n  color: #8CD0D3;\n}\n\n.dos .hljs-envvar,\n.dos .hljs-stream,\n.hljs-variable,\n.apache .hljs-sqbracket {\n  color: #EFDCBC;\n}\n\n.dos .hljs-flow,\n.diff .hljs-change,\n.python .exception,\n.python .hljs-built_in,\n.hljs-literal,\n.tex .hljs-special {\n  color: #EFEFAF;\n}\n\n.diff .hljs-chunk,\n.hljs-subst {\n  color: #8F8F8F;\n}\n\n.dos .hljs-keyword,\n.python .hljs-decorator,\n.hljs-title,\n.haskell .hljs-type,\n.diff .hljs-header,\n.ruby .hljs-class .hljs-parent,\n.apache .hljs-tag,\n.nginx .hljs-built_in,\n.tex .hljs-command,\n.hljs-prompt {\n  color: #efef8f;\n}\n\n.dos .hljs-winutils,\n.ruby .hljs-symbol,\n.ruby .hljs-symbol .hljs-string,\n.ruby .hljs-string {\n  color: #DCA3A3;\n}\n\n.diff .hljs-deletion,\n.hljs-string,\n.hljs-tag .hljs-value,\n.hljs-preprocessor,\n.hljs-pragma,\n.hljs-built_in,\n.sql .hljs-aggregate,\n.hljs-javadoc,\n.smalltalk .hljs-class,\n.smalltalk .hljs-localvars,\n.smalltalk .hljs-array,\n.css .hljs-rules .hljs-value,\n.hljs-attr_selector,\n.hljs-pseudo,\n.apache .hljs-cbracket,\n.tex .hljs-formula,\n.coffeescript .hljs-attribute {\n  color: #CC9393;\n}\n\n.hljs-shebang,\n.diff .hljs-addition,\n.hljs-comment,\n.java .hljs-annotation,\n.hljs-template_comment,\n.hljs-pi,\n.hljs-doctype {\n  color: #7F9F7F;\n}\n\n.coffeescript .javascript,\n.javascript .xml,\n.tex .hljs-formula,\n.xml .javascript,\n.xml .vbscript,\n.xml .css,\n.xml .hljs-cdata {\n  opacity: 0.5;\n}\n\n.reveal section img {\n  border: 0;\n  background: none;\n}\n\n.reveal h1,\n.reveal h2,\n.reveal h3,\n.reveal h4 {\n  text-transform: none;\n  display: block;\n  margin: 0 -20em .25em;\n}\n\n.reveal .attribution {\n  background-color: rgba(0, 0, 0, 0.6);\n  color: #ccc;\n  padding: 2px 15px;\n  display: inline-block;\n  position: absolute;\n  top: 5px 5px;\n}\n\n#attribution {\n  position: absolute;\n  top: 0;\n  right: 0;\n  z-index: 500;\n  padding: 0;\n  display: none;\n  text-align: right;\n  line-height: 1.6em;\n}\n\n.show-header #attribution {\n  display: block;\n  margin-top: 5px;\n  background: #000;\n  opacity: 0.65;\n  padding: 0 0.5em;\n}\n\n.heading {\n  background-color: rgba(45, 168, 37, 0.9);\n  color: white;\n  padding: 0.5em;\n}\n\n.heading.invert {\n  background-color: rgba(0, 0, 0, 0.9);\n  color: #fff;\n  color: #2da825;\n}\n\n.hidden {\n  display: none;\n}\n\n.success {\n  color: #2da825;\n}\n\n.warning {\n  color: #c8b423;\n}\n\n.danger {\n  color: #c82323;\n}\n\n.heading.bottom {\n  margin-top: 22rem;\n}\n\n.reveal blockquote {\n  font-family: 'Gentium Book Basic', serif;\n  background-color: rgba(0, 0, 0, 0.65);\n  letter-spacing: 1px;\n  text-align: left;\n  border: none;\n  padding: .25em 1em;\n}\n\n.reveal blockquote.invert {\n  background-color: rgba(255, 255, 255, 0.65);\n  color: #161616;\n}\n\n.reveal blockquote .quote-source {\n  font-family: sans-serif;\n  font-style: normal;\n  font-size: x-large;\n  text-align: right;\n  padding: .25em;\n  margin: .75em 0 0 0;\n  display: block;\n  letter-spacing: 0;\n}\n\n.reveal blockquote h1,\n.reveal blockquote h2,\n.reveal blockquote h3,\n.reveal blockquote h4 {\n  font-style: normal;\n  margin-top: .5em;\n}\n\n.reveal blockquote .quote-source a {\n  font-weight: 700;\n}\n\n.reveal .small {\n  font-size: 1rem;\n}\n\n.highlight {\n  background-color: #FBDA5C;\n  color: #212121;\n}\n\n.emphasize {\n  color: #42affa;\n  font-style: normal !important;\n}\n\n.emphasize.reverse {\n  background-color: #42affa;\n  color: #212121;\n}\n\n.drupalcon-logo {\n  background: url(" + escape(__webpack_require__(372)) + ");\n  background-repeat: no-repeat;\n  background-size: 300px;\n  background-position: 10% 50%;\n  height: 300px;\n}\n\n.text-center {\n  text-align: center;\n}\n\n.block {\n  display: block;\n}\n\n.reveal .workflow-grid {\n  display: grid;\n  grid-gap: 1rem;\n  grid-template-columns: 1fr;\n}\n\n.reveal .workflow-grid.issue-flow .workflow-grid__item {\n  text-align: center;\n}\n\n.reveal .workflow-grid.issue-flow .workflow-grid__item:nth-child(1) {\n  grid-column: 3;\n}\n\n.reveal .workflow-grid.issue-flow .workflow-grid__item:nth-child(2) {\n  grid-row: 2;\n  grid-column: 1;\n}\n\n.reveal .workflow-grid.issue-flow .workflow-grid__item:nth-child(3) {\n  grid-row: 2;\n  grid-column: 5;\n}\n\n.reveal .workflow-grid.issue-flow .workflow-grid__item:nth-child(4) {\n  grid-row: 3;\n  grid-column: 2;\n}\n\n.reveal .workflow-grid.issue-flow .workflow-grid__item:nth-child(5) {\n  grid-row: 3;\n  grid-column: 4;\n}\n\n.reveal .workflow-grid--5col {\n  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;\n}\n\n.reveal .workflow-grid__item {\n  list-style: none;\n}\n\n@media screen and (min-width: 900px) {\n  .reveal #attribution {\n    font-size: 0.5em;\n  }\n}\n\n@media screen and (max-width: 900px), (max-height: 600px) {\n  .reveal #attribution {\n    font-size: 0.35em;\n  }\n}\n\n@media screen and (max-width: 700px), (max-height: 400px) {\n  .reveal #attribution {\n    font-size: 0.25em;\n  }\n}\n", ""]);

// exports


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var cof = __webpack_require__(18);
module.exports = function (it, msg) {
  if (typeof it != 'number' && cof(it) != 'Number') throw TypeError(msg);
  return +it;
};

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)


var toObject = __webpack_require__(9);
var toAbsoluteIndex = __webpack_require__(40);
var toLength = __webpack_require__(8);

module.exports = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
  var O = toObject(this);
  var len = toLength(O.length);
  var to = toAbsoluteIndex(target, len);
  var from = toAbsoluteIndex(start, len);
  var end = arguments.length > 2 ? arguments[2] : undefined;
  var count = Math.min((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
  var inc = 1;
  if (from < to && to < from + count) {
    inc = -1;
    from += count - 1;
    to += count - 1;
  }
  while (count-- > 0) {
    if (from in O) O[to] = O[from];else delete O[to];
    to += inc;
    from += inc;
  }return O;
};

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var forOf = __webpack_require__(32);

module.exports = function (iter, ITERATOR) {
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var aFunction = __webpack_require__(10);
var toObject = __webpack_require__(9);
var IObject = __webpack_require__(47);
var toLength = __webpack_require__(8);

module.exports = function (that, callbackfn, aLen, memo, isRight) {
  aFunction(callbackfn);
  var O = toObject(that);
  var self = IObject(O);
  var length = toLength(O.length);
  var index = isRight ? length - 1 : 0;
  var i = isRight ? -1 : 1;
  if (aLen < 2) for (;;) {
    if (index in self) {
      memo = self[index];
      index += i;
      break;
    }
    index += i;
    if (isRight ? index < 0 : length <= index) {
      throw TypeError('Reduce of empty array with no initial value');
    }
  }
  for (; isRight ? index >= 0 : length > index; index += i) {
    if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
  }return memo;
};

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var aFunction = __webpack_require__(10);
var isObject = __webpack_require__(4);
var invoke = __webpack_require__(108);
var arraySlice = [].slice;
var factories = {};

var construct = function construct(F, len, args) {
  if (!(len in factories)) {
    for (var n = [], i = 0; i < len; i++) {
      n[i] = 'a[' + i + ']';
    } // eslint-disable-next-line no-new-func
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  }return factories[len](F, args);
};

module.exports = Function.bind || function bind(that /* , ...args */) {
  var fn = aFunction(this);
  var partArgs = arraySlice.call(arguments, 1);
  var bound = function bound() /* args... */{
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
  };
  if (isObject(fn.prototype)) bound.prototype = fn.prototype;
  return bound;
};

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var dP = __webpack_require__(7).f;
var create = __webpack_require__(34);
var redefineAll = __webpack_require__(38);
var ctx = __webpack_require__(19);
var anInstance = __webpack_require__(31);
var forOf = __webpack_require__(32);
var $iterDefine = __webpack_require__(76);
var step = __webpack_require__(111);
var setSpecies = __webpack_require__(39);
var DESCRIPTORS = __webpack_require__(6);
var fastKey = __webpack_require__(30).fastKey;
var validate = __webpack_require__(45);
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function getEntry(that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function getConstructor(wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME; // collection type
      that._i = create(null); // index
      that._f = undefined; // first entry
      that._l = undefined; // last entry
      that[SIZE] = 0; // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function _delete(key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        }return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) {
            entry = entry.p;
          }
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function get() {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function def(that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
      // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key, // <- key
        v: value, // <- value
        p: prev = that._l, // <- previous entry
        n: undefined, // <- next entry
        r: false // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    }return that;
  },
  getEntry: getEntry,
  setStrong: function setStrong(C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind; // kind
      this._l = undefined; // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) {
        entry = entry.p;
      } // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = __webpack_require__(46);
var from = __webpack_require__(100);
module.exports = function (NAME) {
  return function toJSON() {
    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var redefineAll = __webpack_require__(38);
var getWeak = __webpack_require__(30).getWeak;
var anObject = __webpack_require__(1);
var isObject = __webpack_require__(4);
var anInstance = __webpack_require__(31);
var forOf = __webpack_require__(32);
var createArrayMethod = __webpack_require__(21);
var $has = __webpack_require__(14);
var validate = __webpack_require__(45);
var arrayFind = createArrayMethod(5);
var arrayFindIndex = createArrayMethod(6);
var id = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function uncaughtFrozenStore(that) {
  return that._l || (that._l = new UncaughtFrozenStore());
};
var UncaughtFrozenStore = function UncaughtFrozenStore() {
  this.a = [];
};
var findUncaughtFrozen = function findUncaughtFrozen(store, key) {
  return arrayFind(store.a, function (it) {
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function get(key) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) return entry[1];
  },
  has: function has(key) {
    return !!findUncaughtFrozen(this, key);
  },
  set: function set(key, value) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) entry[1] = value;else this.a.push([key, value]);
  },
  'delete': function _delete(key) {
    var index = arrayFindIndex(this.a, function (it) {
      return it[0] === key;
    });
    if (~index) this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function getConstructor(wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME; // collection type
      that._i = id++; // collection id
      that._l = undefined; // leak store for uncaught frozen objects
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function _delete(key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME))['delete'](key);
        return data && $has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME)).has(key);
        return data && $has(data, this._i);
      }
    });
    return C;
  },
  def: function def(that, key, value) {
    var data = getWeak(anObject(key), true);
    if (data === true) uncaughtFrozenStore(that).set(key, value);else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray

var isArray = __webpack_require__(55);
var isObject = __webpack_require__(4);
var toLength = __webpack_require__(8);
var ctx = __webpack_require__(19);
var IS_CONCAT_SPREADABLE = __webpack_require__(5)('isConcatSpreadable');

function flattenIntoArray(target, original, source, sourceLen, start, depth, mapper, thisArg) {
  var targetIndex = start;
  var sourceIndex = 0;
  var mapFn = mapper ? ctx(mapper, thisArg, 3) : false;
  var element, spreadable;

  while (sourceIndex < sourceLen) {
    if (sourceIndex in source) {
      element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

      spreadable = false;
      if (isObject(element)) {
        spreadable = element[IS_CONCAT_SPREADABLE];
        spreadable = spreadable !== undefined ? !!spreadable : isArray(element);
      }

      if (spreadable && depth > 0) {
        targetIndex = flattenIntoArray(target, original, element, toLength(element.length), targetIndex, depth - 1) - 1;
      } else {
        if (targetIndex >= 0x1fffffffffffff) throw TypeError();
        target[targetIndex] = element;
      }

      targetIndex++;
    }
    sourceIndex++;
  }
  return targetIndex;
}

module.exports = flattenIntoArray;

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = !__webpack_require__(6) && !__webpack_require__(3)(function () {
  return Object.defineProperty(__webpack_require__(69)('div'), 'a', { get: function get() {
      return 7;
    } }).a != 7;
});

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
                  var un = that === undefined;
                  switch (args.length) {
                                    case 0:
                                                      return un ? fn() : fn.call(that);
                                    case 1:
                                                      return un ? fn(args[0]) : fn.call(that, args[0]);
                                    case 2:
                                                      return un ? fn(args[0], args[1]) : fn.call(that, args[0], args[1]);
                                    case 3:
                                                      return un ? fn(args[0], args[1], args[2]) : fn.call(that, args[0], args[1], args[2]);
                                    case 4:
                                                      return un ? fn(args[0], args[1], args[2], args[3]) : fn.call(that, args[0], args[1], args[2], args[3]);
                  }return fn.apply(that, args);
};

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.1.2.3 Number.isInteger(number)
var isObject = __webpack_require__(4);
var floor = Math.floor;
module.exports = function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// call something on iterator step with safe closing on error
var anObject = __webpack_require__(1);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
    // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (done, value) {
  return { value: value, done: !!done };
};

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.2.2.16 Math.fround(x)
var sign = __webpack_require__(78);
var pow = Math.pow;
var EPSILON = pow(2, -52);
var EPSILON32 = pow(2, -23);
var MAX32 = pow(2, 127) * (2 - EPSILON32);
var MIN32 = pow(2, -126);

var roundTiesToEven = function roundTiesToEven(n) {
  return n + 1 / EPSILON - 1 / EPSILON;
};

module.exports = Math.fround || function fround(x) {
  var $abs = Math.abs(x);
  var $sign = sign(x);
  var a, result;
  if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
  a = (1 + EPSILON32 / EPSILON) * $abs;
  result = a - (a - $abs);
  // eslint-disable-next-line no-self-compare
  if (result > MAX32 || result != result) return $sign * Infinity;
  return $sign * result;
};

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x) {
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://rwaldron.github.io/proposal-math-extensions/
module.exports = Math.scale || function scale(x, inLow, inHigh, outLow, outHigh) {
  if (arguments.length === 0
  // eslint-disable-next-line no-self-compare
  || x != x
  // eslint-disable-next-line no-self-compare
  || inLow != inLow
  // eslint-disable-next-line no-self-compare
  || inHigh != inHigh
  // eslint-disable-next-line no-self-compare
  || outLow != outLow
  // eslint-disable-next-line no-self-compare
  || outHigh != outHigh) return NaN;
  if (x === Infinity || x === -Infinity) return x;
  return (x - inLow) * (outHigh - outLow) / (inHigh - inLow) + outLow;
};

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)

var getKeys = __webpack_require__(36);
var gOPS = __webpack_require__(59);
var pIE = __webpack_require__(48);
var toObject = __webpack_require__(9);
var IObject = __webpack_require__(47);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(3)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) {
    B[k] = k;
  });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) {
  // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
    }
  }return T;
} : $assign;

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var dP = __webpack_require__(7);
var anObject = __webpack_require__(1);
var getKeys = __webpack_require__(36);

module.exports = __webpack_require__(6) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) {
    dP.f(O, P = keys[i++], Properties[P]);
  }return O;
};

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(17);
var gOPN = __webpack_require__(35).f;
var toString = {}.toString;

var windowNames = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) == 'object' && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function getWindowNames(it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = __webpack_require__(14);
var toIObject = __webpack_require__(17);
var arrayIndexOf = __webpack_require__(51)(false);
var IE_PROTO = __webpack_require__(82)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) {
    if (key != IE_PROTO) has(O, key) && result.push(key);
  } // Don't enum bug & hidden keys
  while (names.length > i) {
    if (has(O, key = names[i++])) {
      ~arrayIndexOf(result, key) || result.push(key);
    }
  }return result;
};

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getKeys = __webpack_require__(36);
var toIObject = __webpack_require__(17);
var isEnum = __webpack_require__(48).f;
module.exports = function (isEntries) {
  return function (it) {
    var O = toIObject(it);
    var keys = getKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) {
      if (isEnum.call(O, key = keys[i++])) {
        result.push(isEntries ? [key, O[key]] : O[key]);
      }
    }return result;
  };
};

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// all object keys, includes non-enumerable and symbols
var gOPN = __webpack_require__(35);
var gOPS = __webpack_require__(59);
var anObject = __webpack_require__(1);
var Reflect = __webpack_require__(2).Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
  var keys = gOPN.f(anObject(it));
  var getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $parseFloat = __webpack_require__(2).parseFloat;
var $trim = __webpack_require__(44).trim;

module.exports = 1 / $parseFloat(__webpack_require__(86) + '-0') !== -Infinity ? function parseFloat(str) {
  var string = $trim(String(str), 3);
  var result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $parseInt = __webpack_require__(2).parseInt;
var $trim = __webpack_require__(44).trim;
var ws = __webpack_require__(86);
var hex = /^[-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix) {
  var string = $trim(String(str), 3);
  return $parseInt(string, radix >>> 0 || (hex.test(string) ? 16 : 10));
} : $parseInt;

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__(1);
var isObject = __webpack_require__(4);
var newPromiseCapability = __webpack_require__(80);

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://github.com/tc39/proposal-string-pad-start-end
var toLength = __webpack_require__(8);
var repeat = __webpack_require__(85);
var defined = __webpack_require__(23);

module.exports = function (that, maxLength, fillString, left) {
  var S = String(defined(that));
  var stringLength = S.length;
  var fillStr = fillString === undefined ? ' ' : String(fillString);
  var intMaxLength = toLength(maxLength);
  if (intMaxLength <= stringLength || fillStr == '') return S;
  var fillLen = intMaxLength - stringLength;
  var stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://tc39.github.io/ecma262/#sec-toindex
var toInteger = __webpack_require__(25);
var toLength = __webpack_require__(8);
module.exports = function (it) {
  if (it === undefined) return 0;
  var number = toInteger(it);
  var length = toLength(number);
  if (number !== length) throw RangeError('Wrong length!');
  return length;
};

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.f = __webpack_require__(5);

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var strong = __webpack_require__(103);
var validate = __webpack_require__(45);
var MAP = 'Map';

// 23.1 Map Objects
module.exports = __webpack_require__(52)(MAP, function (get) {
  return function Map() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(validate(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
  }
}, strong, true);

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 21.2.5.3 get RegExp.prototype.flags()
if (__webpack_require__(6) && /./g.flags != 'g') __webpack_require__(7).f(RegExp.prototype, 'flags', {
  configurable: true,
  get: __webpack_require__(54)
});

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var strong = __webpack_require__(103);
var validate = __webpack_require__(45);
var SET = 'Set';

// 23.2 Set Objects
module.exports = __webpack_require__(52)(SET, function (get) {
  return function Set() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
  }
}, strong);

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var each = __webpack_require__(21)(0);
var redefine = __webpack_require__(12);
var meta = __webpack_require__(30);
var assign = __webpack_require__(115);
var weak = __webpack_require__(105);
var isObject = __webpack_require__(4);
var fails = __webpack_require__(3);
var validate = __webpack_require__(45);
var WEAK_MAP = 'WeakMap';
var getWeak = meta.getWeak;
var isExtensible = Object.isExtensible;
var uncaughtFrozenStore = weak.ufstore;
var tmp = {};
var InternalMap;

var wrapper = function wrapper(get) {
  return function WeakMap() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
};

var methods = {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key) {
    if (isObject(key)) {
      var data = getWeak(key);
      if (data === true) return uncaughtFrozenStore(validate(this, WEAK_MAP)).get(key);
      return data ? data[this._i] : undefined;
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value) {
    return weak.def(validate(this, WEAK_MAP), key, value);
  }
};

// 23.3 WeakMap Objects
var $WeakMap = module.exports = __webpack_require__(52)(WEAK_MAP, wrapper, methods, weak, true, true);

// IE11 WeakMap frozen keys fix
if (fails(function () {
  return new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7;
})) {
  InternalMap = weak.getConstructor(wrapper, WEAK_MAP);
  assign(InternalMap.prototype, methods);
  meta.NEED = true;
  each(['delete', 'has', 'get', 'set'], function (key) {
    var proto = $WeakMap.prototype;
    var method = proto[key];
    redefine(proto, key, function (a, b) {
      // store frozen objects on internal weakmap shim
      if (isObject(a) && !isExtensible(a)) {
        if (!this._f) this._f = new InternalMap();
        var result = this._f[key](a, b);
        return key == 'set' ? this : result;
        // store all the rest on native weakmap
      }return method.call(this, a, b);
    });
  });
}

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function escape(url) {
    if (typeof url !== 'string') {
        return url;
    }
    // If url is already wrapped in quotes, remove them
    if (/^['"].*['"]$/.test(url)) {
        url = url.slice(1, -1);
    }
    // Should url be wrapped?
    // See https://drafts.csswg.org/css-values-3/#urls
    if (/["'() \t\n]/.test(url)) {
        return '"' + url.replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"';
    }

    return url;
};

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['CloseCurlyDoubleQuote', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['CloseCurlyQuote', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];

var alphaIndex = {};
var charIndex = {};

createIndexes(alphaIndex, charIndex);

/**
 * @constructor
 */
function Html5Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.decode = function (str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function (s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1) === 'x' ? parseInt(entity.substr(2).toLowerCase(), 16) : parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.decode = function (str) {
    return new Html5Entities().decode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encode = function (str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var charInfo = charIndex[str.charCodeAt(i)];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        result += str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.encode = function (str) {
    return new Html5Entities().encode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonUTF = function (str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var charInfo = charIndex[c];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.encodeNonUTF = function (str) {
    return new Html5Entities().encodeNonUTF(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonASCII = function (str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.encodeNonASCII = function (str) {
    return new Html5Entities().encodeNonASCII(str);
};

/**
 * @param {Object} alphaIndex Passed by reference.
 * @param {Object} charIndex Passed by reference.
 */
function createIndexes(alphaIndex, charIndex) {
    var i = ENTITIES.length;
    var _results = [];
    while (i--) {
        var e = ENTITIES[i];
        var alpha = e[0];
        var chars = e[1];
        var chr = chars[0];
        var addChar = chr < 32 || chr > 126 || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;
        var charInfo;
        if (addChar) {
            charInfo = charIndex[chr] = charIndex[chr] || {};
        }
        if (chars[1]) {
            var chr2 = chars[1];
            alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);
            _results.push(addChar && (charInfo[chr2] = alpha));
        } else {
            alphaIndex[alpha] = String.fromCharCode(chr);
            _results.push(addChar && (charInfo[''] = alpha));
        }
    }
}

module.exports = Html5Entities;

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * reveal.js
 * http://revealjs.com
 * MIT licensed
 *
 * Copyright (C) 2017 Hakim El Hattab, http://hakim.se
 */
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(function () {
			root.Reveal = factory();
			return root.Reveal;
		});
	} else if (( false ? 'undefined' : _typeof(exports)) === 'object') {
		// Node. Does not work with strict CommonJS.
		module.exports = factory();
	} else {
		// Browser globals.
		root.Reveal = factory();
	}
})(undefined, function () {

	'use strict';

	var Reveal;

	// The reveal.js version
	var VERSION = '3.6.0';

	var SLIDES_SELECTOR = '.slides section',
	    HORIZONTAL_SLIDES_SELECTOR = '.slides>section',
	    VERTICAL_SLIDES_SELECTOR = '.slides>section.present>section',
	    HOME_SLIDE_SELECTOR = '.slides>section:first-of-type',
	    UA = navigator.userAgent,


	// Configuration defaults, can be overridden at initialization time
	config = {

		// The "normal" size of the presentation, aspect ratio will be preserved
		// when the presentation is scaled to fit different resolutions
		width: 960,
		height: 700,

		// Factor of the display size that should remain empty around the content
		margin: 0.04,

		// Bounds for smallest/largest possible scale to apply to content
		minScale: 0.2,
		maxScale: 2.0,

		// Display presentation control arrows
		controls: true,

		// Help the user learn the controls by providing hints, for example by
		// bouncing the down arrow when they first encounter a vertical slide
		controlsTutorial: true,

		// Determines where controls appear, "edges" or "bottom-right"
		controlsLayout: 'bottom-right',

		// Visibility rule for backwards navigation arrows; "faded", "hidden"
		// or "visible"
		controlsBackArrows: 'faded',

		// Display a presentation progress bar
		progress: true,

		// Display the page number of the current slide
		slideNumber: false,

		// Determine which displays to show the slide number on
		showSlideNumber: 'all',

		// Push each slide change to the browser history
		history: false,

		// Enable keyboard shortcuts for navigation
		keyboard: true,

		// Optional function that blocks keyboard events when retuning false
		keyboardCondition: null,

		// Enable the slide overview mode
		overview: true,

		// Vertical centering of slides
		center: true,

		// Enables touch navigation on devices with touch input
		touch: true,

		// Loop the presentation
		loop: false,

		// Change the presentation direction to be RTL
		rtl: false,

		// Randomizes the order of slides each time the presentation loads
		shuffle: false,

		// Turns fragments on and off globally
		fragments: true,

		// Flags if the presentation is running in an embedded mode,
		// i.e. contained within a limited portion of the screen
		embedded: false,

		// Flags if we should show a help overlay when the question-mark
		// key is pressed
		help: true,

		// Flags if it should be possible to pause the presentation (blackout)
		pause: true,

		// Flags if speaker notes should be visible to all viewers
		showNotes: false,

		// Global override for autolaying embedded media (video/audio/iframe)
		// - null:   Media will only autoplay if data-autoplay is present
		// - true:   All media will autoplay, regardless of individual setting
		// - false:  No media will autoplay, regardless of individual setting
		autoPlayMedia: null,

		// Controls automatic progression to the next slide
		// - 0:      Auto-sliding only happens if the data-autoslide HTML attribute
		//           is present on the current slide or fragment
		// - 1+:     All slides will progress automatically at the given interval
		// - false:  No auto-sliding, even if data-autoslide is present
		autoSlide: 0,

		// Stop auto-sliding after user input
		autoSlideStoppable: true,

		// Use this method for navigation when auto-sliding (defaults to navigateNext)
		autoSlideMethod: null,

		// Enable slide navigation via mouse wheel
		mouseWheel: false,

		// Apply a 3D roll to links on hover
		rollingLinks: false,

		// Hides the address bar on mobile devices
		hideAddressBar: true,

		// Opens links in an iframe preview overlay
		previewLinks: false,

		// Exposes the reveal.js API through window.postMessage
		postMessage: true,

		// Dispatches all reveal.js events to the parent window through postMessage
		postMessageEvents: false,

		// Focuses body when page changes visibility to ensure keyboard shortcuts work
		focusBodyOnPageVisibilityChange: true,

		// Transition style
		transition: 'slide', // none/fade/slide/convex/concave/zoom

		// Transition speed
		transitionSpeed: 'default', // default/fast/slow

		// Transition style for full page slide backgrounds
		backgroundTransition: 'fade', // none/fade/slide/convex/concave/zoom

		// Parallax background image
		parallaxBackgroundImage: '', // CSS syntax, e.g. "a.jpg"

		// Parallax background size
		parallaxBackgroundSize: '', // CSS syntax, e.g. "3000px 2000px"

		// Amount of pixels to move the parallax background per slide step
		parallaxBackgroundHorizontal: null,
		parallaxBackgroundVertical: null,

		// The maximum number of pages a single slide can expand onto when printing
		// to PDF, unlimited by default
		pdfMaxPagesPerSlide: Number.POSITIVE_INFINITY,

		// Offset used to reduce the height of content within exported PDF pages.
		// This exists to account for environment differences based on how you
		// print to PDF. CLI printing options, like phantomjs and wkpdf, can end
		// on precisely the total height of the document whereas in-browser
		// printing has to end one pixel before.
		pdfPageHeightOffset: -1,

		// Number of slides away from the current that are visible
		viewDistance: 3,

		// The display mode that will be used to show slides
		display: 'block',

		// Script dependencies to load
		dependencies: []

	},


	// Flags if Reveal.initialize() has been called
	initialized = false,


	// Flags if reveal.js is loaded (has dispatched the 'ready' event)
	loaded = false,


	// Flags if the overview mode is currently active
	overview = false,


	// Holds the dimensions of our overview slides, including margins
	overviewSlideWidth = null,
	    overviewSlideHeight = null,


	// The horizontal and vertical index of the currently active slide
	indexh,
	    indexv,


	// The previous and current slide HTML elements
	previousSlide,
	    currentSlide,
	    previousBackground,


	// Remember which directions that the user has navigated towards
	hasNavigatedRight = false,
	    hasNavigatedDown = false,


	// Slides may hold a data-state attribute which we pick up and apply
	// as a class to the body. This list contains the combined state of
	// all current slides.
	state = [],


	// The current scale of the presentation (see width/height config)
	scale = 1,


	// CSS transform that is currently applied to the slides container,
	// split into two groups
	slidesTransform = { layout: '', overview: '' },


	// Cached references to DOM elements
	dom = {},


	// Features supported by the browser, see #checkCapabilities()
	features = {},


	// Client is a mobile device, see #checkCapabilities()
	isMobileDevice,


	// Client is a desktop Chrome, see #checkCapabilities()
	isChrome,


	// Throttles mouse wheel navigation
	lastMouseWheelStep = 0,


	// Delays updates to the URL due to a Chrome thumbnailer bug
	writeURLTimeout = 0,


	// Flags if the interaction event listeners are bound
	eventsAreBound = false,


	// The current auto-slide duration
	autoSlide = 0,


	// Auto slide properties
	autoSlidePlayer,
	    autoSlideTimeout = 0,
	    autoSlideStartTime = -1,
	    autoSlidePaused = false,


	// Holds information about the currently ongoing touch input
	touch = {
		startX: 0,
		startY: 0,
		startSpan: 0,
		startCount: 0,
		captured: false,
		threshold: 40
	},


	// Holds information about the keyboard shortcuts
	keyboardShortcuts = {
		'N  ,  SPACE': 'Next slide',
		'P': 'Previous slide',
		'&#8592;  ,  H': 'Navigate left',
		'&#8594;  ,  L': 'Navigate right',
		'&#8593;  ,  K': 'Navigate up',
		'&#8595;  ,  J': 'Navigate down',
		'Home': 'First slide',
		'End': 'Last slide',
		'B  ,  .': 'Pause',
		'F': 'Fullscreen',
		'ESC, O': 'Slide overview'
	};

	/**
  * Starts up the presentation if the client is capable.
  */
	function initialize(options) {

		// Make sure we only initialize once
		if (initialized === true) return;

		initialized = true;

		checkCapabilities();

		if (!features.transforms2d && !features.transforms3d) {
			document.body.setAttribute('class', 'no-transforms');

			// Since JS won't be running any further, we load all lazy
			// loading elements upfront
			var images = toArray(document.getElementsByTagName('img')),
			    iframes = toArray(document.getElementsByTagName('iframe'));

			var lazyLoadable = images.concat(iframes);

			for (var i = 0, len = lazyLoadable.length; i < len; i++) {
				var element = lazyLoadable[i];
				if (element.getAttribute('data-src')) {
					element.setAttribute('src', element.getAttribute('data-src'));
					element.removeAttribute('data-src');
				}
			}

			// If the browser doesn't support core features we won't be
			// using JavaScript to control the presentation
			return;
		}

		// Cache references to key DOM elements
		dom.wrapper = document.querySelector('.reveal');
		dom.slides = document.querySelector('.reveal .slides');

		// Force a layout when the whole page, incl fonts, has loaded
		window.addEventListener('load', layout, false);

		var query = Reveal.getQueryHash();

		// Do not accept new dependencies via query config to avoid
		// the potential of malicious script injection
		if (typeof query['dependencies'] !== 'undefined') delete query['dependencies'];

		// Copy options over to our config object
		extend(config, options);
		extend(config, query);

		// Hide the address bar in mobile browsers
		hideAddressBar();

		// Loads the dependencies and continues to #start() once done
		load();
	}

	/**
  * Inspect the client to see what it's capable of, this
  * should only happens once per runtime.
  */
	function checkCapabilities() {

		isMobileDevice = /(iphone|ipod|ipad|android)/gi.test(UA);
		isChrome = /chrome/i.test(UA) && !/edge/i.test(UA);

		var testElement = document.createElement('div');

		features.transforms3d = 'WebkitPerspective' in testElement.style || 'MozPerspective' in testElement.style || 'msPerspective' in testElement.style || 'OPerspective' in testElement.style || 'perspective' in testElement.style;

		features.transforms2d = 'WebkitTransform' in testElement.style || 'MozTransform' in testElement.style || 'msTransform' in testElement.style || 'OTransform' in testElement.style || 'transform' in testElement.style;

		features.requestAnimationFrameMethod = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
		features.requestAnimationFrame = typeof features.requestAnimationFrameMethod === 'function';

		features.canvas = !!document.createElement('canvas').getContext;

		// Transitions in the overview are disabled in desktop and
		// Safari due to lag
		features.overviewTransitions = !/Version\/[\d\.]+.*Safari/.test(UA);

		// Flags if we should use zoom instead of transform to scale
		// up slides. Zoom produces crisper results but has a lot of
		// xbrowser quirks so we only use it in whitelsited browsers.
		features.zoom = 'zoom' in testElement.style && !isMobileDevice && (isChrome || /Version\/[\d\.]+.*Safari/.test(UA));
	}

	/**
  * Loads the dependencies of reveal.js. Dependencies are
  * defined via the configuration option 'dependencies'
  * and will be loaded prior to starting/binding reveal.js.
  * Some dependencies may have an 'async' flag, if so they
  * will load after reveal.js has been started up.
  */
	function load() {

		var scripts = [],
		    scriptsAsync = [],
		    scriptsToPreload = 0;

		// Called once synchronous scripts finish loading
		function proceed() {
			if (scriptsAsync.length) {
				// Load asynchronous scripts
				head.js.apply(null, scriptsAsync);
			}

			start();
		}

		function loadScript(s) {
			head.ready(s.src.match(/([\w\d_\-]*)\.?js$|[^\\\/]*$/i)[0], function () {
				// Extension may contain callback functions
				if (typeof s.callback === 'function') {
					s.callback.apply(this);
				}

				if (--scriptsToPreload === 0) {
					proceed();
				}
			});
		}

		for (var i = 0, len = config.dependencies.length; i < len; i++) {
			var s = config.dependencies[i];

			// Load if there's no condition or the condition is truthy
			if (!s.condition || s.condition()) {
				if (s.async) {
					scriptsAsync.push(s.src);
				} else {
					scripts.push(s.src);
				}

				loadScript(s);
			}
		}

		if (scripts.length) {
			scriptsToPreload = scripts.length;

			// Load synchronous scripts
			head.js.apply(null, scripts);
		} else {
			proceed();
		}
	}

	/**
  * Starts up reveal.js by binding input events and navigating
  * to the current URL deeplink if there is one.
  */
	function start() {

		loaded = true;

		// Make sure we've got all the DOM elements we need
		setupDOM();

		// Listen to messages posted to this window
		setupPostMessage();

		// Prevent the slides from being scrolled out of view
		setupScrollPrevention();

		// Resets all vertical slides so that only the first is visible
		resetVerticalSlides();

		// Updates the presentation to match the current configuration values
		configure();

		// Read the initial hash
		readURL();

		// Update all backgrounds
		updateBackground(true);

		// Notify listeners that the presentation is ready but use a 1ms
		// timeout to ensure it's not fired synchronously after #initialize()
		setTimeout(function () {
			// Enable transitions now that we're loaded
			dom.slides.classList.remove('no-transition');

			dom.wrapper.classList.add('ready');

			dispatchEvent('ready', {
				'indexh': indexh,
				'indexv': indexv,
				'currentSlide': currentSlide
			});
		}, 1);

		// Special setup and config is required when printing to PDF
		if (isPrintingPDF()) {
			removeEventListeners();

			// The document needs to have loaded for the PDF layout
			// measurements to be accurate
			if (document.readyState === 'complete') {
				setupPDF();
			} else {
				window.addEventListener('load', setupPDF);
			}
		}
	}

	/**
  * Finds and stores references to DOM elements which are
  * required by the presentation. If a required element is
  * not found, it is created.
  */
	function setupDOM() {

		// Prevent transitions while we're loading
		dom.slides.classList.add('no-transition');

		if (isMobileDevice) {
			dom.wrapper.classList.add('no-hover');
		} else {
			dom.wrapper.classList.remove('no-hover');
		}

		if (/iphone/gi.test(UA)) {
			dom.wrapper.classList.add('ua-iphone');
		} else {
			dom.wrapper.classList.remove('ua-iphone');
		}

		// Background element
		dom.background = createSingletonNode(dom.wrapper, 'div', 'backgrounds', null);

		// Progress bar
		dom.progress = createSingletonNode(dom.wrapper, 'div', 'progress', '<span></span>');
		dom.progressbar = dom.progress.querySelector('span');

		// Arrow controls
		dom.controls = createSingletonNode(dom.wrapper, 'aside', 'controls', '<button class="navigate-left" aria-label="previous slide"><div class="controls-arrow"></div></button>' + '<button class="navigate-right" aria-label="next slide"><div class="controls-arrow"></div></button>' + '<button class="navigate-up" aria-label="above slide"><div class="controls-arrow"></div></button>' + '<button class="navigate-down" aria-label="below slide"><div class="controls-arrow"></div></button>');

		// Slide number
		dom.slideNumber = createSingletonNode(dom.wrapper, 'div', 'slide-number', '');

		// Element containing notes that are visible to the audience
		dom.speakerNotes = createSingletonNode(dom.wrapper, 'div', 'speaker-notes', null);
		dom.speakerNotes.setAttribute('data-prevent-swipe', '');
		dom.speakerNotes.setAttribute('tabindex', '0');

		// Overlay graphic which is displayed during the paused mode
		createSingletonNode(dom.wrapper, 'div', 'pause-overlay', null);

		dom.wrapper.setAttribute('role', 'application');

		// There can be multiple instances of controls throughout the page
		dom.controlsLeft = toArray(document.querySelectorAll('.navigate-left'));
		dom.controlsRight = toArray(document.querySelectorAll('.navigate-right'));
		dom.controlsUp = toArray(document.querySelectorAll('.navigate-up'));
		dom.controlsDown = toArray(document.querySelectorAll('.navigate-down'));
		dom.controlsPrev = toArray(document.querySelectorAll('.navigate-prev'));
		dom.controlsNext = toArray(document.querySelectorAll('.navigate-next'));

		// The right and down arrows in the standard reveal.js controls
		dom.controlsRightArrow = dom.controls.querySelector('.navigate-right');
		dom.controlsDownArrow = dom.controls.querySelector('.navigate-down');

		dom.statusDiv = createStatusDiv();
	}

	/**
  * Creates a hidden div with role aria-live to announce the
  * current slide content. Hide the div off-screen to make it
  * available only to Assistive Technologies.
  *
  * @return {HTMLElement}
  */
	function createStatusDiv() {

		var statusDiv = document.getElementById('aria-status-div');
		if (!statusDiv) {
			statusDiv = document.createElement('div');
			statusDiv.style.position = 'absolute';
			statusDiv.style.height = '1px';
			statusDiv.style.width = '1px';
			statusDiv.style.overflow = 'hidden';
			statusDiv.style.clip = 'rect( 1px, 1px, 1px, 1px )';
			statusDiv.setAttribute('id', 'aria-status-div');
			statusDiv.setAttribute('aria-live', 'polite');
			statusDiv.setAttribute('aria-atomic', 'true');
			dom.wrapper.appendChild(statusDiv);
		}
		return statusDiv;
	}

	/**
  * Converts the given HTML element into a string of text
  * that can be announced to a screen reader. Hidden
  * elements are excluded.
  */
	function getStatusText(node) {

		var text = '';

		// Text node
		if (node.nodeType === 3) {
			text += node.textContent;
		}
		// Element node
		else if (node.nodeType === 1) {

				var isAriaHidden = node.getAttribute('aria-hidden');
				var isDisplayHidden = window.getComputedStyle(node)['display'] === 'none';
				if (isAriaHidden !== 'true' && !isDisplayHidden) {

					toArray(node.childNodes).forEach(function (child) {
						text += getStatusText(child);
					});
				}
			}

		return text;
	}

	/**
  * Configures the presentation for printing to a static
  * PDF.
  */
	function setupPDF() {

		var slideSize = getComputedSlideSize(window.innerWidth, window.innerHeight);

		// Dimensions of the PDF pages
		var pageWidth = Math.floor(slideSize.width * (1 + config.margin)),
		    pageHeight = Math.floor(slideSize.height * (1 + config.margin));

		// Dimensions of slides within the pages
		var slideWidth = slideSize.width,
		    slideHeight = slideSize.height;

		// Let the browser know what page size we want to print
		injectStyleSheet('@page{size:' + pageWidth + 'px ' + pageHeight + 'px; margin: 0px;}');

		// Limit the size of certain elements to the dimensions of the slide
		injectStyleSheet('.reveal section>img, .reveal section>video, .reveal section>iframe{max-width: ' + slideWidth + 'px; max-height:' + slideHeight + 'px}');

		document.body.classList.add('print-pdf');
		document.body.style.width = pageWidth + 'px';
		document.body.style.height = pageHeight + 'px';

		// Make sure stretch elements fit on slide
		layoutSlideContents(slideWidth, slideHeight);

		// Add each slide's index as attributes on itself, we need these
		// indices to generate slide numbers below
		toArray(dom.wrapper.querySelectorAll(HORIZONTAL_SLIDES_SELECTOR)).forEach(function (hslide, h) {
			hslide.setAttribute('data-index-h', h);

			if (hslide.classList.contains('stack')) {
				toArray(hslide.querySelectorAll('section')).forEach(function (vslide, v) {
					vslide.setAttribute('data-index-h', h);
					vslide.setAttribute('data-index-v', v);
				});
			}
		});

		// Slide and slide background layout
		toArray(dom.wrapper.querySelectorAll(SLIDES_SELECTOR)).forEach(function (slide) {

			// Vertical stacks are not centred since their section
			// children will be
			if (slide.classList.contains('stack') === false) {
				// Center the slide inside of the page, giving the slide some margin
				var left = (pageWidth - slideWidth) / 2,
				    top = (pageHeight - slideHeight) / 2;

				var contentHeight = slide.scrollHeight;
				var numberOfPages = Math.max(Math.ceil(contentHeight / pageHeight), 1);

				// Adhere to configured pages per slide limit
				numberOfPages = Math.min(numberOfPages, config.pdfMaxPagesPerSlide);

				// Center slides vertically
				if (numberOfPages === 1 && config.center || slide.classList.contains('center')) {
					top = Math.max((pageHeight - contentHeight) / 2, 0);
				}

				// Wrap the slide in a page element and hide its overflow
				// so that no page ever flows onto another
				var page = document.createElement('div');
				page.className = 'pdf-page';
				page.style.height = (pageHeight + config.pdfPageHeightOffset) * numberOfPages + 'px';
				slide.parentNode.insertBefore(page, slide);
				page.appendChild(slide);

				// Position the slide inside of the page
				slide.style.left = left + 'px';
				slide.style.top = top + 'px';
				slide.style.width = slideWidth + 'px';

				if (slide.slideBackgroundElement) {
					page.insertBefore(slide.slideBackgroundElement, slide);
				}

				// Inject notes if `showNotes` is enabled
				if (config.showNotes) {

					// Are there notes for this slide?
					var notes = getSlideNotes(slide);
					if (notes) {

						var notesSpacing = 8;
						var notesLayout = typeof config.showNotes === 'string' ? config.showNotes : 'inline';
						var notesElement = document.createElement('div');
						notesElement.classList.add('speaker-notes');
						notesElement.classList.add('speaker-notes-pdf');
						notesElement.setAttribute('data-layout', notesLayout);
						notesElement.innerHTML = notes;

						if (notesLayout === 'separate-page') {
							page.parentNode.insertBefore(notesElement, page.nextSibling);
						} else {
							notesElement.style.left = notesSpacing + 'px';
							notesElement.style.bottom = notesSpacing + 'px';
							notesElement.style.width = pageWidth - notesSpacing * 2 + 'px';
							page.appendChild(notesElement);
						}
					}
				}

				// Inject slide numbers if `slideNumbers` are enabled
				if (config.slideNumber && /all|print/i.test(config.showSlideNumber)) {
					var slideNumberH = parseInt(slide.getAttribute('data-index-h'), 10) + 1,
					    slideNumberV = parseInt(slide.getAttribute('data-index-v'), 10) + 1;

					var numberElement = document.createElement('div');
					numberElement.classList.add('slide-number');
					numberElement.classList.add('slide-number-pdf');
					numberElement.innerHTML = formatSlideNumber(slideNumberH, '.', slideNumberV);
					page.appendChild(numberElement);
				}
			}
		});

		// Show all fragments
		toArray(dom.wrapper.querySelectorAll(SLIDES_SELECTOR + ' .fragment')).forEach(function (fragment) {
			fragment.classList.add('visible');
		});

		// Notify subscribers that the PDF layout is good to go
		dispatchEvent('pdf-ready');
	}

	/**
  * This is an unfortunate necessity. Some actions – such as
  * an input field being focused in an iframe or using the
  * keyboard to expand text selection beyond the bounds of
  * a slide – can trigger our content to be pushed out of view.
  * This scrolling can not be prevented by hiding overflow in
  * CSS (we already do) so we have to resort to repeatedly
  * checking if the slides have been offset :(
  */
	function setupScrollPrevention() {

		setInterval(function () {
			if (dom.wrapper.scrollTop !== 0 || dom.wrapper.scrollLeft !== 0) {
				dom.wrapper.scrollTop = 0;
				dom.wrapper.scrollLeft = 0;
			}
		}, 1000);
	}

	/**
  * Creates an HTML element and returns a reference to it.
  * If the element already exists the existing instance will
  * be returned.
  *
  * @param {HTMLElement} container
  * @param {string} tagname
  * @param {string} classname
  * @param {string} innerHTML
  *
  * @return {HTMLElement}
  */
	function createSingletonNode(container, tagname, classname, innerHTML) {

		// Find all nodes matching the description
		var nodes = container.querySelectorAll('.' + classname);

		// Check all matches to find one which is a direct child of
		// the specified container
		for (var i = 0; i < nodes.length; i++) {
			var testNode = nodes[i];
			if (testNode.parentNode === container) {
				return testNode;
			}
		}

		// If no node was found, create it now
		var node = document.createElement(tagname);
		node.className = classname;
		if (typeof innerHTML === 'string') {
			node.innerHTML = innerHTML;
		}
		container.appendChild(node);

		return node;
	}

	/**
  * Creates the slide background elements and appends them
  * to the background container. One element is created per
  * slide no matter if the given slide has visible background.
  */
	function createBackgrounds() {

		var printMode = isPrintingPDF();

		// Clear prior backgrounds
		dom.background.innerHTML = '';
		dom.background.classList.add('no-transition');

		// Iterate over all horizontal slides
		toArray(dom.wrapper.querySelectorAll(HORIZONTAL_SLIDES_SELECTOR)).forEach(function (slideh) {

			var backgroundStack = createBackground(slideh, dom.background);

			// Iterate over all vertical slides
			toArray(slideh.querySelectorAll('section')).forEach(function (slidev) {

				createBackground(slidev, backgroundStack);

				backgroundStack.classList.add('stack');
			});
		});

		// Add parallax background if specified
		if (config.parallaxBackgroundImage) {

			dom.background.style.backgroundImage = 'url("' + config.parallaxBackgroundImage + '")';
			dom.background.style.backgroundSize = config.parallaxBackgroundSize;

			// Make sure the below properties are set on the element - these properties are
			// needed for proper transitions to be set on the element via CSS. To remove
			// annoying background slide-in effect when the presentation starts, apply
			// these properties after short time delay
			setTimeout(function () {
				dom.wrapper.classList.add('has-parallax-background');
			}, 1);
		} else {

			dom.background.style.backgroundImage = '';
			dom.wrapper.classList.remove('has-parallax-background');
		}
	}

	/**
  * Creates a background for the given slide.
  *
  * @param {HTMLElement} slide
  * @param {HTMLElement} container The element that the background
  * should be appended to
  * @return {HTMLElement} New background div
  */
	function createBackground(slide, container) {

		var data = {
			background: slide.getAttribute('data-background'),
			backgroundSize: slide.getAttribute('data-background-size'),
			backgroundImage: slide.getAttribute('data-background-image'),
			backgroundVideo: slide.getAttribute('data-background-video'),
			backgroundIframe: slide.getAttribute('data-background-iframe'),
			backgroundColor: slide.getAttribute('data-background-color'),
			backgroundRepeat: slide.getAttribute('data-background-repeat'),
			backgroundPosition: slide.getAttribute('data-background-position'),
			backgroundTransition: slide.getAttribute('data-background-transition')
		};

		var element = document.createElement('div');

		// Carry over custom classes from the slide to the background
		element.className = 'slide-background ' + slide.className.replace(/present|past|future/, '');

		if (data.background) {
			// Auto-wrap image urls in url(...)
			if (/^(http|file|\/\/)/gi.test(data.background) || /\.(svg|png|jpg|jpeg|gif|bmp)([?#]|$)/gi.test(data.background)) {
				slide.setAttribute('data-background-image', data.background);
			} else {
				element.style.background = data.background;
			}
		}

		// Create a hash for this combination of background settings.
		// This is used to determine when two slide backgrounds are
		// the same.
		if (data.background || data.backgroundColor || data.backgroundImage || data.backgroundVideo || data.backgroundIframe) {
			element.setAttribute('data-background-hash', data.background + data.backgroundSize + data.backgroundImage + data.backgroundVideo + data.backgroundIframe + data.backgroundColor + data.backgroundRepeat + data.backgroundPosition + data.backgroundTransition);
		}

		// Additional and optional background properties
		if (data.backgroundSize) element.style.backgroundSize = data.backgroundSize;
		if (data.backgroundSize) element.setAttribute('data-background-size', data.backgroundSize);
		if (data.backgroundColor) element.style.backgroundColor = data.backgroundColor;
		if (data.backgroundRepeat) element.style.backgroundRepeat = data.backgroundRepeat;
		if (data.backgroundPosition) element.style.backgroundPosition = data.backgroundPosition;
		if (data.backgroundTransition) element.setAttribute('data-background-transition', data.backgroundTransition);

		container.appendChild(element);

		// If backgrounds are being recreated, clear old classes
		slide.classList.remove('has-dark-background');
		slide.classList.remove('has-light-background');

		slide.slideBackgroundElement = element;

		// If this slide has a background color, add a class that
		// signals if it is light or dark. If the slide has no background
		// color, no class will be set
		var computedBackgroundStyle = window.getComputedStyle(element);
		if (computedBackgroundStyle && computedBackgroundStyle.backgroundColor) {
			var rgb = colorToRgb(computedBackgroundStyle.backgroundColor);

			// Ignore fully transparent backgrounds. Some browsers return
			// rgba(0,0,0,0) when reading the computed background color of
			// an element with no background
			if (rgb && rgb.a !== 0) {
				if (colorBrightness(computedBackgroundStyle.backgroundColor) < 128) {
					slide.classList.add('has-dark-background');
				} else {
					slide.classList.add('has-light-background');
				}
			}
		}

		return element;
	}

	/**
  * Registers a listener to postMessage events, this makes it
  * possible to call all reveal.js API methods from another
  * window. For example:
  *
  * revealWindow.postMessage( JSON.stringify({
  *   method: 'slide',
  *   args: [ 2 ]
  * }), '*' );
  */
	function setupPostMessage() {

		if (config.postMessage) {
			window.addEventListener('message', function (event) {
				var data = event.data;

				// Make sure we're dealing with JSON
				if (typeof data === 'string' && data.charAt(0) === '{' && data.charAt(data.length - 1) === '}') {
					data = JSON.parse(data);

					// Check if the requested method can be found
					if (data.method && typeof Reveal[data.method] === 'function') {
						Reveal[data.method].apply(Reveal, data.args);
					}
				}
			}, false);
		}
	}

	/**
  * Applies the configuration settings from the config
  * object. May be called multiple times.
  *
  * @param {object} options
  */
	function configure(options) {

		var oldTransition = config.transition;

		// New config options may be passed when this method
		// is invoked through the API after initialization
		if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') extend(config, options);

		// Abort if reveal.js hasn't finished loading, config
		// changes will be applied automatically once loading
		// finishes
		if (loaded === false) return;

		var numberOfSlides = dom.wrapper.querySelectorAll(SLIDES_SELECTOR).length;

		// Remove the previously configured transition class
		dom.wrapper.classList.remove(oldTransition);

		// Force linear transition based on browser capabilities
		if (features.transforms3d === false) config.transition = 'linear';

		dom.wrapper.classList.add(config.transition);

		dom.wrapper.setAttribute('data-transition-speed', config.transitionSpeed);
		dom.wrapper.setAttribute('data-background-transition', config.backgroundTransition);

		dom.controls.style.display = config.controls ? 'block' : 'none';
		dom.progress.style.display = config.progress ? 'block' : 'none';

		dom.controls.setAttribute('data-controls-layout', config.controlsLayout);
		dom.controls.setAttribute('data-controls-back-arrows', config.controlsBackArrows);

		if (config.shuffle) {
			shuffle();
		}

		if (config.rtl) {
			dom.wrapper.classList.add('rtl');
		} else {
			dom.wrapper.classList.remove('rtl');
		}

		if (config.center) {
			dom.wrapper.classList.add('center');
		} else {
			dom.wrapper.classList.remove('center');
		}

		// Exit the paused mode if it was configured off
		if (config.pause === false) {
			resume();
		}

		if (config.showNotes) {
			dom.speakerNotes.setAttribute('data-layout', typeof config.showNotes === 'string' ? config.showNotes : 'inline');
		}

		if (config.mouseWheel) {
			document.addEventListener('DOMMouseScroll', onDocumentMouseScroll, false); // FF
			document.addEventListener('mousewheel', onDocumentMouseScroll, false);
		} else {
			document.removeEventListener('DOMMouseScroll', onDocumentMouseScroll, false); // FF
			document.removeEventListener('mousewheel', onDocumentMouseScroll, false);
		}

		// Rolling 3D links
		if (config.rollingLinks) {
			enableRollingLinks();
		} else {
			disableRollingLinks();
		}

		// Iframe link previews
		if (config.previewLinks) {
			enablePreviewLinks();
			disablePreviewLinks('[data-preview-link=false]');
		} else {
			disablePreviewLinks();
			enablePreviewLinks('[data-preview-link]:not([data-preview-link=false])');
		}

		// Remove existing auto-slide controls
		if (autoSlidePlayer) {
			autoSlidePlayer.destroy();
			autoSlidePlayer = null;
		}

		// Generate auto-slide controls if needed
		if (numberOfSlides > 1 && config.autoSlide && config.autoSlideStoppable && features.canvas && features.requestAnimationFrame) {
			autoSlidePlayer = new Playback(dom.wrapper, function () {
				return Math.min(Math.max((Date.now() - autoSlideStartTime) / autoSlide, 0), 1);
			});

			autoSlidePlayer.on('click', onAutoSlidePlayerClick);
			autoSlidePaused = false;
		}

		// When fragments are turned off they should be visible
		if (config.fragments === false) {
			toArray(dom.slides.querySelectorAll('.fragment')).forEach(function (element) {
				element.classList.add('visible');
				element.classList.remove('current-fragment');
			});
		}

		// Slide numbers
		var slideNumberDisplay = 'none';
		if (config.slideNumber && !isPrintingPDF()) {
			if (config.showSlideNumber === 'all') {
				slideNumberDisplay = 'block';
			} else if (config.showSlideNumber === 'speaker' && isSpeakerNotes()) {
				slideNumberDisplay = 'block';
			}
		}

		dom.slideNumber.style.display = slideNumberDisplay;

		sync();
	}

	/**
  * Binds all event listeners.
  */
	function addEventListeners() {

		eventsAreBound = true;

		window.addEventListener('hashchange', onWindowHashChange, false);
		window.addEventListener('resize', onWindowResize, false);

		if (config.touch) {
			dom.wrapper.addEventListener('touchstart', onTouchStart, false);
			dom.wrapper.addEventListener('touchmove', onTouchMove, false);
			dom.wrapper.addEventListener('touchend', onTouchEnd, false);

			// Support pointer-style touch interaction as well
			if (window.navigator.pointerEnabled) {
				// IE 11 uses un-prefixed version of pointer events
				dom.wrapper.addEventListener('pointerdown', onPointerDown, false);
				dom.wrapper.addEventListener('pointermove', onPointerMove, false);
				dom.wrapper.addEventListener('pointerup', onPointerUp, false);
			} else if (window.navigator.msPointerEnabled) {
				// IE 10 uses prefixed version of pointer events
				dom.wrapper.addEventListener('MSPointerDown', onPointerDown, false);
				dom.wrapper.addEventListener('MSPointerMove', onPointerMove, false);
				dom.wrapper.addEventListener('MSPointerUp', onPointerUp, false);
			}
		}

		if (config.keyboard) {
			document.addEventListener('keydown', onDocumentKeyDown, false);
			document.addEventListener('keypress', onDocumentKeyPress, false);
		}

		if (config.progress && dom.progress) {
			dom.progress.addEventListener('click', onProgressClicked, false);
		}

		if (config.focusBodyOnPageVisibilityChange) {
			var visibilityChange;

			if ('hidden' in document) {
				visibilityChange = 'visibilitychange';
			} else if ('msHidden' in document) {
				visibilityChange = 'msvisibilitychange';
			} else if ('webkitHidden' in document) {
				visibilityChange = 'webkitvisibilitychange';
			}

			if (visibilityChange) {
				document.addEventListener(visibilityChange, onPageVisibilityChange, false);
			}
		}

		// Listen to both touch and click events, in case the device
		// supports both
		var pointerEvents = ['touchstart', 'click'];

		// Only support touch for Android, fixes double navigations in
		// stock browser
		if (UA.match(/android/gi)) {
			pointerEvents = ['touchstart'];
		}

		pointerEvents.forEach(function (eventName) {
			dom.controlsLeft.forEach(function (el) {
				el.addEventListener(eventName, onNavigateLeftClicked, false);
			});
			dom.controlsRight.forEach(function (el) {
				el.addEventListener(eventName, onNavigateRightClicked, false);
			});
			dom.controlsUp.forEach(function (el) {
				el.addEventListener(eventName, onNavigateUpClicked, false);
			});
			dom.controlsDown.forEach(function (el) {
				el.addEventListener(eventName, onNavigateDownClicked, false);
			});
			dom.controlsPrev.forEach(function (el) {
				el.addEventListener(eventName, onNavigatePrevClicked, false);
			});
			dom.controlsNext.forEach(function (el) {
				el.addEventListener(eventName, onNavigateNextClicked, false);
			});
		});
	}

	/**
  * Unbinds all event listeners.
  */
	function removeEventListeners() {

		eventsAreBound = false;

		document.removeEventListener('keydown', onDocumentKeyDown, false);
		document.removeEventListener('keypress', onDocumentKeyPress, false);
		window.removeEventListener('hashchange', onWindowHashChange, false);
		window.removeEventListener('resize', onWindowResize, false);

		dom.wrapper.removeEventListener('touchstart', onTouchStart, false);
		dom.wrapper.removeEventListener('touchmove', onTouchMove, false);
		dom.wrapper.removeEventListener('touchend', onTouchEnd, false);

		// IE11
		if (window.navigator.pointerEnabled) {
			dom.wrapper.removeEventListener('pointerdown', onPointerDown, false);
			dom.wrapper.removeEventListener('pointermove', onPointerMove, false);
			dom.wrapper.removeEventListener('pointerup', onPointerUp, false);
		}
		// IE10
		else if (window.navigator.msPointerEnabled) {
				dom.wrapper.removeEventListener('MSPointerDown', onPointerDown, false);
				dom.wrapper.removeEventListener('MSPointerMove', onPointerMove, false);
				dom.wrapper.removeEventListener('MSPointerUp', onPointerUp, false);
			}

		if (config.progress && dom.progress) {
			dom.progress.removeEventListener('click', onProgressClicked, false);
		}

		['touchstart', 'click'].forEach(function (eventName) {
			dom.controlsLeft.forEach(function (el) {
				el.removeEventListener(eventName, onNavigateLeftClicked, false);
			});
			dom.controlsRight.forEach(function (el) {
				el.removeEventListener(eventName, onNavigateRightClicked, false);
			});
			dom.controlsUp.forEach(function (el) {
				el.removeEventListener(eventName, onNavigateUpClicked, false);
			});
			dom.controlsDown.forEach(function (el) {
				el.removeEventListener(eventName, onNavigateDownClicked, false);
			});
			dom.controlsPrev.forEach(function (el) {
				el.removeEventListener(eventName, onNavigatePrevClicked, false);
			});
			dom.controlsNext.forEach(function (el) {
				el.removeEventListener(eventName, onNavigateNextClicked, false);
			});
		});
	}

	/**
  * Extend object a with the properties of object b.
  * If there's a conflict, object b takes precedence.
  *
  * @param {object} a
  * @param {object} b
  */
	function extend(a, b) {

		for (var i in b) {
			a[i] = b[i];
		}

		return a;
	}

	/**
  * Converts the target object to an array.
  *
  * @param {object} o
  * @return {object[]}
  */
	function toArray(o) {

		return Array.prototype.slice.call(o);
	}

	/**
  * Utility for deserializing a value.
  *
  * @param {*} value
  * @return {*}
  */
	function deserialize(value) {

		if (typeof value === 'string') {
			if (value === 'null') return null;else if (value === 'true') return true;else if (value === 'false') return false;else if (value.match(/^-?[\d\.]+$/)) return parseFloat(value);
		}

		return value;
	}

	/**
  * Measures the distance in pixels between point a
  * and point b.
  *
  * @param {object} a point with x/y properties
  * @param {object} b point with x/y properties
  *
  * @return {number}
  */
	function distanceBetween(a, b) {

		var dx = a.x - b.x,
		    dy = a.y - b.y;

		return Math.sqrt(dx * dx + dy * dy);
	}

	/**
  * Applies a CSS transform to the target element.
  *
  * @param {HTMLElement} element
  * @param {string} transform
  */
	function transformElement(element, transform) {

		element.style.WebkitTransform = transform;
		element.style.MozTransform = transform;
		element.style.msTransform = transform;
		element.style.transform = transform;
	}

	/**
  * Applies CSS transforms to the slides container. The container
  * is transformed from two separate sources: layout and the overview
  * mode.
  *
  * @param {object} transforms
  */
	function transformSlides(transforms) {

		// Pick up new transforms from arguments
		if (typeof transforms.layout === 'string') slidesTransform.layout = transforms.layout;
		if (typeof transforms.overview === 'string') slidesTransform.overview = transforms.overview;

		// Apply the transforms to the slides container
		if (slidesTransform.layout) {
			transformElement(dom.slides, slidesTransform.layout + ' ' + slidesTransform.overview);
		} else {
			transformElement(dom.slides, slidesTransform.overview);
		}
	}

	/**
  * Injects the given CSS styles into the DOM.
  *
  * @param {string} value
  */
	function injectStyleSheet(value) {

		var tag = document.createElement('style');
		tag.type = 'text/css';
		if (tag.styleSheet) {
			tag.styleSheet.cssText = value;
		} else {
			tag.appendChild(document.createTextNode(value));
		}
		document.getElementsByTagName('head')[0].appendChild(tag);
	}

	/**
  * Find the closest parent that matches the given
  * selector.
  *
  * @param {HTMLElement} target The child element
  * @param {String} selector The CSS selector to match
  * the parents against
  *
  * @return {HTMLElement} The matched parent or null
  * if no matching parent was found
  */
	function closestParent(target, selector) {

		var parent = target.parentNode;

		while (parent) {

			// There's some overhead doing this each time, we don't
			// want to rewrite the element prototype but should still
			// be enough to feature detect once at startup...
			var matchesMethod = parent.matches || parent.matchesSelector || parent.msMatchesSelector;

			// If we find a match, we're all set
			if (matchesMethod && matchesMethod.call(parent, selector)) {
				return parent;
			}

			// Keep searching
			parent = parent.parentNode;
		}

		return null;
	}

	/**
  * Converts various color input formats to an {r:0,g:0,b:0} object.
  *
  * @param {string} color The string representation of a color
  * @example
  * colorToRgb('#000');
  * @example
  * colorToRgb('#000000');
  * @example
  * colorToRgb('rgb(0,0,0)');
  * @example
  * colorToRgb('rgba(0,0,0)');
  *
  * @return {{r: number, g: number, b: number, [a]: number}|null}
  */
	function colorToRgb(color) {

		var hex3 = color.match(/^#([0-9a-f]{3})$/i);
		if (hex3 && hex3[1]) {
			hex3 = hex3[1];
			return {
				r: parseInt(hex3.charAt(0), 16) * 0x11,
				g: parseInt(hex3.charAt(1), 16) * 0x11,
				b: parseInt(hex3.charAt(2), 16) * 0x11
			};
		}

		var hex6 = color.match(/^#([0-9a-f]{6})$/i);
		if (hex6 && hex6[1]) {
			hex6 = hex6[1];
			return {
				r: parseInt(hex6.substr(0, 2), 16),
				g: parseInt(hex6.substr(2, 2), 16),
				b: parseInt(hex6.substr(4, 2), 16)
			};
		}

		var rgb = color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
		if (rgb) {
			return {
				r: parseInt(rgb[1], 10),
				g: parseInt(rgb[2], 10),
				b: parseInt(rgb[3], 10)
			};
		}

		var rgba = color.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\,\s*([\d]+|[\d]*.[\d]+)\s*\)$/i);
		if (rgba) {
			return {
				r: parseInt(rgba[1], 10),
				g: parseInt(rgba[2], 10),
				b: parseInt(rgba[3], 10),
				a: parseFloat(rgba[4])
			};
		}

		return null;
	}

	/**
  * Calculates brightness on a scale of 0-255.
  *
  * @param {string} color See colorToRgb for supported formats.
  * @see {@link colorToRgb}
  */
	function colorBrightness(color) {

		if (typeof color === 'string') color = colorToRgb(color);

		if (color) {
			return (color.r * 299 + color.g * 587 + color.b * 114) / 1000;
		}

		return null;
	}

	/**
  * Returns the remaining height within the parent of the
  * target element.
  *
  * remaining height = [ configured parent height ] - [ current parent height ]
  *
  * @param {HTMLElement} element
  * @param {number} [height]
  */
	function getRemainingHeight(element, height) {

		height = height || 0;

		if (element) {
			var newHeight,
			    oldHeight = element.style.height;

			// Change the .stretch element height to 0 in order find the height of all
			// the other elements
			element.style.height = '0px';
			newHeight = height - element.parentNode.offsetHeight;

			// Restore the old height, just in case
			element.style.height = oldHeight + 'px';

			return newHeight;
		}

		return height;
	}

	/**
  * Checks if this instance is being used to print a PDF.
  */
	function isPrintingPDF() {

		return (/print-pdf/gi.test(window.location.search)
		);
	}

	/**
  * Hides the address bar if we're on a mobile device.
  */
	function hideAddressBar() {

		if (config.hideAddressBar && isMobileDevice) {
			// Events that should trigger the address bar to hide
			window.addEventListener('load', removeAddressBar, false);
			window.addEventListener('orientationchange', removeAddressBar, false);
		}
	}

	/**
  * Causes the address bar to hide on mobile devices,
  * more vertical space ftw.
  */
	function removeAddressBar() {

		setTimeout(function () {
			window.scrollTo(0, 1);
		}, 10);
	}

	/**
  * Dispatches an event of the specified type from the
  * reveal DOM element.
  */
	function dispatchEvent(type, args) {

		var event = document.createEvent('HTMLEvents', 1, 2);
		event.initEvent(type, true, true);
		extend(event, args);
		dom.wrapper.dispatchEvent(event);

		// If we're in an iframe, post each reveal.js event to the
		// parent window. Used by the notes plugin
		if (config.postMessageEvents && window.parent !== window.self) {
			window.parent.postMessage(JSON.stringify({ namespace: 'reveal', eventName: type, state: getState() }), '*');
		}
	}

	/**
  * Wrap all links in 3D goodness.
  */
	function enableRollingLinks() {

		if (features.transforms3d && !('msPerspective' in document.body.style)) {
			var anchors = dom.wrapper.querySelectorAll(SLIDES_SELECTOR + ' a');

			for (var i = 0, len = anchors.length; i < len; i++) {
				var anchor = anchors[i];

				if (anchor.textContent && !anchor.querySelector('*') && (!anchor.className || !anchor.classList.contains(anchor, 'roll'))) {
					var span = document.createElement('span');
					span.setAttribute('data-title', anchor.text);
					span.innerHTML = anchor.innerHTML;

					anchor.classList.add('roll');
					anchor.innerHTML = '';
					anchor.appendChild(span);
				}
			}
		}
	}

	/**
  * Unwrap all 3D links.
  */
	function disableRollingLinks() {

		var anchors = dom.wrapper.querySelectorAll(SLIDES_SELECTOR + ' a.roll');

		for (var i = 0, len = anchors.length; i < len; i++) {
			var anchor = anchors[i];
			var span = anchor.querySelector('span');

			if (span) {
				anchor.classList.remove('roll');
				anchor.innerHTML = span.innerHTML;
			}
		}
	}

	/**
  * Bind preview frame links.
  *
  * @param {string} [selector=a] - selector for anchors
  */
	function enablePreviewLinks(selector) {

		var anchors = toArray(document.querySelectorAll(selector ? selector : 'a'));

		anchors.forEach(function (element) {
			if (/^(http|www)/gi.test(element.getAttribute('href'))) {
				element.addEventListener('click', onPreviewLinkClicked, false);
			}
		});
	}

	/**
  * Unbind preview frame links.
  */
	function disablePreviewLinks(selector) {

		var anchors = toArray(document.querySelectorAll(selector ? selector : 'a'));

		anchors.forEach(function (element) {
			if (/^(http|www)/gi.test(element.getAttribute('href'))) {
				element.removeEventListener('click', onPreviewLinkClicked, false);
			}
		});
	}

	/**
  * Opens a preview window for the target URL.
  *
  * @param {string} url - url for preview iframe src
  */
	function showPreview(url) {

		closeOverlay();

		dom.overlay = document.createElement('div');
		dom.overlay.classList.add('overlay');
		dom.overlay.classList.add('overlay-preview');
		dom.wrapper.appendChild(dom.overlay);

		dom.overlay.innerHTML = ['<header>', '<a class="close" href="#"><span class="icon"></span></a>', '<a class="external" href="' + url + '" target="_blank"><span class="icon"></span></a>', '</header>', '<div class="spinner"></div>', '<div class="viewport">', '<iframe src="' + url + '"></iframe>', '<small class="viewport-inner">', '<span class="x-frame-error">Unable to load iframe. This is likely due to the site\'s policy (x-frame-options).</span>', '</small>', '</div>'].join('');

		dom.overlay.querySelector('iframe').addEventListener('load', function (event) {
			dom.overlay.classList.add('loaded');
		}, false);

		dom.overlay.querySelector('.close').addEventListener('click', function (event) {
			closeOverlay();
			event.preventDefault();
		}, false);

		dom.overlay.querySelector('.external').addEventListener('click', function (event) {
			closeOverlay();
		}, false);

		setTimeout(function () {
			dom.overlay.classList.add('visible');
		}, 1);
	}

	/**
  * Open or close help overlay window.
  *
  * @param {Boolean} [override] Flag which overrides the
  * toggle logic and forcibly sets the desired state. True means
  * help is open, false means it's closed.
  */
	function toggleHelp(override) {

		if (typeof override === 'boolean') {
			override ? showHelp() : closeOverlay();
		} else {
			if (dom.overlay) {
				closeOverlay();
			} else {
				showHelp();
			}
		}
	}

	/**
  * Opens an overlay window with help material.
  */
	function showHelp() {

		if (config.help) {

			closeOverlay();

			dom.overlay = document.createElement('div');
			dom.overlay.classList.add('overlay');
			dom.overlay.classList.add('overlay-help');
			dom.wrapper.appendChild(dom.overlay);

			var html = '<p class="title">Keyboard Shortcuts</p><br/>';

			html += '<table><th>KEY</th><th>ACTION</th>';
			for (var key in keyboardShortcuts) {
				html += '<tr><td>' + key + '</td><td>' + keyboardShortcuts[key] + '</td></tr>';
			}

			html += '</table>';

			dom.overlay.innerHTML = ['<header>', '<a class="close" href="#"><span class="icon"></span></a>', '</header>', '<div class="viewport">', '<div class="viewport-inner">' + html + '</div>', '</div>'].join('');

			dom.overlay.querySelector('.close').addEventListener('click', function (event) {
				closeOverlay();
				event.preventDefault();
			}, false);

			setTimeout(function () {
				dom.overlay.classList.add('visible');
			}, 1);
		}
	}

	/**
  * Closes any currently open overlay.
  */
	function closeOverlay() {

		if (dom.overlay) {
			dom.overlay.parentNode.removeChild(dom.overlay);
			dom.overlay = null;
		}
	}

	/**
  * Applies JavaScript-controlled layout rules to the
  * presentation.
  */
	function layout() {

		if (dom.wrapper && !isPrintingPDF()) {

			var size = getComputedSlideSize();

			// Layout the contents of the slides
			layoutSlideContents(config.width, config.height);

			dom.slides.style.width = size.width + 'px';
			dom.slides.style.height = size.height + 'px';

			// Determine scale of content to fit within available space
			scale = Math.min(size.presentationWidth / size.width, size.presentationHeight / size.height);

			// Respect max/min scale settings
			scale = Math.max(scale, config.minScale);
			scale = Math.min(scale, config.maxScale);

			// Don't apply any scaling styles if scale is 1
			if (scale === 1) {
				dom.slides.style.zoom = '';
				dom.slides.style.left = '';
				dom.slides.style.top = '';
				dom.slides.style.bottom = '';
				dom.slides.style.right = '';
				transformSlides({ layout: '' });
			} else {
				// Prefer zoom for scaling up so that content remains crisp.
				// Don't use zoom to scale down since that can lead to shifts
				// in text layout/line breaks.
				if (scale > 1 && features.zoom) {
					dom.slides.style.zoom = scale;
					dom.slides.style.left = '';
					dom.slides.style.top = '';
					dom.slides.style.bottom = '';
					dom.slides.style.right = '';
					transformSlides({ layout: '' });
				}
				// Apply scale transform as a fallback
				else {
						dom.slides.style.zoom = '';
						dom.slides.style.left = '50%';
						dom.slides.style.top = '50%';
						dom.slides.style.bottom = 'auto';
						dom.slides.style.right = 'auto';
						transformSlides({ layout: 'translate(-50%, -50%) scale(' + scale + ')' });
					}
			}

			// Select all slides, vertical and horizontal
			var slides = toArray(dom.wrapper.querySelectorAll(SLIDES_SELECTOR));

			for (var i = 0, len = slides.length; i < len; i++) {
				var slide = slides[i];

				// Don't bother updating invisible slides
				if (slide.style.display === 'none') {
					continue;
				}

				if (config.center || slide.classList.contains('center')) {
					// Vertical stacks are not centred since their section
					// children will be
					if (slide.classList.contains('stack')) {
						slide.style.top = 0;
					} else {
						slide.style.top = Math.max((size.height - slide.scrollHeight) / 2, 0) + 'px';
					}
				} else {
					slide.style.top = '';
				}
			}

			updateProgress();
			updateParallax();

			if (isOverview()) {
				updateOverview();
			}
		}
	}

	/**
  * Applies layout logic to the contents of all slides in
  * the presentation.
  *
  * @param {string|number} width
  * @param {string|number} height
  */
	function layoutSlideContents(width, height) {

		// Handle sizing of elements with the 'stretch' class
		toArray(dom.slides.querySelectorAll('section > .stretch')).forEach(function (element) {

			// Determine how much vertical space we can use
			var remainingHeight = getRemainingHeight(element, height);

			// Consider the aspect ratio of media elements
			if (/(img|video)/gi.test(element.nodeName)) {
				var nw = element.naturalWidth || element.videoWidth,
				    nh = element.naturalHeight || element.videoHeight;

				var es = Math.min(width / nw, remainingHeight / nh);

				element.style.width = nw * es + 'px';
				element.style.height = nh * es + 'px';
			} else {
				element.style.width = width + 'px';
				element.style.height = remainingHeight + 'px';
			}
		});
	}

	/**
  * Calculates the computed pixel size of our slides. These
  * values are based on the width and height configuration
  * options.
  *
  * @param {number} [presentationWidth=dom.wrapper.offsetWidth]
  * @param {number} [presentationHeight=dom.wrapper.offsetHeight]
  */
	function getComputedSlideSize(presentationWidth, presentationHeight) {

		var size = {
			// Slide size
			width: config.width,
			height: config.height,

			// Presentation size
			presentationWidth: presentationWidth || dom.wrapper.offsetWidth,
			presentationHeight: presentationHeight || dom.wrapper.offsetHeight
		};

		// Reduce available space by margin
		size.presentationWidth -= size.presentationWidth * config.margin;
		size.presentationHeight -= size.presentationHeight * config.margin;

		// Slide width may be a percentage of available width
		if (typeof size.width === 'string' && /%$/.test(size.width)) {
			size.width = parseInt(size.width, 10) / 100 * size.presentationWidth;
		}

		// Slide height may be a percentage of available height
		if (typeof size.height === 'string' && /%$/.test(size.height)) {
			size.height = parseInt(size.height, 10) / 100 * size.presentationHeight;
		}

		return size;
	}

	/**
  * Stores the vertical index of a stack so that the same
  * vertical slide can be selected when navigating to and
  * from the stack.
  *
  * @param {HTMLElement} stack The vertical stack element
  * @param {string|number} [v=0] Index to memorize
  */
	function setPreviousVerticalIndex(stack, v) {

		if ((typeof stack === 'undefined' ? 'undefined' : _typeof(stack)) === 'object' && typeof stack.setAttribute === 'function') {
			stack.setAttribute('data-previous-indexv', v || 0);
		}
	}

	/**
  * Retrieves the vertical index which was stored using
  * #setPreviousVerticalIndex() or 0 if no previous index
  * exists.
  *
  * @param {HTMLElement} stack The vertical stack element
  */
	function getPreviousVerticalIndex(stack) {

		if ((typeof stack === 'undefined' ? 'undefined' : _typeof(stack)) === 'object' && typeof stack.setAttribute === 'function' && stack.classList.contains('stack')) {
			// Prefer manually defined start-indexv
			var attributeName = stack.hasAttribute('data-start-indexv') ? 'data-start-indexv' : 'data-previous-indexv';

			return parseInt(stack.getAttribute(attributeName) || 0, 10);
		}

		return 0;
	}

	/**
  * Displays the overview of slides (quick nav) by scaling
  * down and arranging all slide elements.
  */
	function activateOverview() {

		// Only proceed if enabled in config
		if (config.overview && !isOverview()) {

			overview = true;

			dom.wrapper.classList.add('overview');
			dom.wrapper.classList.remove('overview-deactivating');

			if (features.overviewTransitions) {
				setTimeout(function () {
					dom.wrapper.classList.add('overview-animated');
				}, 1);
			}

			// Don't auto-slide while in overview mode
			cancelAutoSlide();

			// Move the backgrounds element into the slide container to
			// that the same scaling is applied
			dom.slides.appendChild(dom.background);

			// Clicking on an overview slide navigates to it
			toArray(dom.wrapper.querySelectorAll(SLIDES_SELECTOR)).forEach(function (slide) {
				if (!slide.classList.contains('stack')) {
					slide.addEventListener('click', onOverviewSlideClicked, true);
				}
			});

			// Calculate slide sizes
			var margin = 70;
			var slideSize = getComputedSlideSize();
			overviewSlideWidth = slideSize.width + margin;
			overviewSlideHeight = slideSize.height + margin;

			// Reverse in RTL mode
			if (config.rtl) {
				overviewSlideWidth = -overviewSlideWidth;
			}

			updateSlidesVisibility();
			layoutOverview();
			updateOverview();

			layout();

			// Notify observers of the overview showing
			dispatchEvent('overviewshown', {
				'indexh': indexh,
				'indexv': indexv,
				'currentSlide': currentSlide
			});
		}
	}

	/**
  * Uses CSS transforms to position all slides in a grid for
  * display inside of the overview mode.
  */
	function layoutOverview() {

		// Layout slides
		toArray(dom.wrapper.querySelectorAll(HORIZONTAL_SLIDES_SELECTOR)).forEach(function (hslide, h) {
			hslide.setAttribute('data-index-h', h);
			transformElement(hslide, 'translate3d(' + h * overviewSlideWidth + 'px, 0, 0)');

			if (hslide.classList.contains('stack')) {

				toArray(hslide.querySelectorAll('section')).forEach(function (vslide, v) {
					vslide.setAttribute('data-index-h', h);
					vslide.setAttribute('data-index-v', v);

					transformElement(vslide, 'translate3d(0, ' + v * overviewSlideHeight + 'px, 0)');
				});
			}
		});

		// Layout slide backgrounds
		toArray(dom.background.childNodes).forEach(function (hbackground, h) {
			transformElement(hbackground, 'translate3d(' + h * overviewSlideWidth + 'px, 0, 0)');

			toArray(hbackground.querySelectorAll('.slide-background')).forEach(function (vbackground, v) {
				transformElement(vbackground, 'translate3d(0, ' + v * overviewSlideHeight + 'px, 0)');
			});
		});
	}

	/**
  * Moves the overview viewport to the current slides.
  * Called each time the current slide changes.
  */
	function updateOverview() {

		var vmin = Math.min(window.innerWidth, window.innerHeight);
		var scale = Math.max(vmin / 5, 150) / vmin;

		transformSlides({
			overview: ['scale(' + scale + ')', 'translateX(' + -indexh * overviewSlideWidth + 'px)', 'translateY(' + -indexv * overviewSlideHeight + 'px)'].join(' ')
		});
	}

	/**
  * Exits the slide overview and enters the currently
  * active slide.
  */
	function deactivateOverview() {

		// Only proceed if enabled in config
		if (config.overview) {

			overview = false;

			dom.wrapper.classList.remove('overview');
			dom.wrapper.classList.remove('overview-animated');

			// Temporarily add a class so that transitions can do different things
			// depending on whether they are exiting/entering overview, or just
			// moving from slide to slide
			dom.wrapper.classList.add('overview-deactivating');

			setTimeout(function () {
				dom.wrapper.classList.remove('overview-deactivating');
			}, 1);

			// Move the background element back out
			dom.wrapper.appendChild(dom.background);

			// Clean up changes made to slides
			toArray(dom.wrapper.querySelectorAll(SLIDES_SELECTOR)).forEach(function (slide) {
				transformElement(slide, '');

				slide.removeEventListener('click', onOverviewSlideClicked, true);
			});

			// Clean up changes made to backgrounds
			toArray(dom.background.querySelectorAll('.slide-background')).forEach(function (background) {
				transformElement(background, '');
			});

			transformSlides({ overview: '' });

			slide(indexh, indexv);

			layout();

			cueAutoSlide();

			// Notify observers of the overview hiding
			dispatchEvent('overviewhidden', {
				'indexh': indexh,
				'indexv': indexv,
				'currentSlide': currentSlide
			});
		}
	}

	/**
  * Toggles the slide overview mode on and off.
  *
  * @param {Boolean} [override] Flag which overrides the
  * toggle logic and forcibly sets the desired state. True means
  * overview is open, false means it's closed.
  */
	function toggleOverview(override) {

		if (typeof override === 'boolean') {
			override ? activateOverview() : deactivateOverview();
		} else {
			isOverview() ? deactivateOverview() : activateOverview();
		}
	}

	/**
  * Checks if the overview is currently active.
  *
  * @return {Boolean} true if the overview is active,
  * false otherwise
  */
	function isOverview() {

		return overview;
	}

	/**
  * Checks if the current or specified slide is vertical
  * (nested within another slide).
  *
  * @param {HTMLElement} [slide=currentSlide] The slide to check
  * orientation of
  * @return {Boolean}
  */
	function isVerticalSlide(slide) {

		// Prefer slide argument, otherwise use current slide
		slide = slide ? slide : currentSlide;

		return slide && slide.parentNode && !!slide.parentNode.nodeName.match(/section/i);
	}

	/**
  * Handling the fullscreen functionality via the fullscreen API
  *
  * @see http://fullscreen.spec.whatwg.org/
  * @see https://developer.mozilla.org/en-US/docs/DOM/Using_fullscreen_mode
  */
	function enterFullscreen() {

		var element = document.documentElement;

		// Check which implementation is available
		var requestMethod = element.requestFullscreen || element.webkitRequestFullscreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullscreen;

		if (requestMethod) {
			requestMethod.apply(element);
		}
	}

	/**
  * Enters the paused mode which fades everything on screen to
  * black.
  */
	function pause() {

		if (config.pause) {
			var wasPaused = dom.wrapper.classList.contains('paused');

			cancelAutoSlide();
			dom.wrapper.classList.add('paused');

			if (wasPaused === false) {
				dispatchEvent('paused');
			}
		}
	}

	/**
  * Exits from the paused mode.
  */
	function resume() {

		var wasPaused = dom.wrapper.classList.contains('paused');
		dom.wrapper.classList.remove('paused');

		cueAutoSlide();

		if (wasPaused) {
			dispatchEvent('resumed');
		}
	}

	/**
  * Toggles the paused mode on and off.
  */
	function togglePause(override) {

		if (typeof override === 'boolean') {
			override ? pause() : resume();
		} else {
			isPaused() ? resume() : pause();
		}
	}

	/**
  * Checks if we are currently in the paused mode.
  *
  * @return {Boolean}
  */
	function isPaused() {

		return dom.wrapper.classList.contains('paused');
	}

	/**
  * Toggles the auto slide mode on and off.
  *
  * @param {Boolean} [override] Flag which sets the desired state.
  * True means autoplay starts, false means it stops.
  */

	function toggleAutoSlide(override) {

		if (typeof override === 'boolean') {
			override ? resumeAutoSlide() : pauseAutoSlide();
		} else {
			autoSlidePaused ? resumeAutoSlide() : pauseAutoSlide();
		}
	}

	/**
  * Checks if the auto slide mode is currently on.
  *
  * @return {Boolean}
  */
	function isAutoSliding() {

		return !!(autoSlide && !autoSlidePaused);
	}

	/**
  * Steps from the current point in the presentation to the
  * slide which matches the specified horizontal and vertical
  * indices.
  *
  * @param {number} [h=indexh] Horizontal index of the target slide
  * @param {number} [v=indexv] Vertical index of the target slide
  * @param {number} [f] Index of a fragment within the
  * target slide to activate
  * @param {number} [o] Origin for use in multimaster environments
  */
	function slide(h, v, f, o) {

		// Remember where we were at before
		previousSlide = currentSlide;

		// Query all horizontal slides in the deck
		var horizontalSlides = dom.wrapper.querySelectorAll(HORIZONTAL_SLIDES_SELECTOR);

		// Abort if there are no slides
		if (horizontalSlides.length === 0) return;

		// If no vertical index is specified and the upcoming slide is a
		// stack, resume at its previous vertical index
		if (v === undefined && !isOverview()) {
			v = getPreviousVerticalIndex(horizontalSlides[h]);
		}

		// If we were on a vertical stack, remember what vertical index
		// it was on so we can resume at the same position when returning
		if (previousSlide && previousSlide.parentNode && previousSlide.parentNode.classList.contains('stack')) {
			setPreviousVerticalIndex(previousSlide.parentNode, indexv);
		}

		// Remember the state before this slide
		var stateBefore = state.concat();

		// Reset the state array
		state.length = 0;

		var indexhBefore = indexh || 0,
		    indexvBefore = indexv || 0;

		// Activate and transition to the new slide
		indexh = updateSlides(HORIZONTAL_SLIDES_SELECTOR, h === undefined ? indexh : h);
		indexv = updateSlides(VERTICAL_SLIDES_SELECTOR, v === undefined ? indexv : v);

		// Update the visibility of slides now that the indices have changed
		updateSlidesVisibility();

		layout();

		// Apply the new state
		stateLoop: for (var i = 0, len = state.length; i < len; i++) {
			// Check if this state existed on the previous slide. If it
			// did, we will avoid adding it repeatedly
			for (var j = 0; j < stateBefore.length; j++) {
				if (stateBefore[j] === state[i]) {
					stateBefore.splice(j, 1);
					continue stateLoop;
				}
			}

			document.documentElement.classList.add(state[i]);

			// Dispatch custom event matching the state's name
			dispatchEvent(state[i]);
		}

		// Clean up the remains of the previous state
		while (stateBefore.length) {
			document.documentElement.classList.remove(stateBefore.pop());
		}

		// Update the overview if it's currently active
		if (isOverview()) {
			updateOverview();
		}

		// Find the current horizontal slide and any possible vertical slides
		// within it
		var currentHorizontalSlide = horizontalSlides[indexh],
		    currentVerticalSlides = currentHorizontalSlide.querySelectorAll('section');

		// Store references to the previous and current slides
		currentSlide = currentVerticalSlides[indexv] || currentHorizontalSlide;

		// Show fragment, if specified
		if (typeof f !== 'undefined') {
			navigateFragment(f);
		}

		// Dispatch an event if the slide changed
		var slideChanged = indexh !== indexhBefore || indexv !== indexvBefore;
		if (slideChanged) {
			dispatchEvent('slidechanged', {
				'indexh': indexh,
				'indexv': indexv,
				'previousSlide': previousSlide,
				'currentSlide': currentSlide,
				'origin': o
			});
		} else {
			// Ensure that the previous slide is never the same as the current
			previousSlide = null;
		}

		// Solves an edge case where the previous slide maintains the
		// 'present' class when navigating between adjacent vertical
		// stacks
		if (previousSlide) {
			previousSlide.classList.remove('present');
			previousSlide.setAttribute('aria-hidden', 'true');

			// Reset all slides upon navigate to home
			// Issue: #285
			if (dom.wrapper.querySelector(HOME_SLIDE_SELECTOR).classList.contains('present')) {
				// Launch async task
				setTimeout(function () {
					var slides = toArray(dom.wrapper.querySelectorAll(HORIZONTAL_SLIDES_SELECTOR + '.stack')),
					    i;
					for (i in slides) {
						if (slides[i]) {
							// Reset stack
							setPreviousVerticalIndex(slides[i], 0);
						}
					}
				}, 0);
			}
		}

		// Handle embedded content
		if (slideChanged || !previousSlide) {
			stopEmbeddedContent(previousSlide);
			startEmbeddedContent(currentSlide);
		}

		// Announce the current slide contents, for screen readers
		dom.statusDiv.textContent = getStatusText(currentSlide);

		updateControls();
		updateProgress();
		updateBackground();
		updateParallax();
		updateSlideNumber();
		updateNotes();

		// Update the URL hash
		writeURL();

		cueAutoSlide();
	}

	/**
  * Syncs the presentation with the current DOM. Useful
  * when new slides or control elements are added or when
  * the configuration has changed.
  */
	function sync() {

		// Subscribe to input
		removeEventListeners();
		addEventListeners();

		// Force a layout to make sure the current config is accounted for
		layout();

		// Reflect the current autoSlide value
		autoSlide = config.autoSlide;

		// Start auto-sliding if it's enabled
		cueAutoSlide();

		// Re-create the slide backgrounds
		createBackgrounds();

		// Write the current hash to the URL
		writeURL();

		sortAllFragments();

		updateControls();
		updateProgress();
		updateSlideNumber();
		updateSlidesVisibility();
		updateBackground(true);
		updateNotesVisibility();
		updateNotes();

		formatEmbeddedContent();

		// Start or stop embedded content depending on global config
		if (config.autoPlayMedia === false) {
			stopEmbeddedContent(currentSlide, { unloadIframes: false });
		} else {
			startEmbeddedContent(currentSlide);
		}

		if (isOverview()) {
			layoutOverview();
		}
	}

	/**
  * Resets all vertical slides so that only the first
  * is visible.
  */
	function resetVerticalSlides() {

		var horizontalSlides = toArray(dom.wrapper.querySelectorAll(HORIZONTAL_SLIDES_SELECTOR));
		horizontalSlides.forEach(function (horizontalSlide) {

			var verticalSlides = toArray(horizontalSlide.querySelectorAll('section'));
			verticalSlides.forEach(function (verticalSlide, y) {

				if (y > 0) {
					verticalSlide.classList.remove('present');
					verticalSlide.classList.remove('past');
					verticalSlide.classList.add('future');
					verticalSlide.setAttribute('aria-hidden', 'true');
				}
			});
		});
	}

	/**
  * Sorts and formats all of fragments in the
  * presentation.
  */
	function sortAllFragments() {

		var horizontalSlides = toArray(dom.wrapper.querySelectorAll(HORIZONTAL_SLIDES_SELECTOR));
		horizontalSlides.forEach(function (horizontalSlide) {

			var verticalSlides = toArray(horizontalSlide.querySelectorAll('section'));
			verticalSlides.forEach(function (verticalSlide, y) {

				sortFragments(verticalSlide.querySelectorAll('.fragment'));
			});

			if (verticalSlides.length === 0) sortFragments(horizontalSlide.querySelectorAll('.fragment'));
		});
	}

	/**
  * Randomly shuffles all slides in the deck.
  */
	function shuffle() {

		var slides = toArray(dom.wrapper.querySelectorAll(HORIZONTAL_SLIDES_SELECTOR));

		slides.forEach(function (slide) {

			// Insert this slide next to another random slide. This may
			// cause the slide to insert before itself but that's fine.
			dom.slides.insertBefore(slide, slides[Math.floor(Math.random() * slides.length)]);
		});
	}

	/**
  * Updates one dimension of slides by showing the slide
  * with the specified index.
  *
  * @param {string} selector A CSS selector that will fetch
  * the group of slides we are working with
  * @param {number} index The index of the slide that should be
  * shown
  *
  * @return {number} The index of the slide that is now shown,
  * might differ from the passed in index if it was out of
  * bounds.
  */
	function updateSlides(selector, index) {

		// Select all slides and convert the NodeList result to
		// an array
		var slides = toArray(dom.wrapper.querySelectorAll(selector)),
		    slidesLength = slides.length;

		var printMode = isPrintingPDF();

		if (slidesLength) {

			// Should the index loop?
			if (config.loop) {
				index %= slidesLength;

				if (index < 0) {
					index = slidesLength + index;
				}
			}

			// Enforce max and minimum index bounds
			index = Math.max(Math.min(index, slidesLength - 1), 0);

			for (var i = 0; i < slidesLength; i++) {
				var element = slides[i];

				var reverse = config.rtl && !isVerticalSlide(element);

				element.classList.remove('past');
				element.classList.remove('present');
				element.classList.remove('future');

				// http://www.w3.org/html/wg/drafts/html/master/editing.html#the-hidden-attribute
				element.setAttribute('hidden', '');
				element.setAttribute('aria-hidden', 'true');

				// If this element contains vertical slides
				if (element.querySelector('section')) {
					element.classList.add('stack');
				}

				// If we're printing static slides, all slides are "present"
				if (printMode) {
					element.classList.add('present');
					continue;
				}

				if (i < index) {
					// Any element previous to index is given the 'past' class
					element.classList.add(reverse ? 'future' : 'past');

					if (config.fragments) {
						var pastFragments = toArray(element.querySelectorAll('.fragment'));

						// Show all fragments on prior slides
						while (pastFragments.length) {
							var pastFragment = pastFragments.pop();
							pastFragment.classList.add('visible');
							pastFragment.classList.remove('current-fragment');
						}
					}
				} else if (i > index) {
					// Any element subsequent to index is given the 'future' class
					element.classList.add(reverse ? 'past' : 'future');

					if (config.fragments) {
						var futureFragments = toArray(element.querySelectorAll('.fragment.visible'));

						// No fragments in future slides should be visible ahead of time
						while (futureFragments.length) {
							var futureFragment = futureFragments.pop();
							futureFragment.classList.remove('visible');
							futureFragment.classList.remove('current-fragment');
						}
					}
				}
			}

			// Mark the current slide as present
			slides[index].classList.add('present');
			slides[index].removeAttribute('hidden');
			slides[index].removeAttribute('aria-hidden');

			// If this slide has a state associated with it, add it
			// onto the current state of the deck
			var slideState = slides[index].getAttribute('data-state');
			if (slideState) {
				state = state.concat(slideState.split(' '));
			}
		} else {
			// Since there are no slides we can't be anywhere beyond the
			// zeroth index
			index = 0;
		}

		return index;
	}

	/**
  * Optimization method; hide all slides that are far away
  * from the present slide.
  */
	function updateSlidesVisibility() {

		// Select all slides and convert the NodeList result to
		// an array
		var horizontalSlides = toArray(dom.wrapper.querySelectorAll(HORIZONTAL_SLIDES_SELECTOR)),
		    horizontalSlidesLength = horizontalSlides.length,
		    distanceX,
		    distanceY;

		if (horizontalSlidesLength && typeof indexh !== 'undefined') {

			// The number of steps away from the present slide that will
			// be visible
			var viewDistance = isOverview() ? 10 : config.viewDistance;

			// Limit view distance on weaker devices
			if (isMobileDevice) {
				viewDistance = isOverview() ? 6 : 2;
			}

			// All slides need to be visible when exporting to PDF
			if (isPrintingPDF()) {
				viewDistance = Number.MAX_VALUE;
			}

			for (var x = 0; x < horizontalSlidesLength; x++) {
				var horizontalSlide = horizontalSlides[x];

				var verticalSlides = toArray(horizontalSlide.querySelectorAll('section')),
				    verticalSlidesLength = verticalSlides.length;

				// Determine how far away this slide is from the present
				distanceX = Math.abs((indexh || 0) - x) || 0;

				// If the presentation is looped, distance should measure
				// 1 between the first and last slides
				if (config.loop) {
					distanceX = Math.abs(((indexh || 0) - x) % (horizontalSlidesLength - viewDistance)) || 0;
				}

				// Show the horizontal slide if it's within the view distance
				if (distanceX < viewDistance) {
					loadSlide(horizontalSlide);
				} else {
					unloadSlide(horizontalSlide);
				}

				if (verticalSlidesLength) {

					var oy = getPreviousVerticalIndex(horizontalSlide);

					for (var y = 0; y < verticalSlidesLength; y++) {
						var verticalSlide = verticalSlides[y];

						distanceY = x === (indexh || 0) ? Math.abs((indexv || 0) - y) : Math.abs(y - oy);

						if (distanceX + distanceY < viewDistance) {
							loadSlide(verticalSlide);
						} else {
							unloadSlide(verticalSlide);
						}
					}
				}
			}

			// Flag if there are ANY vertical slides, anywhere in the deck
			if (dom.wrapper.querySelectorAll('.slides>section>section').length) {
				dom.wrapper.classList.add('has-vertical-slides');
			} else {
				dom.wrapper.classList.remove('has-vertical-slides');
			}

			// Flag if there are ANY horizontal slides, anywhere in the deck
			if (dom.wrapper.querySelectorAll('.slides>section').length > 1) {
				dom.wrapper.classList.add('has-horizontal-slides');
			} else {
				dom.wrapper.classList.remove('has-horizontal-slides');
			}
		}
	}

	/**
  * Pick up notes from the current slide and display them
  * to the viewer.
  *
  * @see {@link config.showNotes}
  */
	function updateNotes() {

		if (config.showNotes && dom.speakerNotes && currentSlide && !isPrintingPDF()) {

			dom.speakerNotes.innerHTML = getSlideNotes() || '<span class="notes-placeholder">No notes on this slide.</span>';
		}
	}

	/**
  * Updates the visibility of the speaker notes sidebar that
  * is used to share annotated slides. The notes sidebar is
  * only visible if showNotes is true and there are notes on
  * one or more slides in the deck.
  */
	function updateNotesVisibility() {

		if (config.showNotes && hasNotes()) {
			dom.wrapper.classList.add('show-notes');
		} else {
			dom.wrapper.classList.remove('show-notes');
		}
	}

	/**
  * Checks if there are speaker notes for ANY slide in the
  * presentation.
  */
	function hasNotes() {

		return dom.slides.querySelectorAll('[data-notes], aside.notes').length > 0;
	}

	/**
  * Updates the progress bar to reflect the current slide.
  */
	function updateProgress() {

		// Update progress if enabled
		if (config.progress && dom.progressbar) {

			dom.progressbar.style.width = getProgress() * dom.wrapper.offsetWidth + 'px';
		}
	}

	/**
  * Updates the slide number div to reflect the current slide.
  *
  * The following slide number formats are available:
  *  "h.v":	horizontal . vertical slide number (default)
  *  "h/v":	horizontal / vertical slide number
  *    "c":	flattened slide number
  *  "c/t":	flattened slide number / total slides
  */
	function updateSlideNumber() {

		// Update slide number if enabled
		if (config.slideNumber && dom.slideNumber) {

			var value = [];
			var format = 'h.v';

			// Check if a custom number format is available
			if (typeof config.slideNumber === 'string') {
				format = config.slideNumber;
			}

			switch (format) {
				case 'c':
					value.push(getSlidePastCount() + 1);
					break;
				case 'c/t':
					value.push(getSlidePastCount() + 1, '/', getTotalSlides());
					break;
				case 'h/v':
					value.push(indexh + 1);
					if (isVerticalSlide()) value.push('/', indexv + 1);
					break;
				default:
					value.push(indexh + 1);
					if (isVerticalSlide()) value.push('.', indexv + 1);
			}

			dom.slideNumber.innerHTML = formatSlideNumber(value[0], value[1], value[2]);
		}
	}

	/**
  * Applies HTML formatting to a slide number before it's
  * written to the DOM.
  *
  * @param {number} a Current slide
  * @param {string} delimiter Character to separate slide numbers
  * @param {(number|*)} b Total slides
  * @return {string} HTML string fragment
  */
	function formatSlideNumber(a, delimiter, b) {

		if (typeof b === 'number' && !isNaN(b)) {
			return '<span class="slide-number-a">' + a + '</span>' + '<span class="slide-number-delimiter">' + delimiter + '</span>' + '<span class="slide-number-b">' + b + '</span>';
		} else {
			return '<span class="slide-number-a">' + a + '</span>';
		}
	}

	/**
  * Updates the state of all control/navigation arrows.
  */
	function updateControls() {

		var routes = availableRoutes();
		var fragments = availableFragments();

		// Remove the 'enabled' class from all directions
		dom.controlsLeft.concat(dom.controlsRight).concat(dom.controlsUp).concat(dom.controlsDown).concat(dom.controlsPrev).concat(dom.controlsNext).forEach(function (node) {
			node.classList.remove('enabled');
			node.classList.remove('fragmented');

			// Set 'disabled' attribute on all directions
			node.setAttribute('disabled', 'disabled');
		});

		// Add the 'enabled' class to the available routes; remove 'disabled' attribute to enable buttons
		if (routes.left) dom.controlsLeft.forEach(function (el) {
			el.classList.add('enabled');el.removeAttribute('disabled');
		});
		if (routes.right) dom.controlsRight.forEach(function (el) {
			el.classList.add('enabled');el.removeAttribute('disabled');
		});
		if (routes.up) dom.controlsUp.forEach(function (el) {
			el.classList.add('enabled');el.removeAttribute('disabled');
		});
		if (routes.down) dom.controlsDown.forEach(function (el) {
			el.classList.add('enabled');el.removeAttribute('disabled');
		});

		// Prev/next buttons
		if (routes.left || routes.up) dom.controlsPrev.forEach(function (el) {
			el.classList.add('enabled');el.removeAttribute('disabled');
		});
		if (routes.right || routes.down) dom.controlsNext.forEach(function (el) {
			el.classList.add('enabled');el.removeAttribute('disabled');
		});

		// Highlight fragment directions
		if (currentSlide) {

			// Always apply fragment decorator to prev/next buttons
			if (fragments.prev) dom.controlsPrev.forEach(function (el) {
				el.classList.add('fragmented', 'enabled');el.removeAttribute('disabled');
			});
			if (fragments.next) dom.controlsNext.forEach(function (el) {
				el.classList.add('fragmented', 'enabled');el.removeAttribute('disabled');
			});

			// Apply fragment decorators to directional buttons based on
			// what slide axis they are in
			if (isVerticalSlide(currentSlide)) {
				if (fragments.prev) dom.controlsUp.forEach(function (el) {
					el.classList.add('fragmented', 'enabled');el.removeAttribute('disabled');
				});
				if (fragments.next) dom.controlsDown.forEach(function (el) {
					el.classList.add('fragmented', 'enabled');el.removeAttribute('disabled');
				});
			} else {
				if (fragments.prev) dom.controlsLeft.forEach(function (el) {
					el.classList.add('fragmented', 'enabled');el.removeAttribute('disabled');
				});
				if (fragments.next) dom.controlsRight.forEach(function (el) {
					el.classList.add('fragmented', 'enabled');el.removeAttribute('disabled');
				});
			}
		}

		if (config.controlsTutorial) {

			// Highlight control arrows with an animation to ensure
			// that the viewer knows how to navigate
			if (!hasNavigatedDown && routes.down) {
				dom.controlsDownArrow.classList.add('highlight');
			} else {
				dom.controlsDownArrow.classList.remove('highlight');

				if (!hasNavigatedRight && routes.right && indexv === 0) {
					dom.controlsRightArrow.classList.add('highlight');
				} else {
					dom.controlsRightArrow.classList.remove('highlight');
				}
			}
		}
	}

	/**
  * Updates the background elements to reflect the current
  * slide.
  *
  * @param {boolean} includeAll If true, the backgrounds of
  * all vertical slides (not just the present) will be updated.
  */
	function updateBackground(includeAll) {

		var currentBackground = null;

		// Reverse past/future classes when in RTL mode
		var horizontalPast = config.rtl ? 'future' : 'past',
		    horizontalFuture = config.rtl ? 'past' : 'future';

		// Update the classes of all backgrounds to match the
		// states of their slides (past/present/future)
		toArray(dom.background.childNodes).forEach(function (backgroundh, h) {

			backgroundh.classList.remove('past');
			backgroundh.classList.remove('present');
			backgroundh.classList.remove('future');

			if (h < indexh) {
				backgroundh.classList.add(horizontalPast);
			} else if (h > indexh) {
				backgroundh.classList.add(horizontalFuture);
			} else {
				backgroundh.classList.add('present');

				// Store a reference to the current background element
				currentBackground = backgroundh;
			}

			if (includeAll || h === indexh) {
				toArray(backgroundh.querySelectorAll('.slide-background')).forEach(function (backgroundv, v) {

					backgroundv.classList.remove('past');
					backgroundv.classList.remove('present');
					backgroundv.classList.remove('future');

					if (v < indexv) {
						backgroundv.classList.add('past');
					} else if (v > indexv) {
						backgroundv.classList.add('future');
					} else {
						backgroundv.classList.add('present');

						// Only if this is the present horizontal and vertical slide
						if (h === indexh) currentBackground = backgroundv;
					}
				});
			}
		});

		// Stop content inside of previous backgrounds
		if (previousBackground) {

			stopEmbeddedContent(previousBackground);
		}

		// Start content in the current background
		if (currentBackground) {

			startEmbeddedContent(currentBackground);

			var backgroundImageURL = currentBackground.style.backgroundImage || '';

			// Restart GIFs (doesn't work in Firefox)
			if (/\.gif/i.test(backgroundImageURL)) {
				currentBackground.style.backgroundImage = '';
				window.getComputedStyle(currentBackground).opacity;
				currentBackground.style.backgroundImage = backgroundImageURL;
			}

			// Don't transition between identical backgrounds. This
			// prevents unwanted flicker.
			var previousBackgroundHash = previousBackground ? previousBackground.getAttribute('data-background-hash') : null;
			var currentBackgroundHash = currentBackground.getAttribute('data-background-hash');
			if (currentBackgroundHash && currentBackgroundHash === previousBackgroundHash && currentBackground !== previousBackground) {
				dom.background.classList.add('no-transition');
			}

			previousBackground = currentBackground;
		}

		// If there's a background brightness flag for this slide,
		// bubble it to the .reveal container
		if (currentSlide) {
			['has-light-background', 'has-dark-background'].forEach(function (classToBubble) {
				if (currentSlide.classList.contains(classToBubble)) {
					dom.wrapper.classList.add(classToBubble);
				} else {
					dom.wrapper.classList.remove(classToBubble);
				}
			});
		}

		// Allow the first background to apply without transition
		setTimeout(function () {
			dom.background.classList.remove('no-transition');
		}, 1);
	}

	/**
  * Updates the position of the parallax background based
  * on the current slide index.
  */
	function updateParallax() {

		if (config.parallaxBackgroundImage) {

			var horizontalSlides = dom.wrapper.querySelectorAll(HORIZONTAL_SLIDES_SELECTOR),
			    verticalSlides = dom.wrapper.querySelectorAll(VERTICAL_SLIDES_SELECTOR);

			var backgroundSize = dom.background.style.backgroundSize.split(' '),
			    backgroundWidth,
			    backgroundHeight;

			if (backgroundSize.length === 1) {
				backgroundWidth = backgroundHeight = parseInt(backgroundSize[0], 10);
			} else {
				backgroundWidth = parseInt(backgroundSize[0], 10);
				backgroundHeight = parseInt(backgroundSize[1], 10);
			}

			var slideWidth = dom.background.offsetWidth,
			    horizontalSlideCount = horizontalSlides.length,
			    horizontalOffsetMultiplier,
			    horizontalOffset;

			if (typeof config.parallaxBackgroundHorizontal === 'number') {
				horizontalOffsetMultiplier = config.parallaxBackgroundHorizontal;
			} else {
				horizontalOffsetMultiplier = horizontalSlideCount > 1 ? (backgroundWidth - slideWidth) / (horizontalSlideCount - 1) : 0;
			}

			horizontalOffset = horizontalOffsetMultiplier * indexh * -1;

			var slideHeight = dom.background.offsetHeight,
			    verticalSlideCount = verticalSlides.length,
			    verticalOffsetMultiplier,
			    verticalOffset;

			if (typeof config.parallaxBackgroundVertical === 'number') {
				verticalOffsetMultiplier = config.parallaxBackgroundVertical;
			} else {
				verticalOffsetMultiplier = (backgroundHeight - slideHeight) / (verticalSlideCount - 1);
			}

			verticalOffset = verticalSlideCount > 0 ? verticalOffsetMultiplier * indexv : 0;

			dom.background.style.backgroundPosition = horizontalOffset + 'px ' + -verticalOffset + 'px';
		}
	}

	/**
  * Called when the given slide is within the configured view
  * distance. Shows the slide element and loads any content
  * that is set to load lazily (data-src).
  *
  * @param {HTMLElement} slide Slide to show
  */
	function loadSlide(slide, options) {

		options = options || {};

		// Show the slide element
		slide.style.display = config.display;

		// Media elements with data-src attributes
		toArray(slide.querySelectorAll('img[data-src], video[data-src], audio[data-src]')).forEach(function (element) {
			element.setAttribute('src', element.getAttribute('data-src'));
			element.setAttribute('data-lazy-loaded', '');
			element.removeAttribute('data-src');
		});

		// Media elements with <source> children
		toArray(slide.querySelectorAll('video, audio')).forEach(function (media) {
			var sources = 0;

			toArray(media.querySelectorAll('source[data-src]')).forEach(function (source) {
				source.setAttribute('src', source.getAttribute('data-src'));
				source.removeAttribute('data-src');
				source.setAttribute('data-lazy-loaded', '');
				sources += 1;
			});

			// If we rewrote sources for this video/audio element, we need
			// to manually tell it to load from its new origin
			if (sources > 0) {
				media.load();
			}
		});

		// Show the corresponding background element
		var indices = getIndices(slide);
		var background = getSlideBackground(indices.h, indices.v);
		if (background) {
			background.style.display = 'block';

			// If the background contains media, load it
			if (background.hasAttribute('data-loaded') === false) {
				background.setAttribute('data-loaded', 'true');

				var backgroundImage = slide.getAttribute('data-background-image'),
				    backgroundVideo = slide.getAttribute('data-background-video'),
				    backgroundVideoLoop = slide.hasAttribute('data-background-video-loop'),
				    backgroundVideoMuted = slide.hasAttribute('data-background-video-muted'),
				    backgroundIframe = slide.getAttribute('data-background-iframe');

				// Images
				if (backgroundImage) {
					background.style.backgroundImage = 'url(' + backgroundImage + ')';
				}
				// Videos
				else if (backgroundVideo && !isSpeakerNotes()) {
						var video = document.createElement('video');

						if (backgroundVideoLoop) {
							video.setAttribute('loop', '');
						}

						if (backgroundVideoMuted) {
							video.muted = true;
						}

						// Inline video playback works (at least in Mobile Safari) as
						// long as the video is muted and the `playsinline` attribute is
						// present
						if (isMobileDevice) {
							video.muted = true;
							video.autoplay = true;
							video.setAttribute('playsinline', '');
						}

						// Support comma separated lists of video sources
						backgroundVideo.split(',').forEach(function (source) {
							video.innerHTML += '<source src="' + source + '">';
						});

						background.appendChild(video);
					}
					// Iframes
					else if (backgroundIframe && options.excludeIframes !== true) {
							var iframe = document.createElement('iframe');
							iframe.setAttribute('allowfullscreen', '');
							iframe.setAttribute('mozallowfullscreen', '');
							iframe.setAttribute('webkitallowfullscreen', '');

							// Only load autoplaying content when the slide is shown to
							// avoid having it play in the background
							if (/autoplay=(1|true|yes)/gi.test(backgroundIframe)) {
								iframe.setAttribute('data-src', backgroundIframe);
							} else {
								iframe.setAttribute('src', backgroundIframe);
							}

							iframe.style.width = '100%';
							iframe.style.height = '100%';
							iframe.style.maxHeight = '100%';
							iframe.style.maxWidth = '100%';

							background.appendChild(iframe);
						}
			}
		}
	}

	/**
  * Unloads and hides the given slide. This is called when the
  * slide is moved outside of the configured view distance.
  *
  * @param {HTMLElement} slide
  */
	function unloadSlide(slide) {

		// Hide the slide element
		slide.style.display = 'none';

		// Hide the corresponding background element
		var indices = getIndices(slide);
		var background = getSlideBackground(indices.h, indices.v);
		if (background) {
			background.style.display = 'none';
		}

		// Reset lazy-loaded media elements with src attributes
		toArray(slide.querySelectorAll('video[data-lazy-loaded][src], audio[data-lazy-loaded][src]')).forEach(function (element) {
			element.setAttribute('data-src', element.getAttribute('src'));
			element.removeAttribute('src');
		});

		// Reset lazy-loaded media elements with <source> children
		toArray(slide.querySelectorAll('video[data-lazy-loaded] source[src], audio source[src]')).forEach(function (source) {
			source.setAttribute('data-src', source.getAttribute('src'));
			source.removeAttribute('src');
		});
	}

	/**
  * Determine what available routes there are for navigation.
  *
  * @return {{left: boolean, right: boolean, up: boolean, down: boolean}}
  */
	function availableRoutes() {

		var horizontalSlides = dom.wrapper.querySelectorAll(HORIZONTAL_SLIDES_SELECTOR),
		    verticalSlides = dom.wrapper.querySelectorAll(VERTICAL_SLIDES_SELECTOR);

		var routes = {
			left: indexh > 0 || config.loop,
			right: indexh < horizontalSlides.length - 1 || config.loop,
			up: indexv > 0,
			down: indexv < verticalSlides.length - 1
		};

		// reverse horizontal controls for rtl
		if (config.rtl) {
			var left = routes.left;
			routes.left = routes.right;
			routes.right = left;
		}

		return routes;
	}

	/**
  * Returns an object describing the available fragment
  * directions.
  *
  * @return {{prev: boolean, next: boolean}}
  */
	function availableFragments() {

		if (currentSlide && config.fragments) {
			var fragments = currentSlide.querySelectorAll('.fragment');
			var hiddenFragments = currentSlide.querySelectorAll('.fragment:not(.visible)');

			return {
				prev: fragments.length - hiddenFragments.length > 0,
				next: !!hiddenFragments.length
			};
		} else {
			return { prev: false, next: false };
		}
	}

	/**
  * Enforces origin-specific format rules for embedded media.
  */
	function formatEmbeddedContent() {

		var _appendParamToIframeSource = function _appendParamToIframeSource(sourceAttribute, sourceURL, param) {
			toArray(dom.slides.querySelectorAll('iframe[' + sourceAttribute + '*="' + sourceURL + '"]')).forEach(function (el) {
				var src = el.getAttribute(sourceAttribute);
				if (src && src.indexOf(param) === -1) {
					el.setAttribute(sourceAttribute, src + (!/\?/.test(src) ? '?' : '&') + param);
				}
			});
		};

		// YouTube frames must include "?enablejsapi=1"
		_appendParamToIframeSource('src', 'youtube.com/embed/', 'enablejsapi=1');
		_appendParamToIframeSource('data-src', 'youtube.com/embed/', 'enablejsapi=1');

		// Vimeo frames must include "?api=1"
		_appendParamToIframeSource('src', 'player.vimeo.com/', 'api=1');
		_appendParamToIframeSource('data-src', 'player.vimeo.com/', 'api=1');

		// Always show media controls on mobile devices
		if (isMobileDevice) {
			toArray(dom.slides.querySelectorAll('video, audio')).forEach(function (el) {
				el.controls = true;
			});
		}
	}

	/**
  * Start playback of any embedded content inside of
  * the given element.
  *
  * @param {HTMLElement} element
  */
	function startEmbeddedContent(element) {

		if (element && !isSpeakerNotes()) {

			// Restart GIFs
			toArray(element.querySelectorAll('img[src$=".gif"]')).forEach(function (el) {
				// Setting the same unchanged source like this was confirmed
				// to work in Chrome, FF & Safari
				el.setAttribute('src', el.getAttribute('src'));
			});

			// HTML5 media elements
			toArray(element.querySelectorAll('video, audio')).forEach(function (el) {
				if (closestParent(el, '.fragment') && !closestParent(el, '.fragment.visible')) {
					return;
				}

				// Prefer an explicit global autoplay setting
				var autoplay = config.autoPlayMedia;

				// If no global setting is available, fall back on the element's
				// own autoplay setting
				if (typeof autoplay !== 'boolean') {
					autoplay = el.hasAttribute('data-autoplay') || !!closestParent(el, '.slide-background');
				}

				if (autoplay && typeof el.play === 'function') {

					if (el.readyState > 1) {
						startEmbeddedMedia({ target: el });
					} else {
						el.removeEventListener('loadeddata', startEmbeddedMedia); // remove first to avoid dupes
						el.addEventListener('loadeddata', startEmbeddedMedia);
					}
				}
			});

			// Normal iframes
			toArray(element.querySelectorAll('iframe[src]')).forEach(function (el) {
				if (closestParent(el, '.fragment') && !closestParent(el, '.fragment.visible')) {
					return;
				}

				startEmbeddedIframe({ target: el });
			});

			// Lazy loading iframes
			toArray(element.querySelectorAll('iframe[data-src]')).forEach(function (el) {
				if (closestParent(el, '.fragment') && !closestParent(el, '.fragment.visible')) {
					return;
				}

				if (el.getAttribute('src') !== el.getAttribute('data-src')) {
					el.removeEventListener('load', startEmbeddedIframe); // remove first to avoid dupes
					el.addEventListener('load', startEmbeddedIframe);
					el.setAttribute('src', el.getAttribute('data-src'));
				}
			});
		}
	}

	/**
  * Starts playing an embedded video/audio element after
  * it has finished loading.
  *
  * @param {object} event
  */
	function startEmbeddedMedia(event) {

		var isAttachedToDOM = !!closestParent(event.target, 'html'),
		    isVisible = !!closestParent(event.target, '.present');

		if (isAttachedToDOM && isVisible) {
			event.target.currentTime = 0;
			event.target.play();
		}

		event.target.removeEventListener('loadeddata', startEmbeddedMedia);
	}

	/**
  * "Starts" the content of an embedded iframe using the
  * postMessage API.
  *
  * @param {object} event
  */
	function startEmbeddedIframe(event) {

		var iframe = event.target;

		if (iframe && iframe.contentWindow) {

			var isAttachedToDOM = !!closestParent(event.target, 'html'),
			    isVisible = !!closestParent(event.target, '.present');

			if (isAttachedToDOM && isVisible) {

				// Prefer an explicit global autoplay setting
				var autoplay = config.autoPlayMedia;

				// If no global setting is available, fall back on the element's
				// own autoplay setting
				if (typeof autoplay !== 'boolean') {
					autoplay = iframe.hasAttribute('data-autoplay') || !!closestParent(iframe, '.slide-background');
				}

				// YouTube postMessage API
				if (/youtube\.com\/embed\//.test(iframe.getAttribute('src')) && autoplay) {
					iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
				}
				// Vimeo postMessage API
				else if (/player\.vimeo\.com\//.test(iframe.getAttribute('src')) && autoplay) {
						iframe.contentWindow.postMessage('{"method":"play"}', '*');
					}
					// Generic postMessage API
					else {
							iframe.contentWindow.postMessage('slide:start', '*');
						}
			}
		}
	}

	/**
  * Stop playback of any embedded content inside of
  * the targeted slide.
  *
  * @param {HTMLElement} element
  */
	function stopEmbeddedContent(element, options) {

		options = extend({
			// Defaults
			unloadIframes: true
		}, options || {});

		if (element && element.parentNode) {
			// HTML5 media elements
			toArray(element.querySelectorAll('video, audio')).forEach(function (el) {
				if (!el.hasAttribute('data-ignore') && typeof el.pause === 'function') {
					el.setAttribute('data-paused-by-reveal', '');
					el.pause();
				}
			});

			// Generic postMessage API for non-lazy loaded iframes
			toArray(element.querySelectorAll('iframe')).forEach(function (el) {
				if (el.contentWindow) el.contentWindow.postMessage('slide:stop', '*');
				el.removeEventListener('load', startEmbeddedIframe);
			});

			// YouTube postMessage API
			toArray(element.querySelectorAll('iframe[src*="youtube.com/embed/"]')).forEach(function (el) {
				if (!el.hasAttribute('data-ignore') && el.contentWindow && typeof el.contentWindow.postMessage === 'function') {
					el.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
				}
			});

			// Vimeo postMessage API
			toArray(element.querySelectorAll('iframe[src*="player.vimeo.com/"]')).forEach(function (el) {
				if (!el.hasAttribute('data-ignore') && el.contentWindow && typeof el.contentWindow.postMessage === 'function') {
					el.contentWindow.postMessage('{"method":"pause"}', '*');
				}
			});

			if (options.unloadIframes === true) {
				// Unload lazy-loaded iframes
				toArray(element.querySelectorAll('iframe[data-src]')).forEach(function (el) {
					// Only removing the src doesn't actually unload the frame
					// in all browsers (Firefox) so we set it to blank first
					el.setAttribute('src', 'about:blank');
					el.removeAttribute('src');
				});
			}
		}
	}

	/**
  * Returns the number of past slides. This can be used as a global
  * flattened index for slides.
  *
  * @return {number} Past slide count
  */
	function getSlidePastCount() {

		var horizontalSlides = toArray(dom.wrapper.querySelectorAll(HORIZONTAL_SLIDES_SELECTOR));

		// The number of past slides
		var pastCount = 0;

		// Step through all slides and count the past ones
		mainLoop: for (var i = 0; i < horizontalSlides.length; i++) {

			var horizontalSlide = horizontalSlides[i];
			var verticalSlides = toArray(horizontalSlide.querySelectorAll('section'));

			for (var j = 0; j < verticalSlides.length; j++) {

				// Stop as soon as we arrive at the present
				if (verticalSlides[j].classList.contains('present')) {
					break mainLoop;
				}

				pastCount++;
			}

			// Stop as soon as we arrive at the present
			if (horizontalSlide.classList.contains('present')) {
				break;
			}

			// Don't count the wrapping section for vertical slides
			if (horizontalSlide.classList.contains('stack') === false) {
				pastCount++;
			}
		}

		return pastCount;
	}

	/**
  * Returns a value ranging from 0-1 that represents
  * how far into the presentation we have navigated.
  *
  * @return {number}
  */
	function getProgress() {

		// The number of past and total slides
		var totalCount = getTotalSlides();
		var pastCount = getSlidePastCount();

		if (currentSlide) {

			var allFragments = currentSlide.querySelectorAll('.fragment');

			// If there are fragments in the current slide those should be
			// accounted for in the progress.
			if (allFragments.length > 0) {
				var visibleFragments = currentSlide.querySelectorAll('.fragment.visible');

				// This value represents how big a portion of the slide progress
				// that is made up by its fragments (0-1)
				var fragmentWeight = 0.9;

				// Add fragment progress to the past slide count
				pastCount += visibleFragments.length / allFragments.length * fragmentWeight;
			}
		}

		return pastCount / (totalCount - 1);
	}

	/**
  * Checks if this presentation is running inside of the
  * speaker notes window.
  *
  * @return {boolean}
  */
	function isSpeakerNotes() {

		return !!window.location.search.match(/receiver/gi);
	}

	/**
  * Reads the current URL (hash) and navigates accordingly.
  */
	function readURL() {

		var hash = window.location.hash;

		// Attempt to parse the hash as either an index or name
		var bits = hash.slice(2).split('/'),
		    name = hash.replace(/#|\//gi, '');

		// If the first bit is invalid and there is a name we can
		// assume that this is a named link
		if (isNaN(parseInt(bits[0], 10)) && name.length) {
			var element;

			// Ensure the named link is a valid HTML ID attribute
			if (/^[a-zA-Z][\w:.-]*$/.test(name)) {
				// Find the slide with the specified ID
				element = document.getElementById(name);
			}

			if (element) {
				// Find the position of the named slide and navigate to it
				var indices = Reveal.getIndices(element);
				slide(indices.h, indices.v);
			}
			// If the slide doesn't exist, navigate to the current slide
			else {
					slide(indexh || 0, indexv || 0);
				}
		} else {
			// Read the index components of the hash
			var h = parseInt(bits[0], 10) || 0,
			    v = parseInt(bits[1], 10) || 0;

			if (h !== indexh || v !== indexv) {
				slide(h, v);
			}
		}
	}

	/**
  * Updates the page URL (hash) to reflect the current
  * state.
  *
  * @param {number} delay The time in ms to wait before
  * writing the hash
  */
	function writeURL(delay) {

		if (config.history) {

			// Make sure there's never more than one timeout running
			clearTimeout(writeURLTimeout);

			// If a delay is specified, timeout this call
			if (typeof delay === 'number') {
				writeURLTimeout = setTimeout(writeURL, delay);
			} else if (currentSlide) {
				var url = '/';

				// Attempt to create a named link based on the slide's ID
				var id = currentSlide.getAttribute('id');
				if (id) {
					id = id.replace(/[^a-zA-Z0-9\-\_\:\.]/g, '');
				}

				// If the current slide has an ID, use that as a named link
				if (typeof id === 'string' && id.length) {
					url = '/' + id;
				}
				// Otherwise use the /h/v index
				else {
						if (indexh > 0 || indexv > 0) url += indexh;
						if (indexv > 0) url += '/' + indexv;
					}

				window.location.hash = url;
			}
		}
	}
	/**
  * Retrieves the h/v location and fragment of the current,
  * or specified, slide.
  *
  * @param {HTMLElement} [slide] If specified, the returned
  * index will be for this slide rather than the currently
  * active one
  *
  * @return {{h: number, v: number, f: number}}
  */
	function getIndices(slide) {

		// By default, return the current indices
		var h = indexh,
		    v = indexv,
		    f;

		// If a slide is specified, return the indices of that slide
		if (slide) {
			var isVertical = isVerticalSlide(slide);
			var slideh = isVertical ? slide.parentNode : slide;

			// Select all horizontal slides
			var horizontalSlides = toArray(dom.wrapper.querySelectorAll(HORIZONTAL_SLIDES_SELECTOR));

			// Now that we know which the horizontal slide is, get its index
			h = Math.max(horizontalSlides.indexOf(slideh), 0);

			// Assume we're not vertical
			v = undefined;

			// If this is a vertical slide, grab the vertical index
			if (isVertical) {
				v = Math.max(toArray(slide.parentNode.querySelectorAll('section')).indexOf(slide), 0);
			}
		}

		if (!slide && currentSlide) {
			var hasFragments = currentSlide.querySelectorAll('.fragment').length > 0;
			if (hasFragments) {
				var currentFragment = currentSlide.querySelector('.current-fragment');
				if (currentFragment && currentFragment.hasAttribute('data-fragment-index')) {
					f = parseInt(currentFragment.getAttribute('data-fragment-index'), 10);
				} else {
					f = currentSlide.querySelectorAll('.fragment.visible').length - 1;
				}
			}
		}

		return { h: h, v: v, f: f };
	}

	/**
  * Retrieves all slides in this presentation.
  */
	function getSlides() {

		return toArray(dom.wrapper.querySelectorAll(SLIDES_SELECTOR + ':not(.stack)'));
	}

	/**
  * Retrieves the total number of slides in this presentation.
  *
  * @return {number}
  */
	function getTotalSlides() {

		return getSlides().length;
	}

	/**
  * Returns the slide element matching the specified index.
  *
  * @return {HTMLElement}
  */
	function getSlide(x, y) {

		var horizontalSlide = dom.wrapper.querySelectorAll(HORIZONTAL_SLIDES_SELECTOR)[x];
		var verticalSlides = horizontalSlide && horizontalSlide.querySelectorAll('section');

		if (verticalSlides && verticalSlides.length && typeof y === 'number') {
			return verticalSlides ? verticalSlides[y] : undefined;
		}

		return horizontalSlide;
	}

	/**
  * Returns the background element for the given slide.
  * All slides, even the ones with no background properties
  * defined, have a background element so as long as the
  * index is valid an element will be returned.
  *
  * @param {number} x Horizontal background index
  * @param {number} y Vertical background index
  * @return {(HTMLElement[]|*)}
  */
	function getSlideBackground(x, y) {

		var slide = getSlide(x, y);
		if (slide) {
			return slide.slideBackgroundElement;
		}

		return undefined;
	}

	/**
  * Retrieves the speaker notes from a slide. Notes can be
  * defined in two ways:
  * 1. As a data-notes attribute on the slide <section>
  * 2. As an <aside class="notes"> inside of the slide
  *
  * @param {HTMLElement} [slide=currentSlide]
  * @return {(string|null)}
  */
	function getSlideNotes(slide) {

		// Default to the current slide
		slide = slide || currentSlide;

		// Notes can be specified via the data-notes attribute...
		if (slide.hasAttribute('data-notes')) {
			return slide.getAttribute('data-notes');
		}

		// ... or using an <aside class="notes"> element
		var notesElement = slide.querySelector('aside.notes');
		if (notesElement) {
			return notesElement.innerHTML;
		}

		return null;
	}

	/**
  * Retrieves the current state of the presentation as
  * an object. This state can then be restored at any
  * time.
  *
  * @return {{indexh: number, indexv: number, indexf: number, paused: boolean, overview: boolean}}
  */
	function getState() {

		var indices = getIndices();

		return {
			indexh: indices.h,
			indexv: indices.v,
			indexf: indices.f,
			paused: isPaused(),
			overview: isOverview()
		};
	}

	/**
  * Restores the presentation to the given state.
  *
  * @param {object} state As generated by getState()
  * @see {@link getState} generates the parameter `state`
  */
	function setState(state) {

		if ((typeof state === 'undefined' ? 'undefined' : _typeof(state)) === 'object') {
			slide(deserialize(state.indexh), deserialize(state.indexv), deserialize(state.indexf));

			var pausedFlag = deserialize(state.paused),
			    overviewFlag = deserialize(state.overview);

			if (typeof pausedFlag === 'boolean' && pausedFlag !== isPaused()) {
				togglePause(pausedFlag);
			}

			if (typeof overviewFlag === 'boolean' && overviewFlag !== isOverview()) {
				toggleOverview(overviewFlag);
			}
		}
	}

	/**
  * Return a sorted fragments list, ordered by an increasing
  * "data-fragment-index" attribute.
  *
  * Fragments will be revealed in the order that they are returned by
  * this function, so you can use the index attributes to control the
  * order of fragment appearance.
  *
  * To maintain a sensible default fragment order, fragments are presumed
  * to be passed in document order. This function adds a "fragment-index"
  * attribute to each node if such an attribute is not already present,
  * and sets that attribute to an integer value which is the position of
  * the fragment within the fragments list.
  *
  * @param {object[]|*} fragments
  * @return {object[]} sorted Sorted array of fragments
  */
	function sortFragments(fragments) {

		fragments = toArray(fragments);

		var ordered = [],
		    unordered = [],
		    sorted = [];

		// Group ordered and unordered elements
		fragments.forEach(function (fragment, i) {
			if (fragment.hasAttribute('data-fragment-index')) {
				var index = parseInt(fragment.getAttribute('data-fragment-index'), 10);

				if (!ordered[index]) {
					ordered[index] = [];
				}

				ordered[index].push(fragment);
			} else {
				unordered.push([fragment]);
			}
		});

		// Append fragments without explicit indices in their
		// DOM order
		ordered = ordered.concat(unordered);

		// Manually count the index up per group to ensure there
		// are no gaps
		var index = 0;

		// Push all fragments in their sorted order to an array,
		// this flattens the groups
		ordered.forEach(function (group) {
			group.forEach(function (fragment) {
				sorted.push(fragment);
				fragment.setAttribute('data-fragment-index', index);
			});

			index++;
		});

		return sorted;
	}

	/**
  * Navigate to the specified slide fragment.
  *
  * @param {?number} index The index of the fragment that
  * should be shown, -1 means all are invisible
  * @param {number} offset Integer offset to apply to the
  * fragment index
  *
  * @return {boolean} true if a change was made in any
  * fragments visibility as part of this call
  */
	function navigateFragment(index, offset) {

		if (currentSlide && config.fragments) {

			var fragments = sortFragments(currentSlide.querySelectorAll('.fragment'));
			if (fragments.length) {

				// If no index is specified, find the current
				if (typeof index !== 'number') {
					var lastVisibleFragment = sortFragments(currentSlide.querySelectorAll('.fragment.visible')).pop();

					if (lastVisibleFragment) {
						index = parseInt(lastVisibleFragment.getAttribute('data-fragment-index') || 0, 10);
					} else {
						index = -1;
					}
				}

				// If an offset is specified, apply it to the index
				if (typeof offset === 'number') {
					index += offset;
				}

				var fragmentsShown = [],
				    fragmentsHidden = [];

				toArray(fragments).forEach(function (element, i) {

					if (element.hasAttribute('data-fragment-index')) {
						i = parseInt(element.getAttribute('data-fragment-index'), 10);
					}

					// Visible fragments
					if (i <= index) {
						if (!element.classList.contains('visible')) fragmentsShown.push(element);
						element.classList.add('visible');
						element.classList.remove('current-fragment');

						// Announce the fragments one by one to the Screen Reader
						dom.statusDiv.textContent = getStatusText(element);

						if (i === index) {
							element.classList.add('current-fragment');
							startEmbeddedContent(element);
						}
					}
					// Hidden fragments
					else {
							if (element.classList.contains('visible')) fragmentsHidden.push(element);
							element.classList.remove('visible');
							element.classList.remove('current-fragment');
						}
				});

				if (fragmentsHidden.length) {
					dispatchEvent('fragmenthidden', { fragment: fragmentsHidden[0], fragments: fragmentsHidden });
				}

				if (fragmentsShown.length) {
					dispatchEvent('fragmentshown', { fragment: fragmentsShown[0], fragments: fragmentsShown });
				}

				updateControls();
				updateProgress();

				return !!(fragmentsShown.length || fragmentsHidden.length);
			}
		}

		return false;
	}

	/**
  * Navigate to the next slide fragment.
  *
  * @return {boolean} true if there was a next fragment,
  * false otherwise
  */
	function nextFragment() {

		return navigateFragment(null, 1);
	}

	/**
  * Navigate to the previous slide fragment.
  *
  * @return {boolean} true if there was a previous fragment,
  * false otherwise
  */
	function previousFragment() {

		return navigateFragment(null, -1);
	}

	/**
  * Cues a new automated slide if enabled in the config.
  */
	function cueAutoSlide() {

		cancelAutoSlide();

		if (currentSlide && config.autoSlide !== false) {

			var fragment = currentSlide.querySelector('.current-fragment');

			// When the slide first appears there is no "current" fragment so
			// we look for a data-autoslide timing on the first fragment
			if (!fragment) fragment = currentSlide.querySelector('.fragment');

			var fragmentAutoSlide = fragment ? fragment.getAttribute('data-autoslide') : null;
			var parentAutoSlide = currentSlide.parentNode ? currentSlide.parentNode.getAttribute('data-autoslide') : null;
			var slideAutoSlide = currentSlide.getAttribute('data-autoslide');

			// Pick value in the following priority order:
			// 1. Current fragment's data-autoslide
			// 2. Current slide's data-autoslide
			// 3. Parent slide's data-autoslide
			// 4. Global autoSlide setting
			if (fragmentAutoSlide) {
				autoSlide = parseInt(fragmentAutoSlide, 10);
			} else if (slideAutoSlide) {
				autoSlide = parseInt(slideAutoSlide, 10);
			} else if (parentAutoSlide) {
				autoSlide = parseInt(parentAutoSlide, 10);
			} else {
				autoSlide = config.autoSlide;
			}

			// If there are media elements with data-autoplay,
			// automatically set the autoSlide duration to the
			// length of that media. Not applicable if the slide
			// is divided up into fragments.
			// playbackRate is accounted for in the duration.
			if (currentSlide.querySelectorAll('.fragment').length === 0) {
				toArray(currentSlide.querySelectorAll('video, audio')).forEach(function (el) {
					if (el.hasAttribute('data-autoplay')) {
						if (autoSlide && el.duration * 1000 / el.playbackRate > autoSlide) {
							autoSlide = el.duration * 1000 / el.playbackRate + 1000;
						}
					}
				});
			}

			// Cue the next auto-slide if:
			// - There is an autoSlide value
			// - Auto-sliding isn't paused by the user
			// - The presentation isn't paused
			// - The overview isn't active
			// - The presentation isn't over
			if (autoSlide && !autoSlidePaused && !isPaused() && !isOverview() && (!Reveal.isLastSlide() || availableFragments().next || config.loop === true)) {
				autoSlideTimeout = setTimeout(function () {
					typeof config.autoSlideMethod === 'function' ? config.autoSlideMethod() : navigateNext();
					cueAutoSlide();
				}, autoSlide);
				autoSlideStartTime = Date.now();
			}

			if (autoSlidePlayer) {
				autoSlidePlayer.setPlaying(autoSlideTimeout !== -1);
			}
		}
	}

	/**
  * Cancels any ongoing request to auto-slide.
  */
	function cancelAutoSlide() {

		clearTimeout(autoSlideTimeout);
		autoSlideTimeout = -1;
	}

	function pauseAutoSlide() {

		if (autoSlide && !autoSlidePaused) {
			autoSlidePaused = true;
			dispatchEvent('autoslidepaused');
			clearTimeout(autoSlideTimeout);

			if (autoSlidePlayer) {
				autoSlidePlayer.setPlaying(false);
			}
		}
	}

	function resumeAutoSlide() {

		if (autoSlide && autoSlidePaused) {
			autoSlidePaused = false;
			dispatchEvent('autoslideresumed');
			cueAutoSlide();
		}
	}

	function navigateLeft() {

		// Reverse for RTL
		if (config.rtl) {
			if ((isOverview() || nextFragment() === false) && availableRoutes().left) {
				slide(indexh + 1);
			}
		}
		// Normal navigation
		else if ((isOverview() || previousFragment() === false) && availableRoutes().left) {
				slide(indexh - 1);
			}
	}

	function navigateRight() {

		hasNavigatedRight = true;

		// Reverse for RTL
		if (config.rtl) {
			if ((isOverview() || previousFragment() === false) && availableRoutes().right) {
				slide(indexh - 1);
			}
		}
		// Normal navigation
		else if ((isOverview() || nextFragment() === false) && availableRoutes().right) {
				slide(indexh + 1);
			}
	}

	function navigateUp() {

		// Prioritize hiding fragments
		if ((isOverview() || previousFragment() === false) && availableRoutes().up) {
			slide(indexh, indexv - 1);
		}
	}

	function navigateDown() {

		hasNavigatedDown = true;

		// Prioritize revealing fragments
		if ((isOverview() || nextFragment() === false) && availableRoutes().down) {
			slide(indexh, indexv + 1);
		}
	}

	/**
  * Navigates backwards, prioritized in the following order:
  * 1) Previous fragment
  * 2) Previous vertical slide
  * 3) Previous horizontal slide
  */
	function navigatePrev() {

		// Prioritize revealing fragments
		if (previousFragment() === false) {
			if (availableRoutes().up) {
				navigateUp();
			} else {
				// Fetch the previous horizontal slide, if there is one
				var previousSlide;

				if (config.rtl) {
					previousSlide = toArray(dom.wrapper.querySelectorAll(HORIZONTAL_SLIDES_SELECTOR + '.future')).pop();
				} else {
					previousSlide = toArray(dom.wrapper.querySelectorAll(HORIZONTAL_SLIDES_SELECTOR + '.past')).pop();
				}

				if (previousSlide) {
					var v = previousSlide.querySelectorAll('section').length - 1 || undefined;
					var h = indexh - 1;
					slide(h, v);
				}
			}
		}
	}

	/**
  * The reverse of #navigatePrev().
  */
	function navigateNext() {

		hasNavigatedRight = true;
		hasNavigatedDown = true;

		// Prioritize revealing fragments
		if (nextFragment() === false) {
			if (availableRoutes().down) {
				navigateDown();
			} else if (config.rtl) {
				navigateLeft();
			} else {
				navigateRight();
			}
		}
	}

	/**
  * Checks if the target element prevents the triggering of
  * swipe navigation.
  */
	function isSwipePrevented(target) {

		while (target && typeof target.hasAttribute === 'function') {
			if (target.hasAttribute('data-prevent-swipe')) return true;
			target = target.parentNode;
		}

		return false;
	}

	// --------------------------------------------------------------------//
	// ----------------------------- EVENTS -------------------------------//
	// --------------------------------------------------------------------//

	/**
  * Called by all event handlers that are based on user
  * input.
  *
  * @param {object} [event]
  */
	function onUserInput(event) {

		if (config.autoSlideStoppable) {
			pauseAutoSlide();
		}
	}

	/**
  * Handler for the document level 'keypress' event.
  *
  * @param {object} event
  */
	function onDocumentKeyPress(event) {

		// Check if the pressed key is question mark
		if (event.shiftKey && event.charCode === 63) {
			toggleHelp();
		}
	}

	/**
  * Handler for the document level 'keydown' event.
  *
  * @param {object} event
  */
	function onDocumentKeyDown(event) {

		// If there's a condition specified and it returns false,
		// ignore this event
		if (typeof config.keyboardCondition === 'function' && config.keyboardCondition() === false) {
			return true;
		}

		// Remember if auto-sliding was paused so we can toggle it
		var autoSlideWasPaused = autoSlidePaused;

		onUserInput(event);

		// Check if there's a focused element that could be using
		// the keyboard
		var activeElementIsCE = document.activeElement && document.activeElement.contentEditable !== 'inherit';
		var activeElementIsInput = document.activeElement && document.activeElement.tagName && /input|textarea/i.test(document.activeElement.tagName);
		var activeElementIsNotes = document.activeElement && document.activeElement.className && /speaker-notes/i.test(document.activeElement.className);

		// Disregard the event if there's a focused element or a
		// keyboard modifier key is present
		if (activeElementIsCE || activeElementIsInput || activeElementIsNotes || event.shiftKey && event.keyCode !== 32 || event.altKey || event.ctrlKey || event.metaKey) return;

		// While paused only allow resume keyboard events; 'b', 'v', '.'
		var resumeKeyCodes = [66, 86, 190, 191];
		var key;

		// Custom key bindings for togglePause should be able to resume
		if (_typeof(config.keyboard) === 'object') {
			for (key in config.keyboard) {
				if (config.keyboard[key] === 'togglePause') {
					resumeKeyCodes.push(parseInt(key, 10));
				}
			}
		}

		if (isPaused() && resumeKeyCodes.indexOf(event.keyCode) === -1) {
			return false;
		}

		var triggered = false;

		// 1. User defined key bindings
		if (_typeof(config.keyboard) === 'object') {

			for (key in config.keyboard) {

				// Check if this binding matches the pressed key
				if (parseInt(key, 10) === event.keyCode) {

					var value = config.keyboard[key];

					// Callback function
					if (typeof value === 'function') {
						value.apply(null, [event]);
					}
					// String shortcuts to reveal.js API
					else if (typeof value === 'string' && typeof Reveal[value] === 'function') {
							Reveal[value].call();
						}

					triggered = true;
				}
			}
		}

		// 2. System defined key bindings
		if (triggered === false) {

			// Assume true and try to prove false
			triggered = true;

			switch (event.keyCode) {
				// p, page up
				case 80:case 33:
					navigatePrev();break;
				// n, page down
				case 78:case 34:
					navigateNext();break;
				// h, left
				case 72:case 37:
					navigateLeft();break;
				// l, right
				case 76:case 39:
					navigateRight();break;
				// k, up
				case 75:case 38:
					navigateUp();break;
				// j, down
				case 74:case 40:
					navigateDown();break;
				// home
				case 36:
					slide(0);break;
				// end
				case 35:
					slide(Number.MAX_VALUE);break;
				// space
				case 32:
					isOverview() ? deactivateOverview() : event.shiftKey ? navigatePrev() : navigateNext();break;
				// return
				case 13:
					isOverview() ? deactivateOverview() : triggered = false;break;
				// two-spot, semicolon, b, v, period, Logitech presenter tools "black screen" button
				case 58:case 59:case 66:case 86:case 190:case 191:
					togglePause();break;
				// f
				case 70:
					enterFullscreen();break;
				// a
				case 65:
					if (config.autoSlideStoppable) toggleAutoSlide(autoSlideWasPaused);break;
				default:
					triggered = false;
			}
		}

		// If the input resulted in a triggered action we should prevent
		// the browsers default behavior
		if (triggered) {
			event.preventDefault && event.preventDefault();
		}
		// ESC or O key
		else if ((event.keyCode === 27 || event.keyCode === 79) && features.transforms3d) {
				if (dom.overlay) {
					closeOverlay();
				} else {
					toggleOverview();
				}

				event.preventDefault && event.preventDefault();
			}

		// If auto-sliding is enabled we need to cue up
		// another timeout
		cueAutoSlide();
	}

	/**
  * Handler for the 'touchstart' event, enables support for
  * swipe and pinch gestures.
  *
  * @param {object} event
  */
	function onTouchStart(event) {

		if (isSwipePrevented(event.target)) return true;

		touch.startX = event.touches[0].clientX;
		touch.startY = event.touches[0].clientY;
		touch.startCount = event.touches.length;

		// If there's two touches we need to memorize the distance
		// between those two points to detect pinching
		if (event.touches.length === 2 && config.overview) {
			touch.startSpan = distanceBetween({
				x: event.touches[1].clientX,
				y: event.touches[1].clientY
			}, {
				x: touch.startX,
				y: touch.startY
			});
		}
	}

	/**
  * Handler for the 'touchmove' event.
  *
  * @param {object} event
  */
	function onTouchMove(event) {

		if (isSwipePrevented(event.target)) return true;

		// Each touch should only trigger one action
		if (!touch.captured) {
			onUserInput(event);

			var currentX = event.touches[0].clientX;
			var currentY = event.touches[0].clientY;

			// If the touch started with two points and still has
			// two active touches; test for the pinch gesture
			if (event.touches.length === 2 && touch.startCount === 2 && config.overview) {

				// The current distance in pixels between the two touch points
				var currentSpan = distanceBetween({
					x: event.touches[1].clientX,
					y: event.touches[1].clientY
				}, {
					x: touch.startX,
					y: touch.startY
				});

				// If the span is larger than the desire amount we've got
				// ourselves a pinch
				if (Math.abs(touch.startSpan - currentSpan) > touch.threshold) {
					touch.captured = true;

					if (currentSpan < touch.startSpan) {
						activateOverview();
					} else {
						deactivateOverview();
					}
				}

				event.preventDefault();
			}
			// There was only one touch point, look for a swipe
			else if (event.touches.length === 1 && touch.startCount !== 2) {

					var deltaX = currentX - touch.startX,
					    deltaY = currentY - touch.startY;

					if (deltaX > touch.threshold && Math.abs(deltaX) > Math.abs(deltaY)) {
						touch.captured = true;
						navigateLeft();
					} else if (deltaX < -touch.threshold && Math.abs(deltaX) > Math.abs(deltaY)) {
						touch.captured = true;
						navigateRight();
					} else if (deltaY > touch.threshold) {
						touch.captured = true;
						navigateUp();
					} else if (deltaY < -touch.threshold) {
						touch.captured = true;
						navigateDown();
					}

					// If we're embedded, only block touch events if they have
					// triggered an action
					if (config.embedded) {
						if (touch.captured || isVerticalSlide(currentSlide)) {
							event.preventDefault();
						}
					}
					// Not embedded? Block them all to avoid needless tossing
					// around of the viewport in iOS
					else {
							event.preventDefault();
						}
				}
		}
		// There's a bug with swiping on some Android devices unless
		// the default action is always prevented
		else if (UA.match(/android/gi)) {
				event.preventDefault();
			}
	}

	/**
  * Handler for the 'touchend' event.
  *
  * @param {object} event
  */
	function onTouchEnd(event) {

		touch.captured = false;
	}

	/**
  * Convert pointer down to touch start.
  *
  * @param {object} event
  */
	function onPointerDown(event) {

		if (event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === "touch") {
			event.touches = [{ clientX: event.clientX, clientY: event.clientY }];
			onTouchStart(event);
		}
	}

	/**
  * Convert pointer move to touch move.
  *
  * @param {object} event
  */
	function onPointerMove(event) {

		if (event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === "touch") {
			event.touches = [{ clientX: event.clientX, clientY: event.clientY }];
			onTouchMove(event);
		}
	}

	/**
  * Convert pointer up to touch end.
  *
  * @param {object} event
  */
	function onPointerUp(event) {

		if (event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === "touch") {
			event.touches = [{ clientX: event.clientX, clientY: event.clientY }];
			onTouchEnd(event);
		}
	}

	/**
  * Handles mouse wheel scrolling, throttled to avoid skipping
  * multiple slides.
  *
  * @param {object} event
  */
	function onDocumentMouseScroll(event) {

		if (Date.now() - lastMouseWheelStep > 600) {

			lastMouseWheelStep = Date.now();

			var delta = event.detail || -event.wheelDelta;
			if (delta > 0) {
				navigateNext();
			} else if (delta < 0) {
				navigatePrev();
			}
		}
	}

	/**
  * Clicking on the progress bar results in a navigation to the
  * closest approximate horizontal slide using this equation:
  *
  * ( clickX / presentationWidth ) * numberOfSlides
  *
  * @param {object} event
  */
	function onProgressClicked(event) {

		onUserInput(event);

		event.preventDefault();

		var slidesTotal = toArray(dom.wrapper.querySelectorAll(HORIZONTAL_SLIDES_SELECTOR)).length;
		var slideIndex = Math.floor(event.clientX / dom.wrapper.offsetWidth * slidesTotal);

		if (config.rtl) {
			slideIndex = slidesTotal - slideIndex;
		}

		slide(slideIndex);
	}

	/**
  * Event handler for navigation control buttons.
  */
	function onNavigateLeftClicked(event) {
		event.preventDefault();onUserInput();navigateLeft();
	}
	function onNavigateRightClicked(event) {
		event.preventDefault();onUserInput();navigateRight();
	}
	function onNavigateUpClicked(event) {
		event.preventDefault();onUserInput();navigateUp();
	}
	function onNavigateDownClicked(event) {
		event.preventDefault();onUserInput();navigateDown();
	}
	function onNavigatePrevClicked(event) {
		event.preventDefault();onUserInput();navigatePrev();
	}
	function onNavigateNextClicked(event) {
		event.preventDefault();onUserInput();navigateNext();
	}

	/**
  * Handler for the window level 'hashchange' event.
  *
  * @param {object} [event]
  */
	function onWindowHashChange(event) {

		readURL();
	}

	/**
  * Handler for the window level 'resize' event.
  *
  * @param {object} [event]
  */
	function onWindowResize(event) {

		layout();
	}

	/**
  * Handle for the window level 'visibilitychange' event.
  *
  * @param {object} [event]
  */
	function onPageVisibilityChange(event) {

		var isHidden = document.webkitHidden || document.msHidden || document.hidden;

		// If, after clicking a link or similar and we're coming back,
		// focus the document.body to ensure we can use keyboard shortcuts
		if (isHidden === false && document.activeElement !== document.body) {
			// Not all elements support .blur() - SVGs among them.
			if (typeof document.activeElement.blur === 'function') {
				document.activeElement.blur();
			}
			document.body.focus();
		}
	}

	/**
  * Invoked when a slide is and we're in the overview.
  *
  * @param {object} event
  */
	function onOverviewSlideClicked(event) {

		// TODO There's a bug here where the event listeners are not
		// removed after deactivating the overview.
		if (eventsAreBound && isOverview()) {
			event.preventDefault();

			var element = event.target;

			while (element && !element.nodeName.match(/section/gi)) {
				element = element.parentNode;
			}

			if (element && !element.classList.contains('disabled')) {

				deactivateOverview();

				if (element.nodeName.match(/section/gi)) {
					var h = parseInt(element.getAttribute('data-index-h'), 10),
					    v = parseInt(element.getAttribute('data-index-v'), 10);

					slide(h, v);
				}
			}
		}
	}

	/**
  * Handles clicks on links that are set to preview in the
  * iframe overlay.
  *
  * @param {object} event
  */
	function onPreviewLinkClicked(event) {

		if (event.currentTarget && event.currentTarget.hasAttribute('href')) {
			var url = event.currentTarget.getAttribute('href');
			if (url) {
				showPreview(url);
				event.preventDefault();
			}
		}
	}

	/**
  * Handles click on the auto-sliding controls element.
  *
  * @param {object} [event]
  */
	function onAutoSlidePlayerClick(event) {

		// Replay
		if (Reveal.isLastSlide() && config.loop === false) {
			slide(0, 0);
			resumeAutoSlide();
		}
		// Resume
		else if (autoSlidePaused) {
				resumeAutoSlide();
			}
			// Pause
			else {
					pauseAutoSlide();
				}
	}

	// --------------------------------------------------------------------//
	// ------------------------ PLAYBACK COMPONENT ------------------------//
	// --------------------------------------------------------------------//


	/**
  * Constructor for the playback component, which displays
  * play/pause/progress controls.
  *
  * @param {HTMLElement} container The component will append
  * itself to this
  * @param {function} progressCheck A method which will be
  * called frequently to get the current progress on a range
  * of 0-1
  */
	function Playback(container, progressCheck) {

		// Cosmetics
		this.diameter = 100;
		this.diameter2 = this.diameter / 2;
		this.thickness = 6;

		// Flags if we are currently playing
		this.playing = false;

		// Current progress on a 0-1 range
		this.progress = 0;

		// Used to loop the animation smoothly
		this.progressOffset = 1;

		this.container = container;
		this.progressCheck = progressCheck;

		this.canvas = document.createElement('canvas');
		this.canvas.className = 'playback';
		this.canvas.width = this.diameter;
		this.canvas.height = this.diameter;
		this.canvas.style.width = this.diameter2 + 'px';
		this.canvas.style.height = this.diameter2 + 'px';
		this.context = this.canvas.getContext('2d');

		this.container.appendChild(this.canvas);

		this.render();
	}

	/**
  * @param value
  */
	Playback.prototype.setPlaying = function (value) {

		var wasPlaying = this.playing;

		this.playing = value;

		// Start repainting if we weren't already
		if (!wasPlaying && this.playing) {
			this.animate();
		} else {
			this.render();
		}
	};

	Playback.prototype.animate = function () {

		var progressBefore = this.progress;

		this.progress = this.progressCheck();

		// When we loop, offset the progress so that it eases
		// smoothly rather than immediately resetting
		if (progressBefore > 0.8 && this.progress < 0.2) {
			this.progressOffset = this.progress;
		}

		this.render();

		if (this.playing) {
			features.requestAnimationFrameMethod.call(window, this.animate.bind(this));
		}
	};

	/**
  * Renders the current progress and playback state.
  */
	Playback.prototype.render = function () {

		var progress = this.playing ? this.progress : 0,
		    radius = this.diameter2 - this.thickness,
		    x = this.diameter2,
		    y = this.diameter2,
		    iconSize = 28;

		// Ease towards 1
		this.progressOffset += (1 - this.progressOffset) * 0.1;

		var endAngle = -Math.PI / 2 + progress * (Math.PI * 2);
		var startAngle = -Math.PI / 2 + this.progressOffset * (Math.PI * 2);

		this.context.save();
		this.context.clearRect(0, 0, this.diameter, this.diameter);

		// Solid background color
		this.context.beginPath();
		this.context.arc(x, y, radius + 4, 0, Math.PI * 2, false);
		this.context.fillStyle = 'rgba( 0, 0, 0, 0.4 )';
		this.context.fill();

		// Draw progress track
		this.context.beginPath();
		this.context.arc(x, y, radius, 0, Math.PI * 2, false);
		this.context.lineWidth = this.thickness;
		this.context.strokeStyle = 'rgba( 255, 255, 255, 0.2 )';
		this.context.stroke();

		if (this.playing) {
			// Draw progress on top of track
			this.context.beginPath();
			this.context.arc(x, y, radius, startAngle, endAngle, false);
			this.context.lineWidth = this.thickness;
			this.context.strokeStyle = '#fff';
			this.context.stroke();
		}

		this.context.translate(x - iconSize / 2, y - iconSize / 2);

		// Draw play/pause icons
		if (this.playing) {
			this.context.fillStyle = '#fff';
			this.context.fillRect(0, 0, iconSize / 2 - 4, iconSize);
			this.context.fillRect(iconSize / 2 + 4, 0, iconSize / 2 - 4, iconSize);
		} else {
			this.context.beginPath();
			this.context.translate(4, 0);
			this.context.moveTo(0, 0);
			this.context.lineTo(iconSize - 4, iconSize / 2);
			this.context.lineTo(0, iconSize);
			this.context.fillStyle = '#fff';
			this.context.fill();
		}

		this.context.restore();
	};

	Playback.prototype.on = function (type, listener) {
		this.canvas.addEventListener(type, listener, false);
	};

	Playback.prototype.off = function (type, listener) {
		this.canvas.removeEventListener(type, listener, false);
	};

	Playback.prototype.destroy = function () {

		this.playing = false;

		if (this.canvas.parentNode) {
			this.container.removeChild(this.canvas);
		}
	};

	// --------------------------------------------------------------------//
	// ------------------------------- API --------------------------------//
	// --------------------------------------------------------------------//


	Reveal = {
		VERSION: VERSION,

		initialize: initialize,
		configure: configure,
		sync: sync,

		// Navigation methods
		slide: slide,
		left: navigateLeft,
		right: navigateRight,
		up: navigateUp,
		down: navigateDown,
		prev: navigatePrev,
		next: navigateNext,

		// Fragment methods
		navigateFragment: navigateFragment,
		prevFragment: previousFragment,
		nextFragment: nextFragment,

		// Deprecated aliases
		navigateTo: slide,
		navigateLeft: navigateLeft,
		navigateRight: navigateRight,
		navigateUp: navigateUp,
		navigateDown: navigateDown,
		navigatePrev: navigatePrev,
		navigateNext: navigateNext,

		// Forces an update in slide layout
		layout: layout,

		// Randomizes the order of slides
		shuffle: shuffle,

		// Returns an object with the available routes as booleans (left/right/top/bottom)
		availableRoutes: availableRoutes,

		// Returns an object with the available fragments as booleans (prev/next)
		availableFragments: availableFragments,

		// Toggles a help overlay with keyboard shortcuts
		toggleHelp: toggleHelp,

		// Toggles the overview mode on/off
		toggleOverview: toggleOverview,

		// Toggles the "black screen" mode on/off
		togglePause: togglePause,

		// Toggles the auto slide mode on/off
		toggleAutoSlide: toggleAutoSlide,

		// State checks
		isOverview: isOverview,
		isPaused: isPaused,
		isAutoSliding: isAutoSliding,
		isSpeakerNotes: isSpeakerNotes,

		// Slide preloading
		loadSlide: loadSlide,
		unloadSlide: unloadSlide,

		// Adds or removes all internal event listeners (such as keyboard)
		addEventListeners: addEventListeners,
		removeEventListeners: removeEventListeners,

		// Facility for persisting and restoring the presentation state
		getState: getState,
		setState: setState,

		// Presentation progress
		getSlidePastCount: getSlidePastCount,

		// Presentation progress on range of 0-1
		getProgress: getProgress,

		// Returns the indices of the current, or specified, slide
		getIndices: getIndices,

		// Returns an Array of all slides
		getSlides: getSlides,

		// Returns the total number of slides
		getTotalSlides: getTotalSlides,

		// Returns the slide element at the specified index
		getSlide: getSlide,

		// Returns the slide background element at the specified index
		getSlideBackground: getSlideBackground,

		// Returns the speaker notes string for a slide, or null
		getSlideNotes: getSlideNotes,

		// Returns the previous slide element, may be null
		getPreviousSlide: function getPreviousSlide() {
			return previousSlide;
		},

		// Returns the current slide element
		getCurrentSlide: function getCurrentSlide() {
			return currentSlide;
		},

		// Returns the current scale of the presentation content
		getScale: function getScale() {
			return scale;
		},

		// Returns the current configuration object
		getConfig: function getConfig() {
			return config;
		},

		// Helper method, retrieves query string as a key/value hash
		getQueryHash: function getQueryHash() {
			var query = {};

			location.search.replace(/[A-Z0-9]+?=([\w\.%-]*)/gi, function (a) {
				query[a.split('=').shift()] = a.split('=').pop();
			});

			// Basic deserialization
			for (var i in query) {
				var value = query[i];

				query[i] = deserialize(unescape(value));
			}

			return query;
		},

		// Returns true if we're currently on the first slide
		isFirstSlide: function isFirstSlide() {
			return indexh === 0 && indexv === 0;
		},

		// Returns true if we're currently on the last slide
		isLastSlide: function isLastSlide() {
			if (currentSlide) {
				// Does this slide has next a sibling?
				if (currentSlide.nextElementSibling) return false;

				// If it's vertical, does its parent have a next sibling?
				if (isVerticalSlide(currentSlide) && currentSlide.parentNode.nextElementSibling) return false;

				return true;
			}

			return false;
		},

		// Checks if reveal.js has been loaded and is ready for use
		isReady: function isReady() {
			return loaded;
		},

		// Forward event binding to the reveal DOM element
		addEventListener: function addEventListener(type, listener, useCapture) {
			if ('addEventListener' in window) {
				(dom.wrapper || document.querySelector('.reveal')).addEventListener(type, listener, useCapture);
			}
		},
		removeEventListener: function removeEventListener(type, listener, useCapture) {
			if ('addEventListener' in window) {
				(dom.wrapper || document.querySelector('.reveal')).removeEventListener(type, listener, useCapture);
			}
		},

		// Programatically triggers a keyboard event
		triggerKey: function triggerKey(keyCode) {
			onDocumentKeyDown({ keyCode: keyCode });
		},

		// Registers a new shortcut to include in the help overlay
		registerKeyboardShortcut: function registerKeyboardShortcut(key, value) {
			keyboardShortcuts[key] = value;
		}
	};

	return Reveal;
});

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var EventEmitter = __webpack_require__(349);
module.exports = new EventEmitter();

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/source-sans-pro-italic.eot";

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/source-sans-pro-regular.eot";

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/source-sans-pro-semibold.eot";

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/source-sans-pro-semibolditalic.eot";

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

__webpack_require__(346);

__webpack_require__(146);

__webpack_require__(147);

if (global._babelPolyfill) {
  throw new Error("only one instance of babel-polyfill is allowed");
}
global._babelPolyfill = true;

var DEFINE_PROPERTY = "defineProperty";
function define(O, key, value) {
  O[key] || Object[DEFINE_PROPERTY](O, key, {
    writable: true,
    configurable: true,
    value: value
  });
}

define(String.prototype, "padLeft", "".padStart);
define(String.prototype, "padRight", "".padEnd);

"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function (key) {
  [][key] && define(Array, key, Function.call.bind([][key]));
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(50)))

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _reveal = __webpack_require__(134);

var _reveal2 = _interopRequireDefault(_reveal);

var _markdown = __webpack_require__(347);

var _markdown2 = _interopRequireDefault(_markdown);

var _notes = __webpack_require__(348);

var _notes2 = _interopRequireDefault(_notes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(375);
__webpack_require__(374);
// Printing and PDF exports.
__webpack_require__(373);
__webpack_require__(376);

// Plugins need to be initialized before reveal.js is initialized because.
_markdown2.default.initialize();

// Full list of configuration options available at:
// https://github.com/hakimel/reveal.js#configuration
_reveal2.default.initialize({
  width: 1280,
  height: 720,
  controls: false,
  progress: false,
  history: true,
  center: true,
  // Options: none/fade/slide/convex/concave/zoom.
  transition: 'none',
  // Optional reveal.js plugins.
  dependencies: []
});

_reveal2.default.addEventListener('slidechanged', function (event) {
  // event.previousSlide, event.currentSlide, event.indexh, event.indexv
  var attribution = document.querySelector('#attribution');
  if (event.currentSlide.dataset.header) {
    attribution.innerHTML = event.currentSlide.dataset.header;
  } else {
    attribution.innerHTML = '';
  }
});

// Open the notes when the 's' key is hit
document.addEventListener('keydown', function (event) {
  // Disregard the event if the target is editable or a
  // modifier is present.
  if (document.querySelector(':focus') !== null || event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) {
    return;
  }

  if (event.keyCode === 83) {
    event.preventDefault();
    _notes2.default.openNotes();
  }
}, false);

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__resourceQuery) {

/* global __resourceQuery WorkerGlobalScope self */
/* eslint prefer-destructuring: off */

var url = __webpack_require__(362);
var stripAnsi = __webpack_require__(360);
var log = __webpack_require__(353).getLogger('webpack-dev-server');
var socket = __webpack_require__(365);
var overlay = __webpack_require__(364);

function getCurrentScriptSource() {
  // `document.currentScript` is the most accurate way to find the current script,
  // but is not supported in all browsers.
  if (document.currentScript) {
    return document.currentScript.getAttribute('src');
  }
  // Fall back to getting all scripts in the document.
  var scriptElements = document.scripts || [];
  var currentScript = scriptElements[scriptElements.length - 1];
  if (currentScript) {
    return currentScript.getAttribute('src');
  }
  // Fail as there was no script to use.
  throw new Error('[WDS] Failed to get current script source.');
}

var urlParts = void 0;
var hotReload = true;
if (typeof window !== 'undefined') {
  var qs = window.location.search.toLowerCase();
  hotReload = qs.indexOf('hotreload=false') === -1;
}
if (true) {
  // If this bundle is inlined, use the resource query to get the correct url.
  urlParts = url.parse(__resourceQuery.substr(1));
} else {
  // Else, get the url from the <script> this file was called with.
  var scriptHost = getCurrentScriptSource();
  // eslint-disable-next-line no-useless-escape
  scriptHost = scriptHost.replace(/\/[^\/]+$/, '');
  urlParts = url.parse(scriptHost || '/', false, true);
}

if (!urlParts.port || urlParts.port === '0') {
  urlParts.port = self.location.port;
}

var _hot = false;
var initial = true;
var currentHash = '';
var useWarningOverlay = false;
var useErrorOverlay = false;
var useProgress = false;

var INFO = 'info';
var WARNING = 'warning';
var ERROR = 'error';
var NONE = 'none';

// Set the default log level
log.setDefaultLevel(INFO);

// Send messages to the outside, so plugins can consume it.
function sendMsg(type, data) {
  if (typeof self !== 'undefined' && (typeof WorkerGlobalScope === 'undefined' || !(self instanceof WorkerGlobalScope))) {
    self.postMessage({
      type: 'webpack' + type,
      data: data
    }, '*');
  }
}

var onSocketMsg = {
  hot: function hot() {
    _hot = true;
    log.info('[WDS] Hot Module Replacement enabled.');
  },
  invalid: function invalid() {
    log.info('[WDS] App updated. Recompiling...');
    // fixes #1042. overlay doesn't clear if errors are fixed but warnings remain.
    if (useWarningOverlay || useErrorOverlay) overlay.clear();
    sendMsg('Invalid');
  },
  hash: function hash(_hash) {
    currentHash = _hash;
  },

  'still-ok': function stillOk() {
    log.info('[WDS] Nothing changed.');
    if (useWarningOverlay || useErrorOverlay) overlay.clear();
    sendMsg('StillOk');
  },
  'log-level': function logLevel(level) {
    var hotCtx = __webpack_require__(381);
    if (hotCtx.keys().indexOf('./log') !== -1) {
      hotCtx('./log').setLogLevel(level);
    }
    switch (level) {
      case INFO:
      case ERROR:
        log.setLevel(level);
        break;
      case WARNING:
        // loglevel's warning name is different from webpack's
        log.setLevel('warn');
        break;
      case NONE:
        log.disableAll();
        break;
      default:
        log.error('[WDS] Unknown clientLogLevel \'' + level + '\'');
    }
  },
  overlay: function overlay(value) {
    if (typeof document !== 'undefined') {
      if (typeof value === 'boolean') {
        useWarningOverlay = false;
        useErrorOverlay = value;
      } else if (value) {
        useWarningOverlay = value.warnings;
        useErrorOverlay = value.errors;
      }
    }
  },
  progress: function progress(_progress) {
    if (typeof document !== 'undefined') {
      useProgress = _progress;
    }
  },

  'progress-update': function progressUpdate(data) {
    if (useProgress) log.info('[WDS] ' + data.percent + '% - ' + data.msg + '.');
  },
  ok: function ok() {
    sendMsg('Ok');
    if (useWarningOverlay || useErrorOverlay) overlay.clear();
    if (initial) return initial = false; // eslint-disable-line no-return-assign
    reloadApp();
  },

  'content-changed': function contentChanged() {
    log.info('[WDS] Content base changed. Reloading...');
    self.location.reload();
  },
  warnings: function warnings(_warnings) {
    log.warn('[WDS] Warnings while compiling.');
    var strippedWarnings = _warnings.map(function (warning) {
      return stripAnsi(warning);
    });
    sendMsg('Warnings', strippedWarnings);
    for (var i = 0; i < strippedWarnings.length; i++) {
      log.warn(strippedWarnings[i]);
    }
    if (useWarningOverlay) overlay.showMessage(_warnings);

    if (initial) return initial = false; // eslint-disable-line no-return-assign
    reloadApp();
  },
  errors: function errors(_errors) {
    log.error('[WDS] Errors while compiling. Reload prevented.');
    var strippedErrors = _errors.map(function (error) {
      return stripAnsi(error);
    });
    sendMsg('Errors', strippedErrors);
    for (var i = 0; i < strippedErrors.length; i++) {
      log.error(strippedErrors[i]);
    }
    if (useErrorOverlay) overlay.showMessage(_errors);
    initial = false;
  },
  error: function error(_error) {
    log.error(_error);
  },
  close: function close() {
    log.error('[WDS] Disconnected!');
    sendMsg('Close');
  }
};

var hostname = urlParts.hostname;
var protocol = urlParts.protocol;

// check ipv4 and ipv6 `all hostname`
if (hostname === '0.0.0.0' || hostname === '::') {
  // why do we need this check?
  // hostname n/a for file protocol (example, when using electron, ionic)
  // see: https://github.com/webpack/webpack-dev-server/pull/384
  // eslint-disable-next-line no-bitwise
  if (self.location.hostname && !!~self.location.protocol.indexOf('http')) {
    hostname = self.location.hostname;
  }
}

// `hostname` can be empty when the script path is relative. In that case, specifying
// a protocol would result in an invalid URL.
// When https is used in the app, secure websockets are always necessary
// because the browser doesn't accept non-secure websockets.
if (hostname && (self.location.protocol === 'https:' || urlParts.hostname === '0.0.0.0')) {
  protocol = self.location.protocol;
}

var socketUrl = url.format({
  protocol: protocol,
  auth: urlParts.auth,
  hostname: hostname,
  port: urlParts.port,
  pathname: urlParts.path == null || urlParts.path === '/' ? '/sockjs-node' : urlParts.path
});

socket(socketUrl, onSocketMsg);

var isUnloading = false;
self.addEventListener('beforeunload', function () {
  isUnloading = true;
});

function reloadApp() {
  if (isUnloading || !hotReload) {
    return;
  }
  if (_hot) {
    log.info('[WDS] App hot update...');
    // eslint-disable-next-line global-require
    var hotEmitter = __webpack_require__(135);
    hotEmitter.emit('webpackHotUpdate', currentHash);
    if (typeof self !== 'undefined' && self.window) {
      // broadcast update to window
      self.postMessage('webpackHotUpdate' + currentHash, '*');
    }
  } else {
    var rootWindow = self;
    // use parent window for reload (in case we're in an iframe with no valid src)
    var intervalId = self.setInterval(function () {
      if (rootWindow.location.protocol !== 'about:') {
        // reload immediately if protocol is valid
        applyReload(rootWindow, intervalId);
      } else {
        rootWindow = rootWindow.parent;
        if (rootWindow.parent === rootWindow) {
          // if parent equals current window we've reached the root which would continue forever, so trigger a reload anyways
          applyReload(rootWindow, intervalId);
        }
      }
    });
  }

  function applyReload(rootWindow, intervalId) {
    clearInterval(intervalId);
    log.info('[WDS] App updated. Reloading...');
    rootWindow.location.reload();
  }
}
/* WEBPACK VAR INJECTION */}.call(exports, "?http://localhost:8000"))

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals __webpack_hash__ */
if (true) {
	var lastHash;
	var upToDate = function upToDate() {
		return lastHash.indexOf(__webpack_require__.h()) >= 0;
	};
	var check = function check() {
		module.hot.check().then(function (updatedModules) {
			if (!updatedModules) {
				console.warn("[HMR] Cannot find update. Need to do a full reload!");
				console.warn("[HMR] (Probably because of restarting the webpack-dev-server)");
				return;
			}

			return module.hot.apply({
				ignoreUnaccepted: true,
				ignoreDeclined: true,
				ignoreErrored: true,
				onUnaccepted: function onUnaccepted(data) {
					console.warn("Ignored an update to unaccepted module " + data.chain.join(" -> "));
				},
				onDeclined: function onDeclined(data) {
					console.warn("Ignored an update to declined module " + data.chain.join(" -> "));
				},
				onErrored: function onErrored(data) {
					console.warn("Ignored an error while updating module " + data.moduleId + " (" + data.type + ")");
				}
			}).then(function (renewedModules) {
				if (!upToDate()) {
					check();
				}

				__webpack_require__(366)(updatedModules, renewedModules);

				if (upToDate()) {
					console.log("[HMR] App is up to date.");
				}
			});
		}).catch(function (err) {
			var status = module.hot.status();
			if (["abort", "fail"].indexOf(status) >= 0) {
				console.warn("[HMR] Cannot check for update. Need to do a full reload!");
				console.warn("[HMR] " + err.stack || err.message);
			} else {
				console.warn("[HMR] Update check failed: " + err.stack || err.message);
			}
		});
	};
	var hotEmitter = __webpack_require__(135);
	hotEmitter.on("webpackHotUpdate", function (currentHash) {
		lastHash = currentHash;
		if (!upToDate()) {
			var status = module.hot.status();
			if (status === "idle") {
				console.log("[HMR] Checking for updates on the server...");
				check();
			} else if (["abort", "fail"].indexOf(status) >= 0) {
				console.warn("[HMR] Cannot apply update as a previous update " + status + "ed. Need to do a full reload!");
			}
		}
	});
	console.log("[HMR] Waiting for update signal from WDS...");
} else {
	throw new Error("[HMR] Hot Module Replacement is disabled.");
}

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = ansiHTML;

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/;

var _defColors = {
  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
};
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
};
var _openTags = {
  '1': 'font-weight:bold', // bold
  '2': 'opacity:0.5', // dim
  '3': '<i>', // italic
  '4': '<u>', // underscore
  '8': 'display:none', // hidden
  '9': '<del>' // delete
};
var _closeTags = {
  '23': '</i>', // reset italic
  '24': '</u>', // reset underscore
  '29': '</del>' // reset delete
};[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  _closeTags[n] = '</span>';
});

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML(text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text;
  }

  // Cache opened sequence.
  var ansiCodes = [];
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
    var ot = _openTags[seq];
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) {
        // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop();
        return '</span>';
      }
      // Open tag.
      ansiCodes.push(seq);
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">';
    }

    var ct = _closeTags[seq];
    if (ct) {
      // Pop sequence
      ansiCodes.pop();
      return ct;
    }
    return '';
  });

  // Make sure tags are closed.
  var l = ansiCodes.length;l > 0 && (ret += Array(l + 1).join('</span>'));

  return ret;
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function (colors) {
  if ((typeof colors === 'undefined' ? 'undefined' : _typeof(colors)) !== 'object') {
    throw new Error('`colors` parameter must be an Object.');
  }

  var _finalColors = {};
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null;
    if (!hex) {
      _finalColors[key] = _defColors[key];
      continue;
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex];
      }
      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
        return typeof h !== 'string';
      })) {
        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000');
      }
      var defHexColor = _defColors[key];
      if (!hex[0]) {
        hex[0] = defHexColor[0];
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]];
        hex.push(defHexColor[1]);
      }

      hex = hex.slice(0, 2);
    } else if (typeof hex !== 'string') {
      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000');
    }
    _finalColors[key] = hex;
  }
  _setTags(_finalColors);
};

/**
 * Reset colors.
 */
ansiHTML.reset = function () {
  _setTags(_defColors);
};

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {};

if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function get() {
      return _openTags;
    }
  });
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function get() {
      return _closeTags;
    }
  });
} else {
  ansiHTML.tags.open = _openTags;
  ansiHTML.tags.close = _closeTags;
}

function _setTags(colors) {
  // reset all
  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1];
  // inverse
  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0];
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey;

  for (var code in _styles) {
    var color = _styles[code];
    var oriColor = colors[color] || '000';
    _openTags[code] = 'color:#' + oriColor;
    code = parseInt(code);
    _openTags[(code + 10).toString()] = 'background:#' + oriColor;
  }
}

ansiHTML.reset();

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
	return (/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g
	);
};

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, module) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!function (global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = ( false ? "undefined" : _typeof(module)) === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      prototype[method] = function (arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function (genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction ||
    // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  };

  runtime.mark = function (genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function (arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function (unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (_typeof(global.process) === "object" && global.process.domain) {
      invoke = global.process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
      // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg,
      // Avoid propagating failures to Promises returned by later
      // invocations of the iterator.
      callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function (innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));

    return runtime.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;
        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);
        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };
        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (!info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }
    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function () {
    return this;
  };

  Gp.toString = function () {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function (object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function reset(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function stop() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function dispatchException(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function complete(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" || record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
}(
// Among the various tricks for obtaining a reference to the global
// object, this seems to be the most reliable technique that does not
// use indirect eval (which violates Content Security Policy).
(typeof global === "undefined" ? "undefined" : _typeof(global)) === "object" ? global : (typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" ? window : (typeof self === "undefined" ? "undefined" : _typeof(self)) === "object" ? self : undefined);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(50), __webpack_require__(93)(module)))

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(154);
module.exports = __webpack_require__(22).RegExp.escape;

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isObject = __webpack_require__(4);
var isArray = __webpack_require__(55);
var SPECIES = __webpack_require__(5)('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  }return C === undefined ? Array : C;
};

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()

var fails = __webpack_require__(3);
var getTime = Date.prototype.getTime;
var $toISOString = Date.prototype.toISOString;

var lz = function lz(num) {
  return num > 9 ? num : '0' + num;
};

// PhantomJS / old WebKit has a broken implementations
module.exports = fails(function () {
  return $toISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z';
}) || !fails(function () {
  $toISOString.call(new Date(NaN));
}) ? function toISOString() {
  if (!isFinite(getTime.call(this))) throw RangeError('Invalid time value');
  var d = this;
  var y = d.getUTCFullYear();
  var m = d.getUTCMilliseconds();
  var s = y < 0 ? '-' : y > 9999 ? '+' : '';
  return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) + '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) + 'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) + ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
} : $toISOString;

/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__(1);
var toPrimitive = __webpack_require__(26);
var NUMBER = 'number';

module.exports = function (hint) {
  if (hint !== 'string' && hint !== NUMBER && hint !== 'default') throw TypeError('Incorrect hint');
  return toPrimitive(anObject(this), hint != NUMBER);
};

/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(36);
var gOPS = __webpack_require__(59);
var pIE = __webpack_require__(48);
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) {
      if (isEnum.call(it, key = symbols[i++])) result.push(key);
    }
  }return result;
};

/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (regExp, replace) {
  var replacer = replace === Object(replace) ? function (part) {
    return replace[part];
  } : replace;
  return function (it) {
    return String(it).replace(regExp, replacer);
  };
};

/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};

/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://github.com/benjamingr/RexExp.escape
var $export = __webpack_require__(0);
var $re = __webpack_require__(152)(/[\\^$*+?.()|[\]{}]/g, '\\$&');

$export($export.S, 'RegExp', { escape: function escape(it) {
    return $re(it);
  } });

/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = __webpack_require__(0);

$export($export.P, 'Array', { copyWithin: __webpack_require__(99) });

__webpack_require__(29)('copyWithin');

/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
var $every = __webpack_require__(21)(4);

$export($export.P + $export.F * !__webpack_require__(20)([].every, true), 'Array', {
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: function every(callbackfn /* , thisArg */) {
    return $every(this, callbackfn, arguments[1]);
  }
});

/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = __webpack_require__(0);

$export($export.P, 'Array', { fill: __webpack_require__(66) });

__webpack_require__(29)('fill');

/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
var $filter = __webpack_require__(21)(2);

$export($export.P + $export.F * !__webpack_require__(20)([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments[1]);
  }
});

/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)

var $export = __webpack_require__(0);
var $find = __webpack_require__(21)(6);
var KEY = 'findIndex';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () {
  forced = false;
});
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__(29)(KEY);

/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)

var $export = __webpack_require__(0);
var $find = __webpack_require__(21)(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () {
  forced = false;
});
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__(29)(KEY);

/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
var $forEach = __webpack_require__(21)(0);
var STRICT = __webpack_require__(20)([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */) {
    return $forEach(this, callbackfn, arguments[1]);
  }
});

/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ctx = __webpack_require__(19);
var $export = __webpack_require__(0);
var toObject = __webpack_require__(9);
var call = __webpack_require__(110);
var isArrayIter = __webpack_require__(74);
var toLength = __webpack_require__(8);
var createProperty = __webpack_require__(68);
var getIterFn = __webpack_require__(91);

$export($export.S + $export.F * !__webpack_require__(57)(function (iter) {
  Array.from(iter);
}), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
var $indexOf = __webpack_require__(51)(false);
var $native = [].indexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !__webpack_require__(20)($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
    // convert -0 to +0
    ? $native.apply(this, arguments) || 0 : $indexOf(this, searchElement, arguments[1]);
  }
});

/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = __webpack_require__(0);

$export($export.S, 'Array', { isArray: __webpack_require__(55) });

/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.13 Array.prototype.join(separator)

var $export = __webpack_require__(0);
var toIObject = __webpack_require__(17);
var arrayJoin = [].join;

// fallback for not array-like strings
$export($export.P + $export.F * (__webpack_require__(47) != Object || !__webpack_require__(20)(arrayJoin)), 'Array', {
  join: function join(separator) {
    return arrayJoin.call(toIObject(this), separator === undefined ? ',' : separator);
  }
});

/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
var toIObject = __webpack_require__(17);
var toInteger = __webpack_require__(25);
var toLength = __webpack_require__(8);
var $native = [].lastIndexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].lastIndexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !__webpack_require__(20)($native)), 'Array', {
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
    // convert -0 to +0
    if (NEGATIVE_ZERO) return $native.apply(this, arguments) || 0;
    var O = toIObject(this);
    var length = toLength(O.length);
    var index = length - 1;
    if (arguments.length > 1) index = Math.min(index, toInteger(arguments[1]));
    if (index < 0) index = length + index;
    for (; index >= 0; index--) {
      if (index in O) if (O[index] === searchElement) return index || 0;
    }return -1;
  }
});

/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
var $map = __webpack_require__(21)(1);

$export($export.P + $export.F * !__webpack_require__(20)([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments[1]);
  }
});

/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
var createProperty = __webpack_require__(68);

// WebKit Array.of isn't generic
$export($export.S + $export.F * __webpack_require__(3)(function () {
  function F() {/* empty */}
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of() /* ...args */{
    var index = 0;
    var aLen = arguments.length;
    var result = new (typeof this == 'function' ? this : Array)(aLen);
    while (aLen > index) {
      createProperty(result, index, arguments[index++]);
    }result.length = aLen;
    return result;
  }
});

/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
var $reduce = __webpack_require__(101);

$export($export.P + $export.F * !__webpack_require__(20)([].reduceRight, true), 'Array', {
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: function reduceRight(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], true);
  }
});

/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
var $reduce = __webpack_require__(101);

$export($export.P + $export.F * !__webpack_require__(20)([].reduce, true), 'Array', {
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: function reduce(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
  }
});

/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
var html = __webpack_require__(72);
var cof = __webpack_require__(18);
var toAbsoluteIndex = __webpack_require__(40);
var toLength = __webpack_require__(8);
var arraySlice = [].slice;

// fallback for not array-like ES3 strings and DOM objects
$export($export.P + $export.F * __webpack_require__(3)(function () {
  if (html) arraySlice.call(html);
}), 'Array', {
  slice: function slice(begin, end) {
    var len = toLength(this.length);
    var klass = cof(this);
    end = end === undefined ? len : end;
    if (klass == 'Array') return arraySlice.call(this, begin, end);
    var start = toAbsoluteIndex(begin, len);
    var upTo = toAbsoluteIndex(end, len);
    var size = toLength(upTo - start);
    var cloned = new Array(size);
    var i = 0;
    for (; i < size; i++) {
      cloned[i] = klass == 'String' ? this.charAt(start + i) : this[start + i];
    }return cloned;
  }
});

/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
var $some = __webpack_require__(21)(3);

$export($export.P + $export.F * !__webpack_require__(20)([].some, true), 'Array', {
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn /* , thisArg */) {
    return $some(this, callbackfn, arguments[1]);
  }
});

/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
var aFunction = __webpack_require__(10);
var toObject = __webpack_require__(9);
var fails = __webpack_require__(3);
var $sort = [].sort;
var test = [1, 2, 3];

$export($export.P + $export.F * (fails(function () {
  // IE8-
  test.sort(undefined);
}) || !fails(function () {
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !__webpack_require__(20)($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn) {
    return comparefn === undefined ? $sort.call(toObject(this)) : $sort.call(toObject(this), aFunction(comparefn));
  }
});

/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(39)('Array');

/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.3.3.1 / 15.9.4.4 Date.now()
var $export = __webpack_require__(0);

$export($export.S, 'Date', { now: function now() {
    return new Date().getTime();
  } });

/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var $export = __webpack_require__(0);
var toISOString = __webpack_require__(149);

// PhantomJS / old WebKit has a broken implementations
$export($export.P + $export.F * (Date.prototype.toISOString !== toISOString), 'Date', {
  toISOString: toISOString
});

/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
var toObject = __webpack_require__(9);
var toPrimitive = __webpack_require__(26);

$export($export.P + $export.F * __webpack_require__(3)(function () {
  return new Date(NaN).toJSON() !== null || Date.prototype.toJSON.call({ toISOString: function toISOString() {
      return 1;
    } }) !== 1;
}), 'Date', {
  // eslint-disable-next-line no-unused-vars
  toJSON: function toJSON(key) {
    var O = toObject(this);
    var pv = toPrimitive(O);
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});

/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var TO_PRIMITIVE = __webpack_require__(5)('toPrimitive');
var proto = Date.prototype;

if (!(TO_PRIMITIVE in proto)) __webpack_require__(11)(proto, TO_PRIMITIVE, __webpack_require__(150));

/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var DateProto = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING = 'toString';
var $toString = DateProto[TO_STRING];
var getTime = DateProto.getTime;
if (new Date(NaN) + '' != INVALID_DATE) {
  __webpack_require__(12)(DateProto, TO_STRING, function toString() {
    var value = getTime.call(this);
    // eslint-disable-next-line no-self-compare
    return value === value ? $toString.call(this) : INVALID_DATE;
  });
}

/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = __webpack_require__(0);

$export($export.P, 'Function', { bind: __webpack_require__(102) });

/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isObject = __webpack_require__(4);
var getPrototypeOf = __webpack_require__(16);
var HAS_INSTANCE = __webpack_require__(5)('hasInstance');
var FunctionProto = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if (!(HAS_INSTANCE in FunctionProto)) __webpack_require__(7).f(FunctionProto, HAS_INSTANCE, { value: function value(O) {
    if (typeof this != 'function' || !isObject(O)) return false;
    if (!isObject(this.prototype)) return O instanceof this;
    // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
    while (O = getPrototypeOf(O)) {
      if (this.prototype === O) return true;
    }return false;
  } });

/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var dP = __webpack_require__(7).f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || __webpack_require__(6) && dP(FProto, NAME, {
  configurable: true,
  get: function get() {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});

/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.2.2.3 Math.acosh(x)
var $export = __webpack_require__(0);
var log1p = __webpack_require__(113);
var sqrt = Math.sqrt;
var $acosh = Math.acosh;

$export($export.S + $export.F * !($acosh
// V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
&& Math.floor($acosh(Number.MAX_VALUE)) == 710
// Tor Browser bug: Math.acosh(Infinity) -> NaN
&& $acosh(Infinity) == Infinity), 'Math', {
  acosh: function acosh(x) {
    return (x = +x) < 1 ? NaN : x > 94906265.62425156 ? Math.log(x) + Math.LN2 : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});

/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.2.2.5 Math.asinh(x)
var $export = __webpack_require__(0);
var $asinh = Math.asinh;

function asinh(x) {
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

// Tor Browser bug: Math.asinh(0) -> -0
$export($export.S + $export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', { asinh: asinh });

/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.2.2.7 Math.atanh(x)
var $export = __webpack_require__(0);
var $atanh = Math.atanh;

// Tor Browser bug: Math.atanh(-0) -> 0
$export($export.S + $export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
  atanh: function atanh(x) {
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});

/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.2.2.9 Math.cbrt(x)
var $export = __webpack_require__(0);
var sign = __webpack_require__(78);

$export($export.S, 'Math', {
  cbrt: function cbrt(x) {
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});

/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.2.2.11 Math.clz32(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  clz32: function clz32(x) {
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});

/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.2.2.12 Math.cosh(x)
var $export = __webpack_require__(0);
var exp = Math.exp;

$export($export.S, 'Math', {
  cosh: function cosh(x) {
    return (exp(x = +x) + exp(-x)) / 2;
  }
});

/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.2.2.14 Math.expm1(x)
var $export = __webpack_require__(0);
var $expm1 = __webpack_require__(77);

$export($export.S + $export.F * ($expm1 != Math.expm1), 'Math', { expm1: $expm1 });

/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.2.2.16 Math.fround(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', { fround: __webpack_require__(112) });

/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export = __webpack_require__(0);
var abs = Math.abs;

$export($export.S, 'Math', {
  hypot: function hypot(value1, value2) {
    // eslint-disable-line no-unused-vars
    var sum = 0;
    var i = 0;
    var aLen = arguments.length;
    var larg = 0;
    var arg, div;
    while (i < aLen) {
      arg = abs(arguments[i++]);
      if (larg < arg) {
        div = larg / arg;
        sum = sum * div * div + 1;
        larg = arg;
      } else if (arg > 0) {
        div = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});

/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.2.2.18 Math.imul(x, y)
var $export = __webpack_require__(0);
var $imul = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$export($export.S + $export.F * __webpack_require__(3)(function () {
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y) {
    var UINT16 = 0xffff;
    var xn = +x;
    var yn = +y;
    var xl = UINT16 & xn;
    var yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});

/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.2.2.21 Math.log10(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  log10: function log10(x) {
    return Math.log(x) * Math.LOG10E;
  }
});

/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.2.2.20 Math.log1p(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', { log1p: __webpack_require__(113) });

/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.2.2.22 Math.log2(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  log2: function log2(x) {
    return Math.log(x) / Math.LN2;
  }
});

/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.2.2.28 Math.sign(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', { sign: __webpack_require__(78) });

/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.2.2.30 Math.sinh(x)
var $export = __webpack_require__(0);
var expm1 = __webpack_require__(77);
var exp = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$export($export.S + $export.F * __webpack_require__(3)(function () {
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x) {
    return Math.abs(x = +x) < 1 ? (expm1(x) - expm1(-x)) / 2 : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});

/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.2.2.33 Math.tanh(x)
var $export = __webpack_require__(0);
var expm1 = __webpack_require__(77);
var exp = Math.exp;

$export($export.S, 'Math', {
  tanh: function tanh(x) {
    var a = expm1(x = +x);
    var b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});

/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.2.2.34 Math.trunc(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  trunc: function trunc(it) {
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});

/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var global = __webpack_require__(2);
var has = __webpack_require__(14);
var cof = __webpack_require__(18);
var inheritIfRequired = __webpack_require__(73);
var toPrimitive = __webpack_require__(26);
var fails = __webpack_require__(3);
var gOPN = __webpack_require__(35).f;
var gOPD = __webpack_require__(15).f;
var dP = __webpack_require__(7).f;
var $trim = __webpack_require__(44).trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(__webpack_require__(34)(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function toNumber(argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66:case 98:
          radix = 2;maxCode = 49;break; // fast equal /^0b[01]+$/i
        case 79:case 111:
          radix = 8;maxCode = 55;break; // fast equal /^0o[0-7]+$/i
        default:
          return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      }return parseInt(digits, radix);
    }
  }return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
    // check on 1..constructor(foo) case
    && (BROKEN_COF ? fails(function () {
      proto.valueOf.call(that);
    }) : cof(that) != NUMBER) ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = __webpack_require__(6) ? gOPN(Base) : (
  // ES3:
  'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
  // ES6 (in case, if modules with ES6 Number statics required before):
  'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' + 'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger').split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  __webpack_require__(12)(global, NUMBER, $Number);
}

/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.1.2.1 Number.EPSILON
var $export = __webpack_require__(0);

$export($export.S, 'Number', { EPSILON: Math.pow(2, -52) });

/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.1.2.2 Number.isFinite(number)
var $export = __webpack_require__(0);
var _isFinite = __webpack_require__(2).isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it) {
    return typeof it == 'number' && _isFinite(it);
  }
});

/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.1.2.3 Number.isInteger(number)
var $export = __webpack_require__(0);

$export($export.S, 'Number', { isInteger: __webpack_require__(109) });

/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.1.2.4 Number.isNaN(number)
var $export = __webpack_require__(0);

$export($export.S, 'Number', {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare
    return number != number;
  }
});

/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.1.2.5 Number.isSafeInteger(number)
var $export = __webpack_require__(0);
var isInteger = __webpack_require__(109);
var abs = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number) {
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});

/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = __webpack_require__(0);

$export($export.S, 'Number', { MAX_SAFE_INTEGER: 0x1fffffffffffff });

/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = __webpack_require__(0);

$export($export.S, 'Number', { MIN_SAFE_INTEGER: -0x1fffffffffffff });

/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
var $parseFloat = __webpack_require__(121);
// 20.1.2.12 Number.parseFloat(string)
$export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', { parseFloat: $parseFloat });

/***/ }),
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
var $parseInt = __webpack_require__(122);
// 20.1.2.13 Number.parseInt(string, radix)
$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', { parseInt: $parseInt });

/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
var toInteger = __webpack_require__(25);
var aNumberValue = __webpack_require__(98);
var repeat = __webpack_require__(85);
var $toFixed = 1.0.toFixed;
var floor = Math.floor;
var data = [0, 0, 0, 0, 0, 0];
var ERROR = 'Number.toFixed: incorrect invocation!';
var ZERO = '0';

var multiply = function multiply(n, c) {
  var i = -1;
  var c2 = c;
  while (++i < 6) {
    c2 += n * data[i];
    data[i] = c2 % 1e7;
    c2 = floor(c2 / 1e7);
  }
};
var divide = function divide(n) {
  var i = 6;
  var c = 0;
  while (--i >= 0) {
    c += data[i];
    data[i] = floor(c / n);
    c = c % n * 1e7;
  }
};
var numToString = function numToString() {
  var i = 6;
  var s = '';
  while (--i >= 0) {
    if (s !== '' || i === 0 || data[i] !== 0) {
      var t = String(data[i]);
      s = s === '' ? t : s + repeat.call(ZERO, 7 - t.length) + t;
    }
  }return s;
};
var pow = function pow(x, n, acc) {
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};
var log = function log(x) {
  var n = 0;
  var x2 = x;
  while (x2 >= 4096) {
    n += 12;
    x2 /= 4096;
  }
  while (x2 >= 2) {
    n += 1;
    x2 /= 2;
  }return n;
};

$export($export.P + $export.F * (!!$toFixed && (0.00008.toFixed(3) !== '0.000' || 0.9.toFixed(0) !== '1' || 1.255.toFixed(2) !== '1.25' || 1000000000000000128.0.toFixed(0) !== '1000000000000000128') || !__webpack_require__(3)(function () {
  // V8 ~ Android 4.3-
  $toFixed.call({});
})), 'Number', {
  toFixed: function toFixed(fractionDigits) {
    var x = aNumberValue(this, ERROR);
    var f = toInteger(fractionDigits);
    var s = '';
    var m = ZERO;
    var e, z, j, k;
    if (f < 0 || f > 20) throw RangeError(ERROR);
    // eslint-disable-next-line no-self-compare
    if (x != x) return 'NaN';
    if (x <= -1e21 || x >= 1e21) return String(x);
    if (x < 0) {
      s = '-';
      x = -x;
    }
    if (x > 1e-21) {
      e = log(x * pow(2, 69, 1)) - 69;
      z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if (e > 0) {
        multiply(0, z);
        j = f;
        while (j >= 7) {
          multiply(1e7, 0);
          j -= 7;
        }
        multiply(pow(10, j, 1), 0);
        j = e - 1;
        while (j >= 23) {
          divide(1 << 23);
          j -= 23;
        }
        divide(1 << j);
        multiply(1, 1);
        divide(2);
        m = numToString();
      } else {
        multiply(0, z);
        multiply(1 << -e, 0);
        m = numToString() + repeat.call(ZERO, f);
      }
    }
    if (f > 0) {
      k = m.length;
      m = s + (k <= f ? '0.' + repeat.call(ZERO, f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
    } else {
      m = s + m;
    }return m;
  }
});

/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
var $fails = __webpack_require__(3);
var aNumberValue = __webpack_require__(98);
var $toPrecision = 1.0.toPrecision;

$export($export.P + $export.F * ($fails(function () {
  // IE7-
  return $toPrecision.call(1, undefined) !== '1';
}) || !$fails(function () {
  // V8 ~ Android 4.3-
  $toPrecision.call({});
})), 'Number', {
  toPrecision: function toPrecision(precision) {
    var that = aNumberValue(this, 'Number#toPrecision: incorrect invocation!');
    return precision === undefined ? $toPrecision.call(that) : $toPrecision.call(that, precision);
  }
});

/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(0);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(115) });

/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: __webpack_require__(34) });

/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
$export($export.S + $export.F * !__webpack_require__(6), 'Object', { defineProperties: __webpack_require__(116) });

/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(6), 'Object', { defineProperty: __webpack_require__(7).f });

/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 19.1.2.5 Object.freeze(O)
var isObject = __webpack_require__(4);
var meta = __webpack_require__(30).onFreeze;

__webpack_require__(24)('freeze', function ($freeze) {
  return function freeze(it) {
    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
  };
});

/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = __webpack_require__(17);
var $getOwnPropertyDescriptor = __webpack_require__(15).f;

__webpack_require__(24)('getOwnPropertyDescriptor', function () {
  return function getOwnPropertyDescriptor(it, key) {
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});

/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 19.1.2.7 Object.getOwnPropertyNames(O)
__webpack_require__(24)('getOwnPropertyNames', function () {
  return __webpack_require__(117).f;
});

/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = __webpack_require__(9);
var $getPrototypeOf = __webpack_require__(16);

__webpack_require__(24)('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return $getPrototypeOf(toObject(it));
  };
});

/***/ }),
/* 220 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 19.1.2.11 Object.isExtensible(O)
var isObject = __webpack_require__(4);

__webpack_require__(24)('isExtensible', function ($isExtensible) {
  return function isExtensible(it) {
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});

/***/ }),
/* 221 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 19.1.2.12 Object.isFrozen(O)
var isObject = __webpack_require__(4);

__webpack_require__(24)('isFrozen', function ($isFrozen) {
  return function isFrozen(it) {
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});

/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 19.1.2.13 Object.isSealed(O)
var isObject = __webpack_require__(4);

__webpack_require__(24)('isSealed', function ($isSealed) {
  return function isSealed(it) {
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});

/***/ }),
/* 223 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 19.1.3.10 Object.is(value1, value2)
var $export = __webpack_require__(0);
$export($export.S, 'Object', { is: __webpack_require__(153) });

/***/ }),
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(9);
var $keys = __webpack_require__(36);

__webpack_require__(24)('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});

/***/ }),
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 19.1.2.15 Object.preventExtensions(O)
var isObject = __webpack_require__(4);
var meta = __webpack_require__(30).onFreeze;

__webpack_require__(24)('preventExtensions', function ($preventExtensions) {
  return function preventExtensions(it) {
    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
  };
});

/***/ }),
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 19.1.2.17 Object.seal(O)
var isObject = __webpack_require__(4);
var meta = __webpack_require__(30).onFreeze;

__webpack_require__(24)('seal', function ($seal) {
  return function seal(it) {
    return $seal && isObject(it) ? $seal(meta(it)) : it;
  };
});

/***/ }),
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = __webpack_require__(0);
$export($export.S, 'Object', { setPrototypeOf: __webpack_require__(81).set });

/***/ }),
/* 228 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.3.6 Object.prototype.toString()

var classof = __webpack_require__(46);
var test = {};
test[__webpack_require__(5)('toStringTag')] = 'z';
if (test + '' != '[object z]') {
  __webpack_require__(12)(Object.prototype, 'toString', function toString() {
    return '[object ' + classof(this) + ']';
  }, true);
}

/***/ }),
/* 229 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
var $parseFloat = __webpack_require__(121);
// 18.2.4 parseFloat(string)
$export($export.G + $export.F * (parseFloat != $parseFloat), { parseFloat: $parseFloat });

/***/ }),
/* 230 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
var $parseInt = __webpack_require__(122);
// 18.2.5 parseInt(string, radix)
$export($export.G + $export.F * (parseInt != $parseInt), { parseInt: $parseInt });

/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var LIBRARY = __webpack_require__(33);
var global = __webpack_require__(2);
var ctx = __webpack_require__(19);
var classof = __webpack_require__(46);
var $export = __webpack_require__(0);
var isObject = __webpack_require__(4);
var aFunction = __webpack_require__(10);
var anInstance = __webpack_require__(31);
var forOf = __webpack_require__(32);
var speciesConstructor = __webpack_require__(63);
var task = __webpack_require__(87).set;
var microtask = __webpack_require__(79)();
var newPromiseCapabilityModule = __webpack_require__(80);
var perform = __webpack_require__(123);
var promiseResolve = __webpack_require__(124);
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function empty() {/* empty */};
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__(5)('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) {/* empty */}
}();

// helpers
var isThenable = function isThenable(it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function notify(promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function run(reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) {
      run(chain[i++]);
    } // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function onUnhandled(promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    }promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function isUnhandled(promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function onHandleUnhandled(promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function $reject(value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function $resolve(value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = []; // <- awaiting reactions
    this._a = undefined; // <- checked in isUnhandled reactions
    this._s = 0; // <- state
    this._d = false; // <- done
    this._v = undefined; // <- value
    this._h = 0; // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false; // <- notify
  };
  Internal.prototype = __webpack_require__(38)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function _catch(onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function OwnPromiseCapability() {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function newPromiseCapability(C) {
    return C === $Promise || C === Wrapper ? new OwnPromiseCapability(C) : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__(43)($Promise, PROMISE);
__webpack_require__(39)(PROMISE);
Wrapper = __webpack_require__(22)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(57)(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export = __webpack_require__(0);
var aFunction = __webpack_require__(10);
var anObject = __webpack_require__(1);
var rApply = (__webpack_require__(2).Reflect || {}).apply;
var fApply = Function.apply;
// MS Edge argumentsList argument is optional
$export($export.S + $export.F * !__webpack_require__(3)(function () {
  rApply(function () {/* empty */});
}), 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList) {
    var T = aFunction(target);
    var L = anObject(argumentsList);
    return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
  }
});

/***/ }),
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $export = __webpack_require__(0);
var create = __webpack_require__(34);
var aFunction = __webpack_require__(10);
var anObject = __webpack_require__(1);
var isObject = __webpack_require__(4);
var fails = __webpack_require__(3);
var bind = __webpack_require__(102);
var rConstruct = (__webpack_require__(2).Reflect || {}).construct;

// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function () {
  function F() {/* empty */}
  return !(rConstruct(function () {/* empty */}, [], F) instanceof F);
});
var ARGS_BUG = !fails(function () {
  rConstruct(function () {/* empty */});
});

$export($export.S + $export.F * (NEW_TARGET_BUG || ARGS_BUG), 'Reflect', {
  construct: function construct(Target, args /* , newTarget */) {
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return rConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0:
          return new Target();
        case 1:
          return new Target(args[0]);
        case 2:
          return new Target(args[0], args[1]);
        case 3:
          return new Target(args[0], args[1], args[2]);
        case 4:
          return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype;
    var instance = create(isObject(proto) ? proto : Object.prototype);
    var result = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});

/***/ }),
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var dP = __webpack_require__(7);
var $export = __webpack_require__(0);
var anObject = __webpack_require__(1);
var toPrimitive = __webpack_require__(26);

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * __webpack_require__(3)(function () {
  // eslint-disable-next-line no-undef
  Reflect.defineProperty(dP.f({}, 1, { value: 1 }), 1, { value: 2 });
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes) {
    anObject(target);
    propertyKey = toPrimitive(propertyKey, true);
    anObject(attributes);
    try {
      dP.f(target, propertyKey, attributes);
      return true;
    } catch (e) {
      return false;
    }
  }
});

/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export = __webpack_require__(0);
var gOPD = __webpack_require__(15).f;
var anObject = __webpack_require__(1);

$export($export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey) {
    var desc = gOPD(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});

/***/ }),
/* 236 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 26.1.5 Reflect.enumerate(target)

var $export = __webpack_require__(0);
var anObject = __webpack_require__(1);
var Enumerate = function Enumerate(iterated) {
  this._t = anObject(iterated); // target
  this._i = 0; // next index
  var keys = this._k = []; // keys
  var key;
  for (key in iterated) {
    keys.push(key);
  }
};
__webpack_require__(75)(Enumerate, 'Object', function () {
  var that = this;
  var keys = that._k;
  var key;
  do {
    if (that._i >= keys.length) return { value: undefined, done: true };
  } while (!((key = keys[that._i++]) in that._t));
  return { value: key, done: false };
});

$export($export.S, 'Reflect', {
  enumerate: function enumerate(target) {
    return new Enumerate(target);
  }
});

/***/ }),
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var gOPD = __webpack_require__(15);
var $export = __webpack_require__(0);
var anObject = __webpack_require__(1);

$export($export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
    return gOPD.f(anObject(target), propertyKey);
  }
});

/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 26.1.8 Reflect.getPrototypeOf(target)
var $export = __webpack_require__(0);
var getProto = __webpack_require__(16);
var anObject = __webpack_require__(1);

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target) {
    return getProto(anObject(target));
  }
});

/***/ }),
/* 239 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var gOPD = __webpack_require__(15);
var getPrototypeOf = __webpack_require__(16);
var has = __webpack_require__(14);
var $export = __webpack_require__(0);
var isObject = __webpack_require__(4);
var anObject = __webpack_require__(1);

function get(target, propertyKey /* , receiver */) {
  var receiver = arguments.length < 3 ? target : arguments[2];
  var desc, proto;
  if (anObject(target) === receiver) return target[propertyKey];
  if (desc = gOPD.f(target, propertyKey)) return has(desc, 'value') ? desc.value : desc.get !== undefined ? desc.get.call(receiver) : undefined;
  if (isObject(proto = getPrototypeOf(target))) return get(proto, propertyKey, receiver);
}

$export($export.S, 'Reflect', { get: get });

/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 26.1.9 Reflect.has(target, propertyKey)
var $export = __webpack_require__(0);

$export($export.S, 'Reflect', {
  has: function has(target, propertyKey) {
    return propertyKey in target;
  }
});

/***/ }),
/* 241 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 26.1.10 Reflect.isExtensible(target)
var $export = __webpack_require__(0);
var anObject = __webpack_require__(1);
var $isExtensible = Object.isExtensible;

$export($export.S, 'Reflect', {
  isExtensible: function isExtensible(target) {
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});

/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 26.1.11 Reflect.ownKeys(target)
var $export = __webpack_require__(0);

$export($export.S, 'Reflect', { ownKeys: __webpack_require__(120) });

/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 26.1.12 Reflect.preventExtensions(target)
var $export = __webpack_require__(0);
var anObject = __webpack_require__(1);
var $preventExtensions = Object.preventExtensions;

$export($export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target) {
    anObject(target);
    try {
      if ($preventExtensions) $preventExtensions(target);
      return true;
    } catch (e) {
      return false;
    }
  }
});

/***/ }),
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export = __webpack_require__(0);
var setProto = __webpack_require__(81);

if (setProto) $export($export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto) {
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch (e) {
      return false;
    }
  }
});

/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var dP = __webpack_require__(7);
var gOPD = __webpack_require__(15);
var getPrototypeOf = __webpack_require__(16);
var has = __webpack_require__(14);
var $export = __webpack_require__(0);
var createDesc = __webpack_require__(37);
var anObject = __webpack_require__(1);
var isObject = __webpack_require__(4);

function set(target, propertyKey, V /* , receiver */) {
  var receiver = arguments.length < 4 ? target : arguments[3];
  var ownDesc = gOPD.f(anObject(target), propertyKey);
  var existingDescriptor, proto;
  if (!ownDesc) {
    if (isObject(proto = getPrototypeOf(target))) {
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if (has(ownDesc, 'value')) {
    if (ownDesc.writable === false || !isObject(receiver)) return false;
    if (existingDescriptor = gOPD.f(receiver, propertyKey)) {
      if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
      existingDescriptor.value = V;
      dP.f(receiver, propertyKey, existingDescriptor);
    } else dP.f(receiver, propertyKey, createDesc(0, V));
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$export($export.S, 'Reflect', { set: set });

/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var global = __webpack_require__(2);
var inheritIfRequired = __webpack_require__(73);
var dP = __webpack_require__(7).f;
var gOPN = __webpack_require__(35).f;
var isRegExp = __webpack_require__(56);
var $flags = __webpack_require__(54);
var $RegExp = global.RegExp;
var Base = $RegExp;
var proto = $RegExp.prototype;
var re1 = /a/g;
var re2 = /a/g;
// "new" creates a new object, old webkit buggy here
var CORRECT_NEW = new $RegExp(re1) !== re1;

if (__webpack_require__(6) && (!CORRECT_NEW || __webpack_require__(3)(function () {
  re2[__webpack_require__(5)('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))) {
  $RegExp = function RegExp(p, f) {
    var tiRE = this instanceof $RegExp;
    var piRE = isRegExp(p);
    var fiU = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p : inheritIfRequired(CORRECT_NEW ? new Base(piRE && !fiU ? p.source : p, f) : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f), tiRE ? this : proto, $RegExp);
  };
  var proxy = function proxy(key) {
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function get() {
        return Base[key];
      },
      set: function set(it) {
        Base[key] = it;
      }
    });
  };
  for (var keys = gOPN(Base), i = 0; keys.length > i;) {
    proxy(keys[i++]);
  }proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  __webpack_require__(12)(global, 'RegExp', $RegExp);
}

__webpack_require__(39)('RegExp');

/***/ }),
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// @@match logic
__webpack_require__(53)('match', 1, function (defined, MATCH, $match) {
  // 21.1.3.11 String.prototype.match(regexp)
  return [function match(regexp) {
    'use strict';

    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  }, $match];
});

/***/ }),
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// @@replace logic
__webpack_require__(53)('replace', 2, function (defined, REPLACE, $replace) {
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue) {
    'use strict';

    var O = defined(this);
    var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined ? fn.call(searchValue, O, replaceValue) : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});

/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// @@search logic
__webpack_require__(53)('search', 1, function (defined, SEARCH, $search) {
  // 21.1.3.15 String.prototype.search(regexp)
  return [function search(regexp) {
    'use strict';

    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  }, $search];
});

/***/ }),
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// @@split logic
__webpack_require__(53)('split', 2, function (defined, SPLIT, $split) {
  'use strict';

  var isRegExp = __webpack_require__(56);
  var _split = $split;
  var $push = [].push;
  var $SPLIT = 'split';
  var LENGTH = 'length';
  var LAST_INDEX = 'lastIndex';
  if ('abbc'[$SPLIT](/(b)*/)[1] == 'c' || 'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 || 'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 || '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 || '.'[$SPLIT](/()()/)[LENGTH] > 1 || ''[$SPLIT](/.?/)[LENGTH]) {
    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
    // based on es5-shim implementation, need to rework it
    $split = function $split(separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) return _split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.unicode ? 'u' : '') + (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var separator2, match, lastIndex, lastLength, i;
      // Doesn't need flags gy, but they don't hurt
      if (!NPCG) separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
      while (match = separatorCopy.exec(string)) {
        // `separatorCopy.lastIndex` is not reliable cross-browser
        lastIndex = match.index + match[0][LENGTH];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
          // eslint-disable-next-line no-loop-func
          if (!NPCG && match[LENGTH] > 1) match[0].replace(separator2, function () {
            for (i = 1; i < arguments[LENGTH] - 2; i++) {
              if (arguments[i] === undefined) match[i] = undefined;
            }
          });
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
    // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    $split = function $split(separator, limit) {
      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
    };
  }
  // 21.1.3.17 String.prototype.split(separator, limit)
  return [function split(separator, limit) {
    var O = defined(this);
    var fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
  }, $split];
});

/***/ }),
/* 251 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(129);
var anObject = __webpack_require__(1);
var $flags = __webpack_require__(54);
var DESCRIPTORS = __webpack_require__(6);
var TO_STRING = 'toString';
var $toString = /./[TO_STRING];

var define = function define(fn) {
  __webpack_require__(12)(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if (__webpack_require__(3)(function () {
  return $toString.call({ source: 'a', flags: 'b' }) != '/a/b';
})) {
  define(function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/', 'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
  // FF44- RegExp#toString has a wrong name
} else if ($toString.name != TO_STRING) {
  define(function toString() {
    return $toString.call(this);
  });
}

/***/ }),
/* 252 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.2 String.prototype.anchor(name)

__webpack_require__(13)('anchor', function (createHTML) {
  return function anchor(name) {
    return createHTML(this, 'a', 'name', name);
  };
});

/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.3 String.prototype.big()

__webpack_require__(13)('big', function (createHTML) {
  return function big() {
    return createHTML(this, 'big', '', '');
  };
});

/***/ }),
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.4 String.prototype.blink()

__webpack_require__(13)('blink', function (createHTML) {
  return function blink() {
    return createHTML(this, 'blink', '', '');
  };
});

/***/ }),
/* 255 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.5 String.prototype.bold()

__webpack_require__(13)('bold', function (createHTML) {
  return function bold() {
    return createHTML(this, 'b', '', '');
  };
});

/***/ }),
/* 256 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
var $at = __webpack_require__(83)(false);
$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos) {
    return $at(this, pos);
  }
});

/***/ }),
/* 257 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])


var $export = __webpack_require__(0);
var toLength = __webpack_require__(8);
var context = __webpack_require__(84);
var ENDS_WITH = 'endsWith';
var $endsWith = ''[ENDS_WITH];

$export($export.P + $export.F * __webpack_require__(71)(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /* , endPosition = @length */) {
    var that = context(this, searchString, ENDS_WITH);
    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
    var len = toLength(that.length);
    var end = endPosition === undefined ? len : Math.min(toLength(endPosition), len);
    var search = String(searchString);
    return $endsWith ? $endsWith.call(that, search, end) : that.slice(end - search.length, end) === search;
  }
});

/***/ }),
/* 258 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.6 String.prototype.fixed()

__webpack_require__(13)('fixed', function (createHTML) {
  return function fixed() {
    return createHTML(this, 'tt', '', '');
  };
});

/***/ }),
/* 259 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.7 String.prototype.fontcolor(color)

__webpack_require__(13)('fontcolor', function (createHTML) {
  return function fontcolor(color) {
    return createHTML(this, 'font', 'color', color);
  };
});

/***/ }),
/* 260 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.8 String.prototype.fontsize(size)

__webpack_require__(13)('fontsize', function (createHTML) {
  return function fontsize(size) {
    return createHTML(this, 'font', 'size', size);
  };
});

/***/ }),
/* 261 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
var toAbsoluteIndex = __webpack_require__(40);
var fromCharCode = String.fromCharCode;
var $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x) {
    // eslint-disable-line no-unused-vars
    var res = [];
    var aLen = arguments.length;
    var i = 0;
    var code;
    while (aLen > i) {
      code = +arguments[i++];
      if (toAbsoluteIndex(code, 0x10ffff) !== code) throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000 ? fromCharCode(code) : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00));
    }return res.join('');
  }
});

/***/ }),
/* 262 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.7 String.prototype.includes(searchString, position = 0)


var $export = __webpack_require__(0);
var context = __webpack_require__(84);
var INCLUDES = 'includes';

$export($export.P + $export.F * __webpack_require__(71)(INCLUDES), 'String', {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~context(this, searchString, INCLUDES).indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});

/***/ }),
/* 263 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.9 String.prototype.italics()

__webpack_require__(13)('italics', function (createHTML) {
  return function italics() {
    return createHTML(this, 'i', '', '');
  };
});

/***/ }),
/* 264 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $at = __webpack_require__(83)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(76)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0; // next index
  // 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

/***/ }),
/* 265 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.10 String.prototype.link(url)

__webpack_require__(13)('link', function (createHTML) {
  return function link(url) {
    return createHTML(this, 'a', 'href', url);
  };
});

/***/ }),
/* 266 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
var toIObject = __webpack_require__(17);
var toLength = __webpack_require__(8);

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite) {
    var tpl = toIObject(callSite.raw);
    var len = toLength(tpl.length);
    var aLen = arguments.length;
    var res = [];
    var i = 0;
    while (len > i) {
      res.push(String(tpl[i++]));
      if (i < aLen) res.push(String(arguments[i]));
    }return res.join('');
  }
});

/***/ }),
/* 267 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: __webpack_require__(85)
});

/***/ }),
/* 268 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.11 String.prototype.small()

__webpack_require__(13)('small', function (createHTML) {
  return function small() {
    return createHTML(this, 'small', '', '');
  };
});

/***/ }),
/* 269 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])


var $export = __webpack_require__(0);
var toLength = __webpack_require__(8);
var context = __webpack_require__(84);
var STARTS_WITH = 'startsWith';
var $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * __webpack_require__(71)(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = context(this, searchString, STARTS_WITH);
    var index = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return $startsWith ? $startsWith.call(that, search, index) : that.slice(index, index + search.length) === search;
  }
});

/***/ }),
/* 270 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.12 String.prototype.strike()

__webpack_require__(13)('strike', function (createHTML) {
  return function strike() {
    return createHTML(this, 'strike', '', '');
  };
});

/***/ }),
/* 271 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.13 String.prototype.sub()

__webpack_require__(13)('sub', function (createHTML) {
  return function sub() {
    return createHTML(this, 'sub', '', '');
  };
});

/***/ }),
/* 272 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.14 String.prototype.sup()

__webpack_require__(13)('sup', function (createHTML) {
  return function sup() {
    return createHTML(this, 'sup', '', '');
  };
});

/***/ }),
/* 273 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.1.3.25 String.prototype.trim()

__webpack_require__(44)('trim', function ($trim) {
  return function trim() {
    return $trim(this, 3);
  };
});

/***/ }),
/* 274 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var global = __webpack_require__(2);
var has = __webpack_require__(14);
var DESCRIPTORS = __webpack_require__(6);
var $export = __webpack_require__(0);
var redefine = __webpack_require__(12);
var META = __webpack_require__(30).KEY;
var $fails = __webpack_require__(3);
var shared = __webpack_require__(62);
var setToStringTag = __webpack_require__(43);
var uid = __webpack_require__(41);
var wks = __webpack_require__(5);
var wksExt = __webpack_require__(127);
var wksDefine = __webpack_require__(90);
var enumKeys = __webpack_require__(151);
var isArray = __webpack_require__(55);
var anObject = __webpack_require__(1);
var isObject = __webpack_require__(4);
var toIObject = __webpack_require__(17);
var toPrimitive = __webpack_require__(26);
var createDesc = __webpack_require__(37);
var _create = __webpack_require__(34);
var gOPNExt = __webpack_require__(117);
var $GOPD = __webpack_require__(15);
var $DP = __webpack_require__(7);
var $keys = __webpack_require__(36);
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function get() {
      return dP(this, 'a', { value: 7 }).a;
    }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function wrap(tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && _typeof($Symbol.iterator) == 'symbol' ? function (it) {
  return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    }return setSymbolDesc(it, key, D);
  }return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) {
    $defineProperty(it, key = keys[i++], P[key]);
  }return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  }return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  }return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function _Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function $set(value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  __webpack_require__(35).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(48).f = $propertyIsEnumerable;
  __webpack_require__(59).f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !__webpack_require__(33)) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols =
// 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'.split(','), j = 0; es6Symbols.length > j;) {
  wks(es6Symbols[j++]);
}for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) {
  wksDefine(wellKnownSymbols[k++]);
}$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function _for(key) {
    return has(SymbolRegistry, key += '') ? SymbolRegistry[key] : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) {
      if (SymbolRegistry[key] === sym) return key;
    }
  },
  useSetter: function useSetter() {
    setter = true;
  },
  useSimple: function useSimple() {
    setter = false;
  }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) {
      args.push(arguments[i++]);
    }$replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function replacer(key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(11)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

/***/ }),
/* 275 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
var $typed = __webpack_require__(64);
var buffer = __webpack_require__(88);
var anObject = __webpack_require__(1);
var toAbsoluteIndex = __webpack_require__(40);
var toLength = __webpack_require__(8);
var isObject = __webpack_require__(4);
var ArrayBuffer = __webpack_require__(2).ArrayBuffer;
var speciesConstructor = __webpack_require__(63);
var $ArrayBuffer = buffer.ArrayBuffer;
var $DataView = buffer.DataView;
var $isView = $typed.ABV && ArrayBuffer.isView;
var $slice = $ArrayBuffer.prototype.slice;
var VIEW = $typed.VIEW;
var ARRAY_BUFFER = 'ArrayBuffer';

$export($export.G + $export.W + $export.F * (ArrayBuffer !== $ArrayBuffer), { ArrayBuffer: $ArrayBuffer });

$export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
  // 24.1.3.1 ArrayBuffer.isView(arg)
  isView: function isView(it) {
    return $isView && $isView(it) || isObject(it) && VIEW in it;
  }
});

$export($export.P + $export.U + $export.F * __webpack_require__(3)(function () {
  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
}), ARRAY_BUFFER, {
  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
  slice: function slice(start, end) {
    if ($slice !== undefined && end === undefined) return $slice.call(anObject(this), start); // FF fix
    var len = anObject(this).byteLength;
    var first = toAbsoluteIndex(start, len);
    var final = toAbsoluteIndex(end === undefined ? len : end, len);
    var result = new (speciesConstructor(this, $ArrayBuffer))(toLength(final - first));
    var viewS = new $DataView(this);
    var viewT = new $DataView(result);
    var index = 0;
    while (first < final) {
      viewT.setUint8(index++, viewS.getUint8(first++));
    }return result;
  }
});

__webpack_require__(39)(ARRAY_BUFFER);

/***/ }),
/* 276 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
$export($export.G + $export.W + $export.F * !__webpack_require__(64).ABV, {
  DataView: __webpack_require__(88).DataView
});

/***/ }),
/* 277 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(28)('Float32', 4, function (init) {
  return function Float32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 278 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(28)('Float64', 8, function (init) {
  return function Float64Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 279 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(28)('Int16', 2, function (init) {
  return function Int16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 280 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(28)('Int32', 4, function (init) {
  return function Int32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 281 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(28)('Int8', 1, function (init) {
  return function Int8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 282 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(28)('Uint16', 2, function (init) {
  return function Uint16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 283 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(28)('Uint32', 4, function (init) {
  return function Uint32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 284 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(28)('Uint8', 1, function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 285 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(28)('Uint8', 1, function (init) {
  return function Uint8ClampedArray(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
}, true);

/***/ }),
/* 286 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var weak = __webpack_require__(105);
var validate = __webpack_require__(45);
var WEAK_SET = 'WeakSet';

// 23.4 WeakSet Objects
__webpack_require__(52)(WEAK_SET, function (get) {
  return function WeakSet() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value) {
    return weak.def(validate(this, WEAK_SET), value, true);
  }
}, weak, false, true);

/***/ }),
/* 287 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatMap

var $export = __webpack_require__(0);
var flattenIntoArray = __webpack_require__(106);
var toObject = __webpack_require__(9);
var toLength = __webpack_require__(8);
var aFunction = __webpack_require__(10);
var arraySpeciesCreate = __webpack_require__(67);

$export($export.P, 'Array', {
  flatMap: function flatMap(callbackfn /* , thisArg */) {
    var O = toObject(this);
    var sourceLen, A;
    aFunction(callbackfn);
    sourceLen = toLength(O.length);
    A = arraySpeciesCreate(O, 0);
    flattenIntoArray(A, O, O, sourceLen, 0, 1, callbackfn, arguments[1]);
    return A;
  }
});

__webpack_require__(29)('flatMap');

/***/ }),
/* 288 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatten

var $export = __webpack_require__(0);
var flattenIntoArray = __webpack_require__(106);
var toObject = __webpack_require__(9);
var toLength = __webpack_require__(8);
var toInteger = __webpack_require__(25);
var arraySpeciesCreate = __webpack_require__(67);

$export($export.P, 'Array', {
  flatten: function flatten() /* depthArg = 1 */{
    var depthArg = arguments[0];
    var O = toObject(this);
    var sourceLen = toLength(O.length);
    var A = arraySpeciesCreate(O, 0);
    flattenIntoArray(A, O, O, sourceLen, 0, depthArg === undefined ? 1 : toInteger(depthArg));
    return A;
  }
});

__webpack_require__(29)('flatten');

/***/ }),
/* 289 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/Array.prototype.includes

var $export = __webpack_require__(0);
var $includes = __webpack_require__(51)(true);

$export($export.P, 'Array', {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

__webpack_require__(29)('includes');

/***/ }),
/* 290 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://github.com/rwaldron/tc39-notes/blob/master/es6/2014-09/sept-25.md#510-globalasap-for-enqueuing-a-microtask
var $export = __webpack_require__(0);
var microtask = __webpack_require__(79)();
var process = __webpack_require__(2).process;
var isNode = __webpack_require__(18)(process) == 'process';

$export($export.G, {
  asap: function asap(fn) {
    var domain = isNode && process.domain;
    microtask(domain ? domain.bind(fn) : fn);
  }
});

/***/ }),
/* 291 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://github.com/ljharb/proposal-is-error
var $export = __webpack_require__(0);
var cof = __webpack_require__(18);

$export($export.S, 'Error', {
  isError: function isError(it) {
    return cof(it) === 'Error';
  }
});

/***/ }),
/* 292 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://github.com/tc39/proposal-global
var $export = __webpack_require__(0);

$export($export.G, { global: __webpack_require__(2) });

/***/ }),
/* 293 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://tc39.github.io/proposal-setmap-offrom/#sec-map.from
__webpack_require__(60)('Map');

/***/ }),
/* 294 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://tc39.github.io/proposal-setmap-offrom/#sec-map.of
__webpack_require__(61)('Map');

/***/ }),
/* 295 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = __webpack_require__(0);

$export($export.P + $export.R, 'Map', { toJSON: __webpack_require__(104)('Map') });

/***/ }),
/* 296 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://rwaldron.github.io/proposal-math-extensions/
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  clamp: function clamp(x, lower, upper) {
    return Math.min(upper, Math.max(lower, x));
  }
});

/***/ }),
/* 297 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://rwaldron.github.io/proposal-math-extensions/
var $export = __webpack_require__(0);

$export($export.S, 'Math', { DEG_PER_RAD: Math.PI / 180 });

/***/ }),
/* 298 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://rwaldron.github.io/proposal-math-extensions/
var $export = __webpack_require__(0);
var RAD_PER_DEG = 180 / Math.PI;

$export($export.S, 'Math', {
  degrees: function degrees(radians) {
    return radians * RAD_PER_DEG;
  }
});

/***/ }),
/* 299 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://rwaldron.github.io/proposal-math-extensions/
var $export = __webpack_require__(0);
var scale = __webpack_require__(114);
var fround = __webpack_require__(112);

$export($export.S, 'Math', {
  fscale: function fscale(x, inLow, inHigh, outLow, outHigh) {
    return fround(scale(x, inLow, inHigh, outLow, outHigh));
  }
});

/***/ }),
/* 300 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  iaddh: function iaddh(x0, x1, y0, y1) {
    var $x0 = x0 >>> 0;
    var $x1 = x1 >>> 0;
    var $y0 = y0 >>> 0;
    return $x1 + (y1 >>> 0) + (($x0 & $y0 | ($x0 | $y0) & ~($x0 + $y0 >>> 0)) >>> 31) | 0;
  }
});

/***/ }),
/* 301 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  imulh: function imulh(u, v) {
    var UINT16 = 0xffff;
    var $u = +u;
    var $v = +v;
    var u0 = $u & UINT16;
    var v0 = $v & UINT16;
    var u1 = $u >> 16;
    var v1 = $v >> 16;
    var t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >> 16);
  }
});

/***/ }),
/* 302 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  isubh: function isubh(x0, x1, y0, y1) {
    var $x0 = x0 >>> 0;
    var $x1 = x1 >>> 0;
    var $y0 = y0 >>> 0;
    return $x1 - (y1 >>> 0) - ((~$x0 & $y0 | ~($x0 ^ $y0) & $x0 - $y0 >>> 0) >>> 31) | 0;
  }
});

/***/ }),
/* 303 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://rwaldron.github.io/proposal-math-extensions/
var $export = __webpack_require__(0);

$export($export.S, 'Math', { RAD_PER_DEG: 180 / Math.PI });

/***/ }),
/* 304 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://rwaldron.github.io/proposal-math-extensions/
var $export = __webpack_require__(0);
var DEG_PER_RAD = Math.PI / 180;

$export($export.S, 'Math', {
  radians: function radians(degrees) {
    return degrees * DEG_PER_RAD;
  }
});

/***/ }),
/* 305 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://rwaldron.github.io/proposal-math-extensions/
var $export = __webpack_require__(0);

$export($export.S, 'Math', { scale: __webpack_require__(114) });

/***/ }),
/* 306 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// http://jfbastien.github.io/papers/Math.signbit.html
var $export = __webpack_require__(0);

$export($export.S, 'Math', { signbit: function signbit(x) {
    // eslint-disable-next-line no-self-compare
    return (x = +x) != x ? x : x == 0 ? 1 / x == Infinity : x > 0;
  } });

/***/ }),
/* 307 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  umulh: function umulh(u, v) {
    var UINT16 = 0xffff;
    var $u = +u;
    var $v = +v;
    var u0 = $u & UINT16;
    var v0 = $v & UINT16;
    var u1 = $u >>> 16;
    var v1 = $v >>> 16;
    var t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >>> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >>> 16);
  }
});

/***/ }),
/* 308 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
var toObject = __webpack_require__(9);
var aFunction = __webpack_require__(10);
var $defineProperty = __webpack_require__(7);

// B.2.2.2 Object.prototype.__defineGetter__(P, getter)
__webpack_require__(6) && $export($export.P + __webpack_require__(58), 'Object', {
  __defineGetter__: function __defineGetter__(P, getter) {
    $defineProperty.f(toObject(this), P, { get: aFunction(getter), enumerable: true, configurable: true });
  }
});

/***/ }),
/* 309 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
var toObject = __webpack_require__(9);
var aFunction = __webpack_require__(10);
var $defineProperty = __webpack_require__(7);

// B.2.2.3 Object.prototype.__defineSetter__(P, setter)
__webpack_require__(6) && $export($export.P + __webpack_require__(58), 'Object', {
  __defineSetter__: function __defineSetter__(P, setter) {
    $defineProperty.f(toObject(this), P, { set: aFunction(setter), enumerable: true, configurable: true });
  }
});

/***/ }),
/* 310 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://github.com/tc39/proposal-object-values-entries
var $export = __webpack_require__(0);
var $entries = __webpack_require__(119)(true);

$export($export.S, 'Object', {
  entries: function entries(it) {
    return $entries(it);
  }
});

/***/ }),
/* 311 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export = __webpack_require__(0);
var ownKeys = __webpack_require__(120);
var toIObject = __webpack_require__(17);
var gOPD = __webpack_require__(15);
var createProperty = __webpack_require__(68);

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIObject(object);
    var getDesc = gOPD.f;
    var keys = ownKeys(O);
    var result = {};
    var i = 0;
    var key, desc;
    while (keys.length > i) {
      desc = getDesc(O, key = keys[i++]);
      if (desc !== undefined) createProperty(result, key, desc);
    }
    return result;
  }
});

/***/ }),
/* 312 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
var toObject = __webpack_require__(9);
var toPrimitive = __webpack_require__(26);
var getPrototypeOf = __webpack_require__(16);
var getOwnPropertyDescriptor = __webpack_require__(15).f;

// B.2.2.4 Object.prototype.__lookupGetter__(P)
__webpack_require__(6) && $export($export.P + __webpack_require__(58), 'Object', {
  __lookupGetter__: function __lookupGetter__(P) {
    var O = toObject(this);
    var K = toPrimitive(P, true);
    var D;
    do {
      if (D = getOwnPropertyDescriptor(O, K)) return D.get;
    } while (O = getPrototypeOf(O));
  }
});

/***/ }),
/* 313 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
var toObject = __webpack_require__(9);
var toPrimitive = __webpack_require__(26);
var getPrototypeOf = __webpack_require__(16);
var getOwnPropertyDescriptor = __webpack_require__(15).f;

// B.2.2.5 Object.prototype.__lookupSetter__(P)
__webpack_require__(6) && $export($export.P + __webpack_require__(58), 'Object', {
  __lookupSetter__: function __lookupSetter__(P) {
    var O = toObject(this);
    var K = toPrimitive(P, true);
    var D;
    do {
      if (D = getOwnPropertyDescriptor(O, K)) return D.set;
    } while (O = getPrototypeOf(O));
  }
});

/***/ }),
/* 314 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://github.com/tc39/proposal-object-values-entries
var $export = __webpack_require__(0);
var $values = __webpack_require__(119)(false);

$export($export.S, 'Object', {
  values: function values(it) {
    return $values(it);
  }
});

/***/ }),
/* 315 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/zenparsing/es-observable

var $export = __webpack_require__(0);
var global = __webpack_require__(2);
var core = __webpack_require__(22);
var microtask = __webpack_require__(79)();
var OBSERVABLE = __webpack_require__(5)('observable');
var aFunction = __webpack_require__(10);
var anObject = __webpack_require__(1);
var anInstance = __webpack_require__(31);
var redefineAll = __webpack_require__(38);
var hide = __webpack_require__(11);
var forOf = __webpack_require__(32);
var RETURN = forOf.RETURN;

var getMethod = function getMethod(fn) {
  return fn == null ? undefined : aFunction(fn);
};

var cleanupSubscription = function cleanupSubscription(subscription) {
  var cleanup = subscription._c;
  if (cleanup) {
    subscription._c = undefined;
    cleanup();
  }
};

var subscriptionClosed = function subscriptionClosed(subscription) {
  return subscription._o === undefined;
};

var closeSubscription = function closeSubscription(subscription) {
  if (!subscriptionClosed(subscription)) {
    subscription._o = undefined;
    cleanupSubscription(subscription);
  }
};

var Subscription = function Subscription(observer, subscriber) {
  anObject(observer);
  this._c = undefined;
  this._o = observer;
  observer = new SubscriptionObserver(this);
  try {
    var cleanup = subscriber(observer);
    var subscription = cleanup;
    if (cleanup != null) {
      if (typeof cleanup.unsubscribe === 'function') cleanup = function cleanup() {
        subscription.unsubscribe();
      };else aFunction(cleanup);
      this._c = cleanup;
    }
  } catch (e) {
    observer.error(e);
    return;
  }if (subscriptionClosed(this)) cleanupSubscription(this);
};

Subscription.prototype = redefineAll({}, {
  unsubscribe: function unsubscribe() {
    closeSubscription(this);
  }
});

var SubscriptionObserver = function SubscriptionObserver(subscription) {
  this._s = subscription;
};

SubscriptionObserver.prototype = redefineAll({}, {
  next: function next(value) {
    var subscription = this._s;
    if (!subscriptionClosed(subscription)) {
      var observer = subscription._o;
      try {
        var m = getMethod(observer.next);
        if (m) return m.call(observer, value);
      } catch (e) {
        try {
          closeSubscription(subscription);
        } finally {
          throw e;
        }
      }
    }
  },
  error: function error(value) {
    var subscription = this._s;
    if (subscriptionClosed(subscription)) throw value;
    var observer = subscription._o;
    subscription._o = undefined;
    try {
      var m = getMethod(observer.error);
      if (!m) throw value;
      value = m.call(observer, value);
    } catch (e) {
      try {
        cleanupSubscription(subscription);
      } finally {
        throw e;
      }
    }cleanupSubscription(subscription);
    return value;
  },
  complete: function complete(value) {
    var subscription = this._s;
    if (!subscriptionClosed(subscription)) {
      var observer = subscription._o;
      subscription._o = undefined;
      try {
        var m = getMethod(observer.complete);
        value = m ? m.call(observer, value) : undefined;
      } catch (e) {
        try {
          cleanupSubscription(subscription);
        } finally {
          throw e;
        }
      }cleanupSubscription(subscription);
      return value;
    }
  }
});

var $Observable = function Observable(subscriber) {
  anInstance(this, $Observable, 'Observable', '_f')._f = aFunction(subscriber);
};

redefineAll($Observable.prototype, {
  subscribe: function subscribe(observer) {
    return new Subscription(observer, this._f);
  },
  forEach: function forEach(fn) {
    var that = this;
    return new (core.Promise || global.Promise)(function (resolve, reject) {
      aFunction(fn);
      var subscription = that.subscribe({
        next: function next(value) {
          try {
            return fn(value);
          } catch (e) {
            reject(e);
            subscription.unsubscribe();
          }
        },
        error: reject,
        complete: resolve
      });
    });
  }
});

redefineAll($Observable, {
  from: function from(x) {
    var C = typeof this === 'function' ? this : $Observable;
    var method = getMethod(anObject(x)[OBSERVABLE]);
    if (method) {
      var observable = anObject(method.call(x));
      return observable.constructor === C ? observable : new C(function (observer) {
        return observable.subscribe(observer);
      });
    }
    return new C(function (observer) {
      var done = false;
      microtask(function () {
        if (!done) {
          try {
            if (forOf(x, false, function (it) {
              observer.next(it);
              if (done) return RETURN;
            }) === RETURN) return;
          } catch (e) {
            if (done) throw e;
            observer.error(e);
            return;
          }observer.complete();
        }
      });
      return function () {
        done = true;
      };
    });
  },
  of: function of() {
    for (var i = 0, l = arguments.length, items = new Array(l); i < l;) {
      items[i] = arguments[i++];
    }return new (typeof this === 'function' ? this : $Observable)(function (observer) {
      var done = false;
      microtask(function () {
        if (!done) {
          for (var j = 0; j < items.length; ++j) {
            observer.next(items[j]);
            if (done) return;
          }observer.complete();
        }
      });
      return function () {
        done = true;
      };
    });
  }
});

hide($Observable.prototype, OBSERVABLE, function () {
  return this;
});

$export($export.G, { Observable: $Observable });

__webpack_require__(39)('Observable');

/***/ }),
/* 316 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// https://github.com/tc39/proposal-promise-finally


var $export = __webpack_require__(0);
var core = __webpack_require__(22);
var global = __webpack_require__(2);
var speciesConstructor = __webpack_require__(63);
var promiseResolve = __webpack_require__(124);

$export($export.P + $export.R, 'Promise', { 'finally': function _finally(onFinally) {
    var C = speciesConstructor(this, core.Promise || global.Promise);
    var isFunction = typeof onFinally == 'function';
    return this.then(isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () {
        return x;
      });
    } : onFinally, isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () {
        throw e;
      });
    } : onFinally);
  } });

/***/ }),
/* 317 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-promise-try

var $export = __webpack_require__(0);
var newPromiseCapability = __webpack_require__(80);
var perform = __webpack_require__(123);

$export($export.S, 'Promise', { 'try': function _try(callbackfn) {
    var promiseCapability = newPromiseCapability.f(this);
    var result = perform(callbackfn);
    (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
    return promiseCapability.promise;
  } });

/***/ }),
/* 318 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var metadata = __webpack_require__(27);
var anObject = __webpack_require__(1);
var toMetaKey = metadata.key;
var ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({ defineMetadata: function defineMetadata(metadataKey, metadataValue, target, targetKey) {
    ordinaryDefineOwnMetadata(metadataKey, metadataValue, anObject(target), toMetaKey(targetKey));
  } });

/***/ }),
/* 319 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var metadata = __webpack_require__(27);
var anObject = __webpack_require__(1);
var toMetaKey = metadata.key;
var getOrCreateMetadataMap = metadata.map;
var store = metadata.store;

metadata.exp({ deleteMetadata: function deleteMetadata(metadataKey, target /* , targetKey */) {
    var targetKey = arguments.length < 3 ? undefined : toMetaKey(arguments[2]);
    var metadataMap = getOrCreateMetadataMap(anObject(target), targetKey, false);
    if (metadataMap === undefined || !metadataMap['delete'](metadataKey)) return false;
    if (metadataMap.size) return true;
    var targetMetadata = store.get(target);
    targetMetadata['delete'](targetKey);
    return !!targetMetadata.size || store['delete'](target);
  } });

/***/ }),
/* 320 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Set = __webpack_require__(130);
var from = __webpack_require__(100);
var metadata = __webpack_require__(27);
var anObject = __webpack_require__(1);
var getPrototypeOf = __webpack_require__(16);
var ordinaryOwnMetadataKeys = metadata.keys;
var toMetaKey = metadata.key;

var ordinaryMetadataKeys = function ordinaryMetadataKeys(O, P) {
  var oKeys = ordinaryOwnMetadataKeys(O, P);
  var parent = getPrototypeOf(O);
  if (parent === null) return oKeys;
  var pKeys = ordinaryMetadataKeys(parent, P);
  return pKeys.length ? oKeys.length ? from(new Set(oKeys.concat(pKeys))) : pKeys : oKeys;
};

metadata.exp({ getMetadataKeys: function getMetadataKeys(target /* , targetKey */) {
    return ordinaryMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
  } });

/***/ }),
/* 321 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var metadata = __webpack_require__(27);
var anObject = __webpack_require__(1);
var getPrototypeOf = __webpack_require__(16);
var ordinaryHasOwnMetadata = metadata.has;
var ordinaryGetOwnMetadata = metadata.get;
var toMetaKey = metadata.key;

var ordinaryGetMetadata = function ordinaryGetMetadata(MetadataKey, O, P) {
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if (hasOwn) return ordinaryGetOwnMetadata(MetadataKey, O, P);
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryGetMetadata(MetadataKey, parent, P) : undefined;
};

metadata.exp({ getMetadata: function getMetadata(metadataKey, target /* , targetKey */) {
    return ordinaryGetMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
  } });

/***/ }),
/* 322 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var metadata = __webpack_require__(27);
var anObject = __webpack_require__(1);
var ordinaryOwnMetadataKeys = metadata.keys;
var toMetaKey = metadata.key;

metadata.exp({ getOwnMetadataKeys: function getOwnMetadataKeys(target /* , targetKey */) {
    return ordinaryOwnMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
  } });

/***/ }),
/* 323 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var metadata = __webpack_require__(27);
var anObject = __webpack_require__(1);
var ordinaryGetOwnMetadata = metadata.get;
var toMetaKey = metadata.key;

metadata.exp({ getOwnMetadata: function getOwnMetadata(metadataKey, target /* , targetKey */) {
    return ordinaryGetOwnMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
  } });

/***/ }),
/* 324 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var metadata = __webpack_require__(27);
var anObject = __webpack_require__(1);
var getPrototypeOf = __webpack_require__(16);
var ordinaryHasOwnMetadata = metadata.has;
var toMetaKey = metadata.key;

var ordinaryHasMetadata = function ordinaryHasMetadata(MetadataKey, O, P) {
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if (hasOwn) return true;
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryHasMetadata(MetadataKey, parent, P) : false;
};

metadata.exp({ hasMetadata: function hasMetadata(metadataKey, target /* , targetKey */) {
    return ordinaryHasMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
  } });

/***/ }),
/* 325 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var metadata = __webpack_require__(27);
var anObject = __webpack_require__(1);
var ordinaryHasOwnMetadata = metadata.has;
var toMetaKey = metadata.key;

metadata.exp({ hasOwnMetadata: function hasOwnMetadata(metadataKey, target /* , targetKey */) {
    return ordinaryHasOwnMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
  } });

/***/ }),
/* 326 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $metadata = __webpack_require__(27);
var anObject = __webpack_require__(1);
var aFunction = __webpack_require__(10);
var toMetaKey = $metadata.key;
var ordinaryDefineOwnMetadata = $metadata.set;

$metadata.exp({ metadata: function metadata(metadataKey, metadataValue) {
    return function decorator(target, targetKey) {
      ordinaryDefineOwnMetadata(metadataKey, metadataValue, (targetKey !== undefined ? anObject : aFunction)(target), toMetaKey(targetKey));
    };
  } });

/***/ }),
/* 327 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://tc39.github.io/proposal-setmap-offrom/#sec-set.from
__webpack_require__(60)('Set');

/***/ }),
/* 328 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://tc39.github.io/proposal-setmap-offrom/#sec-set.of
__webpack_require__(61)('Set');

/***/ }),
/* 329 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = __webpack_require__(0);

$export($export.P + $export.R, 'Set', { toJSON: __webpack_require__(104)('Set') });

/***/ }),
/* 330 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/mathiasbynens/String.prototype.at

var $export = __webpack_require__(0);
var $at = __webpack_require__(83)(true);

$export($export.P, 'String', {
  at: function at(pos) {
    return $at(this, pos);
  }
});

/***/ }),
/* 331 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/String.prototype.matchAll/

var $export = __webpack_require__(0);
var defined = __webpack_require__(23);
var toLength = __webpack_require__(8);
var isRegExp = __webpack_require__(56);
var getFlags = __webpack_require__(54);
var RegExpProto = RegExp.prototype;

var $RegExpStringIterator = function $RegExpStringIterator(regexp, string) {
  this._r = regexp;
  this._s = string;
};

__webpack_require__(75)($RegExpStringIterator, 'RegExp String', function next() {
  var match = this._r.exec(this._s);
  return { value: match, done: match === null };
});

$export($export.P, 'String', {
  matchAll: function matchAll(regexp) {
    defined(this);
    if (!isRegExp(regexp)) throw TypeError(regexp + ' is not a regexp!');
    var S = String(this);
    var flags = 'flags' in RegExpProto ? String(regexp.flags) : getFlags.call(regexp);
    var rx = new RegExp(regexp.source, ~flags.indexOf('g') ? flags : 'g' + flags);
    rx.lastIndex = toLength(regexp.lastIndex);
    return new $RegExpStringIterator(rx, S);
  }
});

/***/ }),
/* 332 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-string-pad-start-end

var $export = __webpack_require__(0);
var $pad = __webpack_require__(125);
var userAgent = __webpack_require__(89);

// https://github.com/zloirock/core-js/issues/280
$export($export.P + $export.F * /Version\/10\.\d+(\.\d+)? Safari\//.test(userAgent), 'String', {
  padEnd: function padEnd(maxLength /* , fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});

/***/ }),
/* 333 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-string-pad-start-end

var $export = __webpack_require__(0);
var $pad = __webpack_require__(125);
var userAgent = __webpack_require__(89);

// https://github.com/zloirock/core-js/issues/280
$export($export.P + $export.F * /Version\/10\.\d+(\.\d+)? Safari\//.test(userAgent), 'String', {
  padStart: function padStart(maxLength /* , fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});

/***/ }),
/* 334 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/sebmarkbage/ecmascript-string-left-right-trim

__webpack_require__(44)('trimLeft', function ($trim) {
  return function trimLeft() {
    return $trim(this, 1);
  };
}, 'trimStart');

/***/ }),
/* 335 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/sebmarkbage/ecmascript-string-left-right-trim

__webpack_require__(44)('trimRight', function ($trim) {
  return function trimRight() {
    return $trim(this, 2);
  };
}, 'trimEnd');

/***/ }),
/* 336 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(90)('asyncIterator');

/***/ }),
/* 337 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(90)('observable');

/***/ }),
/* 338 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://github.com/tc39/proposal-global
var $export = __webpack_require__(0);

$export($export.S, 'System', { global: __webpack_require__(2) });

/***/ }),
/* 339 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.from
__webpack_require__(60)('WeakMap');

/***/ }),
/* 340 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.of
__webpack_require__(61)('WeakMap');

/***/ }),
/* 341 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://tc39.github.io/proposal-setmap-offrom/#sec-weakset.from
__webpack_require__(60)('WeakSet');

/***/ }),
/* 342 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://tc39.github.io/proposal-setmap-offrom/#sec-weakset.of
__webpack_require__(61)('WeakSet');

/***/ }),
/* 343 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $iterators = __webpack_require__(92);
var getKeys = __webpack_require__(36);
var redefine = __webpack_require__(12);
var global = __webpack_require__(2);
var hide = __webpack_require__(11);
var Iterators = __webpack_require__(42);
var wks = __webpack_require__(5);
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) {
      if (!proto[key]) redefine(proto, key, $iterators[key], true);
    }
  }
}

/***/ }),
/* 344 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(0);
var $task = __webpack_require__(87);
$export($export.G + $export.B, {
  setImmediate: $task.set,
  clearImmediate: $task.clear
});

/***/ }),
/* 345 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// ie9- setTimeout & setInterval additional parameters fix
var global = __webpack_require__(2);
var $export = __webpack_require__(0);
var userAgent = __webpack_require__(89);
var slice = [].slice;
var MSIE = /MSIE .\./.test(userAgent); // <- dirty ie9- check
var wrap = function wrap(set) {
  return function (fn, time /* , ...args */) {
    var boundArgs = arguments.length > 2;
    var args = boundArgs ? slice.call(arguments, 2) : false;
    return set(boundArgs ? function () {
      // eslint-disable-next-line no-new-func
      (typeof fn == 'function' ? fn : Function(fn)).apply(this, args);
    } : fn, time);
  };
};
$export($export.G + $export.B + $export.F * MSIE, {
  setTimeout: wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});

/***/ }),
/* 346 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(274);
__webpack_require__(213);
__webpack_require__(215);
__webpack_require__(214);
__webpack_require__(217);
__webpack_require__(219);
__webpack_require__(224);
__webpack_require__(218);
__webpack_require__(216);
__webpack_require__(226);
__webpack_require__(225);
__webpack_require__(221);
__webpack_require__(222);
__webpack_require__(220);
__webpack_require__(212);
__webpack_require__(223);
__webpack_require__(227);
__webpack_require__(228);
__webpack_require__(180);
__webpack_require__(182);
__webpack_require__(181);
__webpack_require__(230);
__webpack_require__(229);
__webpack_require__(200);
__webpack_require__(210);
__webpack_require__(211);
__webpack_require__(201);
__webpack_require__(202);
__webpack_require__(203);
__webpack_require__(204);
__webpack_require__(205);
__webpack_require__(206);
__webpack_require__(207);
__webpack_require__(208);
__webpack_require__(209);
__webpack_require__(183);
__webpack_require__(184);
__webpack_require__(185);
__webpack_require__(186);
__webpack_require__(187);
__webpack_require__(188);
__webpack_require__(189);
__webpack_require__(190);
__webpack_require__(191);
__webpack_require__(192);
__webpack_require__(193);
__webpack_require__(194);
__webpack_require__(195);
__webpack_require__(196);
__webpack_require__(197);
__webpack_require__(198);
__webpack_require__(199);
__webpack_require__(261);
__webpack_require__(266);
__webpack_require__(273);
__webpack_require__(264);
__webpack_require__(256);
__webpack_require__(257);
__webpack_require__(262);
__webpack_require__(267);
__webpack_require__(269);
__webpack_require__(252);
__webpack_require__(253);
__webpack_require__(254);
__webpack_require__(255);
__webpack_require__(258);
__webpack_require__(259);
__webpack_require__(260);
__webpack_require__(263);
__webpack_require__(265);
__webpack_require__(268);
__webpack_require__(270);
__webpack_require__(271);
__webpack_require__(272);
__webpack_require__(175);
__webpack_require__(177);
__webpack_require__(176);
__webpack_require__(179);
__webpack_require__(178);
__webpack_require__(164);
__webpack_require__(162);
__webpack_require__(168);
__webpack_require__(165);
__webpack_require__(171);
__webpack_require__(173);
__webpack_require__(161);
__webpack_require__(167);
__webpack_require__(158);
__webpack_require__(172);
__webpack_require__(156);
__webpack_require__(170);
__webpack_require__(169);
__webpack_require__(163);
__webpack_require__(166);
__webpack_require__(155);
__webpack_require__(157);
__webpack_require__(160);
__webpack_require__(159);
__webpack_require__(174);
__webpack_require__(92);
__webpack_require__(246);
__webpack_require__(251);
__webpack_require__(129);
__webpack_require__(247);
__webpack_require__(248);
__webpack_require__(249);
__webpack_require__(250);
__webpack_require__(231);
__webpack_require__(128);
__webpack_require__(130);
__webpack_require__(131);
__webpack_require__(286);
__webpack_require__(275);
__webpack_require__(276);
__webpack_require__(281);
__webpack_require__(284);
__webpack_require__(285);
__webpack_require__(279);
__webpack_require__(282);
__webpack_require__(280);
__webpack_require__(283);
__webpack_require__(277);
__webpack_require__(278);
__webpack_require__(232);
__webpack_require__(233);
__webpack_require__(234);
__webpack_require__(235);
__webpack_require__(236);
__webpack_require__(239);
__webpack_require__(237);
__webpack_require__(238);
__webpack_require__(240);
__webpack_require__(241);
__webpack_require__(242);
__webpack_require__(243);
__webpack_require__(245);
__webpack_require__(244);
__webpack_require__(289);
__webpack_require__(287);
__webpack_require__(288);
__webpack_require__(330);
__webpack_require__(333);
__webpack_require__(332);
__webpack_require__(334);
__webpack_require__(335);
__webpack_require__(331);
__webpack_require__(336);
__webpack_require__(337);
__webpack_require__(311);
__webpack_require__(314);
__webpack_require__(310);
__webpack_require__(308);
__webpack_require__(309);
__webpack_require__(312);
__webpack_require__(313);
__webpack_require__(295);
__webpack_require__(329);
__webpack_require__(294);
__webpack_require__(328);
__webpack_require__(340);
__webpack_require__(342);
__webpack_require__(293);
__webpack_require__(327);
__webpack_require__(339);
__webpack_require__(341);
__webpack_require__(292);
__webpack_require__(338);
__webpack_require__(291);
__webpack_require__(296);
__webpack_require__(297);
__webpack_require__(298);
__webpack_require__(299);
__webpack_require__(300);
__webpack_require__(302);
__webpack_require__(301);
__webpack_require__(303);
__webpack_require__(304);
__webpack_require__(305);
__webpack_require__(307);
__webpack_require__(306);
__webpack_require__(316);
__webpack_require__(317);
__webpack_require__(318);
__webpack_require__(319);
__webpack_require__(321);
__webpack_require__(320);
__webpack_require__(323);
__webpack_require__(322);
__webpack_require__(324);
__webpack_require__(325);
__webpack_require__(326);
__webpack_require__(290);
__webpack_require__(315);
__webpack_require__(345);
__webpack_require__(344);
__webpack_require__(343);
module.exports = __webpack_require__(22);

/***/ }),
/* 347 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * The reveal.js markdown plugin. Handles parsing of
 * markdown inside of presentations as well as loading
 * of external markdown documents.
 */
(function (root, factory) {
	if (( false ? 'undefined' : _typeof(exports)) === 'object') {
		module.exports = factory(__webpack_require__(354));
	} else {
		// Browser globals (root is window)
		root.RevealMarkdown = factory(root.marked);
		root.RevealMarkdown.initialize();
	}
})(undefined, function (marked) {

	if (typeof marked === 'undefined') {
		throw 'The reveal.js Markdown plugin requires marked to be loaded';
	}

	if (typeof hljs !== 'undefined') {
		marked.setOptions({
			highlight: function highlight(lang, code) {
				return hljs.highlightAuto(lang, code).value;
			}
		});
	}

	var DEFAULT_SLIDE_SEPARATOR = '^\r?\n---\r?\n$',
	    DEFAULT_NOTES_SEPARATOR = 'note:',
	    DEFAULT_ELEMENT_ATTRIBUTES_SEPARATOR = '\\\.element\\\s*?(.+?)$',
	    DEFAULT_SLIDE_ATTRIBUTES_SEPARATOR = '\\\.slide:\\\s*?(\\\S.+?)$';

	/**
  * Retrieves the markdown contents of a slide section
  * element. Normalizes leading tabs/whitespace.
  */
	function getMarkdownFromSlide(section) {

		var template = section.querySelector('script');

		// strip leading whitespace so it isn't evaluated as code
		var text = (template || section).textContent;

		var leadingWs = text.match(/^\n?(\s*)/)[1].length,
		    leadingTabs = text.match(/^\n?(\t*)/)[1].length;

		if (leadingTabs > 0) {
			text = text.replace(new RegExp('\\n?\\t{' + leadingTabs + '}', 'g'), '\n');
		} else if (leadingWs > 1) {
			text = text.replace(new RegExp('\\n? {' + leadingWs + '}', 'g'), '\n');
		}

		return text;
	}

	/**
  * Given a markdown slide section element, this will
  * return all arguments that aren't related to markdown
  * parsing. Used to forward any other user-defined arguments
  * to the output markdown slide.
  */
	function getForwardedAttributes(section) {

		var attributes = section.attributes;
		var result = [];

		for (var i = 0, len = attributes.length; i < len; i++) {
			var name = attributes[i].name,
			    value = attributes[i].value;

			// disregard attributes that are used for markdown loading/parsing
			if (/data\-(markdown|separator|vertical|notes)/gi.test(name)) continue;

			if (value) {
				result.push(name + '="' + value + '"');
			} else {
				result.push(name);
			}
		}

		return result.join(' ');
	}

	/**
  * Inspects the given options and fills out default
  * values for what's not defined.
  */
	function getSlidifyOptions(options) {

		options = options || {};
		options.separator = options.separator || DEFAULT_SLIDE_SEPARATOR;
		options.notesSeparator = options.notesSeparator || DEFAULT_NOTES_SEPARATOR;
		options.attributes = options.attributes || '';

		return options;
	}

	/**
  * Helper function for constructing a markdown slide.
  */
	function createMarkdownSlide(content, options) {

		options = getSlidifyOptions(options);

		var notesMatch = content.split(new RegExp(options.notesSeparator, 'mgi'));

		if (notesMatch.length === 2) {
			content = notesMatch[0] + '<aside class="notes" data-markdown>' + notesMatch[1].trim() + '</aside>';
		}

		return '<script type="text/template">' + content + '</script>';
	}

	/**
  * Parses a data string into multiple slides based
  * on the passed in separator arguments.
  */
	function slidify(markdown, options) {

		options = getSlidifyOptions(options);

		var separatorRegex = new RegExp(options.separator + (options.verticalSeparator ? '|' + options.verticalSeparator : ''), 'mg'),
		    horizontalSeparatorRegex = new RegExp(options.separator);

		var matches,
		    lastIndex = 0,
		    isHorizontal,
		    wasHorizontal = true,
		    content,
		    notes,
		    sectionStack = [];

		// iterate until all blocks between separators are stacked up
		while (matches = separatorRegex.exec(markdown)) {
			notes = null;

			// determine direction (horizontal by default)
			isHorizontal = horizontalSeparatorRegex.test(matches[0]);

			if (!isHorizontal && wasHorizontal) {
				// create vertical stack
				sectionStack.push([]);
			}

			// pluck slide content from markdown input
			content = markdown.substring(lastIndex, matches.index);

			if (isHorizontal && wasHorizontal) {
				// add to horizontal stack
				sectionStack.push(content);
			} else {
				// add to vertical stack
				sectionStack[sectionStack.length - 1].push(content);
			}

			lastIndex = separatorRegex.lastIndex;
			wasHorizontal = isHorizontal;
		}

		// add the remaining slide
		(wasHorizontal ? sectionStack : sectionStack[sectionStack.length - 1]).push(markdown.substring(lastIndex));

		var markdownSections = '';

		// flatten the hierarchical stack, and insert <section data-markdown> tags
		for (var i = 0, len = sectionStack.length; i < len; i++) {
			// vertical
			if (sectionStack[i] instanceof Array) {
				markdownSections += '<section ' + options.attributes + '>';

				sectionStack[i].forEach(function (child) {
					markdownSections += '<section data-markdown>' + createMarkdownSlide(child, options) + '</section>';
				});

				markdownSections += '</section>';
			} else {
				markdownSections += '<section ' + options.attributes + ' data-markdown>' + createMarkdownSlide(sectionStack[i], options) + '</section>';
			}
		}

		return markdownSections;
	}

	/**
  * Parses any current data-markdown slides, splits
  * multi-slide markdown into separate sections and
  * handles loading of external markdown.
  */
	function processSlides() {

		var sections = document.querySelectorAll('[data-markdown]'),
		    section;

		for (var i = 0, len = sections.length; i < len; i++) {

			section = sections[i];

			if (section.getAttribute('data-markdown').length) {

				var xhr = new XMLHttpRequest(),
				    url = section.getAttribute('data-markdown');

				var datacharset = section.getAttribute('data-charset');

				// see https://developer.mozilla.org/en-US/docs/Web/API/element.getAttribute#Notes
				if (datacharset != null && datacharset != '') {
					xhr.overrideMimeType('text/html; charset=' + datacharset);
				}

				xhr.onreadystatechange = function () {
					if (xhr.readyState === 4) {
						// file protocol yields status code 0 (useful for local debug, mobile applications etc.)
						if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 0) {

							section.outerHTML = slidify(xhr.responseText, {
								separator: section.getAttribute('data-separator'),
								verticalSeparator: section.getAttribute('data-separator-vertical'),
								notesSeparator: section.getAttribute('data-separator-notes'),
								attributes: getForwardedAttributes(section)
							});
						} else {

							section.outerHTML = '<section data-state="alert">' + 'ERROR: The attempt to fetch ' + url + ' failed with HTTP status ' + xhr.status + '.' + 'Check your browser\'s JavaScript console for more details.' + '<p>Remember that you need to serve the presentation HTML from a HTTP server.</p>' + '</section>';
						}
					}
				};

				xhr.open('GET', url, false);

				try {
					xhr.send();
				} catch (e) {
					alert('Failed to get the Markdown file ' + url + '. Make sure that the presentation and the file are served by a HTTP server and the file can be found there. ' + e);
				}
			} else if (section.getAttribute('data-separator') || section.getAttribute('data-separator-vertical') || section.getAttribute('data-separator-notes')) {

				section.outerHTML = slidify(getMarkdownFromSlide(section), {
					separator: section.getAttribute('data-separator'),
					verticalSeparator: section.getAttribute('data-separator-vertical'),
					notesSeparator: section.getAttribute('data-separator-notes'),
					attributes: getForwardedAttributes(section)
				});
			} else {
				section.innerHTML = createMarkdownSlide(getMarkdownFromSlide(section));
			}
		}
	}

	/**
  * Check if a node value has the attributes pattern.
  * If yes, extract it and add that value as one or several attributes
  * the the terget element.
  *
  * You need Cache Killer on Chrome to see the effect on any FOM transformation
  * directly on refresh (F5)
  * http://stackoverflow.com/questions/5690269/disabling-chrome-cache-for-website-development/7000899#answer-11786277
  */
	function addAttributeInElement(node, elementTarget, separator) {

		var mardownClassesInElementsRegex = new RegExp(separator, 'mg');
		var mardownClassRegex = new RegExp("([^\"= ]+?)=\"([^\"=]+?)\"", 'mg');
		var nodeValue = node.nodeValue;
		var matches = [];
		if (matches = mardownClassesInElementsRegex.exec(nodeValue)) {

			var classes = matches[1];
			var matchesClass = null;
			nodeValue = nodeValue.substring(0, matches.index) + nodeValue.substring(mardownClassesInElementsRegex.lastIndex);
			node.nodeValue = nodeValue;
			while (matchesClass = mardownClassRegex.exec(classes)) {
				elementTarget.setAttribute(matchesClass[1], matchesClass[2]);
			}
			return true;
		}
		return false;
	}

	/**
  * Add attributes to the parent element of a text node,
  * or the element of an attribute node.
  */
	function addAttributes(section, element, previousElement, separatorElementAttributes, separatorSectionAttributes) {

		if (element != null && element.childNodes != undefined && element.childNodes.length > 0) {
			var previousParentElement = element;
			for (var i = 0; i < element.childNodes.length; i++) {
				var childElement = element.childNodes[i];
				if (i > 0) {
					var j = void 0;
					j = i - 1;
					while (j >= 0) {
						var aPreviousChildElement = element.childNodes[j];
						if (typeof aPreviousChildElement.setAttribute == 'function' && aPreviousChildElement.tagName != "BR") {
							previousParentElement = aPreviousChildElement;
							break;
						}
						j = j - 1;
					}
				}
				var parentSection = section;
				if (childElement.nodeName == "section") {
					parentSection = childElement;
					previousParentElement = childElement;
				}
				if (typeof childElement.setAttribute == 'function' || childElement.nodeType == Node.COMMENT_NODE) {
					addAttributes(parentSection, childElement, previousParentElement, separatorElementAttributes, separatorSectionAttributes);
				}
			}
		}

		if (element.nodeType == Node.COMMENT_NODE) {
			if (addAttributeInElement(element, previousElement, separatorElementAttributes) == false) {
				addAttributeInElement(element, section, separatorSectionAttributes);
			}
		}
	}

	/**
  * Converts any current data-markdown slides in the
  * DOM to HTML.
  */
	function convertSlides() {

		var sections = document.querySelectorAll('[data-markdown]');

		for (var i = 0, len = sections.length; i < len; i++) {

			var section = sections[i];

			// Only parse the same slide once
			if (!section.getAttribute('data-markdown-parsed')) {

				section.setAttribute('data-markdown-parsed', true);

				var notes = section.querySelector('aside.notes');
				var markdown = getMarkdownFromSlide(section);

				section.innerHTML = marked(markdown);
				addAttributes(section, section, null, section.getAttribute('data-element-attributes') || section.parentNode.getAttribute('data-element-attributes') || DEFAULT_ELEMENT_ATTRIBUTES_SEPARATOR, section.getAttribute('data-attributes') || section.parentNode.getAttribute('data-attributes') || DEFAULT_SLIDE_ATTRIBUTES_SEPARATOR);

				// If there were notes, we need to re-add them after
				// having overwritten the section's HTML
				if (notes) {
					section.appendChild(notes);
				}
			}
		}
	}

	// API
	return {

		initialize: function initialize() {
			processSlides();
			convertSlides();
		},

		// TODO: Do these belong in the API?
		processSlides: processSlides,
		convertSlides: convertSlides,
		slidify: slidify

	};
});

/***/ }),
/* 348 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reveal = __webpack_require__(134);

var _reveal2 = _interopRequireDefault(_reveal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Handles opening of and synchronization with the reveal.js
 * notes window.
 *
 * Handshake process:
 * 1. This window posts 'connect' to notes window
 *    - Includes URL of presentation to show
 * 2. Notes window responds with 'connected' when it is available
 * 3. This window proceeds to send the current presentation state
 *    to the notes window
 */
var RevealNotes = function () {
  function RevealNotes() {
    _classCallCheck(this, RevealNotes);

    if (!/receiver/i.test(window.location.search)) {
      // If the there's a 'notes' query set, open directly
      if (window.location.search.match(/(\?|&)notes/gi) !== null) {
        this.openNotes();
      }
    }
  }

  _createClass(RevealNotes, null, [{
    key: 'openNotes',
    value: function openNotes() {
      var notesPopup = window.open('./notes.html', 'reveal.js - Notes', 'width=1100,height=700');

      /**
       * Posts the current slide data to the notes window
       */
      function post() {
        var slideElement = _reveal2.default.getCurrentSlide();
        var notesElement = slideElement.querySelector('aside.notes');
        var messageData = {
          namespace: 'reveal-notes',
          type: 'state',
          notes: '',
          markdown: false,
          state: _reveal2.default.getState()
        };

        // Look for notes defined in a slide attribute.
        if (slideElement.hasAttribute('data-notes')) {
          messageData.notes = slideElement.getAttribute('data-notes');
        }

        // Look for notes defined in an aside element.
        if (notesElement) {
          messageData.notes = notesElement.innerHTML;
          messageData.markdown = false;
          // typeof notesElement.getAttribute('data-markdown') === 'string';
        }

        notesPopup.postMessage(JSON.stringify(messageData), '*');
      }

      /**
       * Called once we have established a connection to the notes
       * window.
       */
      function onConnected() {
        _reveal2.default.addEventListener('slidechanged', post);
        _reveal2.default.addEventListener('fragmentshown', post);
        _reveal2.default.addEventListener('fragmenthidden', post);
        _reveal2.default.addEventListener('overviewhidden', post);
        _reveal2.default.addEventListener('overviewshown', post);
        _reveal2.default.addEventListener('paused', post);
        _reveal2.default.addEventListener('resumed', post);

        post();
      }

      /**
       * Connect to the notes window through a postmessage handshake.
       * Using postmessage enables us to work in situations where the
       * origins differ, such as a presentation being opened from the
       * file system.
       */
      function connect() {
        // Keep trying to connect until we get a 'connected' message back.
        var connectInterval = setInterval(function () {
          var url = window.location.protocol + '//' + window.location.host + window.location.pathname + window.location.search;
          notesPopup.postMessage(JSON.stringify({
            namespace: 'reveal-notes',
            type: 'connect',
            url: url,
            state: _reveal2.default.getState()
          }), '*');
        }, 500);

        window.addEventListener('message', function (event) {
          var data = JSON.parse(event.data);
          if (data && data.namespace === 'reveal-notes' && data.type === 'connected') {
            clearInterval(connectInterval);
            onConnected();
          }
        });
      }

      connect();
    }
  }]);

  return RevealNotes;
}();

exports.default = RevealNotes;

/***/ }),
/* 349 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function (n) {
  if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function (type) {
  var er, handler, len, args, i, listeners;

  if (!this._events) this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error || isObject(this._events.error) && !this._events.error.length) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler)) return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++) {
      listeners[i].apply(this, args);
    }
  }

  return true;
};

EventEmitter.prototype.addListener = function (type, listener) {
  var m;

  if (!isFunction(listener)) throw TypeError('listener must be a function');

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener) this.emit('newListener', type, isFunction(listener.listener) ? listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' + 'leak detected. %d listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.', this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function (type, listener) {
  if (!isFunction(listener)) throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function (type, listener) {
  var list, position, length, i;

  if (!isFunction(listener)) throw TypeError('listener must be a function');

  if (!this._events || !this._events[type]) return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener || isFunction(list.listener) && list.listener === listener) {
    delete this._events[type];
    if (this._events.removeListener) this.emit('removeListener', type, listener);
  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener || list[i].listener && list[i].listener === listener) {
        position = i;
        break;
      }
    }

    if (position < 0) return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener) this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function (type) {
  var key, listeners;

  if (!this._events) return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0) this._events = {};else if (this._events[type]) delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length) {
      this.removeListener(type, listeners[listeners.length - 1]);
    }
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function (type) {
  var ret;
  if (!this._events || !this._events[type]) ret = [];else if (isFunction(this._events[type])) ret = [this._events[type]];else ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function (type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener)) return 1;else if (evlistener) return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function (emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

/***/ }),
/* 350 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  XmlEntities: __webpack_require__(352),
  Html4Entities: __webpack_require__(351),
  Html5Entities: __webpack_require__(133),
  AllHtmlEntities: __webpack_require__(133)
};

/***/ }),
/* 351 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'Aelig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'OElig', 'oelig', 'Scaron', 'scaron', 'Yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'Dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'Prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'lArr', 'uArr', 'rArr', 'dArr', 'hArr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];
var HTML_CODES = [39, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 34, 38, 60, 62, 338, 339, 352, 353, 376, 710, 732, 8194, 8195, 8201, 8204, 8205, 8206, 8207, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8240, 8249, 8250, 8364, 402, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 977, 978, 982, 8226, 8230, 8242, 8243, 8254, 8260, 8472, 8465, 8476, 8482, 8501, 8592, 8593, 8594, 8595, 8596, 8629, 8656, 8657, 8658, 8659, 8660, 8704, 8706, 8707, 8709, 8711, 8712, 8713, 8715, 8719, 8721, 8722, 8727, 8730, 8733, 8734, 8736, 8743, 8744, 8745, 8746, 8747, 8756, 8764, 8773, 8776, 8800, 8801, 8804, 8805, 8834, 8835, 8836, 8838, 8839, 8853, 8855, 8869, 8901, 8968, 8969, 8970, 8971, 9001, 9002, 9674, 9824, 9827, 9829, 9830];

var alphaIndex = {};
var numIndex = {};

var i = 0;
var length = HTML_ALPHA.length;
while (i < length) {
    var a = HTML_ALPHA[i];
    var c = HTML_CODES[i];
    alphaIndex[a] = String.fromCharCode(c);
    numIndex[c] = a;
    i++;
}

/**
 * @constructor
 */
function Html4Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.decode = function (str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function (s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1).toLowerCase() === 'x' ? parseInt(entity.substr(2), 16) : parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.decode = function (str) {
    return new Html4Entities().decode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encode = function (str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var alpha = numIndex[str.charCodeAt(i)];
        result += alpha ? "&" + alpha + ";" : str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encode = function (str) {
    return new Html4Entities().encode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonUTF = function (str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var cc = str.charCodeAt(i);
        var alpha = numIndex[cc];
        if (alpha) {
            result += "&" + alpha + ";";
        } else if (cc < 32 || cc > 126) {
            result += "&#" + cc + ";";
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonUTF = function (str) {
    return new Html4Entities().encodeNonUTF(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonASCII = function (str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonASCII = function (str) {
    return new Html4Entities().encodeNonASCII(str);
};

module.exports = Html4Entities;

/***/ }),
/* 352 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ALPHA_INDEX = {
    '&lt': '<',
    '&gt': '>',
    '&quot': '"',
    '&apos': '\'',
    '&amp': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&amp;': '&'
};

var CHAR_INDEX = {
    60: 'lt',
    62: 'gt',
    34: 'quot',
    39: 'apos',
    38: 'amp'
};

var CHAR_S_INDEX = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&apos;',
    '&': '&amp;'
};

/**
 * @constructor
 */
function XmlEntities() {}

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encode = function (str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/<|>|"|'|&/g, function (s) {
        return CHAR_S_INDEX[s];
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.encode = function (str) {
    return new XmlEntities().encode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.decode = function (str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function (s) {
        if (s.charAt(1) === '#') {
            var code = s.charAt(2).toLowerCase() === 'x' ? parseInt(s.substr(3), 16) : parseInt(s.substr(2));

            if (isNaN(code) || code < -32768 || code > 65535) {
                return '';
            }
            return String.fromCharCode(code);
        }
        return ALPHA_INDEX[s] || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.decode = function (str) {
    return new XmlEntities().decode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonUTF = function (str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var alpha = CHAR_INDEX[c];
        if (alpha) {
            result += "&" + alpha + ";";
            i++;
            continue;
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.encodeNonUTF = function (str) {
    return new XmlEntities().encodeNonUTF(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonASCII = function (str) {
    if (!str || !str.length) {
        return '';
    }
    var strLenght = str.length;
    var result = '';
    var i = 0;
    while (i < strLenght) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.encodeNonASCII = function (str) {
    return new XmlEntities().encodeNonASCII(str);
};

module.exports = XmlEntities;

/***/ }),
/* 353 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
* loglevel - https://github.com/pimterry/loglevel
*
* Copyright (c) 2013 Tim Perry
* Licensed under the MIT license.
*/
(function (root, definition) {
    "use strict";

    if (typeof define === 'function' && define.amd) {
        define(definition);
    } else if (( false ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
        module.exports = definition();
    } else {
        root.log = definition();
    }
})(undefined, function () {
    "use strict";

    // Slightly dubious tricks to cut down minimized file size

    var noop = function noop() {};
    var undefinedType = "undefined";

    var logMethods = ["trace", "debug", "info", "warn", "error"];

    // Cross-browser bind equivalent that works at least back to IE6
    function bindMethod(obj, methodName) {
        var method = obj[methodName];
        if (typeof method.bind === 'function') {
            return method.bind(obj);
        } else {
            try {
                return Function.prototype.bind.call(method, obj);
            } catch (e) {
                // Missing bind shim or IE8 + Modernizr, fallback to wrapping
                return function () {
                    return Function.prototype.apply.apply(method, [obj, arguments]);
                };
            }
        }
    }

    // Build the best logging method possible for this env
    // Wherever possible we want to bind, not wrap, to preserve stack traces
    function realMethod(methodName) {
        if (methodName === 'debug') {
            methodName = 'log';
        }

        if ((typeof console === 'undefined' ? 'undefined' : _typeof(console)) === undefinedType) {
            return false; // No method possible, for now - fixed later by enableLoggingWhenConsoleArrives
        } else if (console[methodName] !== undefined) {
            return bindMethod(console, methodName);
        } else if (console.log !== undefined) {
            return bindMethod(console, 'log');
        } else {
            return noop;
        }
    }

    // These private functions always need `this` to be set properly

    function replaceLoggingMethods(level, loggerName) {
        /*jshint validthis:true */
        for (var i = 0; i < logMethods.length; i++) {
            var methodName = logMethods[i];
            this[methodName] = i < level ? noop : this.methodFactory(methodName, level, loggerName);
        }

        // Define log.log as an alias for log.debug
        this.log = this.debug;
    }

    // In old IE versions, the console isn't present until you first open it.
    // We build realMethod() replacements here that regenerate logging methods
    function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {
        return function () {
            if ((typeof console === 'undefined' ? 'undefined' : _typeof(console)) !== undefinedType) {
                replaceLoggingMethods.call(this, level, loggerName);
                this[methodName].apply(this, arguments);
            }
        };
    }

    // By default, we use closely bound real methods wherever possible, and
    // otherwise we wait for a console to appear, and then try again.
    function defaultMethodFactory(methodName, level, loggerName) {
        /*jshint validthis:true */
        return realMethod(methodName) || enableLoggingWhenConsoleArrives.apply(this, arguments);
    }

    function Logger(name, defaultLevel, factory) {
        var self = this;
        var currentLevel;
        var storageKey = "loglevel";
        if (name) {
            storageKey += ":" + name;
        }

        function persistLevelIfPossible(levelNum) {
            var levelName = (logMethods[levelNum] || 'silent').toUpperCase();

            if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === undefinedType) return;

            // Use localStorage if available
            try {
                window.localStorage[storageKey] = levelName;
                return;
            } catch (ignore) {}

            // Use session cookie as fallback
            try {
                window.document.cookie = encodeURIComponent(storageKey) + "=" + levelName + ";";
            } catch (ignore) {}
        }

        function getPersistedLevel() {
            var storedLevel;

            if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === undefinedType) return;

            try {
                storedLevel = window.localStorage[storageKey];
            } catch (ignore) {}

            // Fallback to cookies if local storage gives us nothing
            if ((typeof storedLevel === 'undefined' ? 'undefined' : _typeof(storedLevel)) === undefinedType) {
                try {
                    var cookie = window.document.cookie;
                    var location = cookie.indexOf(encodeURIComponent(storageKey) + "=");
                    if (location !== -1) {
                        storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];
                    }
                } catch (ignore) {}
            }

            // If the stored level is not valid, treat it as if nothing was stored.
            if (self.levels[storedLevel] === undefined) {
                storedLevel = undefined;
            }

            return storedLevel;
        }

        /*
         *
         * Public logger API - see https://github.com/pimterry/loglevel for details
         *
         */

        self.name = name;

        self.levels = { "TRACE": 0, "DEBUG": 1, "INFO": 2, "WARN": 3,
            "ERROR": 4, "SILENT": 5 };

        self.methodFactory = factory || defaultMethodFactory;

        self.getLevel = function () {
            return currentLevel;
        };

        self.setLevel = function (level, persist) {
            if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
                level = self.levels[level.toUpperCase()];
            }
            if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
                currentLevel = level;
                if (persist !== false) {
                    // defaults to true
                    persistLevelIfPossible(level);
                }
                replaceLoggingMethods.call(self, level, name);
                if ((typeof console === 'undefined' ? 'undefined' : _typeof(console)) === undefinedType && level < self.levels.SILENT) {
                    return "No console available for logging";
                }
            } else {
                throw "log.setLevel() called with invalid level: " + level;
            }
        };

        self.setDefaultLevel = function (level) {
            if (!getPersistedLevel()) {
                self.setLevel(level, false);
            }
        };

        self.enableAll = function (persist) {
            self.setLevel(self.levels.TRACE, persist);
        };

        self.disableAll = function (persist) {
            self.setLevel(self.levels.SILENT, persist);
        };

        // Initialize with the right level
        var initialLevel = getPersistedLevel();
        if (initialLevel == null) {
            initialLevel = defaultLevel == null ? "WARN" : defaultLevel;
        }
        self.setLevel(initialLevel, false);
    }

    /*
     *
     * Top-level API
     *
     */

    var defaultLogger = new Logger();

    var _loggersByName = {};
    defaultLogger.getLogger = function getLogger(name) {
        if (typeof name !== "string" || name === "") {
            throw new TypeError("You must supply a name when creating a logger.");
        }

        var logger = _loggersByName[name];
        if (!logger) {
            logger = _loggersByName[name] = new Logger(name, defaultLogger.getLevel(), defaultLogger.methodFactory);
        }
        return logger;
    };

    // Grab the current global log variable in case of overwrite
    var _log = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== undefinedType ? window.log : undefined;
    defaultLogger.noConflict = function () {
        if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== undefinedType && window.log === defaultLogger) {
            window.log = _log;
        }

        return defaultLogger;
    };

    defaultLogger.getLoggers = function getLoggers() {
        return _loggersByName;
    };

    return defaultLogger;
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(93)(module)))

/***/ }),
/* 354 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/markedjs/marked
 */

;(function (root) {
  'use strict';

  /**
   * Block-Level Grammar
   */

  var block = {
    newline: /^\n+/,
    code: /^( {4}[^\n]+\n*)+/,
    fences: noop,
    hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
    heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
    nptable: noop,
    blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
    list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
    html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
    def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
    table: noop,
    lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
    paragraph: /^([^\n]+(?:\n?(?!hr|heading|lheading| {0,3}>|tag)[^\n]+)+)/,
    text: /^[^\n]+/
  };

  block._label = /(?:\\[\[\]]|[^\[\]])+/;
  block._title = /(?:"(?:\\"|[^"]|"[^"\n]*")*"|'\n?(?:[^'\n]+\n?)*'|\([^()]*\))/;
  block.def = edit(block.def).replace('label', block._label).replace('title', block._title).getRegex();

  block.bullet = /(?:[*+-]|\d+\.)/;
  block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
  block.item = edit(block.item, 'gm').replace(/bull/g, block.bullet).getRegex();

  block.list = edit(block.list).replace(/bull/g, block.bullet).replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))').replace('def', '\\n+(?=' + block.def.source + ')').getRegex();

  block._tag = '(?!(?:' + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code' + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo' + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b';

  block.html = edit(block.html).replace('comment', /<!--[\s\S]*?-->/).replace('closed', /<(tag)[\s\S]+?<\/\1>/).replace('closing', /<tag(?:"[^"]*"|'[^']*'|\s[^'"\/>\s]*)*?\/?>/).replace(/tag/g, block._tag).getRegex();

  block.paragraph = edit(block.paragraph).replace('hr', block.hr).replace('heading', block.heading).replace('lheading', block.lheading).replace('tag', '<' + block._tag).getRegex();

  block.blockquote = edit(block.blockquote).replace('paragraph', block.paragraph).getRegex();

  /**
   * Normal Block Grammar
   */

  block.normal = merge({}, block);

  /**
   * GFM Block Grammar
   */

  block.gfm = merge({}, block.normal, {
    fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\n? *\1 *(?:\n+|$)/,
    paragraph: /^/,
    heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
  });

  block.gfm.paragraph = edit(block.paragraph).replace('(?!', '(?!' + block.gfm.fences.source.replace('\\1', '\\2') + '|' + block.list.source.replace('\\1', '\\3') + '|').getRegex();

  /**
   * GFM + Tables Block Grammar
   */

  block.tables = merge({}, block.gfm, {
    nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
    table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
  });

  /**
   * Block Lexer
   */

  function Lexer(options) {
    this.tokens = [];
    this.tokens.links = {};
    this.options = options || marked.defaults;
    this.rules = block.normal;

    if (this.options.gfm) {
      if (this.options.tables) {
        this.rules = block.tables;
      } else {
        this.rules = block.gfm;
      }
    }
  }

  /**
   * Expose Block Rules
   */

  Lexer.rules = block;

  /**
   * Static Lex Method
   */

  Lexer.lex = function (src, options) {
    var lexer = new Lexer(options);
    return lexer.lex(src);
  };

  /**
   * Preprocessing
   */

  Lexer.prototype.lex = function (src) {
    src = src.replace(/\r\n|\r/g, '\n').replace(/\t/g, '    ').replace(/\u00a0/g, ' ').replace(/\u2424/g, '\n');

    return this.token(src, true);
  };

  /**
   * Lexing
   */

  Lexer.prototype.token = function (src, top) {
    src = src.replace(/^ +$/gm, '');
    var next, loose, cap, bull, b, item, space, i, tag, l, isordered;

    while (src) {
      // newline
      if (cap = this.rules.newline.exec(src)) {
        src = src.substring(cap[0].length);
        if (cap[0].length > 1) {
          this.tokens.push({
            type: 'space'
          });
        }
      }

      // code
      if (cap = this.rules.code.exec(src)) {
        src = src.substring(cap[0].length);
        cap = cap[0].replace(/^ {4}/gm, '');
        this.tokens.push({
          type: 'code',
          text: !this.options.pedantic ? cap.replace(/\n+$/, '') : cap
        });
        continue;
      }

      // fences (gfm)
      if (cap = this.rules.fences.exec(src)) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'code',
          lang: cap[2],
          text: cap[3] || ''
        });
        continue;
      }

      // heading
      if (cap = this.rules.heading.exec(src)) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'heading',
          depth: cap[1].length,
          text: cap[2]
        });
        continue;
      }

      // table no leading pipe (gfm)
      if (top && (cap = this.rules.nptable.exec(src))) {
        src = src.substring(cap[0].length);

        item = {
          type: 'table',
          header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
          align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
          cells: cap[3].replace(/\n$/, '').split('\n')
        };

        for (i = 0; i < item.align.length; i++) {
          if (/^ *-+: *$/.test(item.align[i])) {
            item.align[i] = 'right';
          } else if (/^ *:-+: *$/.test(item.align[i])) {
            item.align[i] = 'center';
          } else if (/^ *:-+ *$/.test(item.align[i])) {
            item.align[i] = 'left';
          } else {
            item.align[i] = null;
          }
        }

        for (i = 0; i < item.cells.length; i++) {
          item.cells[i] = item.cells[i].split(/ *\| */);
        }

        this.tokens.push(item);

        continue;
      }

      // hr
      if (cap = this.rules.hr.exec(src)) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'hr'
        });
        continue;
      }

      // blockquote
      if (cap = this.rules.blockquote.exec(src)) {
        src = src.substring(cap[0].length);

        this.tokens.push({
          type: 'blockquote_start'
        });

        cap = cap[0].replace(/^ *> ?/gm, '');

        // Pass `top` to keep the current
        // "toplevel" state. This is exactly
        // how markdown.pl works.
        this.token(cap, top);

        this.tokens.push({
          type: 'blockquote_end'
        });

        continue;
      }

      // list
      if (cap = this.rules.list.exec(src)) {
        src = src.substring(cap[0].length);
        bull = cap[2];
        isordered = bull.length > 1;

        this.tokens.push({
          type: 'list_start',
          ordered: isordered,
          start: isordered ? +bull : ''
        });

        // Get each top-level item.
        cap = cap[0].match(this.rules.item);

        next = false;
        l = cap.length;
        i = 0;

        for (; i < l; i++) {
          item = cap[i];

          // Remove the list item's bullet
          // so it is seen as the next token.
          space = item.length;
          item = item.replace(/^ *([*+-]|\d+\.) +/, '');

          // Outdent whatever the
          // list item contains. Hacky.
          if (~item.indexOf('\n ')) {
            space -= item.length;
            item = !this.options.pedantic ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '') : item.replace(/^ {1,4}/gm, '');
          }

          // Determine whether the next list item belongs here.
          // Backpedal if it does not belong in this list.
          if (this.options.smartLists && i !== l - 1) {
            b = block.bullet.exec(cap[i + 1])[0];
            if (bull !== b && !(bull.length > 1 && b.length > 1)) {
              src = cap.slice(i + 1).join('\n') + src;
              i = l - 1;
            }
          }

          // Determine whether item is loose or not.
          // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
          // for discount behavior.
          loose = next || /\n\n(?!\s*$)/.test(item);
          if (i !== l - 1) {
            next = item.charAt(item.length - 1) === '\n';
            if (!loose) loose = next;
          }

          this.tokens.push({
            type: loose ? 'loose_item_start' : 'list_item_start'
          });

          // Recurse.
          this.token(item, false);

          this.tokens.push({
            type: 'list_item_end'
          });
        }

        this.tokens.push({
          type: 'list_end'
        });

        continue;
      }

      // html
      if (cap = this.rules.html.exec(src)) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: this.options.sanitize ? 'paragraph' : 'html',
          pre: !this.options.sanitizer && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
          text: cap[0]
        });
        continue;
      }

      // def
      if (top && (cap = this.rules.def.exec(src))) {
        src = src.substring(cap[0].length);
        if (cap[3]) cap[3] = cap[3].substring(1, cap[3].length - 1);
        tag = cap[1].toLowerCase();
        if (!this.tokens.links[tag]) {
          this.tokens.links[tag] = {
            href: cap[2],
            title: cap[3]
          };
        }
        continue;
      }

      // table (gfm)
      if (top && (cap = this.rules.table.exec(src))) {
        src = src.substring(cap[0].length);

        item = {
          type: 'table',
          header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
          align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
          cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
        };

        for (i = 0; i < item.align.length; i++) {
          if (/^ *-+: *$/.test(item.align[i])) {
            item.align[i] = 'right';
          } else if (/^ *:-+: *$/.test(item.align[i])) {
            item.align[i] = 'center';
          } else if (/^ *:-+ *$/.test(item.align[i])) {
            item.align[i] = 'left';
          } else {
            item.align[i] = null;
          }
        }

        for (i = 0; i < item.cells.length; i++) {
          item.cells[i] = item.cells[i].replace(/^ *\| *| *\| *$/g, '').split(/ *\| */);
        }

        this.tokens.push(item);

        continue;
      }

      // lheading
      if (cap = this.rules.lheading.exec(src)) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'heading',
          depth: cap[2] === '=' ? 1 : 2,
          text: cap[1]
        });
        continue;
      }

      // top-level paragraph
      if (top && (cap = this.rules.paragraph.exec(src))) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'paragraph',
          text: cap[1].charAt(cap[1].length - 1) === '\n' ? cap[1].slice(0, -1) : cap[1]
        });
        continue;
      }

      // text
      if (cap = this.rules.text.exec(src)) {
        // Top-level should never reach here.
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'text',
          text: cap[0]
        });
        continue;
      }

      if (src) {
        throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
      }
    }

    return this.tokens;
  };

  /**
   * Inline-Level Grammar
   */

  var inline = {
    escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
    autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
    url: noop,
    tag: /^<!--[\s\S]*?-->|^<\/?[a-zA-Z0-9\-]+(?:"[^"]*"|'[^']*'|\s[^<'">\/\s]*)*?\/?>/,
    link: /^!?\[(inside)\]\(href\)/,
    reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
    nolink: /^!?\[((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\]/,
    strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
    em: /^_([^\s_](?:[^_]|__)+?[^\s_])_\b|^\*((?:\*\*|[^*])+?)\*(?!\*)/,
    code: /^(`+)\s*([\s\S]*?[^`]?)\s*\1(?!`)/,
    br: /^ {2,}\n(?!\s*$)/,
    del: noop,
    text: /^[\s\S]+?(?=[\\<!\[`*]|\b_| {2,}\n|$)/
  };

  inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
  inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;

  inline.autolink = edit(inline.autolink).replace('scheme', inline._scheme).replace('email', inline._email).getRegex();

  inline._inside = /(?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]]|\](?=[^\[]*\]))*/;
  inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

  inline.link = edit(inline.link).replace('inside', inline._inside).replace('href', inline._href).getRegex();

  inline.reflink = edit(inline.reflink).replace('inside', inline._inside).getRegex();

  /**
   * Normal Inline Grammar
   */

  inline.normal = merge({}, inline);

  /**
   * Pedantic Inline Grammar
   */

  inline.pedantic = merge({}, inline.normal, {
    strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
    em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
  });

  /**
   * GFM Inline Grammar
   */

  inline.gfm = merge({}, inline.normal, {
    escape: edit(inline.escape).replace('])', '~|])').getRegex(),
    url: edit(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace('email', inline._email).getRegex(),
    _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
    del: /^~~(?=\S)([\s\S]*?\S)~~/,
    text: edit(inline.text).replace(']|', '~]|').replace('|', '|https?://|ftp://|www\\.|[a-zA-Z0-9.!#$%&\'*+/=?^_`{\\|}~-]+@|').getRegex()
  });

  /**
   * GFM + Line Breaks Inline Grammar
   */

  inline.breaks = merge({}, inline.gfm, {
    br: edit(inline.br).replace('{2,}', '*').getRegex(),
    text: edit(inline.gfm.text).replace('{2,}', '*').getRegex()
  });

  /**
   * Inline Lexer & Compiler
   */

  function InlineLexer(links, options) {
    this.options = options || marked.defaults;
    this.links = links;
    this.rules = inline.normal;
    this.renderer = this.options.renderer || new Renderer();
    this.renderer.options = this.options;

    if (!this.links) {
      throw new Error('Tokens array requires a `links` property.');
    }

    if (this.options.gfm) {
      if (this.options.breaks) {
        this.rules = inline.breaks;
      } else {
        this.rules = inline.gfm;
      }
    } else if (this.options.pedantic) {
      this.rules = inline.pedantic;
    }
  }

  /**
   * Expose Inline Rules
   */

  InlineLexer.rules = inline;

  /**
   * Static Lexing/Compiling Method
   */

  InlineLexer.output = function (src, links, options) {
    var inline = new InlineLexer(links, options);
    return inline.output(src);
  };

  /**
   * Lexing/Compiling
   */

  InlineLexer.prototype.output = function (src) {
    var out = '',
        link,
        text,
        href,
        cap;

    while (src) {
      // escape
      if (cap = this.rules.escape.exec(src)) {
        src = src.substring(cap[0].length);
        out += cap[1];
        continue;
      }

      // autolink
      if (cap = this.rules.autolink.exec(src)) {
        src = src.substring(cap[0].length);
        if (cap[2] === '@') {
          text = escape(this.mangle(cap[1]));
          href = 'mailto:' + text;
        } else {
          text = escape(cap[1]);
          href = text;
        }
        out += this.renderer.link(href, null, text);
        continue;
      }

      // url (gfm)
      if (!this.inLink && (cap = this.rules.url.exec(src))) {
        cap[0] = this.rules._backpedal.exec(cap[0])[0];
        src = src.substring(cap[0].length);
        if (cap[2] === '@') {
          text = escape(cap[0]);
          href = 'mailto:' + text;
        } else {
          text = escape(cap[0]);
          if (cap[1] === 'www.') {
            href = 'http://' + text;
          } else {
            href = text;
          }
        }
        out += this.renderer.link(href, null, text);
        continue;
      }

      // tag
      if (cap = this.rules.tag.exec(src)) {
        if (!this.inLink && /^<a /i.test(cap[0])) {
          this.inLink = true;
        } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
          this.inLink = false;
        }
        src = src.substring(cap[0].length);
        out += this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]) : cap[0];
        continue;
      }

      // link
      if (cap = this.rules.link.exec(src)) {
        src = src.substring(cap[0].length);
        this.inLink = true;
        out += this.outputLink(cap, {
          href: cap[2],
          title: cap[3]
        });
        this.inLink = false;
        continue;
      }

      // reflink, nolink
      if ((cap = this.rules.reflink.exec(src)) || (cap = this.rules.nolink.exec(src))) {
        src = src.substring(cap[0].length);
        link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
        link = this.links[link.toLowerCase()];
        if (!link || !link.href) {
          out += cap[0].charAt(0);
          src = cap[0].substring(1) + src;
          continue;
        }
        this.inLink = true;
        out += this.outputLink(cap, link);
        this.inLink = false;
        continue;
      }

      // strong
      if (cap = this.rules.strong.exec(src)) {
        src = src.substring(cap[0].length);
        out += this.renderer.strong(this.output(cap[2] || cap[1]));
        continue;
      }

      // em
      if (cap = this.rules.em.exec(src)) {
        src = src.substring(cap[0].length);
        out += this.renderer.em(this.output(cap[2] || cap[1]));
        continue;
      }

      // code
      if (cap = this.rules.code.exec(src)) {
        src = src.substring(cap[0].length);
        out += this.renderer.codespan(escape(cap[2].trim(), true));
        continue;
      }

      // br
      if (cap = this.rules.br.exec(src)) {
        src = src.substring(cap[0].length);
        out += this.renderer.br();
        continue;
      }

      // del (gfm)
      if (cap = this.rules.del.exec(src)) {
        src = src.substring(cap[0].length);
        out += this.renderer.del(this.output(cap[1]));
        continue;
      }

      // text
      if (cap = this.rules.text.exec(src)) {
        src = src.substring(cap[0].length);
        out += this.renderer.text(escape(this.smartypants(cap[0])));
        continue;
      }

      if (src) {
        throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
      }
    }

    return out;
  };

  /**
   * Compile Link
   */

  InlineLexer.prototype.outputLink = function (cap, link) {
    var href = escape(link.href),
        title = link.title ? escape(link.title) : null;

    return cap[0].charAt(0) !== '!' ? this.renderer.link(href, title, this.output(cap[1])) : this.renderer.image(href, title, escape(cap[1]));
  };

  /**
   * Smartypants Transformations
   */

  InlineLexer.prototype.smartypants = function (text) {
    if (!this.options.smartypants) return text;
    return text
    // em-dashes
    .replace(/---/g, '\u2014')
    // en-dashes
    .replace(/--/g, '\u2013')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201C')
    // closing doubles
    .replace(/"/g, '\u201D')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
  };

  /**
   * Mangle Links
   */

  InlineLexer.prototype.mangle = function (text) {
    if (!this.options.mangle) return text;
    var out = '',
        l = text.length,
        i = 0,
        ch;

    for (; i < l; i++) {
      ch = text.charCodeAt(i);
      if (Math.random() > 0.5) {
        ch = 'x' + ch.toString(16);
      }
      out += '&#' + ch + ';';
    }

    return out;
  };

  /**
   * Renderer
   */

  function Renderer(options) {
    this.options = options || {};
  }

  Renderer.prototype.code = function (code, lang, escaped) {
    if (this.options.highlight) {
      var out = this.options.highlight(code, lang);
      if (out != null && out !== code) {
        escaped = true;
        code = out;
      }
    }

    if (!lang) {
      return '<pre><code>' + (escaped ? code : escape(code, true)) + '\n</code></pre>';
    }

    return '<pre><code class="' + this.options.langPrefix + escape(lang, true) + '">' + (escaped ? code : escape(code, true)) + '\n</code></pre>\n';
  };

  Renderer.prototype.blockquote = function (quote) {
    return '<blockquote>\n' + quote + '</blockquote>\n';
  };

  Renderer.prototype.html = function (html) {
    return html;
  };

  Renderer.prototype.heading = function (text, level, raw) {
    return '<h' + level + ' id="' + this.options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-') + '">' + text + '</h' + level + '>\n';
  };

  Renderer.prototype.hr = function () {
    return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
  };

  Renderer.prototype.list = function (body, ordered, start) {
    var type = ordered ? 'ol' : 'ul',
        startatt = ordered && start !== 1 ? ' start="' + start + '"' : '';
    return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
  };

  Renderer.prototype.listitem = function (text) {
    return '<li>' + text + '</li>\n';
  };

  Renderer.prototype.paragraph = function (text) {
    return '<p>' + text + '</p>\n';
  };

  Renderer.prototype.table = function (header, body) {
    return '<table>\n' + '<thead>\n' + header + '</thead>\n' + '<tbody>\n' + body + '</tbody>\n' + '</table>\n';
  };

  Renderer.prototype.tablerow = function (content) {
    return '<tr>\n' + content + '</tr>\n';
  };

  Renderer.prototype.tablecell = function (content, flags) {
    var type = flags.header ? 'th' : 'td';
    var tag = flags.align ? '<' + type + ' style="text-align:' + flags.align + '">' : '<' + type + '>';
    return tag + content + '</' + type + '>\n';
  };

  // span level renderer
  Renderer.prototype.strong = function (text) {
    return '<strong>' + text + '</strong>';
  };

  Renderer.prototype.em = function (text) {
    return '<em>' + text + '</em>';
  };

  Renderer.prototype.codespan = function (text) {
    return '<code>' + text + '</code>';
  };

  Renderer.prototype.br = function () {
    return this.options.xhtml ? '<br/>' : '<br>';
  };

  Renderer.prototype.del = function (text) {
    return '<del>' + text + '</del>';
  };

  Renderer.prototype.link = function (href, title, text) {
    if (this.options.sanitize) {
      try {
        var prot = decodeURIComponent(unescape(href)).replace(/[^\w:]/g, '').toLowerCase();
      } catch (e) {
        return text;
      }
      if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
        return text;
      }
    }
    if (this.options.baseUrl && !originIndependentUrl.test(href)) {
      href = resolveUrl(this.options.baseUrl, href);
    }
    var out = '<a href="' + href + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += '>' + text + '</a>';
    return out;
  };

  Renderer.prototype.image = function (href, title, text) {
    if (this.options.baseUrl && !originIndependentUrl.test(href)) {
      href = resolveUrl(this.options.baseUrl, href);
    }
    var out = '<img src="' + href + '" alt="' + text + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += this.options.xhtml ? '/>' : '>';
    return out;
  };

  Renderer.prototype.text = function (text) {
    return text;
  };

  /**
   * TextRenderer
   * returns only the textual part of the token
   */

  function TextRenderer() {}

  // no need for block level renderers

  TextRenderer.prototype.strong = TextRenderer.prototype.em = TextRenderer.prototype.codespan = TextRenderer.prototype.del = TextRenderer.prototype.text = function (text) {
    return text;
  };

  TextRenderer.prototype.link = TextRenderer.prototype.image = function (href, title, text) {
    return '' + text;
  };

  TextRenderer.prototype.br = function () {
    return '';
  };

  /**
   * Parsing & Compiling
   */

  function Parser(options) {
    this.tokens = [];
    this.token = null;
    this.options = options || marked.defaults;
    this.options.renderer = this.options.renderer || new Renderer();
    this.renderer = this.options.renderer;
    this.renderer.options = this.options;
  }

  /**
   * Static Parse Method
   */

  Parser.parse = function (src, options) {
    var parser = new Parser(options);
    return parser.parse(src);
  };

  /**
   * Parse Loop
   */

  Parser.prototype.parse = function (src) {
    this.inline = new InlineLexer(src.links, this.options);
    // use an InlineLexer with a TextRenderer to extract pure text
    this.inlineText = new InlineLexer(src.links, merge({}, this.options, { renderer: new TextRenderer() }));
    this.tokens = src.reverse();

    var out = '';
    while (this.next()) {
      out += this.tok();
    }

    return out;
  };

  /**
   * Next Token
   */

  Parser.prototype.next = function () {
    return this.token = this.tokens.pop();
  };

  /**
   * Preview Next Token
   */

  Parser.prototype.peek = function () {
    return this.tokens[this.tokens.length - 1] || 0;
  };

  /**
   * Parse Text Tokens
   */

  Parser.prototype.parseText = function () {
    var body = this.token.text;

    while (this.peek().type === 'text') {
      body += '\n' + this.next().text;
    }

    return this.inline.output(body);
  };

  /**
   * Parse Current Token
   */

  Parser.prototype.tok = function () {
    switch (this.token.type) {
      case 'space':
        {
          return '';
        }
      case 'hr':
        {
          return this.renderer.hr();
        }
      case 'heading':
        {
          return this.renderer.heading(this.inline.output(this.token.text), this.token.depth, unescape(this.inlineText.output(this.token.text)));
        }
      case 'code':
        {
          return this.renderer.code(this.token.text, this.token.lang, this.token.escaped);
        }
      case 'table':
        {
          var header = '',
              body = '',
              i,
              row,
              cell,
              j;

          // header
          cell = '';
          for (i = 0; i < this.token.header.length; i++) {
            cell += this.renderer.tablecell(this.inline.output(this.token.header[i]), { header: true, align: this.token.align[i] });
          }
          header += this.renderer.tablerow(cell);

          for (i = 0; i < this.token.cells.length; i++) {
            row = this.token.cells[i];

            cell = '';
            for (j = 0; j < row.length; j++) {
              cell += this.renderer.tablecell(this.inline.output(row[j]), { header: false, align: this.token.align[j] });
            }

            body += this.renderer.tablerow(cell);
          }
          return this.renderer.table(header, body);
        }
      case 'blockquote_start':
        {
          body = '';

          while (this.next().type !== 'blockquote_end') {
            body += this.tok();
          }

          return this.renderer.blockquote(body);
        }
      case 'list_start':
        {
          body = '';
          var ordered = this.token.ordered,
              start = this.token.start;

          while (this.next().type !== 'list_end') {
            body += this.tok();
          }

          return this.renderer.list(body, ordered, start);
        }
      case 'list_item_start':
        {
          body = '';

          while (this.next().type !== 'list_item_end') {
            body += this.token.type === 'text' ? this.parseText() : this.tok();
          }

          return this.renderer.listitem(body);
        }
      case 'loose_item_start':
        {
          body = '';

          while (this.next().type !== 'list_item_end') {
            body += this.tok();
          }

          return this.renderer.listitem(body);
        }
      case 'html':
        {
          var html = !this.token.pre && !this.options.pedantic ? this.inline.output(this.token.text) : this.token.text;
          return this.renderer.html(html);
        }
      case 'paragraph':
        {
          return this.renderer.paragraph(this.inline.output(this.token.text));
        }
      case 'text':
        {
          return this.renderer.paragraph(this.parseText());
        }
    }
  };

  /**
   * Helpers
   */

  function escape(html, encode) {
    return html.replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function unescape(html) {
    // explicitly match decimal, hex, and named HTML entities
    return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, function (_, n) {
      n = n.toLowerCase();
      if (n === 'colon') return ':';
      if (n.charAt(0) === '#') {
        return n.charAt(1) === 'x' ? String.fromCharCode(parseInt(n.substring(2), 16)) : String.fromCharCode(+n.substring(1));
      }
      return '';
    });
  }

  function edit(regex, opt) {
    regex = regex.source;
    opt = opt || '';
    return {
      replace: function replace(name, val) {
        val = val.source || val;
        val = val.replace(/(^|[^\[])\^/g, '$1');
        regex = regex.replace(name, val);
        return this;
      },
      getRegex: function getRegex() {
        return new RegExp(regex, opt);
      }
    };
  }

  function resolveUrl(base, href) {
    if (!baseUrls[' ' + base]) {
      // we can ignore everything in base after the last slash of its path component,
      // but we might need to add _that_
      // https://tools.ietf.org/html/rfc3986#section-3
      if (/^[^:]+:\/*[^/]*$/.test(base)) {
        baseUrls[' ' + base] = base + '/';
      } else {
        baseUrls[' ' + base] = base.replace(/[^/]*$/, '');
      }
    }
    base = baseUrls[' ' + base];

    if (href.slice(0, 2) === '//') {
      return base.replace(/:[\s\S]*/, ':') + href;
    } else if (href.charAt(0) === '/') {
      return base.replace(/(:\/*[^/]*)[\s\S]*/, '$1') + href;
    } else {
      return base + href;
    }
  }
  var baseUrls = {};
  var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

  function noop() {}
  noop.exec = noop;

  function merge(obj) {
    var i = 1,
        target,
        key;

    for (; i < arguments.length; i++) {
      target = arguments[i];
      for (key in target) {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
          obj[key] = target[key];
        }
      }
    }

    return obj;
  }

  /**
   * Marked
   */

  function marked(src, opt, callback) {
    // throw error in case of non string input
    if (typeof src === 'undefined' || src === null) {
      throw new Error('marked(): input parameter is undefined or null');
    }
    if (typeof src !== 'string') {
      throw new Error('marked(): input parameter is of type ' + Object.prototype.toString.call(src) + ', string expected');
    }

    if (callback || typeof opt === 'function') {
      if (!callback) {
        callback = opt;
        opt = null;
      }

      opt = merge({}, marked.defaults, opt || {});

      var highlight = opt.highlight,
          tokens,
          pending,
          i = 0;

      try {
        tokens = Lexer.lex(src, opt);
      } catch (e) {
        return callback(e);
      }

      pending = tokens.length;

      var done = function done(err) {
        if (err) {
          opt.highlight = highlight;
          return callback(err);
        }

        var out;

        try {
          out = Parser.parse(tokens, opt);
        } catch (e) {
          err = e;
        }

        opt.highlight = highlight;

        return err ? callback(err) : callback(null, out);
      };

      if (!highlight || highlight.length < 3) {
        return done();
      }

      delete opt.highlight;

      if (!pending) return done();

      for (; i < tokens.length; i++) {
        (function (token) {
          if (token.type !== 'code') {
            return --pending || done();
          }
          return highlight(token.text, token.lang, function (err, code) {
            if (err) return done(err);
            if (code == null || code === token.text) {
              return --pending || done();
            }
            token.text = code;
            token.escaped = true;
            --pending || done();
          });
        })(tokens[i]);
      }

      return;
    }
    try {
      if (opt) opt = merge({}, marked.defaults, opt);
      return Parser.parse(Lexer.lex(src, opt), opt);
    } catch (e) {
      e.message += '\nPlease report this to https://github.com/markedjs/marked.';
      if ((opt || marked.defaults).silent) {
        return '<p>An error occurred:</p><pre>' + escape(e.message + '', true) + '</pre>';
      }
      throw e;
    }
  }

  /**
   * Options
   */

  marked.options = marked.setOptions = function (opt) {
    merge(marked.defaults, opt);
    return marked;
  };

  marked.defaults = {
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    sanitizer: null,
    mangle: true,
    smartLists: false,
    silent: false,
    highlight: null,
    langPrefix: 'lang-',
    smartypants: false,
    headerPrefix: '',
    renderer: new Renderer(),
    xhtml: false,
    baseUrl: null
  };

  /**
   * Expose
   */

  marked.Parser = Parser;
  marked.parser = Parser.parse;

  marked.Renderer = Renderer;
  marked.TextRenderer = TextRenderer;

  marked.Lexer = Lexer;
  marked.lexer = Lexer.lex;

  marked.InlineLexer = InlineLexer;
  marked.inlineLexer = InlineLexer.output;

  marked.parse = marked;

  if (typeof module !== 'undefined' && ( false ? 'undefined' : _typeof(exports)) === 'object') {
    module.exports = marked;
  } else if (typeof define === 'function' && define.amd) {
    define(function () {
      return marked;
    });
  } else {
    root.marked = marked;
  }
})(undefined || (typeof window !== 'undefined' ? window : global));
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(50)))

/***/ }),
/* 355 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module, global) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function (root) {

	/** Detect free variables */
	var freeExports = ( false ? 'undefined' : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;
	var freeModule = ( false ? 'undefined' : _typeof(module)) == 'object' && module && !module.nodeType && module;
	var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal) {
		root = freeGlobal;
	}

	/**
  * The `punycode` object.
  * @name punycode
  * @type Object
  */
	var punycode,


	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647,
	    // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	    tMin = 1,
	    tMax = 26,
	    skew = 38,
	    damp = 700,
	    initialBias = 72,
	    initialN = 128,
	    // 0x80
	delimiter = '-',
	    // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	    regexNonASCII = /[^\x20-\x7E]/,
	    // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g,
	    // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},


	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	    floor = Math.floor,
	    stringFromCharCode = String.fromCharCode,


	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
  * A generic error utility function.
  * @private
  * @param {String} type The error type.
  * @returns {Error} Throws a `RangeError` with the applicable error message.
  */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
  * A generic `Array#map` utility function.
  * @private
  * @param {Array} array The array to iterate over.
  * @param {Function} callback The function that gets called for every array
  * item.
  * @returns {Array} A new array of values returned by the callback function.
  */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
  * A simple `Array#map`-like wrapper to work with domain name strings or email
  * addresses.
  * @private
  * @param {String} domain The domain name or email address.
  * @param {Function} callback The function that gets called for every
  * character.
  * @returns {Array} A new string of characters returned by the callback
  * function.
  */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
  * Creates an array containing the numeric code points of each Unicode
  * character in the string. While JavaScript uses UCS-2 internally,
  * this function will convert a pair of surrogate halves (each of which
  * UCS-2 exposes as separate characters) into a single code point,
  * matching UTF-16.
  * @see `punycode.ucs2.encode`
  * @see <https://mathiasbynens.be/notes/javascript-encoding>
  * @memberOf punycode.ucs2
  * @name decode
  * @param {String} string The Unicode input string (UCS-2).
  * @returns {Array} The new array of code points.
  */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) {
					// low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
  * Creates a string based on an array of numeric code points.
  * @see `punycode.ucs2.decode`
  * @memberOf punycode.ucs2
  * @name encode
  * @param {Array} codePoints The array of numeric code points.
  * @returns {String} The new Unicode string (UCS-2).
  */
	function ucs2encode(array) {
		return map(array, function (value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
  * Converts a basic code point into a digit/integer.
  * @see `digitToBasic()`
  * @private
  * @param {Number} codePoint The basic numeric code point value.
  * @returns {Number} The numeric value of a basic code point (for use in
  * representing integers) in the range `0` to `base - 1`, or `base` if
  * the code point does not represent a value.
  */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
  * Converts a digit/integer into a basic code point.
  * @see `basicToDigit()`
  * @private
  * @param {Number} digit The numeric value of a basic code point.
  * @returns {Number} The basic code point whose value (when used for
  * representing integers) is `digit`, which needs to be in the range
  * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
  * used; else, the lowercase form is used. The behavior is undefined
  * if `flag` is non-zero and `digit` has no uppercase form.
  */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
  * Bias adaptation function as per section 3.4 of RFC 3492.
  * https://tools.ietf.org/html/rfc3492#section-3.4
  * @private
  */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (; /* no initialization */delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
  * Converts a Punycode string of ASCII-only symbols to a string of Unicode
  * symbols.
  * @memberOf punycode
  * @param {String} input The Punycode string of ASCII-only symbols.
  * @returns {String} The resulting string of Unicode symbols.
  */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,

		/** Cached calculation results */
		baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength;) /* no final expression */{

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base;; /* no condition */k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;
			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);
		}

		return ucs2encode(output);
	}

	/**
  * Converts a string of Unicode symbols (e.g. a domain name label) to a
  * Punycode string of ASCII-only symbols.
  * @memberOf punycode
  * @param {String} input The string of Unicode symbols.
  * @returns {String} The resulting Punycode string of ASCII-only symbols.
  */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],

		/** `inputLength` will hold the number of code points in `input`. */
		inputLength,

		/** Cached calculation results */
		handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base;; /* no condition */k += base) {
						t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;
		}
		return output.join('');
	}

	/**
  * Converts a Punycode string representing a domain name or an email address
  * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
  * it doesn't matter if you call it on a string that has already been
  * converted to Unicode.
  * @memberOf punycode
  * @param {String} input The Punycoded domain name or email address to
  * convert to Unicode.
  * @returns {String} The Unicode representation of the given Punycode
  * string.
  */
	function toUnicode(input) {
		return mapDomain(input, function (string) {
			return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
		});
	}

	/**
  * Converts a Unicode string representing a domain name or an email address to
  * Punycode. Only the non-ASCII parts of the domain name will be converted,
  * i.e. it doesn't matter if you call it with a domain that's already in
  * ASCII.
  * @memberOf punycode
  * @param {String} input The domain name or email address to convert, as a
  * Unicode string.
  * @returns {String} The Punycode representation of the given domain name or
  * email address.
  */
	function toASCII(input) {
		return mapDomain(input, function (string) {
			return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
   * A string representing the current Punycode.js version number.
   * @memberOf punycode
   * @type String
   */
		'version': '1.4.1',
		/**
   * An object of methods to convert from JavaScript's internal character
   * representation (UCS-2) to Unicode code points, and back.
   * @see <https://mathiasbynens.be/notes/javascript-encoding>
   * @memberOf punycode
   * @type Object
   */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (typeof define == 'function' && _typeof(define.amd) == 'object' && define.amd) {
		define('punycode', function () {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}
})(undefined);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(93)(module), __webpack_require__(50)))

/***/ }),
/* 356 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function (qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr,
        vstr,
        k,
        v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

/***/ }),
/* 357 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var stringifyPrimitive = function stringifyPrimitive(v) {
  switch (typeof v === 'undefined' ? 'undefined' : _typeof(v)) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function (obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
    return map(objectKeys(obj), function (k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function (v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);
  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map(xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

/***/ }),
/* 358 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(356);
exports.encode = exports.stringify = __webpack_require__(357);

/***/ }),
/* 359 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {var require;var require;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* sockjs-client v1.1.4 | http://sockjs.org | MIT license */
(function (f) {
  if (( false ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }g.SockJS = f();
  }
})(function () {
  var define, module, exports;return function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == "function" && require;if (!u && a) return require(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
        }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
          var n = t[o][1][e];return s(n ? n : e);
        }, l, l.exports, e, t, n, r);
      }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
      s(r[o]);
    }return s;
  }({ 1: [function (require, module, exports) {
      (function (global) {
        'use strict';

        var transportList = require('./transport-list');

        module.exports = require('./main')(transportList);

        // TODO can't get rid of this until all servers do
        if ('_sockjs_onload' in global) {
          setTimeout(global._sockjs_onload, 1);
        }
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "./main": 14, "./transport-list": 16 }], 2: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
          Event = require('./event');

      function CloseEvent() {
        Event.call(this);
        this.initEvent('close', false, false);
        this.wasClean = false;
        this.code = 0;
        this.reason = '';
      }

      inherits(CloseEvent, Event);

      module.exports = CloseEvent;
    }, { "./event": 4, "inherits": 57 }], 3: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
          EventTarget = require('./eventtarget');

      function EventEmitter() {
        EventTarget.call(this);
      }

      inherits(EventEmitter, EventTarget);

      EventEmitter.prototype.removeAllListeners = function (type) {
        if (type) {
          delete this._listeners[type];
        } else {
          this._listeners = {};
        }
      };

      EventEmitter.prototype.once = function (type, listener) {
        var self = this,
            fired = false;

        function g() {
          self.removeListener(type, g);

          if (!fired) {
            fired = true;
            listener.apply(this, arguments);
          }
        }

        this.on(type, g);
      };

      EventEmitter.prototype.emit = function () {
        var type = arguments[0];
        var listeners = this._listeners[type];
        if (!listeners) {
          return;
        }
        // equivalent of Array.prototype.slice.call(arguments, 1);
        var l = arguments.length;
        var args = new Array(l - 1);
        for (var ai = 1; ai < l; ai++) {
          args[ai - 1] = arguments[ai];
        }
        for (var i = 0; i < listeners.length; i++) {
          listeners[i].apply(this, args);
        }
      };

      EventEmitter.prototype.on = EventEmitter.prototype.addListener = EventTarget.prototype.addEventListener;
      EventEmitter.prototype.removeListener = EventTarget.prototype.removeEventListener;

      module.exports.EventEmitter = EventEmitter;
    }, { "./eventtarget": 5, "inherits": 57 }], 4: [function (require, module, exports) {
      'use strict';

      function Event(eventType) {
        this.type = eventType;
      }

      Event.prototype.initEvent = function (eventType, canBubble, cancelable) {
        this.type = eventType;
        this.bubbles = canBubble;
        this.cancelable = cancelable;
        this.timeStamp = +new Date();
        return this;
      };

      Event.prototype.stopPropagation = function () {};
      Event.prototype.preventDefault = function () {};

      Event.CAPTURING_PHASE = 1;
      Event.AT_TARGET = 2;
      Event.BUBBLING_PHASE = 3;

      module.exports = Event;
    }, {}], 5: [function (require, module, exports) {
      'use strict';

      /* Simplified implementation of DOM2 EventTarget.
       *   http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget
       */

      function EventTarget() {
        this._listeners = {};
      }

      EventTarget.prototype.addEventListener = function (eventType, listener) {
        if (!(eventType in this._listeners)) {
          this._listeners[eventType] = [];
        }
        var arr = this._listeners[eventType];
        // #4
        if (arr.indexOf(listener) === -1) {
          // Make a copy so as not to interfere with a current dispatchEvent.
          arr = arr.concat([listener]);
        }
        this._listeners[eventType] = arr;
      };

      EventTarget.prototype.removeEventListener = function (eventType, listener) {
        var arr = this._listeners[eventType];
        if (!arr) {
          return;
        }
        var idx = arr.indexOf(listener);
        if (idx !== -1) {
          if (arr.length > 1) {
            // Make a copy so as not to interfere with a current dispatchEvent.
            this._listeners[eventType] = arr.slice(0, idx).concat(arr.slice(idx + 1));
          } else {
            delete this._listeners[eventType];
          }
          return;
        }
      };

      EventTarget.prototype.dispatchEvent = function () {
        var event = arguments[0];
        var t = event.type;
        // equivalent of Array.prototype.slice.call(arguments, 0);
        var args = arguments.length === 1 ? [event] : Array.apply(null, arguments);
        // TODO: This doesn't match the real behavior; per spec, onfoo get
        // their place in line from the /first/ time they're set from
        // non-null. Although WebKit bumps it to the end every time it's
        // set.
        if (this['on' + t]) {
          this['on' + t].apply(this, args);
        }
        if (t in this._listeners) {
          // Grab a reference to the listeners list. removeEventListener may alter the list.
          var listeners = this._listeners[t];
          for (var i = 0; i < listeners.length; i++) {
            listeners[i].apply(this, args);
          }
        }
      };

      module.exports = EventTarget;
    }, {}], 6: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
          Event = require('./event');

      function TransportMessageEvent(data) {
        Event.call(this);
        this.initEvent('message', false, false);
        this.data = data;
      }

      inherits(TransportMessageEvent, Event);

      module.exports = TransportMessageEvent;
    }, { "./event": 4, "inherits": 57 }], 7: [function (require, module, exports) {
      'use strict';

      var JSON3 = require('json3'),
          iframeUtils = require('./utils/iframe');

      function FacadeJS(transport) {
        this._transport = transport;
        transport.on('message', this._transportMessage.bind(this));
        transport.on('close', this._transportClose.bind(this));
      }

      FacadeJS.prototype._transportClose = function (code, reason) {
        iframeUtils.postMessage('c', JSON3.stringify([code, reason]));
      };
      FacadeJS.prototype._transportMessage = function (frame) {
        iframeUtils.postMessage('t', frame);
      };
      FacadeJS.prototype._send = function (data) {
        this._transport.send(data);
      };
      FacadeJS.prototype._close = function () {
        this._transport.close();
        this._transport.removeAllListeners();
      };

      module.exports = FacadeJS;
    }, { "./utils/iframe": 47, "json3": 58 }], 8: [function (require, module, exports) {
      (function (process) {
        'use strict';

        var urlUtils = require('./utils/url'),
            eventUtils = require('./utils/event'),
            JSON3 = require('json3'),
            FacadeJS = require('./facade'),
            InfoIframeReceiver = require('./info-iframe-receiver'),
            iframeUtils = require('./utils/iframe'),
            loc = require('./location');

        var debug = function debug() {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:iframe-bootstrap');
        }

        module.exports = function (SockJS, availableTransports) {
          var transportMap = {};
          availableTransports.forEach(function (at) {
            if (at.facadeTransport) {
              transportMap[at.facadeTransport.transportName] = at.facadeTransport;
            }
          });

          // hard-coded for the info iframe
          // TODO see if we can make this more dynamic
          transportMap[InfoIframeReceiver.transportName] = InfoIframeReceiver;
          var parentOrigin;

          /* eslint-disable camelcase */
          SockJS.bootstrap_iframe = function () {
            /* eslint-enable camelcase */
            var facade;
            iframeUtils.currentWindowId = loc.hash.slice(1);
            var onMessage = function onMessage(e) {
              if (e.source !== parent) {
                return;
              }
              if (typeof parentOrigin === 'undefined') {
                parentOrigin = e.origin;
              }
              if (e.origin !== parentOrigin) {
                return;
              }

              var iframeMessage;
              try {
                iframeMessage = JSON3.parse(e.data);
              } catch (ignored) {
                debug('bad json', e.data);
                return;
              }

              if (iframeMessage.windowId !== iframeUtils.currentWindowId) {
                return;
              }
              switch (iframeMessage.type) {
                case 's':
                  var p;
                  try {
                    p = JSON3.parse(iframeMessage.data);
                  } catch (ignored) {
                    debug('bad json', iframeMessage.data);
                    break;
                  }
                  var version = p[0];
                  var transport = p[1];
                  var transUrl = p[2];
                  var baseUrl = p[3];
                  debug(version, transport, transUrl, baseUrl);
                  // change this to semver logic
                  if (version !== SockJS.version) {
                    throw new Error('Incompatible SockJS! Main site uses:' + ' "' + version + '", the iframe:' + ' "' + SockJS.version + '".');
                  }

                  if (!urlUtils.isOriginEqual(transUrl, loc.href) || !urlUtils.isOriginEqual(baseUrl, loc.href)) {
                    throw new Error('Can\'t connect to different domain from within an ' + 'iframe. (' + loc.href + ', ' + transUrl + ', ' + baseUrl + ')');
                  }
                  facade = new FacadeJS(new transportMap[transport](transUrl, baseUrl));
                  break;
                case 'm':
                  facade._send(iframeMessage.data);
                  break;
                case 'c':
                  if (facade) {
                    facade._close();
                  }
                  facade = null;
                  break;
              }
            };

            eventUtils.attachEvent('message', onMessage);

            // Start
            iframeUtils.postMessage('s');
          };
        };
      }).call(this, { env: {} });
    }, { "./facade": 7, "./info-iframe-receiver": 10, "./location": 13, "./utils/event": 46, "./utils/iframe": 47, "./utils/url": 52, "debug": 55, "json3": 58 }], 9: [function (require, module, exports) {
      (function (process) {
        'use strict';

        var EventEmitter = require('events').EventEmitter,
            inherits = require('inherits'),
            JSON3 = require('json3'),
            objectUtils = require('./utils/object');

        var debug = function debug() {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:info-ajax');
        }

        function InfoAjax(url, AjaxObject) {
          EventEmitter.call(this);

          var self = this;
          var t0 = +new Date();
          this.xo = new AjaxObject('GET', url);

          this.xo.once('finish', function (status, text) {
            var info, rtt;
            if (status === 200) {
              rtt = +new Date() - t0;
              if (text) {
                try {
                  info = JSON3.parse(text);
                } catch (e) {
                  debug('bad json', text);
                }
              }

              if (!objectUtils.isObject(info)) {
                info = {};
              }
            }
            self.emit('finish', info, rtt);
            self.removeAllListeners();
          });
        }

        inherits(InfoAjax, EventEmitter);

        InfoAjax.prototype.close = function () {
          this.removeAllListeners();
          this.xo.close();
        };

        module.exports = InfoAjax;
      }).call(this, { env: {} });
    }, { "./utils/object": 49, "debug": 55, "events": 3, "inherits": 57, "json3": 58 }], 10: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
          EventEmitter = require('events').EventEmitter,
          JSON3 = require('json3'),
          XHRLocalObject = require('./transport/sender/xhr-local'),
          InfoAjax = require('./info-ajax');

      function InfoReceiverIframe(transUrl) {
        var self = this;
        EventEmitter.call(this);

        this.ir = new InfoAjax(transUrl, XHRLocalObject);
        this.ir.once('finish', function (info, rtt) {
          self.ir = null;
          self.emit('message', JSON3.stringify([info, rtt]));
        });
      }

      inherits(InfoReceiverIframe, EventEmitter);

      InfoReceiverIframe.transportName = 'iframe-info-receiver';

      InfoReceiverIframe.prototype.close = function () {
        if (this.ir) {
          this.ir.close();
          this.ir = null;
        }
        this.removeAllListeners();
      };

      module.exports = InfoReceiverIframe;
    }, { "./info-ajax": 9, "./transport/sender/xhr-local": 37, "events": 3, "inherits": 57, "json3": 58 }], 11: [function (require, module, exports) {
      (function (process, global) {
        'use strict';

        var EventEmitter = require('events').EventEmitter,
            inherits = require('inherits'),
            JSON3 = require('json3'),
            utils = require('./utils/event'),
            IframeTransport = require('./transport/iframe'),
            InfoReceiverIframe = require('./info-iframe-receiver');

        var debug = function debug() {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:info-iframe');
        }

        function InfoIframe(baseUrl, url) {
          var self = this;
          EventEmitter.call(this);

          var go = function go() {
            var ifr = self.ifr = new IframeTransport(InfoReceiverIframe.transportName, url, baseUrl);

            ifr.once('message', function (msg) {
              if (msg) {
                var d;
                try {
                  d = JSON3.parse(msg);
                } catch (e) {
                  debug('bad json', msg);
                  self.emit('finish');
                  self.close();
                  return;
                }

                var info = d[0],
                    rtt = d[1];
                self.emit('finish', info, rtt);
              }
              self.close();
            });

            ifr.once('close', function () {
              self.emit('finish');
              self.close();
            });
          };

          // TODO this seems the same as the 'needBody' from transports
          if (!global.document.body) {
            utils.attachEvent('load', go);
          } else {
            go();
          }
        }

        inherits(InfoIframe, EventEmitter);

        InfoIframe.enabled = function () {
          return IframeTransport.enabled();
        };

        InfoIframe.prototype.close = function () {
          if (this.ifr) {
            this.ifr.close();
          }
          this.removeAllListeners();
          this.ifr = null;
        };

        module.exports = InfoIframe;
      }).call(this, { env: {} }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "./info-iframe-receiver": 10, "./transport/iframe": 22, "./utils/event": 46, "debug": 55, "events": 3, "inherits": 57, "json3": 58 }], 12: [function (require, module, exports) {
      (function (process) {
        'use strict';

        var EventEmitter = require('events').EventEmitter,
            inherits = require('inherits'),
            urlUtils = require('./utils/url'),
            XDR = require('./transport/sender/xdr'),
            XHRCors = require('./transport/sender/xhr-cors'),
            XHRLocal = require('./transport/sender/xhr-local'),
            XHRFake = require('./transport/sender/xhr-fake'),
            InfoIframe = require('./info-iframe'),
            InfoAjax = require('./info-ajax');

        var debug = function debug() {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:info-receiver');
        }

        function InfoReceiver(baseUrl, urlInfo) {
          debug(baseUrl);
          var self = this;
          EventEmitter.call(this);

          setTimeout(function () {
            self.doXhr(baseUrl, urlInfo);
          }, 0);
        }

        inherits(InfoReceiver, EventEmitter);

        // TODO this is currently ignoring the list of available transports and the whitelist

        InfoReceiver._getReceiver = function (baseUrl, url, urlInfo) {
          // determine method of CORS support (if needed)
          if (urlInfo.sameOrigin) {
            return new InfoAjax(url, XHRLocal);
          }
          if (XHRCors.enabled) {
            return new InfoAjax(url, XHRCors);
          }
          if (XDR.enabled && urlInfo.sameScheme) {
            return new InfoAjax(url, XDR);
          }
          if (InfoIframe.enabled()) {
            return new InfoIframe(baseUrl, url);
          }
          return new InfoAjax(url, XHRFake);
        };

        InfoReceiver.prototype.doXhr = function (baseUrl, urlInfo) {
          var self = this,
              url = urlUtils.addPath(baseUrl, '/info');
          debug('doXhr', url);

          this.xo = InfoReceiver._getReceiver(baseUrl, url, urlInfo);

          this.timeoutRef = setTimeout(function () {
            debug('timeout');
            self._cleanup(false);
            self.emit('finish');
          }, InfoReceiver.timeout);

          this.xo.once('finish', function (info, rtt) {
            debug('finish', info, rtt);
            self._cleanup(true);
            self.emit('finish', info, rtt);
          });
        };

        InfoReceiver.prototype._cleanup = function (wasClean) {
          debug('_cleanup');
          clearTimeout(this.timeoutRef);
          this.timeoutRef = null;
          if (!wasClean && this.xo) {
            this.xo.close();
          }
          this.xo = null;
        };

        InfoReceiver.prototype.close = function () {
          debug('close');
          this.removeAllListeners();
          this._cleanup(false);
        };

        InfoReceiver.timeout = 8000;

        module.exports = InfoReceiver;
      }).call(this, { env: {} });
    }, { "./info-ajax": 9, "./info-iframe": 11, "./transport/sender/xdr": 34, "./transport/sender/xhr-cors": 35, "./transport/sender/xhr-fake": 36, "./transport/sender/xhr-local": 37, "./utils/url": 52, "debug": 55, "events": 3, "inherits": 57 }], 13: [function (require, module, exports) {
      (function (global) {
        'use strict';

        module.exports = global.location || {
          origin: 'http://localhost:80',
          protocol: 'http',
          host: 'localhost',
          port: 80,
          href: 'http://localhost/',
          hash: ''
        };
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}], 14: [function (require, module, exports) {
      (function (process, global) {
        'use strict';

        require('./shims');

        var URL = require('url-parse'),
            inherits = require('inherits'),
            JSON3 = require('json3'),
            random = require('./utils/random'),
            escape = require('./utils/escape'),
            urlUtils = require('./utils/url'),
            eventUtils = require('./utils/event'),
            transport = require('./utils/transport'),
            objectUtils = require('./utils/object'),
            browser = require('./utils/browser'),
            log = require('./utils/log'),
            Event = require('./event/event'),
            EventTarget = require('./event/eventtarget'),
            loc = require('./location'),
            CloseEvent = require('./event/close'),
            TransportMessageEvent = require('./event/trans-message'),
            InfoReceiver = require('./info-receiver');

        var debug = function debug() {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:main');
        }

        var transports;

        // follow constructor steps defined at http://dev.w3.org/html5/websockets/#the-websocket-interface
        function SockJS(url, protocols, options) {
          if (!(this instanceof SockJS)) {
            return new SockJS(url, protocols, options);
          }
          if (arguments.length < 1) {
            throw new TypeError("Failed to construct 'SockJS: 1 argument required, but only 0 present");
          }
          EventTarget.call(this);

          this.readyState = SockJS.CONNECTING;
          this.extensions = '';
          this.protocol = '';

          // non-standard extension
          options = options || {};
          if (options.protocols_whitelist) {
            log.warn("'protocols_whitelist' is DEPRECATED. Use 'transports' instead.");
          }
          this._transportsWhitelist = options.transports;
          this._transportOptions = options.transportOptions || {};

          var sessionId = options.sessionId || 8;
          if (typeof sessionId === 'function') {
            this._generateSessionId = sessionId;
          } else if (typeof sessionId === 'number') {
            this._generateSessionId = function () {
              return random.string(sessionId);
            };
          } else {
            throw new TypeError('If sessionId is used in the options, it needs to be a number or a function.');
          }

          this._server = options.server || random.numberString(1000);

          // Step 1 of WS spec - parse and validate the url. Issue #8
          var parsedUrl = new URL(url);
          if (!parsedUrl.host || !parsedUrl.protocol) {
            throw new SyntaxError("The URL '" + url + "' is invalid");
          } else if (parsedUrl.hash) {
            throw new SyntaxError('The URL must not contain a fragment');
          } else if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
            throw new SyntaxError("The URL's scheme must be either 'http:' or 'https:'. '" + parsedUrl.protocol + "' is not allowed.");
          }

          var secure = parsedUrl.protocol === 'https:';
          // Step 2 - don't allow secure origin with an insecure protocol
          if (loc.protocol === 'https' && !secure) {
            throw new Error('SecurityError: An insecure SockJS connection may not be initiated from a page loaded over HTTPS');
          }

          // Step 3 - check port access - no need here
          // Step 4 - parse protocols argument
          if (!protocols) {
            protocols = [];
          } else if (!Array.isArray(protocols)) {
            protocols = [protocols];
          }

          // Step 5 - check protocols argument
          var sortedProtocols = protocols.sort();
          sortedProtocols.forEach(function (proto, i) {
            if (!proto) {
              throw new SyntaxError("The protocols entry '" + proto + "' is invalid.");
            }
            if (i < sortedProtocols.length - 1 && proto === sortedProtocols[i + 1]) {
              throw new SyntaxError("The protocols entry '" + proto + "' is duplicated.");
            }
          });

          // Step 6 - convert origin
          var o = urlUtils.getOrigin(loc.href);
          this._origin = o ? o.toLowerCase() : null;

          // remove the trailing slash
          parsedUrl.set('pathname', parsedUrl.pathname.replace(/\/+$/, ''));

          // store the sanitized url
          this.url = parsedUrl.href;
          debug('using url', this.url);

          // Step 7 - start connection in background
          // obtain server info
          // http://sockjs.github.io/sockjs-protocol/sockjs-protocol-0.3.3.html#section-26
          this._urlInfo = {
            nullOrigin: !browser.hasDomain(),
            sameOrigin: urlUtils.isOriginEqual(this.url, loc.href),
            sameScheme: urlUtils.isSchemeEqual(this.url, loc.href)
          };

          this._ir = new InfoReceiver(this.url, this._urlInfo);
          this._ir.once('finish', this._receiveInfo.bind(this));
        }

        inherits(SockJS, EventTarget);

        function userSetCode(code) {
          return code === 1000 || code >= 3000 && code <= 4999;
        }

        SockJS.prototype.close = function (code, reason) {
          // Step 1
          if (code && !userSetCode(code)) {
            throw new Error('InvalidAccessError: Invalid code');
          }
          // Step 2.4 states the max is 123 bytes, but we are just checking length
          if (reason && reason.length > 123) {
            throw new SyntaxError('reason argument has an invalid length');
          }

          // Step 3.1
          if (this.readyState === SockJS.CLOSING || this.readyState === SockJS.CLOSED) {
            return;
          }

          // TODO look at docs to determine how to set this
          var wasClean = true;
          this._close(code || 1000, reason || 'Normal closure', wasClean);
        };

        SockJS.prototype.send = function (data) {
          // #13 - convert anything non-string to string
          // TODO this currently turns objects into [object Object]
          if (typeof data !== 'string') {
            data = '' + data;
          }
          if (this.readyState === SockJS.CONNECTING) {
            throw new Error('InvalidStateError: The connection has not been established yet');
          }
          if (this.readyState !== SockJS.OPEN) {
            return;
          }
          this._transport.send(escape.quote(data));
        };

        SockJS.version = require('./version');

        SockJS.CONNECTING = 0;
        SockJS.OPEN = 1;
        SockJS.CLOSING = 2;
        SockJS.CLOSED = 3;

        SockJS.prototype._receiveInfo = function (info, rtt) {
          debug('_receiveInfo', rtt);
          this._ir = null;
          if (!info) {
            this._close(1002, 'Cannot connect to server');
            return;
          }

          // establish a round-trip timeout (RTO) based on the
          // round-trip time (RTT)
          this._rto = this.countRTO(rtt);
          // allow server to override url used for the actual transport
          this._transUrl = info.base_url ? info.base_url : this.url;
          info = objectUtils.extend(info, this._urlInfo);
          debug('info', info);
          // determine list of desired and supported transports
          var enabledTransports = transports.filterToEnabled(this._transportsWhitelist, info);
          this._transports = enabledTransports.main;
          debug(this._transports.length + ' enabled transports');

          this._connect();
        };

        SockJS.prototype._connect = function () {
          for (var Transport = this._transports.shift(); Transport; Transport = this._transports.shift()) {
            debug('attempt', Transport.transportName);
            if (Transport.needBody) {
              if (!global.document.body || typeof global.document.readyState !== 'undefined' && global.document.readyState !== 'complete' && global.document.readyState !== 'interactive') {
                debug('waiting for body');
                this._transports.unshift(Transport);
                eventUtils.attachEvent('load', this._connect.bind(this));
                return;
              }
            }

            // calculate timeout based on RTO and round trips. Default to 5s
            var timeoutMs = this._rto * Transport.roundTrips || 5000;
            this._transportTimeoutId = setTimeout(this._transportTimeout.bind(this), timeoutMs);
            debug('using timeout', timeoutMs);

            var transportUrl = urlUtils.addPath(this._transUrl, '/' + this._server + '/' + this._generateSessionId());
            var options = this._transportOptions[Transport.transportName];
            debug('transport url', transportUrl);
            var transportObj = new Transport(transportUrl, this._transUrl, options);
            transportObj.on('message', this._transportMessage.bind(this));
            transportObj.once('close', this._transportClose.bind(this));
            transportObj.transportName = Transport.transportName;
            this._transport = transportObj;

            return;
          }
          this._close(2000, 'All transports failed', false);
        };

        SockJS.prototype._transportTimeout = function () {
          debug('_transportTimeout');
          if (this.readyState === SockJS.CONNECTING) {
            this._transportClose(2007, 'Transport timed out');
          }
        };

        SockJS.prototype._transportMessage = function (msg) {
          debug('_transportMessage', msg);
          var self = this,
              type = msg.slice(0, 1),
              content = msg.slice(1),
              payload;

          // first check for messages that don't need a payload
          switch (type) {
            case 'o':
              this._open();
              return;
            case 'h':
              this.dispatchEvent(new Event('heartbeat'));
              debug('heartbeat', this.transport);
              return;
          }

          if (content) {
            try {
              payload = JSON3.parse(content);
            } catch (e) {
              debug('bad json', content);
            }
          }

          if (typeof payload === 'undefined') {
            debug('empty payload', content);
            return;
          }

          switch (type) {
            case 'a':
              if (Array.isArray(payload)) {
                payload.forEach(function (p) {
                  debug('message', self.transport, p);
                  self.dispatchEvent(new TransportMessageEvent(p));
                });
              }
              break;
            case 'm':
              debug('message', this.transport, payload);
              this.dispatchEvent(new TransportMessageEvent(payload));
              break;
            case 'c':
              if (Array.isArray(payload) && payload.length === 2) {
                this._close(payload[0], payload[1], true);
              }
              break;
          }
        };

        SockJS.prototype._transportClose = function (code, reason) {
          debug('_transportClose', this.transport, code, reason);
          if (this._transport) {
            this._transport.removeAllListeners();
            this._transport = null;
            this.transport = null;
          }

          if (!userSetCode(code) && code !== 2000 && this.readyState === SockJS.CONNECTING) {
            this._connect();
            return;
          }

          this._close(code, reason);
        };

        SockJS.prototype._open = function () {
          debug('_open', this._transport.transportName, this.readyState);
          if (this.readyState === SockJS.CONNECTING) {
            if (this._transportTimeoutId) {
              clearTimeout(this._transportTimeoutId);
              this._transportTimeoutId = null;
            }
            this.readyState = SockJS.OPEN;
            this.transport = this._transport.transportName;
            this.dispatchEvent(new Event('open'));
            debug('connected', this.transport);
          } else {
            // The server might have been restarted, and lost track of our
            // connection.
            this._close(1006, 'Server lost session');
          }
        };

        SockJS.prototype._close = function (code, reason, wasClean) {
          debug('_close', this.transport, code, reason, wasClean, this.readyState);
          var forceFail = false;

          if (this._ir) {
            forceFail = true;
            this._ir.close();
            this._ir = null;
          }
          if (this._transport) {
            this._transport.close();
            this._transport = null;
            this.transport = null;
          }

          if (this.readyState === SockJS.CLOSED) {
            throw new Error('InvalidStateError: SockJS has already been closed');
          }

          this.readyState = SockJS.CLOSING;
          setTimeout(function () {
            this.readyState = SockJS.CLOSED;

            if (forceFail) {
              this.dispatchEvent(new Event('error'));
            }

            var e = new CloseEvent('close');
            e.wasClean = wasClean || false;
            e.code = code || 1000;
            e.reason = reason;

            this.dispatchEvent(e);
            this.onmessage = this.onclose = this.onerror = null;
            debug('disconnected');
          }.bind(this), 0);
        };

        // See: http://www.erg.abdn.ac.uk/~gerrit/dccp/notes/ccid2/rto_estimator/
        // and RFC 2988.
        SockJS.prototype.countRTO = function (rtt) {
          // In a local environment, when using IE8/9 and the `jsonp-polling`
          // transport the time needed to establish a connection (the time that pass
          // from the opening of the transport to the call of `_dispatchOpen`) is
          // around 200msec (the lower bound used in the article above) and this
          // causes spurious timeouts. For this reason we calculate a value slightly
          // larger than that used in the article.
          if (rtt > 100) {
            return 4 * rtt; // rto > 400msec
          }
          return 300 + rtt; // 300msec < rto <= 400msec
        };

        module.exports = function (availableTransports) {
          transports = transport(availableTransports);
          require('./iframe-bootstrap')(SockJS, availableTransports);
          return SockJS;
        };
      }).call(this, { env: {} }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "./event/close": 2, "./event/event": 4, "./event/eventtarget": 5, "./event/trans-message": 6, "./iframe-bootstrap": 8, "./info-receiver": 12, "./location": 13, "./shims": 15, "./utils/browser": 44, "./utils/escape": 45, "./utils/event": 46, "./utils/log": 48, "./utils/object": 49, "./utils/random": 50, "./utils/transport": 51, "./utils/url": 52, "./version": 53, "debug": 55, "inherits": 57, "json3": 58, "url-parse": 61 }], 15: [function (require, module, exports) {
      /* eslint-disable */
      /* jscs: disable */
      'use strict';

      // pulled specific shims from https://github.com/es-shims/es5-shim

      var ArrayPrototype = Array.prototype;
      var ObjectPrototype = Object.prototype;
      var FunctionPrototype = Function.prototype;
      var StringPrototype = String.prototype;
      var array_slice = ArrayPrototype.slice;

      var _toString = ObjectPrototype.toString;
      var isFunction = function isFunction(val) {
        return ObjectPrototype.toString.call(val) === '[object Function]';
      };
      var isArray = function isArray(obj) {
        return _toString.call(obj) === '[object Array]';
      };
      var isString = function isString(obj) {
        return _toString.call(obj) === '[object String]';
      };

      var supportsDescriptors = Object.defineProperty && function () {
        try {
          Object.defineProperty({}, 'x', {});
          return true;
        } catch (e) {
          /* this is ES3 */
          return false;
        }
      }();

      // Define configurable, writable and non-enumerable props
      // if they don't exist.
      var defineProperty;
      if (supportsDescriptors) {
        defineProperty = function defineProperty(object, name, method, forceAssign) {
          if (!forceAssign && name in object) {
            return;
          }
          Object.defineProperty(object, name, {
            configurable: true,
            enumerable: false,
            writable: true,
            value: method
          });
        };
      } else {
        defineProperty = function defineProperty(object, name, method, forceAssign) {
          if (!forceAssign && name in object) {
            return;
          }
          object[name] = method;
        };
      }
      var defineProperties = function defineProperties(object, map, forceAssign) {
        for (var name in map) {
          if (ObjectPrototype.hasOwnProperty.call(map, name)) {
            defineProperty(object, name, map[name], forceAssign);
          }
        }
      };

      var toObject = function toObject(o) {
        if (o == null) {
          // this matches both null and undefined
          throw new TypeError("can't convert " + o + ' to object');
        }
        return Object(o);
      };

      //
      // Util
      // ======
      //

      // ES5 9.4
      // http://es5.github.com/#x9.4
      // http://jsperf.com/to-integer

      function toInteger(num) {
        var n = +num;
        if (n !== n) {
          // isNaN
          n = 0;
        } else if (n !== 0 && n !== 1 / 0 && n !== -(1 / 0)) {
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
        return n;
      }

      function ToUint32(x) {
        return x >>> 0;
      }

      //
      // Function
      // ========
      //

      // ES-5 15.3.4.5
      // http://es5.github.com/#x15.3.4.5

      function Empty() {}

      defineProperties(FunctionPrototype, {
        bind: function bind(that) {
          // .length is 1
          // 1. Let Target be the this value.
          var target = this;
          // 2. If IsCallable(Target) is false, throw a TypeError exception.
          if (!isFunction(target)) {
            throw new TypeError('Function.prototype.bind called on incompatible ' + target);
          }
          // 3. Let A be a new (possibly empty) internal list of all of the
          //   argument values provided after thisArg (arg1, arg2 etc), in order.
          // XXX slicedArgs will stand in for "A" if used
          var args = array_slice.call(arguments, 1); // for normal call
          // 4. Let F be a new native ECMAScript object.
          // 11. Set the [[Prototype]] internal property of F to the standard
          //   built-in Function prototype object as specified in 15.3.3.1.
          // 12. Set the [[Call]] internal property of F as described in
          //   15.3.4.5.1.
          // 13. Set the [[Construct]] internal property of F as described in
          //   15.3.4.5.2.
          // 14. Set the [[HasInstance]] internal property of F as described in
          //   15.3.4.5.3.
          var binder = function binder() {

            if (this instanceof bound) {
              // 15.3.4.5.2 [[Construct]]
              // When the [[Construct]] internal method of a function object,
              // F that was created using the bind function is called with a
              // list of arguments ExtraArgs, the following steps are taken:
              // 1. Let target be the value of F's [[TargetFunction]]
              //   internal property.
              // 2. If target has no [[Construct]] internal method, a
              //   TypeError exception is thrown.
              // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
              //   property.
              // 4. Let args be a new list containing the same values as the
              //   list boundArgs in the same order followed by the same
              //   values as the list ExtraArgs in the same order.
              // 5. Return the result of calling the [[Construct]] internal
              //   method of target providing args as the arguments.

              var result = target.apply(this, args.concat(array_slice.call(arguments)));
              if (Object(result) === result) {
                return result;
              }
              return this;
            } else {
              // 15.3.4.5.1 [[Call]]
              // When the [[Call]] internal method of a function object, F,
              // which was created using the bind function is called with a
              // this value and a list of arguments ExtraArgs, the following
              // steps are taken:
              // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
              //   property.
              // 2. Let boundThis be the value of F's [[BoundThis]] internal
              //   property.
              // 3. Let target be the value of F's [[TargetFunction]] internal
              //   property.
              // 4. Let args be a new list containing the same values as the
              //   list boundArgs in the same order followed by the same
              //   values as the list ExtraArgs in the same order.
              // 5. Return the result of calling the [[Call]] internal method
              //   of target providing boundThis as the this value and
              //   providing args as the arguments.

              // equiv: target.call(this, ...boundArgs, ...args)
              return target.apply(that, args.concat(array_slice.call(arguments)));
            }
          };

          // 15. If the [[Class]] internal property of Target is "Function", then
          //     a. Let L be the length property of Target minus the length of A.
          //     b. Set the length own property of F to either 0 or L, whichever is
          //       larger.
          // 16. Else set the length own property of F to 0.

          var boundLength = Math.max(0, target.length - args.length);

          // 17. Set the attributes of the length own property of F to the values
          //   specified in 15.3.5.1.
          var boundArgs = [];
          for (var i = 0; i < boundLength; i++) {
            boundArgs.push('$' + i);
          }

          // XXX Build a dynamic function with desired amount of arguments is the only
          // way to set the length property of a function.
          // In environments where Content Security Policies enabled (Chrome extensions,
          // for ex.) all use of eval or Function costructor throws an exception.
          // However in all of these environments Function.prototype.bind exists
          // and so this code will never be executed.
          var bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);

          if (target.prototype) {
            Empty.prototype = target.prototype;
            bound.prototype = new Empty();
            // Clean up dangling references.
            Empty.prototype = null;
          }

          // TODO
          // 18. Set the [[Extensible]] internal property of F to true.

          // TODO
          // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
          // 20. Call the [[DefineOwnProperty]] internal method of F with
          //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
          //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
          //   false.
          // 21. Call the [[DefineOwnProperty]] internal method of F with
          //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
          //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
          //   and false.

          // TODO
          // NOTE Function objects created using Function.prototype.bind do not
          // have a prototype property or the [[Code]], [[FormalParameters]], and
          // [[Scope]] internal properties.
          // XXX can't delete prototype in pure-js.

          // 22. Return F.
          return bound;
        }
      });

      //
      // Array
      // =====
      //

      // ES5 15.4.3.2
      // http://es5.github.com/#x15.4.3.2
      // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
      defineProperties(Array, { isArray: isArray });

      var boxedString = Object('a');
      var splitString = boxedString[0] !== 'a' || !(0 in boxedString);

      var properlyBoxesContext = function properlyBoxed(method) {
        // Check node 0.6.21 bug where third parameter is not boxed
        var properlyBoxesNonStrict = true;
        var properlyBoxesStrict = true;
        if (method) {
          method.call('foo', function (_, __, context) {
            if ((typeof context === "undefined" ? "undefined" : _typeof(context)) !== 'object') {
              properlyBoxesNonStrict = false;
            }
          });

          method.call([1], function () {
            'use strict';

            properlyBoxesStrict = typeof this === 'string';
          }, 'x');
        }
        return !!method && properlyBoxesNonStrict && properlyBoxesStrict;
      };

      defineProperties(ArrayPrototype, {
        forEach: function forEach(fun /*, thisp*/) {
          var object = toObject(this),
              self = splitString && isString(this) ? this.split('') : object,
              thisp = arguments[1],
              i = -1,
              length = self.length >>> 0;

          // If no callback function or if callback is not a callable function
          if (!isFunction(fun)) {
            throw new TypeError(); // TODO message
          }

          while (++i < length) {
            if (i in self) {
              // Invoke the callback function with call, passing arguments:
              // context, property value, property key, thisArg object
              // context
              fun.call(thisp, self[i], i, object);
            }
          }
        }
      }, !properlyBoxesContext(ArrayPrototype.forEach));

      // ES5 15.4.4.14
      // http://es5.github.com/#x15.4.4.14
      // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
      var hasFirefox2IndexOfBug = Array.prototype.indexOf && [0, 1].indexOf(1, 2) !== -1;
      defineProperties(ArrayPrototype, {
        indexOf: function indexOf(sought /*, fromIndex */) {
          var self = splitString && isString(this) ? this.split('') : toObject(this),
              length = self.length >>> 0;

          if (!length) {
            return -1;
          }

          var i = 0;
          if (arguments.length > 1) {
            i = toInteger(arguments[1]);
          }

          // handle negative indices
          i = i >= 0 ? i : Math.max(0, length + i);
          for (; i < length; i++) {
            if (i in self && self[i] === sought) {
              return i;
            }
          }
          return -1;
        }
      }, hasFirefox2IndexOfBug);

      //
      // String
      // ======
      //

      // ES5 15.5.4.14
      // http://es5.github.com/#x15.5.4.14

      // [bugfix, IE lt 9, firefox 4, Konqueror, Opera, obscure browsers]
      // Many browsers do not split properly with regular expressions or they
      // do not perform the split correctly under obscure conditions.
      // See http://blog.stevenlevithan.com/archives/cross-browser-split
      // I've tested in many browsers and this seems to cover the deviant ones:
      //    'ab'.split(/(?:ab)*/) should be ["", ""], not [""]
      //    '.'.split(/(.?)(.?)/) should be ["", ".", "", ""], not ["", ""]
      //    'tesst'.split(/(s)*/) should be ["t", undefined, "e", "s", "t"], not
      //       [undefined, "t", undefined, "e", ...]
      //    ''.split(/.?/) should be [], not [""]
      //    '.'.split(/()()/) should be ["."], not ["", "", "."]

      var string_split = StringPrototype.split;
      if ('ab'.split(/(?:ab)*/).length !== 2 || '.'.split(/(.?)(.?)/).length !== 4 || 'tesst'.split(/(s)*/)[1] === 't' || 'test'.split(/(?:)/, -1).length !== 4 || ''.split(/.?/).length || '.'.split(/()()/).length > 1) {
        (function () {
          var compliantExecNpcg = /()??/.exec('')[1] === void 0; // NPCG: nonparticipating capturing group

          StringPrototype.split = function (separator, limit) {
            var string = this;
            if (separator === void 0 && limit === 0) {
              return [];
            }

            // If `separator` is not a regex, use native split
            if (_toString.call(separator) !== '[object RegExp]') {
              return string_split.call(this, separator, limit);
            }

            var output = [],
                flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.extended ? 'x' : '') + ( // Proposed for ES6
            separator.sticky ? 'y' : ''),
                // Firefox 3+
            lastLastIndex = 0,

            // Make `global` and avoid `lastIndex` issues by working with a copy
            separator2,
                match,
                lastIndex,
                lastLength;
            separator = new RegExp(separator.source, flags + 'g');
            string += ''; // Type-convert
            if (!compliantExecNpcg) {
              // Doesn't need flags gy, but they don't hurt
              separator2 = new RegExp('^' + separator.source + '$(?!\\s)', flags);
            }
            /* Values for `limit`, per the spec:
             * If undefined: 4294967295 // Math.pow(2, 32) - 1
             * If 0, Infinity, or NaN: 0
             * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
             * If negative number: 4294967296 - Math.floor(Math.abs(limit))
             * If other: Type-convert, then use the above rules
             */
            limit = limit === void 0 ? -1 >>> 0 : // Math.pow(2, 32) - 1
            ToUint32(limit);
            while (match = separator.exec(string)) {
              // `separator.lastIndex` is not reliable cross-browser
              lastIndex = match.index + match[0].length;
              if (lastIndex > lastLastIndex) {
                output.push(string.slice(lastLastIndex, match.index));
                // Fix browsers whose `exec` methods don't consistently return `undefined` for
                // nonparticipating capturing groups
                if (!compliantExecNpcg && match.length > 1) {
                  match[0].replace(separator2, function () {
                    for (var i = 1; i < arguments.length - 2; i++) {
                      if (arguments[i] === void 0) {
                        match[i] = void 0;
                      }
                    }
                  });
                }
                if (match.length > 1 && match.index < string.length) {
                  ArrayPrototype.push.apply(output, match.slice(1));
                }
                lastLength = match[0].length;
                lastLastIndex = lastIndex;
                if (output.length >= limit) {
                  break;
                }
              }
              if (separator.lastIndex === match.index) {
                separator.lastIndex++; // Avoid an infinite loop
              }
            }
            if (lastLastIndex === string.length) {
              if (lastLength || !separator.test('')) {
                output.push('');
              }
            } else {
              output.push(string.slice(lastLastIndex));
            }
            return output.length > limit ? output.slice(0, limit) : output;
          };
        })();

        // [bugfix, chrome]
        // If separator is undefined, then the result array contains just one String,
        // which is the this value (converted to a String). If limit is not undefined,
        // then the output array is truncated so that it contains no more than limit
        // elements.
        // "0".split(undefined, 0) -> []
      } else if ('0'.split(void 0, 0).length) {
        StringPrototype.split = function split(separator, limit) {
          if (separator === void 0 && limit === 0) {
            return [];
          }
          return string_split.call(this, separator, limit);
        };
      }

      // ECMA-262, 3rd B.2.3
      // Not an ECMAScript standard, although ECMAScript 3rd Edition has a
      // non-normative section suggesting uniform semantics and it should be
      // normalized across all browsers
      // [bugfix, IE lt 9] IE < 9 substr() with negative value not working in IE
      var string_substr = StringPrototype.substr;
      var hasNegativeSubstrBug = ''.substr && '0b'.substr(-1) !== 'b';
      defineProperties(StringPrototype, {
        substr: function substr(start, length) {
          return string_substr.call(this, start < 0 ? (start = this.length + start) < 0 ? 0 : start : start, length);
        }
      }, hasNegativeSubstrBug);
    }, {}], 16: [function (require, module, exports) {
      'use strict';

      module.exports = [
      // streaming transports
      require('./transport/websocket'), require('./transport/xhr-streaming'), require('./transport/xdr-streaming'), require('./transport/eventsource'), require('./transport/lib/iframe-wrap')(require('./transport/eventsource'))

      // polling transports
      , require('./transport/htmlfile'), require('./transport/lib/iframe-wrap')(require('./transport/htmlfile')), require('./transport/xhr-polling'), require('./transport/xdr-polling'), require('./transport/lib/iframe-wrap')(require('./transport/xhr-polling')), require('./transport/jsonp-polling')];
    }, { "./transport/eventsource": 20, "./transport/htmlfile": 21, "./transport/jsonp-polling": 23, "./transport/lib/iframe-wrap": 26, "./transport/websocket": 38, "./transport/xdr-polling": 39, "./transport/xdr-streaming": 40, "./transport/xhr-polling": 41, "./transport/xhr-streaming": 42 }], 17: [function (require, module, exports) {
      (function (process, global) {
        'use strict';

        var EventEmitter = require('events').EventEmitter,
            inherits = require('inherits'),
            utils = require('../../utils/event'),
            urlUtils = require('../../utils/url'),
            XHR = global.XMLHttpRequest;

        var debug = function debug() {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:browser:xhr');
        }

        function AbstractXHRObject(method, url, payload, opts) {
          debug(method, url);
          var self = this;
          EventEmitter.call(this);

          setTimeout(function () {
            self._start(method, url, payload, opts);
          }, 0);
        }

        inherits(AbstractXHRObject, EventEmitter);

        AbstractXHRObject.prototype._start = function (method, url, payload, opts) {
          var self = this;

          try {
            this.xhr = new XHR();
          } catch (x) {
            // intentionally empty
          }

          if (!this.xhr) {
            debug('no xhr');
            this.emit('finish', 0, 'no xhr support');
            this._cleanup();
            return;
          }

          // several browsers cache POSTs
          url = urlUtils.addQuery(url, 't=' + +new Date());

          // Explorer tends to keep connection open, even after the
          // tab gets closed: http://bugs.jquery.com/ticket/5280
          this.unloadRef = utils.unloadAdd(function () {
            debug('unload cleanup');
            self._cleanup(true);
          });
          try {
            this.xhr.open(method, url, true);
            if (this.timeout && 'timeout' in this.xhr) {
              this.xhr.timeout = this.timeout;
              this.xhr.ontimeout = function () {
                debug('xhr timeout');
                self.emit('finish', 0, '');
                self._cleanup(false);
              };
            }
          } catch (e) {
            debug('exception', e);
            // IE raises an exception on wrong port.
            this.emit('finish', 0, '');
            this._cleanup(false);
            return;
          }

          if ((!opts || !opts.noCredentials) && AbstractXHRObject.supportsCORS) {
            debug('withCredentials');
            // Mozilla docs says https://developer.mozilla.org/en/XMLHttpRequest :
            // "This never affects same-site requests."

            this.xhr.withCredentials = 'true';
          }
          if (opts && opts.headers) {
            for (var key in opts.headers) {
              this.xhr.setRequestHeader(key, opts.headers[key]);
            }
          }

          this.xhr.onreadystatechange = function () {
            if (self.xhr) {
              var x = self.xhr;
              var text, status;
              debug('readyState', x.readyState);
              switch (x.readyState) {
                case 3:
                  // IE doesn't like peeking into responseText or status
                  // on Microsoft.XMLHTTP and readystate=3
                  try {
                    status = x.status;
                    text = x.responseText;
                  } catch (e) {
                    // intentionally empty
                  }
                  debug('status', status);
                  // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
                  if (status === 1223) {
                    status = 204;
                  }

                  // IE does return readystate == 3 for 404 answers.
                  if (status === 200 && text && text.length > 0) {
                    debug('chunk');
                    self.emit('chunk', status, text);
                  }
                  break;
                case 4:
                  status = x.status;
                  debug('status', status);
                  // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
                  if (status === 1223) {
                    status = 204;
                  }
                  // IE returns this for a bad port
                  // http://msdn.microsoft.com/en-us/library/windows/desktop/aa383770(v=vs.85).aspx
                  if (status === 12005 || status === 12029) {
                    status = 0;
                  }

                  debug('finish', status, x.responseText);
                  self.emit('finish', status, x.responseText);
                  self._cleanup(false);
                  break;
              }
            }
          };

          try {
            self.xhr.send(payload);
          } catch (e) {
            self.emit('finish', 0, '');
            self._cleanup(false);
          }
        };

        AbstractXHRObject.prototype._cleanup = function (abort) {
          debug('cleanup');
          if (!this.xhr) {
            return;
          }
          this.removeAllListeners();
          utils.unloadDel(this.unloadRef);

          // IE needs this field to be a function
          this.xhr.onreadystatechange = function () {};
          if (this.xhr.ontimeout) {
            this.xhr.ontimeout = null;
          }

          if (abort) {
            try {
              this.xhr.abort();
            } catch (x) {
              // intentionally empty
            }
          }
          this.unloadRef = this.xhr = null;
        };

        AbstractXHRObject.prototype.close = function () {
          debug('close');
          this._cleanup(true);
        };

        AbstractXHRObject.enabled = !!XHR;
        // override XMLHttpRequest for IE6/7
        // obfuscate to avoid firewalls
        var axo = ['Active'].concat('Object').join('X');
        if (!AbstractXHRObject.enabled && axo in global) {
          debug('overriding xmlhttprequest');
          XHR = function XHR() {
            try {
              return new global[axo]('Microsoft.XMLHTTP');
            } catch (e) {
              return null;
            }
          };
          AbstractXHRObject.enabled = !!new XHR();
        }

        var cors = false;
        try {
          cors = 'withCredentials' in new XHR();
        } catch (ignored) {
          // intentionally empty
        }

        AbstractXHRObject.supportsCORS = cors;

        module.exports = AbstractXHRObject;
      }).call(this, { env: {} }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "../../utils/event": 46, "../../utils/url": 52, "debug": 55, "events": 3, "inherits": 57 }], 18: [function (require, module, exports) {
      (function (global) {
        module.exports = global.EventSource;
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}], 19: [function (require, module, exports) {
      (function (global) {
        'use strict';

        var Driver = global.WebSocket || global.MozWebSocket;
        if (Driver) {
          module.exports = function WebSocketBrowserDriver(url) {
            return new Driver(url);
          };
        } else {
          module.exports = undefined;
        }
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}], 20: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
          AjaxBasedTransport = require('./lib/ajax-based'),
          EventSourceReceiver = require('./receiver/eventsource'),
          XHRCorsObject = require('./sender/xhr-cors'),
          EventSourceDriver = require('eventsource');

      function EventSourceTransport(transUrl) {
        if (!EventSourceTransport.enabled()) {
          throw new Error('Transport created when disabled');
        }

        AjaxBasedTransport.call(this, transUrl, '/eventsource', EventSourceReceiver, XHRCorsObject);
      }

      inherits(EventSourceTransport, AjaxBasedTransport);

      EventSourceTransport.enabled = function () {
        return !!EventSourceDriver;
      };

      EventSourceTransport.transportName = 'eventsource';
      EventSourceTransport.roundTrips = 2;

      module.exports = EventSourceTransport;
    }, { "./lib/ajax-based": 24, "./receiver/eventsource": 29, "./sender/xhr-cors": 35, "eventsource": 18, "inherits": 57 }], 21: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
          HtmlfileReceiver = require('./receiver/htmlfile'),
          XHRLocalObject = require('./sender/xhr-local'),
          AjaxBasedTransport = require('./lib/ajax-based');

      function HtmlFileTransport(transUrl) {
        if (!HtmlfileReceiver.enabled) {
          throw new Error('Transport created when disabled');
        }
        AjaxBasedTransport.call(this, transUrl, '/htmlfile', HtmlfileReceiver, XHRLocalObject);
      }

      inherits(HtmlFileTransport, AjaxBasedTransport);

      HtmlFileTransport.enabled = function (info) {
        return HtmlfileReceiver.enabled && info.sameOrigin;
      };

      HtmlFileTransport.transportName = 'htmlfile';
      HtmlFileTransport.roundTrips = 2;

      module.exports = HtmlFileTransport;
    }, { "./lib/ajax-based": 24, "./receiver/htmlfile": 30, "./sender/xhr-local": 37, "inherits": 57 }], 22: [function (require, module, exports) {
      (function (process) {
        'use strict';

        // Few cool transports do work only for same-origin. In order to make
        // them work cross-domain we shall use iframe, served from the
        // remote domain. New browsers have capabilities to communicate with
        // cross domain iframe using postMessage(). In IE it was implemented
        // from IE 8+, but of course, IE got some details wrong:
        //    http://msdn.microsoft.com/en-us/library/cc197015(v=VS.85).aspx
        //    http://stevesouders.com/misc/test-postmessage.php

        var inherits = require('inherits'),
            JSON3 = require('json3'),
            EventEmitter = require('events').EventEmitter,
            version = require('../version'),
            urlUtils = require('../utils/url'),
            iframeUtils = require('../utils/iframe'),
            eventUtils = require('../utils/event'),
            random = require('../utils/random');

        var debug = function debug() {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:transport:iframe');
        }

        function IframeTransport(transport, transUrl, baseUrl) {
          if (!IframeTransport.enabled()) {
            throw new Error('Transport created when disabled');
          }
          EventEmitter.call(this);

          var self = this;
          this.origin = urlUtils.getOrigin(baseUrl);
          this.baseUrl = baseUrl;
          this.transUrl = transUrl;
          this.transport = transport;
          this.windowId = random.string(8);

          var iframeUrl = urlUtils.addPath(baseUrl, '/iframe.html') + '#' + this.windowId;
          debug(transport, transUrl, iframeUrl);

          this.iframeObj = iframeUtils.createIframe(iframeUrl, function (r) {
            debug('err callback');
            self.emit('close', 1006, 'Unable to load an iframe (' + r + ')');
            self.close();
          });

          this.onmessageCallback = this._message.bind(this);
          eventUtils.attachEvent('message', this.onmessageCallback);
        }

        inherits(IframeTransport, EventEmitter);

        IframeTransport.prototype.close = function () {
          debug('close');
          this.removeAllListeners();
          if (this.iframeObj) {
            eventUtils.detachEvent('message', this.onmessageCallback);
            try {
              // When the iframe is not loaded, IE raises an exception
              // on 'contentWindow'.
              this.postMessage('c');
            } catch (x) {
              // intentionally empty
            }
            this.iframeObj.cleanup();
            this.iframeObj = null;
            this.onmessageCallback = this.iframeObj = null;
          }
        };

        IframeTransport.prototype._message = function (e) {
          debug('message', e.data);
          if (!urlUtils.isOriginEqual(e.origin, this.origin)) {
            debug('not same origin', e.origin, this.origin);
            return;
          }

          var iframeMessage;
          try {
            iframeMessage = JSON3.parse(e.data);
          } catch (ignored) {
            debug('bad json', e.data);
            return;
          }

          if (iframeMessage.windowId !== this.windowId) {
            debug('mismatched window id', iframeMessage.windowId, this.windowId);
            return;
          }

          switch (iframeMessage.type) {
            case 's':
              this.iframeObj.loaded();
              // window global dependency
              this.postMessage('s', JSON3.stringify([version, this.transport, this.transUrl, this.baseUrl]));
              break;
            case 't':
              this.emit('message', iframeMessage.data);
              break;
            case 'c':
              var cdata;
              try {
                cdata = JSON3.parse(iframeMessage.data);
              } catch (ignored) {
                debug('bad json', iframeMessage.data);
                return;
              }
              this.emit('close', cdata[0], cdata[1]);
              this.close();
              break;
          }
        };

        IframeTransport.prototype.postMessage = function (type, data) {
          debug('postMessage', type, data);
          this.iframeObj.post(JSON3.stringify({
            windowId: this.windowId,
            type: type,
            data: data || ''
          }), this.origin);
        };

        IframeTransport.prototype.send = function (message) {
          debug('send', message);
          this.postMessage('m', message);
        };

        IframeTransport.enabled = function () {
          return iframeUtils.iframeEnabled;
        };

        IframeTransport.transportName = 'iframe';
        IframeTransport.roundTrips = 2;

        module.exports = IframeTransport;
      }).call(this, { env: {} });
    }, { "../utils/event": 46, "../utils/iframe": 47, "../utils/random": 50, "../utils/url": 52, "../version": 53, "debug": 55, "events": 3, "inherits": 57, "json3": 58 }], 23: [function (require, module, exports) {
      (function (global) {
        'use strict';

        // The simplest and most robust transport, using the well-know cross
        // domain hack - JSONP. This transport is quite inefficient - one
        // message could use up to one http request. But at least it works almost
        // everywhere.
        // Known limitations:
        //   o you will get a spinning cursor
        //   o for Konqueror a dumb timer is needed to detect errors

        var inherits = require('inherits'),
            SenderReceiver = require('./lib/sender-receiver'),
            JsonpReceiver = require('./receiver/jsonp'),
            jsonpSender = require('./sender/jsonp');

        function JsonPTransport(transUrl) {
          if (!JsonPTransport.enabled()) {
            throw new Error('Transport created when disabled');
          }
          SenderReceiver.call(this, transUrl, '/jsonp', jsonpSender, JsonpReceiver);
        }

        inherits(JsonPTransport, SenderReceiver);

        JsonPTransport.enabled = function () {
          return !!global.document;
        };

        JsonPTransport.transportName = 'jsonp-polling';
        JsonPTransport.roundTrips = 1;
        JsonPTransport.needBody = true;

        module.exports = JsonPTransport;
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "./lib/sender-receiver": 28, "./receiver/jsonp": 31, "./sender/jsonp": 33, "inherits": 57 }], 24: [function (require, module, exports) {
      (function (process) {
        'use strict';

        var inherits = require('inherits'),
            urlUtils = require('../../utils/url'),
            SenderReceiver = require('./sender-receiver');

        var debug = function debug() {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:ajax-based');
        }

        function createAjaxSender(AjaxObject) {
          return function (url, payload, callback) {
            debug('create ajax sender', url, payload);
            var opt = {};
            if (typeof payload === 'string') {
              opt.headers = { 'Content-type': 'text/plain' };
            }
            var ajaxUrl = urlUtils.addPath(url, '/xhr_send');
            var xo = new AjaxObject('POST', ajaxUrl, payload, opt);
            xo.once('finish', function (status) {
              debug('finish', status);
              xo = null;

              if (status !== 200 && status !== 204) {
                return callback(new Error('http status ' + status));
              }
              callback();
            });
            return function () {
              debug('abort');
              xo.close();
              xo = null;

              var err = new Error('Aborted');
              err.code = 1000;
              callback(err);
            };
          };
        }

        function AjaxBasedTransport(transUrl, urlSuffix, Receiver, AjaxObject) {
          SenderReceiver.call(this, transUrl, urlSuffix, createAjaxSender(AjaxObject), Receiver, AjaxObject);
        }

        inherits(AjaxBasedTransport, SenderReceiver);

        module.exports = AjaxBasedTransport;
      }).call(this, { env: {} });
    }, { "../../utils/url": 52, "./sender-receiver": 28, "debug": 55, "inherits": 57 }], 25: [function (require, module, exports) {
      (function (process) {
        'use strict';

        var inherits = require('inherits'),
            EventEmitter = require('events').EventEmitter;

        var debug = function debug() {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:buffered-sender');
        }

        function BufferedSender(url, sender) {
          debug(url);
          EventEmitter.call(this);
          this.sendBuffer = [];
          this.sender = sender;
          this.url = url;
        }

        inherits(BufferedSender, EventEmitter);

        BufferedSender.prototype.send = function (message) {
          debug('send', message);
          this.sendBuffer.push(message);
          if (!this.sendStop) {
            this.sendSchedule();
          }
        };

        // For polling transports in a situation when in the message callback,
        // new message is being send. If the sending connection was started
        // before receiving one, it is possible to saturate the network and
        // timeout due to the lack of receiving socket. To avoid that we delay
        // sending messages by some small time, in order to let receiving
        // connection be started beforehand. This is only a halfmeasure and
        // does not fix the big problem, but it does make the tests go more
        // stable on slow networks.
        BufferedSender.prototype.sendScheduleWait = function () {
          debug('sendScheduleWait');
          var self = this;
          var tref;
          this.sendStop = function () {
            debug('sendStop');
            self.sendStop = null;
            clearTimeout(tref);
          };
          tref = setTimeout(function () {
            debug('timeout');
            self.sendStop = null;
            self.sendSchedule();
          }, 25);
        };

        BufferedSender.prototype.sendSchedule = function () {
          debug('sendSchedule', this.sendBuffer.length);
          var self = this;
          if (this.sendBuffer.length > 0) {
            var payload = '[' + this.sendBuffer.join(',') + ']';
            this.sendStop = this.sender(this.url, payload, function (err) {
              self.sendStop = null;
              if (err) {
                debug('error', err);
                self.emit('close', err.code || 1006, 'Sending error: ' + err);
                self.close();
              } else {
                self.sendScheduleWait();
              }
            });
            this.sendBuffer = [];
          }
        };

        BufferedSender.prototype._cleanup = function () {
          debug('_cleanup');
          this.removeAllListeners();
        };

        BufferedSender.prototype.close = function () {
          debug('close');
          this._cleanup();
          if (this.sendStop) {
            this.sendStop();
            this.sendStop = null;
          }
        };

        module.exports = BufferedSender;
      }).call(this, { env: {} });
    }, { "debug": 55, "events": 3, "inherits": 57 }], 26: [function (require, module, exports) {
      (function (global) {
        'use strict';

        var inherits = require('inherits'),
            IframeTransport = require('../iframe'),
            objectUtils = require('../../utils/object');

        module.exports = function (transport) {

          function IframeWrapTransport(transUrl, baseUrl) {
            IframeTransport.call(this, transport.transportName, transUrl, baseUrl);
          }

          inherits(IframeWrapTransport, IframeTransport);

          IframeWrapTransport.enabled = function (url, info) {
            if (!global.document) {
              return false;
            }

            var iframeInfo = objectUtils.extend({}, info);
            iframeInfo.sameOrigin = true;
            return transport.enabled(iframeInfo) && IframeTransport.enabled();
          };

          IframeWrapTransport.transportName = 'iframe-' + transport.transportName;
          IframeWrapTransport.needBody = true;
          IframeWrapTransport.roundTrips = IframeTransport.roundTrips + transport.roundTrips - 1; // html, javascript (2) + transport - no CORS (1)

          IframeWrapTransport.facadeTransport = transport;

          return IframeWrapTransport;
        };
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "../../utils/object": 49, "../iframe": 22, "inherits": 57 }], 27: [function (require, module, exports) {
      (function (process) {
        'use strict';

        var inherits = require('inherits'),
            EventEmitter = require('events').EventEmitter;

        var debug = function debug() {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:polling');
        }

        function Polling(Receiver, receiveUrl, AjaxObject) {
          debug(receiveUrl);
          EventEmitter.call(this);
          this.Receiver = Receiver;
          this.receiveUrl = receiveUrl;
          this.AjaxObject = AjaxObject;
          this._scheduleReceiver();
        }

        inherits(Polling, EventEmitter);

        Polling.prototype._scheduleReceiver = function () {
          debug('_scheduleReceiver');
          var self = this;
          var poll = this.poll = new this.Receiver(this.receiveUrl, this.AjaxObject);

          poll.on('message', function (msg) {
            debug('message', msg);
            self.emit('message', msg);
          });

          poll.once('close', function (code, reason) {
            debug('close', code, reason, self.pollIsClosing);
            self.poll = poll = null;

            if (!self.pollIsClosing) {
              if (reason === 'network') {
                self._scheduleReceiver();
              } else {
                self.emit('close', code || 1006, reason);
                self.removeAllListeners();
              }
            }
          });
        };

        Polling.prototype.abort = function () {
          debug('abort');
          this.removeAllListeners();
          this.pollIsClosing = true;
          if (this.poll) {
            this.poll.abort();
          }
        };

        module.exports = Polling;
      }).call(this, { env: {} });
    }, { "debug": 55, "events": 3, "inherits": 57 }], 28: [function (require, module, exports) {
      (function (process) {
        'use strict';

        var inherits = require('inherits'),
            urlUtils = require('../../utils/url'),
            BufferedSender = require('./buffered-sender'),
            Polling = require('./polling');

        var debug = function debug() {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:sender-receiver');
        }

        function SenderReceiver(transUrl, urlSuffix, senderFunc, Receiver, AjaxObject) {
          var pollUrl = urlUtils.addPath(transUrl, urlSuffix);
          debug(pollUrl);
          var self = this;
          BufferedSender.call(this, transUrl, senderFunc);

          this.poll = new Polling(Receiver, pollUrl, AjaxObject);
          this.poll.on('message', function (msg) {
            debug('poll message', msg);
            self.emit('message', msg);
          });
          this.poll.once('close', function (code, reason) {
            debug('poll close', code, reason);
            self.poll = null;
            self.emit('close', code, reason);
            self.close();
          });
        }

        inherits(SenderReceiver, BufferedSender);

        SenderReceiver.prototype.close = function () {
          BufferedSender.prototype.close.call(this);
          debug('close');
          this.removeAllListeners();
          if (this.poll) {
            this.poll.abort();
            this.poll = null;
          }
        };

        module.exports = SenderReceiver;
      }).call(this, { env: {} });
    }, { "../../utils/url": 52, "./buffered-sender": 25, "./polling": 27, "debug": 55, "inherits": 57 }], 29: [function (require, module, exports) {
      (function (process) {
        'use strict';

        var inherits = require('inherits'),
            EventEmitter = require('events').EventEmitter,
            EventSourceDriver = require('eventsource');

        var debug = function debug() {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:receiver:eventsource');
        }

        function EventSourceReceiver(url) {
          debug(url);
          EventEmitter.call(this);

          var self = this;
          var es = this.es = new EventSourceDriver(url);
          es.onmessage = function (e) {
            debug('message', e.data);
            self.emit('message', decodeURI(e.data));
          };
          es.onerror = function (e) {
            debug('error', es.readyState, e);
            // ES on reconnection has readyState = 0 or 1.
            // on network error it's CLOSED = 2
            var reason = es.readyState !== 2 ? 'network' : 'permanent';
            self._cleanup();
            self._close(reason);
          };
        }

        inherits(EventSourceReceiver, EventEmitter);

        EventSourceReceiver.prototype.abort = function () {
          debug('abort');
          this._cleanup();
          this._close('user');
        };

        EventSourceReceiver.prototype._cleanup = function () {
          debug('cleanup');
          var es = this.es;
          if (es) {
            es.onmessage = es.onerror = null;
            es.close();
            this.es = null;
          }
        };

        EventSourceReceiver.prototype._close = function (reason) {
          debug('close', reason);
          var self = this;
          // Safari and chrome < 15 crash if we close window before
          // waiting for ES cleanup. See:
          // https://code.google.com/p/chromium/issues/detail?id=89155
          setTimeout(function () {
            self.emit('close', null, reason);
            self.removeAllListeners();
          }, 200);
        };

        module.exports = EventSourceReceiver;
      }).call(this, { env: {} });
    }, { "debug": 55, "events": 3, "eventsource": 18, "inherits": 57 }], 30: [function (require, module, exports) {
      (function (process, global) {
        'use strict';

        var inherits = require('inherits'),
            iframeUtils = require('../../utils/iframe'),
            urlUtils = require('../../utils/url'),
            EventEmitter = require('events').EventEmitter,
            random = require('../../utils/random');

        var debug = function debug() {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:receiver:htmlfile');
        }

        function HtmlfileReceiver(url) {
          debug(url);
          EventEmitter.call(this);
          var self = this;
          iframeUtils.polluteGlobalNamespace();

          this.id = 'a' + random.string(6);
          url = urlUtils.addQuery(url, 'c=' + decodeURIComponent(iframeUtils.WPrefix + '.' + this.id));

          debug('using htmlfile', HtmlfileReceiver.htmlfileEnabled);
          var constructFunc = HtmlfileReceiver.htmlfileEnabled ? iframeUtils.createHtmlfile : iframeUtils.createIframe;

          global[iframeUtils.WPrefix][this.id] = {
            start: function start() {
              debug('start');
              self.iframeObj.loaded();
            },
            message: function message(data) {
              debug('message', data);
              self.emit('message', data);
            },
            stop: function stop() {
              debug('stop');
              self._cleanup();
              self._close('network');
            }
          };
          this.iframeObj = constructFunc(url, function () {
            debug('callback');
            self._cleanup();
            self._close('permanent');
          });
        }

        inherits(HtmlfileReceiver, EventEmitter);

        HtmlfileReceiver.prototype.abort = function () {
          debug('abort');
          this._cleanup();
          this._close('user');
        };

        HtmlfileReceiver.prototype._cleanup = function () {
          debug('_cleanup');
          if (this.iframeObj) {
            this.iframeObj.cleanup();
            this.iframeObj = null;
          }
          delete global[iframeUtils.WPrefix][this.id];
        };

        HtmlfileReceiver.prototype._close = function (reason) {
          debug('_close', reason);
          this.emit('close', null, reason);
          this.removeAllListeners();
        };

        HtmlfileReceiver.htmlfileEnabled = false;

        // obfuscate to avoid firewalls
        var axo = ['Active'].concat('Object').join('X');
        if (axo in global) {
          try {
            HtmlfileReceiver.htmlfileEnabled = !!new global[axo]('htmlfile');
          } catch (x) {
            // intentionally empty
          }
        }

        HtmlfileReceiver.enabled = HtmlfileReceiver.htmlfileEnabled || iframeUtils.iframeEnabled;

        module.exports = HtmlfileReceiver;
      }).call(this, { env: {} }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "../../utils/iframe": 47, "../../utils/random": 50, "../../utils/url": 52, "debug": 55, "events": 3, "inherits": 57 }], 31: [function (require, module, exports) {
      (function (process, global) {
        'use strict';

        var utils = require('../../utils/iframe'),
            random = require('../../utils/random'),
            browser = require('../../utils/browser'),
            urlUtils = require('../../utils/url'),
            inherits = require('inherits'),
            EventEmitter = require('events').EventEmitter;

        var debug = function debug() {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:receiver:jsonp');
        }

        function JsonpReceiver(url) {
          debug(url);
          var self = this;
          EventEmitter.call(this);

          utils.polluteGlobalNamespace();

          this.id = 'a' + random.string(6);
          var urlWithId = urlUtils.addQuery(url, 'c=' + encodeURIComponent(utils.WPrefix + '.' + this.id));

          global[utils.WPrefix][this.id] = this._callback.bind(this);
          this._createScript(urlWithId);

          // Fallback mostly for Konqueror - stupid timer, 35 seconds shall be plenty.
          this.timeoutId = setTimeout(function () {
            debug('timeout');
            self._abort(new Error('JSONP script loaded abnormally (timeout)'));
          }, JsonpReceiver.timeout);
        }

        inherits(JsonpReceiver, EventEmitter);

        JsonpReceiver.prototype.abort = function () {
          debug('abort');
          if (global[utils.WPrefix][this.id]) {
            var err = new Error('JSONP user aborted read');
            err.code = 1000;
            this._abort(err);
          }
        };

        JsonpReceiver.timeout = 35000;
        JsonpReceiver.scriptErrorTimeout = 1000;

        JsonpReceiver.prototype._callback = function (data) {
          debug('_callback', data);
          this._cleanup();

          if (this.aborting) {
            return;
          }

          if (data) {
            debug('message', data);
            this.emit('message', data);
          }
          this.emit('close', null, 'network');
          this.removeAllListeners();
        };

        JsonpReceiver.prototype._abort = function (err) {
          debug('_abort', err);
          this._cleanup();
          this.aborting = true;
          this.emit('close', err.code, err.message);
          this.removeAllListeners();
        };

        JsonpReceiver.prototype._cleanup = function () {
          debug('_cleanup');
          clearTimeout(this.timeoutId);
          if (this.script2) {
            this.script2.parentNode.removeChild(this.script2);
            this.script2 = null;
          }
          if (this.script) {
            var script = this.script;
            // Unfortunately, you can't really abort script loading of
            // the script.
            script.parentNode.removeChild(script);
            script.onreadystatechange = script.onerror = script.onload = script.onclick = null;
            this.script = null;
          }
          delete global[utils.WPrefix][this.id];
        };

        JsonpReceiver.prototype._scriptError = function () {
          debug('_scriptError');
          var self = this;
          if (this.errorTimer) {
            return;
          }

          this.errorTimer = setTimeout(function () {
            if (!self.loadedOkay) {
              self._abort(new Error('JSONP script loaded abnormally (onerror)'));
            }
          }, JsonpReceiver.scriptErrorTimeout);
        };

        JsonpReceiver.prototype._createScript = function (url) {
          debug('_createScript', url);
          var self = this;
          var script = this.script = global.document.createElement('script');
          var script2; // Opera synchronous load trick.

          script.id = 'a' + random.string(8);
          script.src = url;
          script.type = 'text/javascript';
          script.charset = 'UTF-8';
          script.onerror = this._scriptError.bind(this);
          script.onload = function () {
            debug('onload');
            self._abort(new Error('JSONP script loaded abnormally (onload)'));
          };

          // IE9 fires 'error' event after onreadystatechange or before, in random order.
          // Use loadedOkay to determine if actually errored
          script.onreadystatechange = function () {
            debug('onreadystatechange', script.readyState);
            if (/loaded|closed/.test(script.readyState)) {
              if (script && script.htmlFor && script.onclick) {
                self.loadedOkay = true;
                try {
                  // In IE, actually execute the script.
                  script.onclick();
                } catch (x) {
                  // intentionally empty
                }
              }
              if (script) {
                self._abort(new Error('JSONP script loaded abnormally (onreadystatechange)'));
              }
            }
          };
          // IE: event/htmlFor/onclick trick.
          // One can't rely on proper order for onreadystatechange. In order to
          // make sure, set a 'htmlFor' and 'event' properties, so that
          // script code will be installed as 'onclick' handler for the
          // script object. Later, onreadystatechange, manually execute this
          // code. FF and Chrome doesn't work with 'event' and 'htmlFor'
          // set. For reference see:
          //   http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
          // Also, read on that about script ordering:
          //   http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
          if (typeof script.async === 'undefined' && global.document.attachEvent) {
            // According to mozilla docs, in recent browsers script.async defaults
            // to 'true', so we may use it to detect a good browser:
            // https://developer.mozilla.org/en/HTML/Element/script
            if (!browser.isOpera()) {
              // Naively assume we're in IE
              try {
                script.htmlFor = script.id;
                script.event = 'onclick';
              } catch (x) {
                // intentionally empty
              }
              script.async = true;
            } else {
              // Opera, second sync script hack
              script2 = this.script2 = global.document.createElement('script');
              script2.text = "try{var a = document.getElementById('" + script.id + "'); if(a)a.onerror();}catch(x){};";
              script.async = script2.async = false;
            }
          }
          if (typeof script.async !== 'undefined') {
            script.async = true;
          }

          var head = global.document.getElementsByTagName('head')[0];
          head.insertBefore(script, head.firstChild);
          if (script2) {
            head.insertBefore(script2, head.firstChild);
          }
        };

        module.exports = JsonpReceiver;
      }).call(this, { env: {} }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "../../utils/browser": 44, "../../utils/iframe": 47, "../../utils/random": 50, "../../utils/url": 52, "debug": 55, "events": 3, "inherits": 57 }], 32: [function (require, module, exports) {
      (function (process) {
        'use strict';

        var inherits = require('inherits'),
            EventEmitter = require('events').EventEmitter;

        var debug = function debug() {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:receiver:xhr');
        }

        function XhrReceiver(url, AjaxObject) {
          debug(url);
          EventEmitter.call(this);
          var self = this;

          this.bufferPosition = 0;

          this.xo = new AjaxObject('POST', url, null);
          this.xo.on('chunk', this._chunkHandler.bind(this));
          this.xo.once('finish', function (status, text) {
            debug('finish', status, text);
            self._chunkHandler(status, text);
            self.xo = null;
            var reason = status === 200 ? 'network' : 'permanent';
            debug('close', reason);
            self.emit('close', null, reason);
            self._cleanup();
          });
        }

        inherits(XhrReceiver, EventEmitter);

        XhrReceiver.prototype._chunkHandler = function (status, text) {
          debug('_chunkHandler', status);
          if (status !== 200 || !text) {
            return;
          }

          for (var idx = -1;; this.bufferPosition += idx + 1) {
            var buf = text.slice(this.bufferPosition);
            idx = buf.indexOf('\n');
            if (idx === -1) {
              break;
            }
            var msg = buf.slice(0, idx);
            if (msg) {
              debug('message', msg);
              this.emit('message', msg);
            }
          }
        };

        XhrReceiver.prototype._cleanup = function () {
          debug('_cleanup');
          this.removeAllListeners();
        };

        XhrReceiver.prototype.abort = function () {
          debug('abort');
          if (this.xo) {
            this.xo.close();
            debug('close');
            this.emit('close', null, 'user');
            this.xo = null;
          }
          this._cleanup();
        };

        module.exports = XhrReceiver;
      }).call(this, { env: {} });
    }, { "debug": 55, "events": 3, "inherits": 57 }], 33: [function (require, module, exports) {
      (function (process, global) {
        'use strict';

        var random = require('../../utils/random'),
            urlUtils = require('../../utils/url');

        var debug = function debug() {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:sender:jsonp');
        }

        var form, area;

        function createIframe(id) {
          debug('createIframe', id);
          try {
            // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
            return global.document.createElement('<iframe name="' + id + '">');
          } catch (x) {
            var iframe = global.document.createElement('iframe');
            iframe.name = id;
            return iframe;
          }
        }

        function createForm() {
          debug('createForm');
          form = global.document.createElement('form');
          form.style.display = 'none';
          form.style.position = 'absolute';
          form.method = 'POST';
          form.enctype = 'application/x-www-form-urlencoded';
          form.acceptCharset = 'UTF-8';

          area = global.document.createElement('textarea');
          area.name = 'd';
          form.appendChild(area);

          global.document.body.appendChild(form);
        }

        module.exports = function (url, payload, callback) {
          debug(url, payload);
          if (!form) {
            createForm();
          }
          var id = 'a' + random.string(8);
          form.target = id;
          form.action = urlUtils.addQuery(urlUtils.addPath(url, '/jsonp_send'), 'i=' + id);

          var iframe = createIframe(id);
          iframe.id = id;
          iframe.style.display = 'none';
          form.appendChild(iframe);

          try {
            area.value = payload;
          } catch (e) {
            // seriously broken browsers get here
          }
          form.submit();

          var completed = function completed(err) {
            debug('completed', id, err);
            if (!iframe.onerror) {
              return;
            }
            iframe.onreadystatechange = iframe.onerror = iframe.onload = null;
            // Opera mini doesn't like if we GC iframe
            // immediately, thus this timeout.
            setTimeout(function () {
              debug('cleaning up', id);
              iframe.parentNode.removeChild(iframe);
              iframe = null;
            }, 500);
            area.value = '';
            // It is not possible to detect if the iframe succeeded or
            // failed to submit our form.
            callback(err);
          };
          iframe.onerror = function () {
            debug('onerror', id);
            completed();
          };
          iframe.onload = function () {
            debug('onload', id);
            completed();
          };
          iframe.onreadystatechange = function (e) {
            debug('onreadystatechange', id, iframe.readyState, e);
            if (iframe.readyState === 'complete') {
              completed();
            }
          };
          return function () {
            debug('aborted', id);
            completed(new Error('Aborted'));
          };
        };
      }).call(this, { env: {} }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "../../utils/random": 50, "../../utils/url": 52, "debug": 55 }], 34: [function (require, module, exports) {
      (function (process, global) {
        'use strict';

        var EventEmitter = require('events').EventEmitter,
            inherits = require('inherits'),
            eventUtils = require('../../utils/event'),
            browser = require('../../utils/browser'),
            urlUtils = require('../../utils/url');

        var debug = function debug() {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:sender:xdr');
        }

        // References:
        //   http://ajaxian.com/archives/100-line-ajax-wrapper
        //   http://msdn.microsoft.com/en-us/library/cc288060(v=VS.85).aspx

        function XDRObject(method, url, payload) {
          debug(method, url);
          var self = this;
          EventEmitter.call(this);

          setTimeout(function () {
            self._start(method, url, payload);
          }, 0);
        }

        inherits(XDRObject, EventEmitter);

        XDRObject.prototype._start = function (method, url, payload) {
          debug('_start');
          var self = this;
          var xdr = new global.XDomainRequest();
          // IE caches even POSTs
          url = urlUtils.addQuery(url, 't=' + +new Date());

          xdr.onerror = function () {
            debug('onerror');
            self._error();
          };
          xdr.ontimeout = function () {
            debug('ontimeout');
            self._error();
          };
          xdr.onprogress = function () {
            debug('progress', xdr.responseText);
            self.emit('chunk', 200, xdr.responseText);
          };
          xdr.onload = function () {
            debug('load');
            self.emit('finish', 200, xdr.responseText);
            self._cleanup(false);
          };
          this.xdr = xdr;
          this.unloadRef = eventUtils.unloadAdd(function () {
            self._cleanup(true);
          });
          try {
            // Fails with AccessDenied if port number is bogus
            this.xdr.open(method, url);
            if (this.timeout) {
              this.xdr.timeout = this.timeout;
            }
            this.xdr.send(payload);
          } catch (x) {
            this._error();
          }
        };

        XDRObject.prototype._error = function () {
          this.emit('finish', 0, '');
          this._cleanup(false);
        };

        XDRObject.prototype._cleanup = function (abort) {
          debug('cleanup', abort);
          if (!this.xdr) {
            return;
          }
          this.removeAllListeners();
          eventUtils.unloadDel(this.unloadRef);

          this.xdr.ontimeout = this.xdr.onerror = this.xdr.onprogress = this.xdr.onload = null;
          if (abort) {
            try {
              this.xdr.abort();
            } catch (x) {
              // intentionally empty
            }
          }
          this.unloadRef = this.xdr = null;
        };

        XDRObject.prototype.close = function () {
          debug('close');
          this._cleanup(true);
        };

        // IE 8/9 if the request target uses the same scheme - #79
        XDRObject.enabled = !!(global.XDomainRequest && browser.hasDomain());

        module.exports = XDRObject;
      }).call(this, { env: {} }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "../../utils/browser": 44, "../../utils/event": 46, "../../utils/url": 52, "debug": 55, "events": 3, "inherits": 57 }], 35: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
          XhrDriver = require('../driver/xhr');

      function XHRCorsObject(method, url, payload, opts) {
        XhrDriver.call(this, method, url, payload, opts);
      }

      inherits(XHRCorsObject, XhrDriver);

      XHRCorsObject.enabled = XhrDriver.enabled && XhrDriver.supportsCORS;

      module.exports = XHRCorsObject;
    }, { "../driver/xhr": 17, "inherits": 57 }], 36: [function (require, module, exports) {
      'use strict';

      var EventEmitter = require('events').EventEmitter,
          inherits = require('inherits');

      function XHRFake() /* method, url, payload, opts */{
        var self = this;
        EventEmitter.call(this);

        this.to = setTimeout(function () {
          self.emit('finish', 200, '{}');
        }, XHRFake.timeout);
      }

      inherits(XHRFake, EventEmitter);

      XHRFake.prototype.close = function () {
        clearTimeout(this.to);
      };

      XHRFake.timeout = 2000;

      module.exports = XHRFake;
    }, { "events": 3, "inherits": 57 }], 37: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
          XhrDriver = require('../driver/xhr');

      function XHRLocalObject(method, url, payload /*, opts */) {
        XhrDriver.call(this, method, url, payload, {
          noCredentials: true
        });
      }

      inherits(XHRLocalObject, XhrDriver);

      XHRLocalObject.enabled = XhrDriver.enabled;

      module.exports = XHRLocalObject;
    }, { "../driver/xhr": 17, "inherits": 57 }], 38: [function (require, module, exports) {
      (function (process) {
        'use strict';

        var utils = require('../utils/event'),
            urlUtils = require('../utils/url'),
            inherits = require('inherits'),
            EventEmitter = require('events').EventEmitter,
            WebsocketDriver = require('./driver/websocket');

        var debug = function debug() {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:websocket');
        }

        function WebSocketTransport(transUrl, ignore, options) {
          if (!WebSocketTransport.enabled()) {
            throw new Error('Transport created when disabled');
          }

          EventEmitter.call(this);
          debug('constructor', transUrl);

          var self = this;
          var url = urlUtils.addPath(transUrl, '/websocket');
          if (url.slice(0, 5) === 'https') {
            url = 'wss' + url.slice(5);
          } else {
            url = 'ws' + url.slice(4);
          }
          this.url = url;

          this.ws = new WebsocketDriver(this.url, [], options);
          this.ws.onmessage = function (e) {
            debug('message event', e.data);
            self.emit('message', e.data);
          };
          // Firefox has an interesting bug. If a websocket connection is
          // created after onunload, it stays alive even when user
          // navigates away from the page. In such situation let's lie -
          // let's not open the ws connection at all. See:
          // https://github.com/sockjs/sockjs-client/issues/28
          // https://bugzilla.mozilla.org/show_bug.cgi?id=696085
          this.unloadRef = utils.unloadAdd(function () {
            debug('unload');
            self.ws.close();
          });
          this.ws.onclose = function (e) {
            debug('close event', e.code, e.reason);
            self.emit('close', e.code, e.reason);
            self._cleanup();
          };
          this.ws.onerror = function (e) {
            debug('error event', e);
            self.emit('close', 1006, 'WebSocket connection broken');
            self._cleanup();
          };
        }

        inherits(WebSocketTransport, EventEmitter);

        WebSocketTransport.prototype.send = function (data) {
          var msg = '[' + data + ']';
          debug('send', msg);
          this.ws.send(msg);
        };

        WebSocketTransport.prototype.close = function () {
          debug('close');
          var ws = this.ws;
          this._cleanup();
          if (ws) {
            ws.close();
          }
        };

        WebSocketTransport.prototype._cleanup = function () {
          debug('_cleanup');
          var ws = this.ws;
          if (ws) {
            ws.onmessage = ws.onclose = ws.onerror = null;
          }
          utils.unloadDel(this.unloadRef);
          this.unloadRef = this.ws = null;
          this.removeAllListeners();
        };

        WebSocketTransport.enabled = function () {
          debug('enabled');
          return !!WebsocketDriver;
        };
        WebSocketTransport.transportName = 'websocket';

        // In theory, ws should require 1 round trip. But in chrome, this is
        // not very stable over SSL. Most likely a ws connection requires a
        // separate SSL connection, in which case 2 round trips are an
        // absolute minumum.
        WebSocketTransport.roundTrips = 2;

        module.exports = WebSocketTransport;
      }).call(this, { env: {} });
    }, { "../utils/event": 46, "../utils/url": 52, "./driver/websocket": 19, "debug": 55, "events": 3, "inherits": 57 }], 39: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
          AjaxBasedTransport = require('./lib/ajax-based'),
          XdrStreamingTransport = require('./xdr-streaming'),
          XhrReceiver = require('./receiver/xhr'),
          XDRObject = require('./sender/xdr');

      function XdrPollingTransport(transUrl) {
        if (!XDRObject.enabled) {
          throw new Error('Transport created when disabled');
        }
        AjaxBasedTransport.call(this, transUrl, '/xhr', XhrReceiver, XDRObject);
      }

      inherits(XdrPollingTransport, AjaxBasedTransport);

      XdrPollingTransport.enabled = XdrStreamingTransport.enabled;
      XdrPollingTransport.transportName = 'xdr-polling';
      XdrPollingTransport.roundTrips = 2; // preflight, ajax

      module.exports = XdrPollingTransport;
    }, { "./lib/ajax-based": 24, "./receiver/xhr": 32, "./sender/xdr": 34, "./xdr-streaming": 40, "inherits": 57 }], 40: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
          AjaxBasedTransport = require('./lib/ajax-based'),
          XhrReceiver = require('./receiver/xhr'),
          XDRObject = require('./sender/xdr');

      // According to:
      //   http://stackoverflow.com/questions/1641507/detect-browser-support-for-cross-domain-xmlhttprequests
      //   http://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/

      function XdrStreamingTransport(transUrl) {
        if (!XDRObject.enabled) {
          throw new Error('Transport created when disabled');
        }
        AjaxBasedTransport.call(this, transUrl, '/xhr_streaming', XhrReceiver, XDRObject);
      }

      inherits(XdrStreamingTransport, AjaxBasedTransport);

      XdrStreamingTransport.enabled = function (info) {
        if (info.cookie_needed || info.nullOrigin) {
          return false;
        }
        return XDRObject.enabled && info.sameScheme;
      };

      XdrStreamingTransport.transportName = 'xdr-streaming';
      XdrStreamingTransport.roundTrips = 2; // preflight, ajax

      module.exports = XdrStreamingTransport;
    }, { "./lib/ajax-based": 24, "./receiver/xhr": 32, "./sender/xdr": 34, "inherits": 57 }], 41: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
          AjaxBasedTransport = require('./lib/ajax-based'),
          XhrReceiver = require('./receiver/xhr'),
          XHRCorsObject = require('./sender/xhr-cors'),
          XHRLocalObject = require('./sender/xhr-local');

      function XhrPollingTransport(transUrl) {
        if (!XHRLocalObject.enabled && !XHRCorsObject.enabled) {
          throw new Error('Transport created when disabled');
        }
        AjaxBasedTransport.call(this, transUrl, '/xhr', XhrReceiver, XHRCorsObject);
      }

      inherits(XhrPollingTransport, AjaxBasedTransport);

      XhrPollingTransport.enabled = function (info) {
        if (info.nullOrigin) {
          return false;
        }

        if (XHRLocalObject.enabled && info.sameOrigin) {
          return true;
        }
        return XHRCorsObject.enabled;
      };

      XhrPollingTransport.transportName = 'xhr-polling';
      XhrPollingTransport.roundTrips = 2; // preflight, ajax

      module.exports = XhrPollingTransport;
    }, { "./lib/ajax-based": 24, "./receiver/xhr": 32, "./sender/xhr-cors": 35, "./sender/xhr-local": 37, "inherits": 57 }], 42: [function (require, module, exports) {
      (function (global) {
        'use strict';

        var inherits = require('inherits'),
            AjaxBasedTransport = require('./lib/ajax-based'),
            XhrReceiver = require('./receiver/xhr'),
            XHRCorsObject = require('./sender/xhr-cors'),
            XHRLocalObject = require('./sender/xhr-local'),
            browser = require('../utils/browser');

        function XhrStreamingTransport(transUrl) {
          if (!XHRLocalObject.enabled && !XHRCorsObject.enabled) {
            throw new Error('Transport created when disabled');
          }
          AjaxBasedTransport.call(this, transUrl, '/xhr_streaming', XhrReceiver, XHRCorsObject);
        }

        inherits(XhrStreamingTransport, AjaxBasedTransport);

        XhrStreamingTransport.enabled = function (info) {
          if (info.nullOrigin) {
            return false;
          }
          // Opera doesn't support xhr-streaming #60
          // But it might be able to #92
          if (browser.isOpera()) {
            return false;
          }

          return XHRCorsObject.enabled;
        };

        XhrStreamingTransport.transportName = 'xhr-streaming';
        XhrStreamingTransport.roundTrips = 2; // preflight, ajax

        // Safari gets confused when a streaming ajax request is started
        // before onload. This causes the load indicator to spin indefinetely.
        // Only require body when used in a browser
        XhrStreamingTransport.needBody = !!global.document;

        module.exports = XhrStreamingTransport;
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "../utils/browser": 44, "./lib/ajax-based": 24, "./receiver/xhr": 32, "./sender/xhr-cors": 35, "./sender/xhr-local": 37, "inherits": 57 }], 43: [function (require, module, exports) {
      (function (global) {
        'use strict';

        if (global.crypto && global.crypto.getRandomValues) {
          module.exports.randomBytes = function (length) {
            var bytes = new Uint8Array(length);
            global.crypto.getRandomValues(bytes);
            return bytes;
          };
        } else {
          module.exports.randomBytes = function (length) {
            var bytes = new Array(length);
            for (var i = 0; i < length; i++) {
              bytes[i] = Math.floor(Math.random() * 256);
            }
            return bytes;
          };
        }
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}], 44: [function (require, module, exports) {
      (function (global) {
        'use strict';

        module.exports = {
          isOpera: function isOpera() {
            return global.navigator && /opera/i.test(global.navigator.userAgent);
          },

          isKonqueror: function isKonqueror() {
            return global.navigator && /konqueror/i.test(global.navigator.userAgent);
          }

          // #187 wrap document.domain in try/catch because of WP8 from file:///
          , hasDomain: function hasDomain() {
            // non-browser client always has a domain
            if (!global.document) {
              return true;
            }

            try {
              return !!global.document.domain;
            } catch (e) {
              return false;
            }
          }
        };
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}], 45: [function (require, module, exports) {
      'use strict';

      var JSON3 = require('json3');

      // Some extra characters that Chrome gets wrong, and substitutes with
      // something else on the wire.
      // eslint-disable-next-line no-control-regex
      var extraEscapable = /[\x00-\x1f\ud800-\udfff\ufffe\uffff\u0300-\u0333\u033d-\u0346\u034a-\u034c\u0350-\u0352\u0357-\u0358\u035c-\u0362\u0374\u037e\u0387\u0591-\u05af\u05c4\u0610-\u0617\u0653-\u0654\u0657-\u065b\u065d-\u065e\u06df-\u06e2\u06eb-\u06ec\u0730\u0732-\u0733\u0735-\u0736\u073a\u073d\u073f-\u0741\u0743\u0745\u0747\u07eb-\u07f1\u0951\u0958-\u095f\u09dc-\u09dd\u09df\u0a33\u0a36\u0a59-\u0a5b\u0a5e\u0b5c-\u0b5d\u0e38-\u0e39\u0f43\u0f4d\u0f52\u0f57\u0f5c\u0f69\u0f72-\u0f76\u0f78\u0f80-\u0f83\u0f93\u0f9d\u0fa2\u0fa7\u0fac\u0fb9\u1939-\u193a\u1a17\u1b6b\u1cda-\u1cdb\u1dc0-\u1dcf\u1dfc\u1dfe\u1f71\u1f73\u1f75\u1f77\u1f79\u1f7b\u1f7d\u1fbb\u1fbe\u1fc9\u1fcb\u1fd3\u1fdb\u1fe3\u1feb\u1fee-\u1fef\u1ff9\u1ffb\u1ffd\u2000-\u2001\u20d0-\u20d1\u20d4-\u20d7\u20e7-\u20e9\u2126\u212a-\u212b\u2329-\u232a\u2adc\u302b-\u302c\uaab2-\uaab3\uf900-\ufa0d\ufa10\ufa12\ufa15-\ufa1e\ufa20\ufa22\ufa25-\ufa26\ufa2a-\ufa2d\ufa30-\ufa6d\ufa70-\ufad9\ufb1d\ufb1f\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4e\ufff0-\uffff]/g,
          extraLookup;

      // This may be quite slow, so let's delay until user actually uses bad
      // characters.
      var unrollLookup = function unrollLookup(escapable) {
        var i;
        var unrolled = {};
        var c = [];
        for (i = 0; i < 65536; i++) {
          c.push(String.fromCharCode(i));
        }
        escapable.lastIndex = 0;
        c.join('').replace(escapable, function (a) {
          unrolled[a] = "\\u" + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
          return '';
        });
        escapable.lastIndex = 0;
        return unrolled;
      };

      // Quote string, also taking care of unicode characters that browsers
      // often break. Especially, take care of unicode surrogates:
      // http://en.wikipedia.org/wiki/Mapping_of_Unicode_characters#Surrogates
      module.exports = {
        quote: function quote(string) {
          var quoted = JSON3.stringify(string);

          // In most cases this should be very fast and good enough.
          extraEscapable.lastIndex = 0;
          if (!extraEscapable.test(quoted)) {
            return quoted;
          }

          if (!extraLookup) {
            extraLookup = unrollLookup(extraEscapable);
          }

          return quoted.replace(extraEscapable, function (a) {
            return extraLookup[a];
          });
        }
      };
    }, { "json3": 58 }], 46: [function (require, module, exports) {
      (function (global) {
        'use strict';

        var random = require('./random');

        var onUnload = {},
            afterUnload = false
        // detect google chrome packaged apps because they don't allow the 'unload' event
        ,
            isChromePackagedApp = global.chrome && global.chrome.app && global.chrome.app.runtime;

        module.exports = {
          attachEvent: function attachEvent(event, listener) {
            if (typeof global.addEventListener !== 'undefined') {
              global.addEventListener(event, listener, false);
            } else if (global.document && global.attachEvent) {
              // IE quirks.
              // According to: http://stevesouders.com/misc/test-postmessage.php
              // the message gets delivered only to 'document', not 'window'.
              global.document.attachEvent('on' + event, listener);
              // I get 'window' for ie8.
              global.attachEvent('on' + event, listener);
            }
          },

          detachEvent: function detachEvent(event, listener) {
            if (typeof global.addEventListener !== 'undefined') {
              global.removeEventListener(event, listener, false);
            } else if (global.document && global.detachEvent) {
              global.document.detachEvent('on' + event, listener);
              global.detachEvent('on' + event, listener);
            }
          },

          unloadAdd: function unloadAdd(listener) {
            if (isChromePackagedApp) {
              return null;
            }

            var ref = random.string(8);
            onUnload[ref] = listener;
            if (afterUnload) {
              setTimeout(this.triggerUnloadCallbacks, 0);
            }
            return ref;
          },

          unloadDel: function unloadDel(ref) {
            if (ref in onUnload) {
              delete onUnload[ref];
            }
          },

          triggerUnloadCallbacks: function triggerUnloadCallbacks() {
            for (var ref in onUnload) {
              onUnload[ref]();
              delete onUnload[ref];
            }
          }
        };

        var unloadTriggered = function unloadTriggered() {
          if (afterUnload) {
            return;
          }
          afterUnload = true;
          module.exports.triggerUnloadCallbacks();
        };

        // 'unload' alone is not reliable in opera within an iframe, but we
        // can't use `beforeunload` as IE fires it on javascript: links.
        if (!isChromePackagedApp) {
          module.exports.attachEvent('unload', unloadTriggered);
        }
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "./random": 50 }], 47: [function (require, module, exports) {
      (function (process, global) {
        'use strict';

        var eventUtils = require('./event'),
            JSON3 = require('json3'),
            browser = require('./browser');

        var debug = function debug() {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:utils:iframe');
        }

        module.exports = {
          WPrefix: '_jp',
          currentWindowId: null,

          polluteGlobalNamespace: function polluteGlobalNamespace() {
            if (!(module.exports.WPrefix in global)) {
              global[module.exports.WPrefix] = {};
            }
          },

          postMessage: function postMessage(type, data) {
            if (global.parent !== global) {
              global.parent.postMessage(JSON3.stringify({
                windowId: module.exports.currentWindowId,
                type: type,
                data: data || ''
              }), '*');
            } else {
              debug('Cannot postMessage, no parent window.', type, data);
            }
          },

          createIframe: function createIframe(iframeUrl, errorCallback) {
            var iframe = global.document.createElement('iframe');
            var tref, unloadRef;
            var unattach = function unattach() {
              debug('unattach');
              clearTimeout(tref);
              // Explorer had problems with that.
              try {
                iframe.onload = null;
              } catch (x) {
                // intentionally empty
              }
              iframe.onerror = null;
            };
            var cleanup = function cleanup() {
              debug('cleanup');
              if (iframe) {
                unattach();
                // This timeout makes chrome fire onbeforeunload event
                // within iframe. Without the timeout it goes straight to
                // onunload.
                setTimeout(function () {
                  if (iframe) {
                    iframe.parentNode.removeChild(iframe);
                  }
                  iframe = null;
                }, 0);
                eventUtils.unloadDel(unloadRef);
              }
            };
            var onerror = function onerror(err) {
              debug('onerror', err);
              if (iframe) {
                cleanup();
                errorCallback(err);
              }
            };
            var post = function post(msg, origin) {
              debug('post', msg, origin);
              try {
                // When the iframe is not loaded, IE raises an exception
                // on 'contentWindow'.
                setTimeout(function () {
                  if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.postMessage(msg, origin);
                  }
                }, 0);
              } catch (x) {
                // intentionally empty
              }
            };

            iframe.src = iframeUrl;
            iframe.style.display = 'none';
            iframe.style.position = 'absolute';
            iframe.onerror = function () {
              onerror('onerror');
            };
            iframe.onload = function () {
              debug('onload');
              // `onload` is triggered before scripts on the iframe are
              // executed. Give it few seconds to actually load stuff.
              clearTimeout(tref);
              tref = setTimeout(function () {
                onerror('onload timeout');
              }, 2000);
            };
            global.document.body.appendChild(iframe);
            tref = setTimeout(function () {
              onerror('timeout');
            }, 15000);
            unloadRef = eventUtils.unloadAdd(cleanup);
            return {
              post: post,
              cleanup: cleanup,
              loaded: unattach
            };
          }

          /* eslint no-undef: "off", new-cap: "off" */
          , createHtmlfile: function createHtmlfile(iframeUrl, errorCallback) {
            var axo = ['Active'].concat('Object').join('X');
            var doc = new global[axo]('htmlfile');
            var tref, unloadRef;
            var iframe;
            var unattach = function unattach() {
              clearTimeout(tref);
              iframe.onerror = null;
            };
            var cleanup = function cleanup() {
              if (doc) {
                unattach();
                eventUtils.unloadDel(unloadRef);
                iframe.parentNode.removeChild(iframe);
                iframe = doc = null;
                CollectGarbage();
              }
            };
            var onerror = function onerror(r) {
              debug('onerror', r);
              if (doc) {
                cleanup();
                errorCallback(r);
              }
            };
            var post = function post(msg, origin) {
              try {
                // When the iframe is not loaded, IE raises an exception
                // on 'contentWindow'.
                setTimeout(function () {
                  if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.postMessage(msg, origin);
                  }
                }, 0);
              } catch (x) {
                // intentionally empty
              }
            };

            doc.open();
            doc.write('<html><s' + 'cript>' + 'document.domain="' + global.document.domain + '";' + '</s' + 'cript></html>');
            doc.close();
            doc.parentWindow[module.exports.WPrefix] = global[module.exports.WPrefix];
            var c = doc.createElement('div');
            doc.body.appendChild(c);
            iframe = doc.createElement('iframe');
            c.appendChild(iframe);
            iframe.src = iframeUrl;
            iframe.onerror = function () {
              onerror('onerror');
            };
            tref = setTimeout(function () {
              onerror('timeout');
            }, 15000);
            unloadRef = eventUtils.unloadAdd(cleanup);
            return {
              post: post,
              cleanup: cleanup,
              loaded: unattach
            };
          }
        };

        module.exports.iframeEnabled = false;
        if (global.document) {
          // postMessage misbehaves in konqueror 4.6.5 - the messages are delivered with
          // huge delay, or not at all.
          module.exports.iframeEnabled = (typeof global.postMessage === 'function' || _typeof(global.postMessage) === 'object') && !browser.isKonqueror();
        }
      }).call(this, { env: {} }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "./browser": 44, "./event": 46, "debug": 55, "json3": 58 }], 48: [function (require, module, exports) {
      (function (global) {
        'use strict';

        var logObject = {};
        ['log', 'debug', 'warn'].forEach(function (level) {
          var levelExists;

          try {
            levelExists = global.console && global.console[level] && global.console[level].apply;
          } catch (e) {
            // do nothing
          }

          logObject[level] = levelExists ? function () {
            return global.console[level].apply(global.console, arguments);
          } : level === 'log' ? function () {} : logObject.log;
        });

        module.exports = logObject;
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}], 49: [function (require, module, exports) {
      'use strict';

      module.exports = {
        isObject: function isObject(obj) {
          var type = typeof obj === "undefined" ? "undefined" : _typeof(obj);
          return type === 'function' || type === 'object' && !!obj;
        },

        extend: function extend(obj) {
          if (!this.isObject(obj)) {
            return obj;
          }
          var source, prop;
          for (var i = 1, length = arguments.length; i < length; i++) {
            source = arguments[i];
            for (prop in source) {
              if (Object.prototype.hasOwnProperty.call(source, prop)) {
                obj[prop] = source[prop];
              }
            }
          }
          return obj;
        }
      };
    }, {}], 50: [function (require, module, exports) {
      'use strict';

      /* global crypto:true */

      var crypto = require('crypto');

      // This string has length 32, a power of 2, so the modulus doesn't introduce a
      // bias.
      var _randomStringChars = 'abcdefghijklmnopqrstuvwxyz012345';
      module.exports = {
        string: function string(length) {
          var max = _randomStringChars.length;
          var bytes = crypto.randomBytes(length);
          var ret = [];
          for (var i = 0; i < length; i++) {
            ret.push(_randomStringChars.substr(bytes[i] % max, 1));
          }
          return ret.join('');
        },

        number: function number(max) {
          return Math.floor(Math.random() * max);
        },

        numberString: function numberString(max) {
          var t = ('' + (max - 1)).length;
          var p = new Array(t + 1).join('0');
          return (p + this.number(max)).slice(-t);
        }
      };
    }, { "crypto": 43 }], 51: [function (require, module, exports) {
      (function (process) {
        'use strict';

        var debug = function debug() {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:utils:transport');
        }

        module.exports = function (availableTransports) {
          return {
            filterToEnabled: function filterToEnabled(transportsWhitelist, info) {
              var transports = {
                main: [],
                facade: []
              };
              if (!transportsWhitelist) {
                transportsWhitelist = [];
              } else if (typeof transportsWhitelist === 'string') {
                transportsWhitelist = [transportsWhitelist];
              }

              availableTransports.forEach(function (trans) {
                if (!trans) {
                  return;
                }

                if (trans.transportName === 'websocket' && info.websocket === false) {
                  debug('disabled from server', 'websocket');
                  return;
                }

                if (transportsWhitelist.length && transportsWhitelist.indexOf(trans.transportName) === -1) {
                  debug('not in whitelist', trans.transportName);
                  return;
                }

                if (trans.enabled(info)) {
                  debug('enabled', trans.transportName);
                  transports.main.push(trans);
                  if (trans.facadeTransport) {
                    transports.facade.push(trans.facadeTransport);
                  }
                } else {
                  debug('disabled', trans.transportName);
                }
              });
              return transports;
            }
          };
        };
      }).call(this, { env: {} });
    }, { "debug": 55 }], 52: [function (require, module, exports) {
      (function (process) {
        'use strict';

        var URL = require('url-parse');

        var debug = function debug() {};
        if (process.env.NODE_ENV !== 'production') {
          debug = require('debug')('sockjs-client:utils:url');
        }

        module.exports = {
          getOrigin: function getOrigin(url) {
            if (!url) {
              return null;
            }

            var p = new URL(url);
            if (p.protocol === 'file:') {
              return null;
            }

            var port = p.port;
            if (!port) {
              port = p.protocol === 'https:' ? '443' : '80';
            }

            return p.protocol + '//' + p.hostname + ':' + port;
          },

          isOriginEqual: function isOriginEqual(a, b) {
            var res = this.getOrigin(a) === this.getOrigin(b);
            debug('same', a, b, res);
            return res;
          },

          isSchemeEqual: function isSchemeEqual(a, b) {
            return a.split(':')[0] === b.split(':')[0];
          },

          addPath: function addPath(url, path) {
            var qs = url.split('?');
            return qs[0] + path + (qs[1] ? '?' + qs[1] : '');
          },

          addQuery: function addQuery(url, q) {
            return url + (url.indexOf('?') === -1 ? '?' + q : '&' + q);
          }
        };
      }).call(this, { env: {} });
    }, { "debug": 55, "url-parse": 61 }], 53: [function (require, module, exports) {
      module.exports = '1.1.4';
    }, {}], 54: [function (require, module, exports) {
      /**
       * Helpers.
       */

      var s = 1000;
      var m = s * 60;
      var h = m * 60;
      var d = h * 24;
      var y = d * 365.25;

      /**
       * Parse or format the given `val`.
       *
       * Options:
       *
       *  - `long` verbose formatting [false]
       *
       * @param {String|Number} val
       * @param {Object} [options]
       * @throws {Error} throw an error if val is not a non-empty string or a number
       * @return {String|Number}
       * @api public
       */

      module.exports = function (val, options) {
        options = options || {};
        var type = typeof val === "undefined" ? "undefined" : _typeof(val);
        if (type === 'string' && val.length > 0) {
          return parse(val);
        } else if (type === 'number' && isNaN(val) === false) {
          return options.long ? fmtLong(val) : fmtShort(val);
        }
        throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
      };

      /**
       * Parse the given `str` and return milliseconds.
       *
       * @param {String} str
       * @return {Number}
       * @api private
       */

      function parse(str) {
        str = String(str);
        if (str.length > 10000) {
          return;
        }
        var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
        if (!match) {
          return;
        }
        var n = parseFloat(match[1]);
        var type = (match[2] || 'ms').toLowerCase();
        switch (type) {
          case 'years':
          case 'year':
          case 'yrs':
          case 'yr':
          case 'y':
            return n * y;
          case 'days':
          case 'day':
          case 'd':
            return n * d;
          case 'hours':
          case 'hour':
          case 'hrs':
          case 'hr':
          case 'h':
            return n * h;
          case 'minutes':
          case 'minute':
          case 'mins':
          case 'min':
          case 'm':
            return n * m;
          case 'seconds':
          case 'second':
          case 'secs':
          case 'sec':
          case 's':
            return n * s;
          case 'milliseconds':
          case 'millisecond':
          case 'msecs':
          case 'msec':
          case 'ms':
            return n;
          default:
            return undefined;
        }
      }

      /**
       * Short format for `ms`.
       *
       * @param {Number} ms
       * @return {String}
       * @api private
       */

      function fmtShort(ms) {
        if (ms >= d) {
          return Math.round(ms / d) + 'd';
        }
        if (ms >= h) {
          return Math.round(ms / h) + 'h';
        }
        if (ms >= m) {
          return Math.round(ms / m) + 'm';
        }
        if (ms >= s) {
          return Math.round(ms / s) + 's';
        }
        return ms + 'ms';
      }

      /**
       * Long format for `ms`.
       *
       * @param {Number} ms
       * @return {String}
       * @api private
       */

      function fmtLong(ms) {
        return plural(ms, d, 'day') || plural(ms, h, 'hour') || plural(ms, m, 'minute') || plural(ms, s, 'second') || ms + ' ms';
      }

      /**
       * Pluralization helper.
       */

      function plural(ms, n, name) {
        if (ms < n) {
          return;
        }
        if (ms < n * 1.5) {
          return Math.floor(ms / n) + ' ' + name;
        }
        return Math.ceil(ms / n) + ' ' + name + 's';
      }
    }, {}], 55: [function (require, module, exports) {
      (function (process) {
        /**
         * This is the web browser implementation of `debug()`.
         *
         * Expose `debug()` as the module.
         */

        exports = module.exports = require('./debug');
        exports.log = log;
        exports.formatArgs = formatArgs;
        exports.save = save;
        exports.load = load;
        exports.useColors = useColors;
        exports.storage = 'undefined' != typeof chrome && 'undefined' != typeof chrome.storage ? chrome.storage.local : localstorage();

        /**
         * Colors.
         */

        exports.colors = ['lightseagreen', 'forestgreen', 'goldenrod', 'dodgerblue', 'darkorchid', 'crimson'];

        /**
         * Currently only WebKit-based Web Inspectors, Firefox >= v31,
         * and the Firebug extension (any Firefox version) are known
         * to support "%c" CSS customizations.
         *
         * TODO: add a `localStorage` variable to explicitly enable/disable colors
         */

        function useColors() {
          // NB: In an Electron preload script, document will be defined but not fully
          // initialized. Since we know we're in Chrome, we'll just detect this case
          // explicitly
          if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
            return true;
          }

          // is webkit? http://stackoverflow.com/a/16459606/376773
          // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
          return typeof document !== 'undefined' && document && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance ||
          // is firebug? http://stackoverflow.com/a/398120/376773
          typeof window !== 'undefined' && window && window.console && (window.console.firebug || window.console.exception && window.console.table) ||
          // is firefox >= v31?
          // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
          typeof navigator !== 'undefined' && navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 ||
          // double check webkit in userAgent just in case we are in a worker
          typeof navigator !== 'undefined' && navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
        }

        /**
         * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
         */

        exports.formatters.j = function (v) {
          try {
            return JSON.stringify(v);
          } catch (err) {
            return '[UnexpectedJSONParseError]: ' + err.message;
          }
        };

        /**
         * Colorize log arguments if enabled.
         *
         * @api public
         */

        function formatArgs(args) {
          var useColors = this.useColors;

          args[0] = (useColors ? '%c' : '') + this.namespace + (useColors ? ' %c' : ' ') + args[0] + (useColors ? '%c ' : ' ') + '+' + exports.humanize(this.diff);

          if (!useColors) return;

          var c = 'color: ' + this.color;
          args.splice(1, 0, c, 'color: inherit');

          // the final "%c" is somewhat tricky, because there could be other
          // arguments passed either before or after the %c, so we need to
          // figure out the correct index to insert the CSS into
          var index = 0;
          var lastC = 0;
          args[0].replace(/%[a-zA-Z%]/g, function (match) {
            if ('%%' === match) return;
            index++;
            if ('%c' === match) {
              // we only are interested in the *last* %c
              // (the user may have provided their own)
              lastC = index;
            }
          });

          args.splice(lastC, 0, c);
        }

        /**
         * Invokes `console.log()` when available.
         * No-op when `console.log` is not a "function".
         *
         * @api public
         */

        function log() {
          // this hackery is required for IE8/9, where
          // the `console.log` function doesn't have 'apply'
          return 'object' === (typeof console === "undefined" ? "undefined" : _typeof(console)) && console.log && Function.prototype.apply.call(console.log, console, arguments);
        }

        /**
         * Save `namespaces`.
         *
         * @param {String} namespaces
         * @api private
         */

        function save(namespaces) {
          try {
            if (null == namespaces) {
              exports.storage.removeItem('debug');
            } else {
              exports.storage.debug = namespaces;
            }
          } catch (e) {}
        }

        /**
         * Load `namespaces`.
         *
         * @return {String} returns the previously persisted debug modes
         * @api private
         */

        function load() {
          var r;
          try {
            r = exports.storage.debug;
          } catch (e) {}

          // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
          if (!r && typeof process !== 'undefined' && 'env' in process) {
            r = process.env.DEBUG;
          }

          return r;
        }

        /**
         * Enable namespaces listed in `localStorage.debug` initially.
         */

        exports.enable(load());

        /**
         * Localstorage attempts to return the localstorage.
         *
         * This is necessary because safari throws
         * when a user disables cookies/localstorage
         * and you attempt to access it.
         *
         * @return {LocalStorage}
         * @api private
         */

        function localstorage() {
          try {
            return window.localStorage;
          } catch (e) {}
        }
      }).call(this, { env: {} });
    }, { "./debug": 56 }], 56: [function (require, module, exports) {

      /**
       * This is the common logic for both the Node.js and web browser
       * implementations of `debug()`.
       *
       * Expose `debug()` as the module.
       */

      exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
      exports.coerce = coerce;
      exports.disable = disable;
      exports.enable = enable;
      exports.enabled = enabled;
      exports.humanize = require('ms');

      /**
       * The currently active debug mode names, and names to skip.
       */

      exports.names = [];
      exports.skips = [];

      /**
       * Map of special "%n" handling functions, for the debug "format" argument.
       *
       * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
       */

      exports.formatters = {};

      /**
       * Previous log timestamp.
       */

      var prevTime;

      /**
       * Select a color.
       * @param {String} namespace
       * @return {Number}
       * @api private
       */

      function selectColor(namespace) {
        var hash = 0,
            i;

        for (i in namespace) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0; // Convert to 32bit integer
        }

        return exports.colors[Math.abs(hash) % exports.colors.length];
      }

      /**
       * Create a debugger with the given `namespace`.
       *
       * @param {String} namespace
       * @return {Function}
       * @api public
       */

      function createDebug(namespace) {

        function debug() {
          // disabled?
          if (!debug.enabled) return;

          var self = debug;

          // set `diff` timestamp
          var curr = +new Date();
          var ms = curr - (prevTime || curr);
          self.diff = ms;
          self.prev = prevTime;
          self.curr = curr;
          prevTime = curr;

          // turn the `arguments` into a proper Array
          var args = new Array(arguments.length);
          for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i];
          }

          args[0] = exports.coerce(args[0]);

          if ('string' !== typeof args[0]) {
            // anything else let's inspect with %O
            args.unshift('%O');
          }

          // apply any `formatters` transformations
          var index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
            // if we encounter an escaped % then don't increase the array index
            if (match === '%%') return match;
            index++;
            var formatter = exports.formatters[format];
            if ('function' === typeof formatter) {
              var val = args[index];
              match = formatter.call(self, val);

              // now we need to remove `args[index]` since it's inlined in the `format`
              args.splice(index, 1);
              index--;
            }
            return match;
          });

          // apply env-specific formatting (colors, etc.)
          exports.formatArgs.call(self, args);

          var logFn = debug.log || exports.log || console.log.bind(console);
          logFn.apply(self, args);
        }

        debug.namespace = namespace;
        debug.enabled = exports.enabled(namespace);
        debug.useColors = exports.useColors();
        debug.color = selectColor(namespace);

        // env-specific initialization logic for debug instances
        if ('function' === typeof exports.init) {
          exports.init(debug);
        }

        return debug;
      }

      /**
       * Enables a debug mode by namespaces. This can include modes
       * separated by a colon and wildcards.
       *
       * @param {String} namespaces
       * @api public
       */

      function enable(namespaces) {
        exports.save(namespaces);

        exports.names = [];
        exports.skips = [];

        var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
        var len = split.length;

        for (var i = 0; i < len; i++) {
          if (!split[i]) continue; // ignore empty strings
          namespaces = split[i].replace(/\*/g, '.*?');
          if (namespaces[0] === '-') {
            exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
          } else {
            exports.names.push(new RegExp('^' + namespaces + '$'));
          }
        }
      }

      /**
       * Disable debug output.
       *
       * @api public
       */

      function disable() {
        exports.enable('');
      }

      /**
       * Returns true if the given mode name is enabled, false otherwise.
       *
       * @param {String} name
       * @return {Boolean}
       * @api public
       */

      function enabled(name) {
        var i, len;
        for (i = 0, len = exports.skips.length; i < len; i++) {
          if (exports.skips[i].test(name)) {
            return false;
          }
        }
        for (i = 0, len = exports.names.length; i < len; i++) {
          if (exports.names[i].test(name)) {
            return true;
          }
        }
        return false;
      }

      /**
       * Coerce `val`.
       *
       * @param {Mixed} val
       * @return {Mixed}
       * @api private
       */

      function coerce(val) {
        if (val instanceof Error) return val.stack || val.message;
        return val;
      }
    }, { "ms": 54 }], 57: [function (require, module, exports) {
      if (typeof Object.create === 'function') {
        // implementation from standard node.js 'util' module
        module.exports = function inherits(ctor, superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        };
      } else {
        // old school shim for old browsers
        module.exports = function inherits(ctor, superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function TempCtor() {};
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        };
      }
    }, {}], 58: [function (require, module, exports) {
      (function (global) {
        /*! JSON v3.3.2 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */
        ;(function () {
          // Detect the `define` function exposed by asynchronous module loaders. The
          // strict `define` check is necessary for compatibility with `r.js`.
          var isLoader = typeof define === "function" && define.amd;

          // A set of types used to distinguish objects from primitives.
          var objectTypes = {
            "function": true,
            "object": true
          };

          // Detect the `exports` object exposed by CommonJS implementations.
          var freeExports = objectTypes[typeof exports === "undefined" ? "undefined" : _typeof(exports)] && exports && !exports.nodeType && exports;

          // Use the `global` object exposed by Node (including Browserify via
          // `insert-module-globals`), Narwhal, and Ringo as the default context,
          // and the `window` object in browsers. Rhino exports a `global` function
          // instead.
          var root = objectTypes[typeof window === "undefined" ? "undefined" : _typeof(window)] && window || this,
              freeGlobal = freeExports && objectTypes[typeof module === "undefined" ? "undefined" : _typeof(module)] && module && !module.nodeType && (typeof global === "undefined" ? "undefined" : _typeof(global)) == "object" && global;

          if (freeGlobal && (freeGlobal["global"] === freeGlobal || freeGlobal["window"] === freeGlobal || freeGlobal["self"] === freeGlobal)) {
            root = freeGlobal;
          }

          // Public: Initializes JSON 3 using the given `context` object, attaching the
          // `stringify` and `parse` functions to the specified `exports` object.
          function runInContext(context, exports) {
            context || (context = root["Object"]());
            exports || (exports = root["Object"]());

            // Native constructor aliases.
            var Number = context["Number"] || root["Number"],
                String = context["String"] || root["String"],
                Object = context["Object"] || root["Object"],
                Date = context["Date"] || root["Date"],
                SyntaxError = context["SyntaxError"] || root["SyntaxError"],
                TypeError = context["TypeError"] || root["TypeError"],
                Math = context["Math"] || root["Math"],
                nativeJSON = context["JSON"] || root["JSON"];

            // Delegate to the native `stringify` and `parse` implementations.
            if ((typeof nativeJSON === "undefined" ? "undefined" : _typeof(nativeJSON)) == "object" && nativeJSON) {
              exports.stringify = nativeJSON.stringify;
              exports.parse = nativeJSON.parse;
            }

            // Convenience aliases.
            var objectProto = Object.prototype,
                getClass = objectProto.toString,
                _isProperty,
                _forEach,
                undef;

            // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
            var isExtended = new Date(-3509827334573292);
            try {
              // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
              // results for certain dates in Opera >= 10.53.
              isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
              // Safari < 2.0.2 stores the internal millisecond time value correctly,
              // but clips the values returned by the date methods to the range of
              // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
              isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
            } catch (exception) {}

            // Internal: Determines whether the native `JSON.stringify` and `parse`
            // implementations are spec-compliant. Based on work by Ken Snyder.
            function has(name) {
              if (has[name] !== undef) {
                // Return cached feature test result.
                return has[name];
              }
              var isSupported;
              if (name == "bug-string-char-index") {
                // IE <= 7 doesn't support accessing string characters using square
                // bracket notation. IE 8 only supports this for primitives.
                isSupported = "a"[0] != "a";
              } else if (name == "json") {
                // Indicates whether both `JSON.stringify` and `JSON.parse` are
                // supported.
                isSupported = has("json-stringify") && has("json-parse");
              } else {
                var value,
                    serialized = "{\"a\":[1,true,false,null,\"\\u0000\\b\\n\\f\\r\\t\"]}";
                // Test `JSON.stringify`.
                if (name == "json-stringify") {
                  var stringify = exports.stringify,
                      stringifySupported = typeof stringify == "function" && isExtended;
                  if (stringifySupported) {
                    // A test function object with a custom `toJSON` method.
                    (value = function value() {
                      return 1;
                    }).toJSON = value;
                    try {
                      stringifySupported =
                      // Firefox 3.1b1 and b2 serialize string, number, and boolean
                      // primitives as object literals.
                      stringify(0) === "0" &&
                      // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
                      // literals.
                      stringify(new Number()) === "0" && stringify(new String()) == '""' &&
                      // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
                      // does not define a canonical JSON representation (this applies to
                      // objects with `toJSON` properties as well, *unless* they are nested
                      // within an object or array).
                      stringify(getClass) === undef &&
                      // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
                      // FF 3.1b3 pass this test.
                      stringify(undef) === undef &&
                      // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
                      // respectively, if the value is omitted entirely.
                      stringify() === undef &&
                      // FF 3.1b1, 2 throw an error if the given value is not a number,
                      // string, array, object, Boolean, or `null` literal. This applies to
                      // objects with custom `toJSON` methods as well, unless they are nested
                      // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
                      // methods entirely.
                      stringify(value) === "1" && stringify([value]) == "[1]" &&
                      // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
                      // `"[null]"`.
                      stringify([undef]) == "[null]" &&
                      // YUI 3.0.0b1 fails to serialize `null` literals.
                      stringify(null) == "null" &&
                      // FF 3.1b1, 2 halts serialization if an array contains a function:
                      // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
                      // elides non-JSON values from objects and arrays, unless they
                      // define custom `toJSON` methods.
                      stringify([undef, getClass, null]) == "[null,null,null]" &&
                      // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
                      // where character escape codes are expected (e.g., `\b` => `\u0008`).
                      stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
                      // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
                      stringify(null, value) === "1" && stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
                      // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
                      // serialize extended years.
                      stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
                      // The milliseconds are optional in ES 5, but required in 5.1.
                      stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
                      // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
                      // four-digit years instead of six-digit years. Credits: @Yaffle.
                      stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
                      // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
                      // values less than 1000. Credits: @Yaffle.
                      stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
                    } catch (exception) {
                      stringifySupported = false;
                    }
                  }
                  isSupported = stringifySupported;
                }
                // Test `JSON.parse`.
                if (name == "json-parse") {
                  var parse = exports.parse;
                  if (typeof parse == "function") {
                    try {
                      // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
                      // Conforming implementations should also coerce the initial argument to
                      // a string prior to parsing.
                      if (parse("0") === 0 && !parse(false)) {
                        // Simple parsing test.
                        value = parse(serialized);
                        var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
                        if (parseSupported) {
                          try {
                            // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
                            parseSupported = !parse('"\t"');
                          } catch (exception) {}
                          if (parseSupported) {
                            try {
                              // FF 4.0 and 4.0.1 allow leading `+` signs and leading
                              // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
                              // certain octal literals.
                              parseSupported = parse("01") !== 1;
                            } catch (exception) {}
                          }
                          if (parseSupported) {
                            try {
                              // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
                              // points. These environments, along with FF 3.1b1 and 2,
                              // also allow trailing commas in JSON objects and arrays.
                              parseSupported = parse("1.") !== 1;
                            } catch (exception) {}
                          }
                        }
                      }
                    } catch (exception) {
                      parseSupported = false;
                    }
                  }
                  isSupported = parseSupported;
                }
              }
              return has[name] = !!isSupported;
            }

            if (!has("json")) {
              // Common `[[Class]]` name aliases.
              var functionClass = "[object Function]",
                  dateClass = "[object Date]",
                  numberClass = "[object Number]",
                  stringClass = "[object String]",
                  arrayClass = "[object Array]",
                  booleanClass = "[object Boolean]";

              // Detect incomplete support for accessing string characters by index.
              var charIndexBuggy = has("bug-string-char-index");

              // Define additional utility methods if the `Date` methods are buggy.
              if (!isExtended) {
                var floor = Math.floor;
                // A mapping between the months of the year and the number of days between
                // January 1st and the first of the respective month.
                var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
                // Internal: Calculates the number of days between the Unix epoch and the
                // first day of the given month.
                var getDay = function getDay(year, month) {
                  return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
                };
              }

              // Internal: Determines if a property is a direct property of the given
              // object. Delegates to the native `Object#hasOwnProperty` method.
              if (!(_isProperty = objectProto.hasOwnProperty)) {
                _isProperty = function isProperty(property) {
                  var members = {},
                      constructor;
                  if ((members.__proto__ = null, members.__proto__ = {
                    // The *proto* property cannot be set multiple times in recent
                    // versions of Firefox and SeaMonkey.
                    "toString": 1
                  }, members).toString != getClass) {
                    // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
                    // supports the mutable *proto* property.
                    _isProperty = function isProperty(property) {
                      // Capture and break the object's prototype chain (see section 8.6.2
                      // of the ES 5.1 spec). The parenthesized expression prevents an
                      // unsafe transformation by the Closure Compiler.
                      var original = this.__proto__,
                          result = property in (this.__proto__ = null, this);
                      // Restore the original prototype chain.
                      this.__proto__ = original;
                      return result;
                    };
                  } else {
                    // Capture a reference to the top-level `Object` constructor.
                    constructor = members.constructor;
                    // Use the `constructor` property to simulate `Object#hasOwnProperty` in
                    // other environments.
                    _isProperty = function isProperty(property) {
                      var parent = (this.constructor || constructor).prototype;
                      return property in this && !(property in parent && this[property] === parent[property]);
                    };
                  }
                  members = null;
                  return _isProperty.call(this, property);
                };
              }

              // Internal: Normalizes the `for...in` iteration algorithm across
              // environments. Each enumerated key is yielded to a `callback` function.
              _forEach = function forEach(object, callback) {
                var size = 0,
                    Properties,
                    members,
                    property;

                // Tests for bugs in the current environment's `for...in` algorithm. The
                // `valueOf` property inherits the non-enumerable flag from
                // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
                (Properties = function Properties() {
                  this.valueOf = 0;
                }).prototype.valueOf = 0;

                // Iterate over a new instance of the `Properties` class.
                members = new Properties();
                for (property in members) {
                  // Ignore all properties inherited from `Object.prototype`.
                  if (_isProperty.call(members, property)) {
                    size++;
                  }
                }
                Properties = members = null;

                // Normalize the iteration algorithm.
                if (!size) {
                  // A list of non-enumerable properties inherited from `Object.prototype`.
                  members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
                  // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
                  // properties.
                  _forEach = function forEach(object, callback) {
                    var isFunction = getClass.call(object) == functionClass,
                        property,
                        length;
                    var hasProperty = !isFunction && typeof object.constructor != "function" && objectTypes[_typeof(object.hasOwnProperty)] && object.hasOwnProperty || _isProperty;
                    for (property in object) {
                      // Gecko <= 1.0 enumerates the `prototype` property of functions under
                      // certain conditions; IE does not.
                      if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
                        callback(property);
                      }
                    }
                    // Manually invoke the callback for each non-enumerable property.
                    for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property)) {}
                  };
                } else if (size == 2) {
                  // Safari <= 2.0.4 enumerates shadowed properties twice.
                  _forEach = function forEach(object, callback) {
                    // Create a set of iterated properties.
                    var members = {},
                        isFunction = getClass.call(object) == functionClass,
                        property;
                    for (property in object) {
                      // Store each property name to prevent double enumeration. The
                      // `prototype` property of functions is not enumerated due to cross-
                      // environment inconsistencies.
                      if (!(isFunction && property == "prototype") && !_isProperty.call(members, property) && (members[property] = 1) && _isProperty.call(object, property)) {
                        callback(property);
                      }
                    }
                  };
                } else {
                  // No bugs detected; use the standard `for...in` algorithm.
                  _forEach = function forEach(object, callback) {
                    var isFunction = getClass.call(object) == functionClass,
                        property,
                        isConstructor;
                    for (property in object) {
                      if (!(isFunction && property == "prototype") && _isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
                        callback(property);
                      }
                    }
                    // Manually invoke the callback for the `constructor` property due to
                    // cross-environment inconsistencies.
                    if (isConstructor || _isProperty.call(object, property = "constructor")) {
                      callback(property);
                    }
                  };
                }
                return _forEach(object, callback);
              };

              // Public: Serializes a JavaScript `value` as a JSON string. The optional
              // `filter` argument may specify either a function that alters how object and
              // array members are serialized, or an array of strings and numbers that
              // indicates which properties should be serialized. The optional `width`
              // argument may be either a string or number that specifies the indentation
              // level of the output.
              if (!has("json-stringify")) {
                // Internal: A map of control characters and their escaped equivalents.
                var Escapes = {
                  92: "\\\\",
                  34: '\\"',
                  8: "\\b",
                  12: "\\f",
                  10: "\\n",
                  13: "\\r",
                  9: "\\t"
                };

                // Internal: Converts `value` into a zero-padded string such that its
                // length is at least equal to `width`. The `width` must be <= 6.
                var leadingZeroes = "000000";
                var toPaddedString = function toPaddedString(width, value) {
                  // The `|| 0` expression is necessary to work around a bug in
                  // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
                  return (leadingZeroes + (value || 0)).slice(-width);
                };

                // Internal: Double-quotes a string `value`, replacing all ASCII control
                // characters (characters with code unit values between 0 and 31) with
                // their escaped equivalents. This is an implementation of the
                // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
                var unicodePrefix = "\\u00";
                var quote = function quote(value) {
                  var result = '"',
                      index = 0,
                      length = value.length,
                      useCharIndex = !charIndexBuggy || length > 10;
                  var symbols = useCharIndex && (charIndexBuggy ? value.split("") : value);
                  for (; index < length; index++) {
                    var charCode = value.charCodeAt(index);
                    // If the character is a control character, append its Unicode or
                    // shorthand escape sequence; otherwise, append the character as-is.
                    switch (charCode) {
                      case 8:case 9:case 10:case 12:case 13:case 34:case 92:
                        result += Escapes[charCode];
                        break;
                      default:
                        if (charCode < 32) {
                          result += unicodePrefix + toPaddedString(2, charCode.toString(16));
                          break;
                        }
                        result += useCharIndex ? symbols[index] : value.charAt(index);
                    }
                  }
                  return result + '"';
                };

                // Internal: Recursively serializes an object. Implements the
                // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
                var serialize = function serialize(property, object, callback, properties, whitespace, indentation, stack) {
                  var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
                  try {
                    // Necessary for host object support.
                    value = object[property];
                  } catch (exception) {}
                  if ((typeof value === "undefined" ? "undefined" : _typeof(value)) == "object" && value) {
                    className = getClass.call(value);
                    if (className == dateClass && !_isProperty.call(value, "toJSON")) {
                      if (value > -1 / 0 && value < 1 / 0) {
                        // Dates are serialized according to the `Date#toJSON` method
                        // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
                        // for the ISO 8601 date time string format.
                        if (getDay) {
                          // Manually compute the year, month, date, hours, minutes,
                          // seconds, and milliseconds if the `getUTC*` methods are
                          // buggy. Adapted from @Yaffle's `date-shim` project.
                          date = floor(value / 864e5);
                          for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++) {}
                          for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++) {}
                          date = 1 + date - getDay(year, month);
                          // The `time` value specifies the time within the day (see ES
                          // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
                          // to compute `A modulo B`, as the `%` operator does not
                          // correspond to the `modulo` operation for negative numbers.
                          time = (value % 864e5 + 864e5) % 864e5;
                          // The hours, minutes, seconds, and milliseconds are obtained by
                          // decomposing the time within the day. See section 15.9.1.10.
                          hours = floor(time / 36e5) % 24;
                          minutes = floor(time / 6e4) % 60;
                          seconds = floor(time / 1e3) % 60;
                          milliseconds = time % 1e3;
                        } else {
                          year = value.getUTCFullYear();
                          month = value.getUTCMonth();
                          date = value.getUTCDate();
                          hours = value.getUTCHours();
                          minutes = value.getUTCMinutes();
                          seconds = value.getUTCSeconds();
                          milliseconds = value.getUTCMilliseconds();
                        }
                        // Serialize extended years correctly.
                        value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) + "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
                        // Months, dates, hours, minutes, and seconds should have two
                        // digits; milliseconds should have three.
                        "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
                        // Milliseconds are optional in ES 5.0, but required in 5.1.
                        "." + toPaddedString(3, milliseconds) + "Z";
                      } else {
                        value = null;
                      }
                    } else if (typeof value.toJSON == "function" && (className != numberClass && className != stringClass && className != arrayClass || _isProperty.call(value, "toJSON"))) {
                      // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
                      // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
                      // ignores all `toJSON` methods on these objects unless they are
                      // defined directly on an instance.
                      value = value.toJSON(property);
                    }
                  }
                  if (callback) {
                    // If a replacement function was provided, call it to obtain the value
                    // for serialization.
                    value = callback.call(object, property, value);
                  }
                  if (value === null) {
                    return "null";
                  }
                  className = getClass.call(value);
                  if (className == booleanClass) {
                    // Booleans are represented literally.
                    return "" + value;
                  } else if (className == numberClass) {
                    // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
                    // `"null"`.
                    return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
                  } else if (className == stringClass) {
                    // Strings are double-quoted and escaped.
                    return quote("" + value);
                  }
                  // Recursively serialize objects and arrays.
                  if ((typeof value === "undefined" ? "undefined" : _typeof(value)) == "object") {
                    // Check for cyclic structures. This is a linear search; performance
                    // is inversely proportional to the number of unique nested objects.
                    for (length = stack.length; length--;) {
                      if (stack[length] === value) {
                        // Cyclic structures cannot be serialized by `JSON.stringify`.
                        throw TypeError();
                      }
                    }
                    // Add the object to the stack of traversed objects.
                    stack.push(value);
                    results = [];
                    // Save the current indentation level and indent one additional level.
                    prefix = indentation;
                    indentation += whitespace;
                    if (className == arrayClass) {
                      // Recursively serialize array elements.
                      for (index = 0, length = value.length; index < length; index++) {
                        element = serialize(index, value, callback, properties, whitespace, indentation, stack);
                        results.push(element === undef ? "null" : element);
                      }
                      result = results.length ? whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : "[" + results.join(",") + "]" : "[]";
                    } else {
                      // Recursively serialize object members. Members are selected from
                      // either a user-specified list of property names, or the object
                      // itself.
                      _forEach(properties || value, function (property) {
                        var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
                        if (element !== undef) {
                          // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
                          // is not the empty string, let `member` {quote(property) + ":"}
                          // be the concatenation of `member` and the `space` character."
                          // The "`space` character" refers to the literal space
                          // character, not the `space` {width} argument provided to
                          // `JSON.stringify`.
                          results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
                        }
                      });
                      result = results.length ? whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : "{" + results.join(",") + "}" : "{}";
                    }
                    // Remove the object from the traversed object stack.
                    stack.pop();
                    return result;
                  }
                };

                // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
                exports.stringify = function (source, filter, width) {
                  var whitespace, callback, properties, className;
                  if (objectTypes[typeof filter === "undefined" ? "undefined" : _typeof(filter)] && filter) {
                    if ((className = getClass.call(filter)) == functionClass) {
                      callback = filter;
                    } else if (className == arrayClass) {
                      // Convert the property names array into a makeshift set.
                      properties = {};
                      for (var index = 0, length = filter.length, value; index < length; value = filter[index++], (className = getClass.call(value), className == stringClass || className == numberClass) && (properties[value] = 1)) {}
                    }
                  }
                  if (width) {
                    if ((className = getClass.call(width)) == numberClass) {
                      // Convert the `width` to an integer and create a string containing
                      // `width` number of space characters.
                      if ((width -= width % 1) > 0) {
                        for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ") {}
                      }
                    } else if (className == stringClass) {
                      whitespace = width.length <= 10 ? width : width.slice(0, 10);
                    }
                  }
                  // Opera <= 7.54u2 discards the values associated with empty string keys
                  // (`""`) only if they are used directly within an object member list
                  // (e.g., `!("" in { "": 1})`).
                  return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
                };
              }

              // Public: Parses a JSON source string.
              if (!has("json-parse")) {
                var fromCharCode = String.fromCharCode;

                // Internal: A map of escaped control characters and their unescaped
                // equivalents.
                var Unescapes = {
                  92: "\\",
                  34: '"',
                  47: "/",
                  98: "\b",
                  116: "\t",
                  110: "\n",
                  102: "\f",
                  114: "\r"
                };

                // Internal: Stores the parser state.
                var Index, Source;

                // Internal: Resets the parser state and throws a `SyntaxError`.
                var abort = function abort() {
                  Index = Source = null;
                  throw SyntaxError();
                };

                // Internal: Returns the next token, or `"$"` if the parser has reached
                // the end of the source string. A token may be a string, number, `null`
                // literal, or Boolean literal.
                var lex = function lex() {
                  var source = Source,
                      length = source.length,
                      value,
                      begin,
                      position,
                      isSigned,
                      charCode;
                  while (Index < length) {
                    charCode = source.charCodeAt(Index);
                    switch (charCode) {
                      case 9:case 10:case 13:case 32:
                        // Skip whitespace tokens, including tabs, carriage returns, line
                        // feeds, and space characters.
                        Index++;
                        break;
                      case 123:case 125:case 91:case 93:case 58:case 44:
                        // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
                        // the current position.
                        value = charIndexBuggy ? source.charAt(Index) : source[Index];
                        Index++;
                        return value;
                      case 34:
                        // `"` delimits a JSON string; advance to the next character and
                        // begin parsing the string. String tokens are prefixed with the
                        // sentinel `@` character to distinguish them from punctuators and
                        // end-of-string tokens.
                        for (value = "@", Index++; Index < length;) {
                          charCode = source.charCodeAt(Index);
                          if (charCode < 32) {
                            // Unescaped ASCII control characters (those with a code unit
                            // less than the space character) are not permitted.
                            abort();
                          } else if (charCode == 92) {
                            // A reverse solidus (`\`) marks the beginning of an escaped
                            // control character (including `"`, `\`, and `/`) or Unicode
                            // escape sequence.
                            charCode = source.charCodeAt(++Index);
                            switch (charCode) {
                              case 92:case 34:case 47:case 98:case 116:case 110:case 102:case 114:
                                // Revive escaped control characters.
                                value += Unescapes[charCode];
                                Index++;
                                break;
                              case 117:
                                // `\u` marks the beginning of a Unicode escape sequence.
                                // Advance to the first character and validate the
                                // four-digit code point.
                                begin = ++Index;
                                for (position = Index + 4; Index < position; Index++) {
                                  charCode = source.charCodeAt(Index);
                                  // A valid sequence comprises four hexdigits (case-
                                  // insensitive) that form a single hexadecimal value.
                                  if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
                                    // Invalid Unicode escape sequence.
                                    abort();
                                  }
                                }
                                // Revive the escaped character.
                                value += fromCharCode("0x" + source.slice(begin, Index));
                                break;
                              default:
                                // Invalid escape sequence.
                                abort();
                            }
                          } else {
                            if (charCode == 34) {
                              // An unescaped double-quote character marks the end of the
                              // string.
                              break;
                            }
                            charCode = source.charCodeAt(Index);
                            begin = Index;
                            // Optimize for the common case where a string is valid.
                            while (charCode >= 32 && charCode != 92 && charCode != 34) {
                              charCode = source.charCodeAt(++Index);
                            }
                            // Append the string as-is.
                            value += source.slice(begin, Index);
                          }
                        }
                        if (source.charCodeAt(Index) == 34) {
                          // Advance to the next character and return the revived string.
                          Index++;
                          return value;
                        }
                        // Unterminated string.
                        abort();
                      default:
                        // Parse numbers and literals.
                        begin = Index;
                        // Advance past the negative sign, if one is specified.
                        if (charCode == 45) {
                          isSigned = true;
                          charCode = source.charCodeAt(++Index);
                        }
                        // Parse an integer or floating-point value.
                        if (charCode >= 48 && charCode <= 57) {
                          // Leading zeroes are interpreted as octal literals.
                          if (charCode == 48 && (charCode = source.charCodeAt(Index + 1), charCode >= 48 && charCode <= 57)) {
                            // Illegal octal literal.
                            abort();
                          }
                          isSigned = false;
                          // Parse the integer component.
                          for (; Index < length && (charCode = source.charCodeAt(Index), charCode >= 48 && charCode <= 57); Index++) {}
                          // Floats cannot contain a leading decimal point; however, this
                          // case is already accounted for by the parser.
                          if (source.charCodeAt(Index) == 46) {
                            position = ++Index;
                            // Parse the decimal component.
                            for (; position < length && (charCode = source.charCodeAt(position), charCode >= 48 && charCode <= 57); position++) {}
                            if (position == Index) {
                              // Illegal trailing decimal.
                              abort();
                            }
                            Index = position;
                          }
                          // Parse exponents. The `e` denoting the exponent is
                          // case-insensitive.
                          charCode = source.charCodeAt(Index);
                          if (charCode == 101 || charCode == 69) {
                            charCode = source.charCodeAt(++Index);
                            // Skip past the sign following the exponent, if one is
                            // specified.
                            if (charCode == 43 || charCode == 45) {
                              Index++;
                            }
                            // Parse the exponential component.
                            for (position = Index; position < length && (charCode = source.charCodeAt(position), charCode >= 48 && charCode <= 57); position++) {}
                            if (position == Index) {
                              // Illegal empty exponent.
                              abort();
                            }
                            Index = position;
                          }
                          // Coerce the parsed value to a JavaScript number.
                          return +source.slice(begin, Index);
                        }
                        // A negative sign may only precede numbers.
                        if (isSigned) {
                          abort();
                        }
                        // `true`, `false`, and `null` literals.
                        if (source.slice(Index, Index + 4) == "true") {
                          Index += 4;
                          return true;
                        } else if (source.slice(Index, Index + 5) == "false") {
                          Index += 5;
                          return false;
                        } else if (source.slice(Index, Index + 4) == "null") {
                          Index += 4;
                          return null;
                        }
                        // Unrecognized token.
                        abort();
                    }
                  }
                  // Return the sentinel `$` character if the parser has reached the end
                  // of the source string.
                  return "$";
                };

                // Internal: Parses a JSON `value` token.
                var get = function get(value) {
                  var results, hasMembers;
                  if (value == "$") {
                    // Unexpected end of input.
                    abort();
                  }
                  if (typeof value == "string") {
                    if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
                      // Remove the sentinel `@` character.
                      return value.slice(1);
                    }
                    // Parse object and array literals.
                    if (value == "[") {
                      // Parses a JSON array, returning a new JavaScript array.
                      results = [];
                      for (;; hasMembers || (hasMembers = true)) {
                        value = lex();
                        // A closing square bracket marks the end of the array literal.
                        if (value == "]") {
                          break;
                        }
                        // If the array literal contains elements, the current token
                        // should be a comma separating the previous element from the
                        // next.
                        if (hasMembers) {
                          if (value == ",") {
                            value = lex();
                            if (value == "]") {
                              // Unexpected trailing `,` in array literal.
                              abort();
                            }
                          } else {
                            // A `,` must separate each array element.
                            abort();
                          }
                        }
                        // Elisions and leading commas are not permitted.
                        if (value == ",") {
                          abort();
                        }
                        results.push(get(value));
                      }
                      return results;
                    } else if (value == "{") {
                      // Parses a JSON object, returning a new JavaScript object.
                      results = {};
                      for (;; hasMembers || (hasMembers = true)) {
                        value = lex();
                        // A closing curly brace marks the end of the object literal.
                        if (value == "}") {
                          break;
                        }
                        // If the object literal contains members, the current token
                        // should be a comma separator.
                        if (hasMembers) {
                          if (value == ",") {
                            value = lex();
                            if (value == "}") {
                              // Unexpected trailing `,` in object literal.
                              abort();
                            }
                          } else {
                            // A `,` must separate each object member.
                            abort();
                          }
                        }
                        // Leading commas are not permitted, object property names must be
                        // double-quoted strings, and a `:` must separate each property
                        // name and value.
                        if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
                          abort();
                        }
                        results[value.slice(1)] = get(lex());
                      }
                      return results;
                    }
                    // Unexpected token encountered.
                    abort();
                  }
                  return value;
                };

                // Internal: Updates a traversed object member.
                var update = function update(source, property, callback) {
                  var element = walk(source, property, callback);
                  if (element === undef) {
                    delete source[property];
                  } else {
                    source[property] = element;
                  }
                };

                // Internal: Recursively traverses a parsed JSON object, invoking the
                // `callback` function for each value. This is an implementation of the
                // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
                var walk = function walk(source, property, callback) {
                  var value = source[property],
                      length;
                  if ((typeof value === "undefined" ? "undefined" : _typeof(value)) == "object" && value) {
                    // `forEach` can't be used to traverse an array in Opera <= 8.54
                    // because its `Object#hasOwnProperty` implementation returns `false`
                    // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
                    if (getClass.call(value) == arrayClass) {
                      for (length = value.length; length--;) {
                        update(value, length, callback);
                      }
                    } else {
                      _forEach(value, function (property) {
                        update(value, property, callback);
                      });
                    }
                  }
                  return callback.call(source, property, value);
                };

                // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
                exports.parse = function (source, callback) {
                  var result, value;
                  Index = 0;
                  Source = "" + source;
                  result = get(lex());
                  // If a JSON string contains multiple tokens, it is invalid.
                  if (lex() != "$") {
                    abort();
                  }
                  // Reset the parser state.
                  Index = Source = null;
                  return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
                };
              }
            }

            exports["runInContext"] = runInContext;
            return exports;
          }

          if (freeExports && !isLoader) {
            // Export for CommonJS environments.
            runInContext(root, freeExports);
          } else {
            // Export for web browsers and JavaScript engines.
            var nativeJSON = root.JSON,
                previousJSON = root["JSON3"],
                isRestored = false;

            var JSON3 = runInContext(root, root["JSON3"] = {
              // Public: Restores the original value of the global `JSON` object and
              // returns a reference to the `JSON3` object.
              "noConflict": function noConflict() {
                if (!isRestored) {
                  isRestored = true;
                  root.JSON = nativeJSON;
                  root["JSON3"] = previousJSON;
                  nativeJSON = previousJSON = null;
                }
                return JSON3;
              }
            });

            root.JSON = {
              "parse": JSON3.parse,
              "stringify": JSON3.stringify
            };
          }

          // Export for asynchronous module loaders.
          if (isLoader) {
            define(function () {
              return JSON3;
            });
          }
        }).call(this);
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}], 59: [function (require, module, exports) {
      'use strict';

      var has = Object.prototype.hasOwnProperty;

      /**
       * Simple query string parser.
       *
       * @param {String} query The query string that needs to be parsed.
       * @returns {Object}
       * @api public
       */
      function querystring(query) {
        var parser = /([^=?&]+)=?([^&]*)/g,
            result = {},
            part;

        //
        // Little nifty parsing hack, leverage the fact that RegExp.exec increments
        // the lastIndex property so we can continue executing this loop until we've
        // parsed all results.
        //
        for (; part = parser.exec(query); result[decodeURIComponent(part[1])] = decodeURIComponent(part[2])) {}

        return result;
      }

      /**
       * Transform a query string to an object.
       *
       * @param {Object} obj Object that should be transformed.
       * @param {String} prefix Optional prefix.
       * @returns {String}
       * @api public
       */
      function querystringify(obj, prefix) {
        prefix = prefix || '';

        var pairs = [];

        //
        // Optionally prefix with a '?' if needed
        //
        if ('string' !== typeof prefix) prefix = '?';

        for (var key in obj) {
          if (has.call(obj, key)) {
            pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
          }
        }

        return pairs.length ? prefix + pairs.join('&') : '';
      }

      //
      // Expose the module.
      //
      exports.stringify = querystringify;
      exports.parse = querystring;
    }, {}], 60: [function (require, module, exports) {
      'use strict';

      /**
       * Check if we're required to add a port number.
       *
       * @see https://url.spec.whatwg.org/#default-port
       * @param {Number|String} port Port number we need to check
       * @param {String} protocol Protocol we need to check against.
       * @returns {Boolean} Is it a default port for the given protocol
       * @api private
       */

      module.exports = function required(port, protocol) {
        protocol = protocol.split(':')[0];
        port = +port;

        if (!port) return false;

        switch (protocol) {
          case 'http':
          case 'ws':
            return port !== 80;

          case 'https':
          case 'wss':
            return port !== 443;

          case 'ftp':
            return port !== 21;

          case 'gopher':
            return port !== 70;

          case 'file':
            return false;
        }

        return port !== 0;
      };
    }, {}], 61: [function (require, module, exports) {
      'use strict';

      var required = require('requires-port'),
          lolcation = require('./lolcation'),
          qs = require('querystringify'),
          protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i;

      /**
       * These are the parse rules for the URL parser, it informs the parser
       * about:
       *
       * 0. The char it Needs to parse, if it's a string it should be done using
       *    indexOf, RegExp using exec and NaN means set as current value.
       * 1. The property we should set when parsing this value.
       * 2. Indication if it's backwards or forward parsing, when set as number it's
       *    the value of extra chars that should be split off.
       * 3. Inherit from location if non existing in the parser.
       * 4. `toLowerCase` the resulting value.
       */
      var rules = [['#', 'hash'], // Extract from the back.
      ['?', 'query'], // Extract from the back.
      ['/', 'pathname'], // Extract from the back.
      ['@', 'auth', 1], // Extract from the front.
      [NaN, 'host', undefined, 1, 1], // Set left over value.
      [/:(\d+)$/, 'port', undefined, 1], // RegExp the back.
      [NaN, 'hostname', undefined, 1, 1] // Set left over.
      ];

      /**
       * @typedef ProtocolExtract
       * @type Object
       * @property {String} protocol Protocol matched in the URL, in lowercase.
       * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
       * @property {String} rest Rest of the URL that is not part of the protocol.
       */

      /**
       * Extract protocol information from a URL with/without double slash ("//").
       *
       * @param {String} address URL we want to extract from.
       * @return {ProtocolExtract} Extracted information.
       * @api private
       */
      function extractProtocol(address) {
        var match = protocolre.exec(address);

        return {
          protocol: match[1] ? match[1].toLowerCase() : '',
          slashes: !!match[2],
          rest: match[3]
        };
      }

      /**
       * Resolve a relative URL pathname against a base URL pathname.
       *
       * @param {String} relative Pathname of the relative URL.
       * @param {String} base Pathname of the base URL.
       * @return {String} Resolved pathname.
       * @api private
       */
      function resolve(relative, base) {
        var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/')),
            i = path.length,
            last = path[i - 1],
            unshift = false,
            up = 0;

        while (i--) {
          if (path[i] === '.') {
            path.splice(i, 1);
          } else if (path[i] === '..') {
            path.splice(i, 1);
            up++;
          } else if (up) {
            if (i === 0) unshift = true;
            path.splice(i, 1);
            up--;
          }
        }

        if (unshift) path.unshift('');
        if (last === '.' || last === '..') path.push('');

        return path.join('/');
      }

      /**
       * The actual URL instance. Instead of returning an object we've opted-in to
       * create an actual constructor as it's much more memory efficient and
       * faster and it pleases my OCD.
       *
       * @constructor
       * @param {String} address URL we want to parse.
       * @param {Object|String} location Location defaults for relative paths.
       * @param {Boolean|Function} parser Parser for the query string.
       * @api public
       */
      function URL(address, location, parser) {
        if (!(this instanceof URL)) {
          return new URL(address, location, parser);
        }

        var relative,
            extracted,
            parse,
            instruction,
            index,
            key,
            instructions = rules.slice(),
            type = typeof location === "undefined" ? "undefined" : _typeof(location),
            url = this,
            i = 0;

        //
        // The following if statements allows this module two have compatibility with
        // 2 different API:
        //
        // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
        //    where the boolean indicates that the query string should also be parsed.
        //
        // 2. The `URL` interface of the browser which accepts a URL, object as
        //    arguments. The supplied object will be used as default values / fall-back
        //    for relative paths.
        //
        if ('object' !== type && 'string' !== type) {
          parser = location;
          location = null;
        }

        if (parser && 'function' !== typeof parser) parser = qs.parse;

        location = lolcation(location);

        //
        // Extract protocol information before running the instructions.
        //
        extracted = extractProtocol(address || '');
        relative = !extracted.protocol && !extracted.slashes;
        url.slashes = extracted.slashes || relative && location.slashes;
        url.protocol = extracted.protocol || location.protocol || '';
        address = extracted.rest;

        //
        // When the authority component is absent the URL starts with a path
        // component.
        //
        if (!extracted.slashes) instructions[2] = [/(.*)/, 'pathname'];

        for (; i < instructions.length; i++) {
          instruction = instructions[i];
          parse = instruction[0];
          key = instruction[1];

          if (parse !== parse) {
            url[key] = address;
          } else if ('string' === typeof parse) {
            if (~(index = address.indexOf(parse))) {
              if ('number' === typeof instruction[2]) {
                url[key] = address.slice(0, index);
                address = address.slice(index + instruction[2]);
              } else {
                url[key] = address.slice(index);
                address = address.slice(0, index);
              }
            }
          } else if (index = parse.exec(address)) {
            url[key] = index[1];
            address = address.slice(0, index.index);
          }

          url[key] = url[key] || (relative && instruction[3] ? location[key] || '' : '');

          //
          // Hostname, host and protocol should be lowercased so they can be used to
          // create a proper `origin`.
          //
          if (instruction[4]) url[key] = url[key].toLowerCase();
        }

        //
        // Also parse the supplied query string in to an object. If we're supplied
        // with a custom parser as function use that instead of the default build-in
        // parser.
        //
        if (parser) url.query = parser(url.query);

        //
        // If the URL is relative, resolve the pathname against the base URL.
        //
        if (relative && location.slashes && url.pathname.charAt(0) !== '/' && (url.pathname !== '' || location.pathname !== '')) {
          url.pathname = resolve(url.pathname, location.pathname);
        }

        //
        // We should not add port numbers if they are already the default port number
        // for a given protocol. As the host also contains the port number we're going
        // override it with the hostname which contains no port number.
        //
        if (!required(url.port, url.protocol)) {
          url.host = url.hostname;
          url.port = '';
        }

        //
        // Parse down the `auth` for the username and password.
        //
        url.username = url.password = '';
        if (url.auth) {
          instruction = url.auth.split(':');
          url.username = instruction[0] || '';
          url.password = instruction[1] || '';
        }

        url.origin = url.protocol && url.host && url.protocol !== 'file:' ? url.protocol + '//' + url.host : 'null';

        //
        // The href is just the compiled result.
        //
        url.href = url.toString();
      }

      /**
       * This is convenience method for changing properties in the URL instance to
       * insure that they all propagate correctly.
       *
       * @param {String} part          Property we need to adjust.
       * @param {Mixed} value          The newly assigned value.
       * @param {Boolean|Function} fn  When setting the query, it will be the function
       *                               used to parse the query.
       *                               When setting the protocol, double slash will be
       *                               removed from the final url if it is true.
       * @returns {URL}
       * @api public
       */
      function set(part, value, fn) {
        var url = this;

        switch (part) {
          case 'query':
            if ('string' === typeof value && value.length) {
              value = (fn || qs.parse)(value);
            }

            url[part] = value;
            break;

          case 'port':
            url[part] = value;

            if (!required(value, url.protocol)) {
              url.host = url.hostname;
              url[part] = '';
            } else if (value) {
              url.host = url.hostname + ':' + value;
            }

            break;

          case 'hostname':
            url[part] = value;

            if (url.port) value += ':' + url.port;
            url.host = value;
            break;

          case 'host':
            url[part] = value;

            if (/:\d+$/.test(value)) {
              value = value.split(':');
              url.port = value.pop();
              url.hostname = value.join(':');
            } else {
              url.hostname = value;
              url.port = '';
            }

            break;

          case 'protocol':
            url.protocol = value.toLowerCase();
            url.slashes = !fn;
            break;

          case 'pathname':
            url.pathname = value.length && value.charAt(0) !== '/' ? '/' + value : value;

            break;

          default:
            url[part] = value;
        }

        for (var i = 0; i < rules.length; i++) {
          var ins = rules[i];

          if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
        }

        url.origin = url.protocol && url.host && url.protocol !== 'file:' ? url.protocol + '//' + url.host : 'null';

        url.href = url.toString();

        return url;
      };

      /**
       * Transform the properties back in to a valid and full URL string.
       *
       * @param {Function} stringify Optional query stringify function.
       * @returns {String}
       * @api public
       */
      function toString(stringify) {
        if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

        var query,
            url = this,
            protocol = url.protocol;

        if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

        var result = protocol + (url.slashes ? '//' : '');

        if (url.username) {
          result += url.username;
          if (url.password) result += ':' + url.password;
          result += '@';
        }

        result += url.host + url.pathname;

        query = 'object' === _typeof(url.query) ? stringify(url.query) : url.query;
        if (query) result += '?' !== query.charAt(0) ? '?' + query : query;

        if (url.hash) result += url.hash;

        return result;
      }

      URL.prototype = { set: set, toString: toString };

      //
      // Expose the URL parser and some additional properties that might be useful for
      // others or testing.
      //
      URL.extractProtocol = extractProtocol;
      URL.location = lolcation;
      URL.qs = qs;

      module.exports = URL;
    }, { "./lolcation": 62, "querystringify": 59, "requires-port": 60 }], 62: [function (require, module, exports) {
      (function (global) {
        'use strict';

        var slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//;

        /**
         * These properties should not be copied or inherited from. This is only needed
         * for all non blob URL's as a blob URL does not include a hash, only the
         * origin.
         *
         * @type {Object}
         * @private
         */
        var ignore = { hash: 1, query: 1 },
            URL;

        /**
         * The location object differs when your code is loaded through a normal page,
         * Worker or through a worker using a blob. And with the blobble begins the
         * trouble as the location object will contain the URL of the blob, not the
         * location of the page where our code is loaded in. The actual origin is
         * encoded in the `pathname` so we can thankfully generate a good "default"
         * location from it so we can generate proper relative URL's again.
         *
         * @param {Object|String} loc Optional default location object.
         * @returns {Object} lolcation object.
         * @api public
         */
        module.exports = function lolcation(loc) {
          loc = loc || global.location || {};
          URL = URL || require('./');

          var finaldestination = {},
              type = typeof loc === "undefined" ? "undefined" : _typeof(loc),
              key;

          if ('blob:' === loc.protocol) {
            finaldestination = new URL(unescape(loc.pathname), {});
          } else if ('string' === type) {
            finaldestination = new URL(loc, {});
            for (key in ignore) {
              delete finaldestination[key];
            }
          } else if ('object' === type) {
            for (key in loc) {
              if (key in ignore) continue;
              finaldestination[key] = loc[key];
            }

            if (finaldestination.slashes === undefined) {
              finaldestination.slashes = slashes.test(loc.href);
            }
          }

          return finaldestination;
        };
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "./": 61 }] }, {}, [1])(1);
});

//# sourceMappingURL=sockjs.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(50)))

/***/ }),
/* 360 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ansiRegex = __webpack_require__(145)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};

/***/ }),
/* 361 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
	// get current location
	var location = typeof window !== "undefined" && window.location;

	if (!location) {
		throw new Error("fixUrls requires window.location");
	}

	// blank or null?
	if (!css || typeof css !== "string") {
		return css;
	}

	var baseUrl = location.protocol + "//" + location.host;
	var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
 This regular expression is just a way to recursively match brackets within
 a string.
 	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
    (  = Start a capturing group
      (?:  = Start a non-capturing group
          [^)(]  = Match anything that isn't a parentheses
          |  = OR
          \(  = Match a start parentheses
              (?:  = Start another non-capturing groups
                  [^)(]+  = Match anything that isn't a parentheses
                  |  = OR
                  \(  = Match a start parentheses
                      [^)(]*  = Match anything that isn't a parentheses
                  \)  = Match a end parentheses
              )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
  \)  = Match a close parens
 	 /gi  = Get all matches, not the first.  Be case insensitive.
  */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function (fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl.trim().replace(/^"(.*)"$/, function (o, $1) {
			return $1;
		}).replace(/^'(.*)'$/, function (o, $1) {
			return $1;
		});

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
			return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
			//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};

/***/ }),
/* 362 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var punycode = __webpack_require__(355);
var util = __webpack_require__(363);

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,


// Special case for a simple path URL
simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,


// RFC 2396: characters reserved for delimiting URLs.
// We actually just auto-escape these.
delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],


// RFC 2396: characters not allowed for various reasons.
unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),


// Allowed by RFCs, but cause of XSS attacks.  Always escape these.
autoEscape = ['\''].concat(unwise),

// Characters that are never ever allowed in a hostname.
// Note that any invalid chars are also handled, but these
// are the ones that are *expected* to be seen, so we fast-path
// them.
nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,

// protocols that can allow "unsafe" and "unwise" chars.
unsafeProtocol = {
  'javascript': true,
  'javascript:': true
},

// protocols that never have a hostname.
hostlessProtocol = {
  'javascript': true,
  'javascript:': true
},

// protocols that always contain a // bit.
slashedProtocol = {
  'http': true,
  'https': true,
  'ftp': true,
  'gopher': true,
  'file': true,
  'http:': true,
  'https:': true,
  'ftp:': true,
  'gopher:': true,
  'file:': true
},
    querystring = __webpack_require__(358);

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url();
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function (url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + (typeof url === 'undefined' ? 'undefined' : _typeof(url)));
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter = queryIndex !== -1 && queryIndex < url.indexOf('#') ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1) hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' && this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1) continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }

  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function () {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ? this.hostname : '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query && util.isObject(this.query) && Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || query && '?' + query || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes || (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function (match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function (relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function (relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol') result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift())) {}
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = result.pathname && result.pathname.charAt(0) === '/',
      isRelAbs = relative.host || relative.pathname && relative.pathname.charAt(0) === '/',
      mustEndAbs = isRelAbs || isSourceAbs || result.host && relative.pathname,
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = relative.host || relative.host === '' ? relative.host : result.host;
    result.hostname = relative.hostname || relative.hostname === '' ? relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (result.host || relative.host || srcPath.length > 1) && (last === '.' || last === '..') || last === '';

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' && (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && srcPath.join('/').substr(-1) !== '/') {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' || srcPath[0] && srcPath[0].charAt(0) === '/';

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' : srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || result.host && srcPath.length;

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function () {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

/***/ }),
/* 363 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = {
  isString: function isString(arg) {
    return typeof arg === 'string';
  },
  isObject: function isObject(arg) {
    return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
  },
  isNull: function isNull(arg) {
    return arg === null;
  },
  isNullOrUndefined: function isNullOrUndefined(arg) {
    return arg == null;
  }
};

/***/ }),
/* 364 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// The error overlay is inspired (and mostly copied) from Create React App (https://github.com/facebookincubator/create-react-app)
// They, in turn, got inspired by webpack-hot-middleware (https://github.com/glenjamin/webpack-hot-middleware).

var ansiHTML = __webpack_require__(144);
var Entities = __webpack_require__(350).AllHtmlEntities;

var entities = new Entities();

var colors = {
  reset: ['transparent', 'transparent'],
  black: '181818',
  red: 'E36049',
  green: 'B3CB74',
  yellow: 'FFD080',
  blue: '7CAFC2',
  magenta: '7FACCA',
  cyan: 'C3C2EF',
  lightgrey: 'EBE7E3',
  darkgrey: '6D7891'
};
ansiHTML.setColors(colors);

function createOverlayIframe(onIframeLoad) {
  var iframe = document.createElement('iframe');
  iframe.id = 'webpack-dev-server-client-overlay';
  iframe.src = 'about:blank';
  iframe.style.position = 'fixed';
  iframe.style.left = 0;
  iframe.style.top = 0;
  iframe.style.right = 0;
  iframe.style.bottom = 0;
  iframe.style.width = '100vw';
  iframe.style.height = '100vh';
  iframe.style.border = 'none';
  iframe.style.zIndex = 9999999999;
  iframe.onload = onIframeLoad;
  return iframe;
}

function addOverlayDivTo(iframe) {
  var div = iframe.contentDocument.createElement('div');
  div.id = 'webpack-dev-server-client-overlay-div';
  div.style.position = 'fixed';
  div.style.boxSizing = 'border-box';
  div.style.left = 0;
  div.style.top = 0;
  div.style.right = 0;
  div.style.bottom = 0;
  div.style.width = '100vw';
  div.style.height = '100vh';
  div.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
  div.style.color = '#E8E8E8';
  div.style.fontFamily = 'Menlo, Consolas, monospace';
  div.style.fontSize = 'large';
  div.style.padding = '2rem';
  div.style.lineHeight = '1.2';
  div.style.whiteSpace = 'pre-wrap';
  div.style.overflow = 'auto';
  iframe.contentDocument.body.appendChild(div);
  return div;
}

var overlayIframe = null;
var overlayDiv = null;
var lastOnOverlayDivReady = null;

function ensureOverlayDivExists(onOverlayDivReady) {
  if (overlayDiv) {
    // Everything is ready, call the callback right away.
    onOverlayDivReady(overlayDiv);
    return;
  }

  // Creating an iframe may be asynchronous so we'll schedule the callback.
  // In case of multiple calls, last callback wins.
  lastOnOverlayDivReady = onOverlayDivReady;

  if (overlayIframe) {
    // We're already creating it.
    return;
  }

  // Create iframe and, when it is ready, a div inside it.
  overlayIframe = createOverlayIframe(function () {
    overlayDiv = addOverlayDivTo(overlayIframe);
    // Now we can talk!
    lastOnOverlayDivReady(overlayDiv);
  });

  // Zalgo alert: onIframeLoad() will be called either synchronously
  // or asynchronously depending on the browser.
  // We delay adding it so `overlayIframe` is set when `onIframeLoad` fires.
  document.body.appendChild(overlayIframe);
}

function showMessageOverlay(message) {
  ensureOverlayDivExists(function (div) {
    // Make it look similar to our terminal.
    div.innerHTML = '<span style="color: #' + colors.red + '">Failed to compile.</span><br><br>' + ansiHTML(entities.encode(message));
  });
}

function destroyErrorOverlay() {
  if (!overlayDiv) {
    // It is not there in the first place.
    return;
  }

  // Clean up and reset internal state.
  document.body.removeChild(overlayIframe);
  overlayDiv = null;
  overlayIframe = null;
  lastOnOverlayDivReady = null;
}

// Successful compilation.
exports.clear = function handleSuccess() {
  destroyErrorOverlay();
};

// Compilation with errors (e.g. syntax error or missing modules).
exports.showMessage = function handleMessage(messages) {
  showMessageOverlay(messages[0]);
};

/***/ }),
/* 365 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var SockJS = __webpack_require__(359);

var retries = 0;
var sock = null;

var socket = function initSocket(url, handlers) {
  sock = new SockJS(url);

  sock.onopen = function onopen() {
    retries = 0;
  };

  sock.onclose = function onclose() {
    if (retries === 0) {
      handlers.close();
    }

    // Try to reconnect.
    sock = null;

    // After 10 retries stop trying, to prevent logspam.
    if (retries <= 10) {
      // Exponentially increase timeout to reconnect.
      // Respectfully copied from the package `got`.
      // eslint-disable-next-line no-mixed-operators, no-restricted-properties
      var retryInMs = 1000 * Math.pow(2, retries) + Math.random() * 100;
      retries += 1;

      setTimeout(function () {
        socket(url, handlers);
      }, retryInMs);
    }
  };

  sock.onmessage = function onmessage(e) {
    // This assumes that all data sent via the websocket is JSON.
    var msg = JSON.parse(e.data);
    if (handlers[msg.type]) {
      handlers[msg.type](msg.data);
    }
  };
};

module.exports = socket;

/***/ }),
/* 366 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function (updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function (moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});

	if (unacceptedModules.length > 0) {
		console.warn("[HMR] The following modules couldn't be hot updated: (They would need a full reload!)");
		unacceptedModules.forEach(function (moduleId) {
			console.warn("[HMR]  - " + moduleId);
		});
	}

	if (!renewedModules || renewedModules.length === 0) {
		console.log("[HMR] Nothing hot updated.");
	} else {
		console.log("[HMR] Updated modules:");
		renewedModules.forEach(function (moduleId) {
			console.log("[HMR]  - " + moduleId);
		});
		var numberIds = renewedModules.every(function (moduleId) {
			return typeof moduleId === "number";
		});
		if (numberIds) console.log("[HMR] Consider using the NamedModulesPlugin for module names.");
	}
};

/***/ }),
/* 367 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(132);
exports = module.exports = __webpack_require__(49)(false);
// imports


// module
exports.push([module.i, "@font-face {\n    font-family: 'Source Sans Pro';\n    src: url(" + escape(__webpack_require__(137)) + ");\n    src: url(" + escape(__webpack_require__(137)) + "?#iefix) format('embedded-opentype'),\n         url(" + escape(__webpack_require__(378)) + ") format('woff'),\n         url(" + escape(__webpack_require__(369)) + ") format('truetype');\n    font-weight: normal;\n    font-style: normal;\n}\n\n@font-face {\n    font-family: 'Source Sans Pro';\n    src: url(" + escape(__webpack_require__(136)) + ");\n    src: url(" + escape(__webpack_require__(136)) + "?#iefix) format('embedded-opentype'),\n         url(" + escape(__webpack_require__(377)) + ") format('woff'),\n         url(" + escape(__webpack_require__(368)) + ") format('truetype');\n    font-weight: normal;\n    font-style: italic;\n}\n\n@font-face {\n    font-family: 'Source Sans Pro';\n    src: url(" + escape(__webpack_require__(138)) + ");\n    src: url(" + escape(__webpack_require__(138)) + "?#iefix) format('embedded-opentype'),\n         url(" + escape(__webpack_require__(379)) + ") format('woff'),\n         url(" + escape(__webpack_require__(370)) + ") format('truetype');\n    font-weight: 600;\n    font-style: normal;\n}\n\n@font-face {\n    font-family: 'Source Sans Pro';\n    src: url(" + escape(__webpack_require__(139)) + ");\n    src: url(" + escape(__webpack_require__(139)) + "?#iefix) format('embedded-opentype'),\n         url(" + escape(__webpack_require__(380)) + ") format('woff'),\n         url(" + escape(__webpack_require__(371)) + ") format('truetype');\n    font-weight: 600;\n    font-style: italic;\n}", ""]);

// exports


/***/ }),
/* 368 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/source-sans-pro-italic.ttf";

/***/ }),
/* 369 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/source-sans-pro-regular.ttf";

/***/ }),
/* 370 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/source-sans-pro-semibold.ttf";

/***/ }),
/* 371 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/source-sans-pro-semibolditalic.ttf";

/***/ }),
/* 372 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/drupaleurope-darmstadt-2018.svg";

/***/ }),
/* 373 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(94);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(65)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(94, function() {
			var newContent = __webpack_require__(94);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 374 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(95);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(65)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(95, function() {
			var newContent = __webpack_require__(95);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 375 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(96);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(65)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(96, function() {
			var newContent = __webpack_require__(96);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 376 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(97);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(65)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(97, function() {
			var newContent = __webpack_require__(97);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 377 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/source-sans-pro-italic.woff";

/***/ }),
/* 378 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/source-sans-pro-regular.woff";

/***/ }),
/* 379 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/source-sans-pro-semibold.woff";

/***/ }),
/* 380 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/source-sans-pro-semibolditalic.woff";

/***/ }),
/* 381 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 381;

/***/ }),
/* 382 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(140);
__webpack_require__(142);
__webpack_require__(143);
module.exports = __webpack_require__(141);


/***/ })
/******/ ]);
//# sourceMappingURL=app.js.map