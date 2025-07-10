import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

function getConfig(): DataSourceOptions {
  dotenv.config();

  const baseConfig: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_host.toString(),
    port: Number(process.env.DB_port),
    username: process.env.DB_username.toString(),
    password: process.env.DB_password.toString(),
    entities: ['dist/**/*.entity.{ts,js}'],
    migrations: ['dist/db/migrations/*.js'],
    migrationsRun: true,
    synchronize: true,
    extra: {
      max: 100,
    },
  };

  return {
    ...baseConfig,
    database: process.env.DB_database.toString(),
  };
}

export const dataSourceOptions: DataSourceOptions = getConfig();

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
