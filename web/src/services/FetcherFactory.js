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

import axios from 'axios';

const defaultBaseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/';
const defaultVersion = 'v1';

export const ConfigSet = {
	DEFAULT_API: {
		baseURL: (process.env.REACT_APP_API_BASE_URL || defaultBaseURL),
		validateStatus(status) {
			return status >= 200 && status <= 500;
		},
	},
	RESOURCE_API: {
		baseURL: (process.env.REACT_APP_API_BASE_URL || defaultBaseURL)
			.concat(process.env.REACT_APP_API_VERSION || defaultVersion)
			.concat('/'),
		validateStatus(status) {
			return status >= 200 && status <= 500;
		}
		// withCredentials: true
	},
};

function FetcherFactory(config) {
	this.config = typeof config !== 'undefined' ? config : ConfigSet.DEFAULT_API;
}

FetcherFactory.prototype.getInstance = function() {
	return axios.create(this.config);
};

FetcherFactory.prototype.setConfig = function(config) {
	this.config = typeof config !== 'undefined' ? config : ConfigSet.DEFAULT_API;
};

export default FetcherFactory;
