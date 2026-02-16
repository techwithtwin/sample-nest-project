import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  name: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  synchronize: process.env.DB_SYNC === 'true',
  autoLoadEntities: process.env.DB_AUTOLOAD === 'true',
}));
