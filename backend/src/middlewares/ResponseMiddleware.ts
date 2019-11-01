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

import { isBoolean, isNumber, isObject, isStream, isString } from '@tsed/core';
import {
	IMiddleware,
	OverrideProvider, Req,
	Res,
	ResponseData,
	SendResponseMiddleware,
} from '@tsed/common';
import { sign } from 'jsonwebtoken';
import { PassportConfig } from '../config/passport.config';
import { ServerConfig } from '../config/server.config';

@OverrideProvider(SendResponseMiddleware)
export class ResponseMiddleware extends SendResponseMiddleware implements IMiddleware {

	public use(@ResponseData() data: any, @Res() response: Res) {

		let message, token;

		const cookieName = 'x-access-token';
		const cookieOptions = {
			secure: true,
			httpOnly: true,
			domain: `.${ (<any>response).requestHost || ServerConfig.productionURL }`,
			expires: new Date(Date.now() + 60 * 60 * 1000)
		};

		if (typeof (<any>response).user !== 'undefined') {
			token = sign((<any>response).user, PassportConfig.jwt.secret);
		}

		if (typeof data === 'undefined' || data === null) {
			return typeof token !== 'undefined'
				? response.cookie(cookieName, token, cookieOptions).json({
					success: true,
					code: 200,
					token,
					data
				})
				: response.json({
					success: true,
					code: 200,
					data
				});
		}

		if (isStream(data)) {
			data.pipe(response);
			return response;
		}

		if (isString(data.$rendered)) {
			return typeof token !== 'undefined'
				? response.cookie(cookieName, token, cookieOptions).send(data.$rendered)
				: response.send(data.$rendered);
		}

		if (isString(data.$message)) {
			const { $message, ...filtered } = data;
			message = $message;
			data = filtered;
		}

		if (isObject(data.$data)) {
			const { $data, ...original } = data;
			data = {
				...original,
				...$data
			};
		}

		if (isString(data)) {
			return typeof token !== 'undefined'
				? response.cookie(cookieName, token, cookieOptions).json({
					success: true,
					code: 200,
					token,
					message: data
				})
				: response.json({
					success: true,
					code: 200,
					message: data
				});
		}

		if (isBoolean(data) || isNumber(data)) {
			return typeof token !== 'undefined'
				? response.cookie(cookieName, token, cookieOptions).json({
					success: true,
					code: 200,
					token,
					message,
					data
				})
				: response.json({
					success: true,
					code: 200,
					message,
					data
				});
		}

		return typeof token !== 'undefined'
			? response.cookie(cookieName, token, cookieOptions).json({
				success: true,
				code: 200,
				token,
				message,
				data: this.converterService.serialize(data)
			})
			: response.json({
				success: true,
				code: 200,
				message,
				data: this.converterService.serialize(data)
			});
	}

}
