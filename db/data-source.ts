import { DataSourceOptions } from 'typeorm';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: true,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/*.js'],
  migrationsTableName: 'migrations',
  migrationsRun: false,
};

const dataSource = new DataSource({
  ...dataSourceOptions,
  entities: ['src/**/*.entity.{ts,js}'],
  migrations: ['*.{ts,js}'],
});

export default dataSource;
