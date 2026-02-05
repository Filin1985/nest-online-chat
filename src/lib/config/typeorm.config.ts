import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { Users } from 'src/modules/users/users.entity';

export default class TypeOrmConfig {
  static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
    const host = configService.get<string>('DB_HOST');
    const port = configService.get<number>('DB_PORT');
    const username = configService.get<string>('DB_USERNAME');
    const password = configService.get<string>('DB_PASSWORD');
    const database = configService.get<string>('DB_NAME');

    return {
      type: 'postgres',
      host: host,
      port: port,
      username: username,
      password: password,
      database: database,
      synchronize: true,
      logging: true,
      entities: [Users],
    };
  }
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) =>
    TypeOrmConfig.getOrmConfig(configService),
  inject: [ConfigService],
};
