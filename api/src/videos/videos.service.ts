import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VideosService {
  private readonly apiKey: string | undefined;
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('YOUTUBE_API_KEY');
  }

  getFeedVideos() {
    if (!this.apiKey) {
      throw new Error('YOUTUBE_API_KEY is not defined');
    }

    return this.httpService.get('https://jsonplaceholder.typicode.com/todos/1');
  }
}
