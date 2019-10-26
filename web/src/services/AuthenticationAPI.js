/**
 * This program was written and submitted for Bootcamp Arkademy
 * Batch 12 selection.
 *
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

import FetcherFactory, { ConfigSet } from './FetcherFactory';
import Fetcher from './Fetcher';

const fetcher = new Fetcher(new FetcherFactory(ConfigSet.DEFAULT_API));

export async function signIn(email_address, password) {
	return fetcher.post('sign-in', { email_address, password });
}

export async function register(given_name, maiden_name, email_address, password, password_confirmation) {
	return fetcher.post('register', {
		given_name,
		maiden_name,
		email_address,
		password,
		password_confirmation
	});
}

export async function activate(email_address, token) {
	return fetcher.post('activate', { email_address, token });
}

export async function forgetPassword(email_address) {
	return fetcher.post('forget-password', { email_address });
}

export async function recover(email_address, token, password, password_confirmation) {
	return fetcher.post('recover', {
		email_address,
		token,
		password,
		password_confirmation
	});
}
