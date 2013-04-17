/** Title: Barefoot
 * Barefoot makes code sharing between browser and server reality. Write your
 * application once and run it on both ends of the wire.
 *
 * It builds upon the popular Backbone.JS library and keeps its own additions as
 * unobtrusive as possible.
 *
 * Server side execution is accomplished by using Node.JS and Express.JS. Once
 * delivered to the users browser, no additional JavaScript libraries are
 * needed when configured properly.
 *
 * If you implement your views with care, your client side follows the
 * "Unobtrusive JavaScript" principle
 * (http://roca-style.org/#unobtrusive-javascript) completely.
 *
 * Author:
 * * Manuel Alabor, <manuel@alabor.me>
 *
 * Source on Github:
 * * https://github.com/swissmanu/barefoot
 *
 *
 * License:
 * Copyright (c) 2013 Manuel Alabor
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


var Backbone = require('backbone')
	, _ = require('underscore')
	, path = require('path')
	, mixins = loadMixins()
	, Router = require('./router')(mixins.RouterMixin)
	, View = require('./view')(mixins.ViewMixin)

/* start
 * Starts your application using the given router.
 *
 * Parameters:
 *     (<Barefoot.Router>) Router - A <Barefoot.Router> class. Make sure you do
 *                                  *not* pass an instance! (no "new Router()"
 *                                  etc.)
 *     (Object) startOptions - These object literal is passed to the final
 *                             Router.
 */
function start(Router, startOptions) {
	mixins.startup(Router, startOptions);
}

module.exports = {
	Router: Router
	, View: View
	, start: start
};


/* mergeObjectProperties
 * This function takes two objects and uses underscores extend function to
 * merge each object contained inside of them.
 *
 * > var A = { person: { name: 'Fritz' } };
 * > var B = { person: { surname: 'Fritzenson' }, city: 'Fritzhausen' };
 * > var merged = mergeObjectProperties(A, B);
 * > // { person: { name: 'Fritz', surname: 'Fritzenson' }, city: 'Fritzhausen'}
 *
 * Parameters:
 *     (Object) objectA
 *     (Object) objectB
 *
 * Returns:
 *     A merged object
 */
function mergeObjectProperties(objectA, objectB) {
	var keys = _.keys(objectA);

	_.each(keys, function(key) {
		if(_.has(objectA, key)) {
			_.extend(objectA[key], objectB[key]);
		} else {
			objectA[key] = objectB[key];
		}
	});

	return objectA;
}

/* loadMixins
 * Since Barefoot is runnable on server and client, this function returns 
 * environment specific code read from the "server", "client" and "shared"
 * folders.
 * 
 * If there is shared code available these it gets merged with the specific
 * ones.
 *
 * Returns:
 *     A mixin to give a Backbone object barefoot capabilities.
 */
function loadMixins() {
	var specific
		, shared = require('./shared');

	if(process.browser) {
		specific = require('./client');
	} else {
		specific = require('./server');
	}

	if(!_.isUndefined(shared) && !_.isUndefined(specific)) {
		specific = mergeObjectProperties(specific, shared);
	} else if(!_.isUndefined(shared) && _.isUndefined(specific)) {
		specific = shared;
	}

	return specific;
}