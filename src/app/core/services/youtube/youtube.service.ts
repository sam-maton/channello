import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, forkJoin, Observable, delay, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment.local';
import type { YoutubeResponse, YoutubeVideo } from '../../types/youtube.types';

interface BasicCache {
  [key: string]: {
    date: number;
    data: Observable<YoutubeVideo[]>[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  //API String for channel searching
  // https://www.googleapis.com/youtube/v3/search?key=${this.API_KEY}&q=dog%20training&type=channel&part=snippet,id&maxResults=25

  private API_KEY = environment.youtubeApiKey;
  cache: BasicCache = {};

  constructor(private http: HttpClient) {}

  getChannelVideos(channelId: string): Observable<YoutubeVideo[]> {
    const apiString = `https://www.googleapis.com/youtube/v3/search?key=${this.API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=10&type=video&videoDuration=medium`;

    const results = this.http
      .get<YoutubeResponse>(apiString)
      .pipe(map((res) => res.items || []));

    return results;
  }

  getFeedVideos(channelIds: string[]): Observable<YoutubeVideo[]> {
    return of(null).pipe(
      delay(2000), // 2 second artificial delay before making API calls
      switchMap(() => {
        const calls = channelIds.map((id) => this.getChannelVideos(id));
        return forkJoin(calls).pipe(map((resultArrays) => resultArrays.flat()));
      }),
    );
  }

  checkCache(channelId: string): Observable<YoutubeVideo[]>[] | null {
    if (this.cache[channelId]) {
      const cached = this.cache[channelId];
      const now = Date.now();
      const twelveHours = 12 * 60 * 60 * 1000;
      if (now - cached.date < twelveHours) {
        return cached.data;
      }
    }
    return null;
  }
}
