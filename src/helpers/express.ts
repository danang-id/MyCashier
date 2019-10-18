/**
 * Copyright 2019, Danang Galuh Tegar Prasetyo.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import morgan from "morgan";
import isString from "lodash.isstring";
import { Application, NextFunction, Request, RequestHandler, Response } from "express-serve-static-core";
import { ILogger } from "../interfaces/ILogger";
import { IRouter } from "../interfaces/IRouter";

export function promisify(handler: RequestHandler) {
	return function(...args: any[]) {
		const next = args[args.length - 1];
		return Promise.resolve((<Function>handler)(...args)).catch(next);
	};
}

function validateAuthentication(request: Request, response: Response, next: NextFunction) {
	if (!(<any>request).user) {
		throwError("You are not authorised to access this resource.", 401);
	}
	next();
}

function addRoute(
	app: Application,
	method: string,
	route: string,
	isProtectedRoute: boolean,
	isAsyncHandler: boolean,
	handler: RequestHandler
) {
	const _handler = isAsyncHandler ? promisify(handler) : handler;
	isProtectedRoute ? (<any>app)[method](route, validateAuthentication, _handler) : (<any>app)[method](route, _handler);
}

export function createRouter(app: Application): IRouter {
	return {
		get(route: string, isProtectedRoute: boolean = false) {
			return {
				handle(handler: RequestHandler, isAsyncHandler: boolean = true) {
					addRoute(app, HTTP_METHOD.GET, route, isProtectedRoute, isAsyncHandler, handler);
				},
			};
		},
		post(route: string, isProtectedRoute: boolean = false) {
			return {
				handle(handler: RequestHandler, isAsyncHandler: boolean = true) {
					addRoute(app, HTTP_METHOD.POST, route, isProtectedRoute, isAsyncHandler, handler);
				},
			};
		},
		put(route: string, isProtectedRoute: boolean = false) {
			return {
				handle(handler: RequestHandler, isAsyncHandler: boolean = true) {
					addRoute(app, HTTP_METHOD.PUT, route, isProtectedRoute, isAsyncHandler, handler);
				},
			};
		},
		patch(route: string, isProtectedRoute: boolean = false) {
			return {
				handle(handler: RequestHandler, isAsyncHandler: boolean = true) {
					addRoute(app, HTTP_METHOD.PATCH, route, isProtectedRoute, isAsyncHandler, handler);
				},
			};
		},
		delete(route: string, isProtectedRoute: boolean = false) {
			return {
				handle(handler: RequestHandler, isAsyncHandler: boolean = true) {
					addRoute(app, HTTP_METHOD.DELETE, route, isProtectedRoute, isAsyncHandler, handler);
				},
			};
		},
	};
}

export function notFound(request: Request, response: Response, next: NextFunction) {
	const error = new Error();
	(<any>error).code = 404;
	next(error);
}

export function createErrorHandler(logger: ILogger) {
	logger.i("Added customised error handler middleware.");
	return function(error: Error, request: Request, response: Response) {
		(<any>error).code = (<any>error).code || 500;
		if (!error.message || error.message === "") {
			if ((<any>error).code === 404) {
				error.message = "Resource you're looking for at " + request.originalUrl + " is not found.";
			}
			if ((<any>error).code === 500) {
				error.message = "Internal server error.";
			}
		}
		if ((<any>error).code === 500) {
			logger.d(error.message, error, true);
		} else {
			logger.d(error.message);
		}
		response.status((<any>error).code).json({
			success: false,
			code: (<any>error).code,
			message: error.message,
			data: (<any>error).data,
		});
	};
}

export function showLog(logger: ILogger) {
	return morgan(
		':req[x-forwarded-for] - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
		{
			stream: {
				write: (message: string) => {
					logger.i(message.substring(0, message.lastIndexOf("\n")));
				},
			},
		}
	);
}

export function validateRequest(request: Request, requirements: RequestRequirements) {
	try {
		for (const requestElement in requirements) {
			if (requirements.hasOwnProperty(requestElement)) {
				const fields = (<any>requirements)[requestElement];
				for (const field of fields) {
					if (!(<any>request)[requestElement][field]) {
						throwError('Parameter "' + field + '" is required.', 400);
					}
				}
			}
		}
	} catch (error) {
		throw error;
	}
}

export function throwError(message: string, code: number) {
	const error = new Error(message);
	(<any>error).code = code;
	throw error;
}

export function sendSuccessResponse(response: Response, ...args: any[]) {
	const obj: {
		success: boolean
		code: number
		message?: string
		data?: any
	} = { success: true, code: 200 };
	for (const arg of args) {
		if (isString(arg)) {
			obj.message = arg;
		} else {
			obj.data = !!obj.data ? obj.data : arg;
		}
	}
	response.json(obj);
}

export enum HTTP_METHOD {
	GET = "get",
	POST = "post",
	PUT = "put",
	PATCH = "patch",
	DELETE = "delete",
}

export type RequestRequirements = {
	body?: string[];
	query?: string[];
};
