import { Component, OnInit, Input, NgModule } from '@angular/core';

export interface NewsCard {
  "source": {
    "id": string
    "name": string
  },
  "author": string,
  "title": string,
  "description": string,
  "url": string,
  "urlToImage": string,
  "publishedAt": string,
  "content": string
}

@Component({
  selector: 'app-news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.scss'],
})

export class NewsCardComponent implements OnInit {
  @Input() news: NewsCard;

  constructor() {
  }

  ngOnInit() {
  }

}
