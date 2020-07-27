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

import { Controller, Post } from '@tsed/common';
import { Docs } from '@tsed/swagger';
import { EntityManager } from 'typeorm';

import { DatabaseService } from '../../services/DatabaseService';
import { MultipartFile } from '@tsed/multipartfiles';
import { ValidateRequest } from '../../decorators/ValidateRequestDecorator';

@Controller('/')
@Docs('api-v1')
export class FileController {
	private manager: EntityManager;

	constructor(private databaseService: DatabaseService) {}

	public $afterRoutesInit(): void {
		this.manager = this.databaseService.getManager();
	}

	@Post('/file')
	@ValidateRequest({
		file: 'image',
	})
	public uploadFile(@MultipartFile('image') file: Express.Multer.File): string {
		return 'File ' + file.originalname + ' has been uploaded successfully';
	}
}
