import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, map } from 'rxjs';

@Injectable()
export class DataResponseInterceptor<T> implements NestInterceptor<
  T,
  { apiVersion: string; data: T }
> {
  constructor(private readonly configService: ConfigService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<{ apiVersion: string; data: T }> {
    return next.handle().pipe(
      map((data: T) => ({
        apiVersion: this.configService.getOrThrow<string>(
          'appConfig.apiVersion',
        ),
        data,
      })),
    );
  }
}
