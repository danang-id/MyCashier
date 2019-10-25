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

import { Default, Property, Required, } from '@tsed/common';
import { Column, CreateDateColumn, Entity, PrimaryColumn, Unique, UpdateDateColumn } from 'typeorm';
import uuid from 'uuid';

@Entity()
@Unique(['_id'])
export class Product {

	@PrimaryColumn({ length: 36 })
	@Default(uuid.v1())
	_id: string = uuid.v1();

	@Column({ length: 255 })
	@Required()
	name: string;

	@Column({ length: 1024 })
	@Required()
	description: string;

	@Column({ length: 2014 })
	@Required()
	image: string;

	@Column()
	@Required()
	price: number;

	@Column({ length: 36 })
	@Required()
	category_id: string;

	@Column()
	@Required()
	@Default(100)
	stock: number = 100;

	@CreateDateColumn({ type: 'timestamp' })
	@Property()
	created_at: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	@Property()
	updated_at: Date;

}
