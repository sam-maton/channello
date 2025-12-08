import { Controller, Get, Param } from '@nestjs/common';
import { VideosService } from './videos.service';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get(':channelId')
  getVideos(@Param() params: { channelId: string }) {
    return this.videosService.getChannelVideos(params.channelId);
  }
}
