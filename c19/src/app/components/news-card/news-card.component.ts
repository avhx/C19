import { Component, OnInit, Input, NgModule } from '@angular/core';

export class NewsCard {
  constructor(
  public source: {
    id: string,
    name: string
  },
  public author: string,
  public title: string,
  public description: string,
  public url: string,
  public urlToImage: string,
  public publishedAt: string,
  public content: string
  ) {}
}

@Component({
  selector: 'app-news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.scss'],
})

export class NewsCardComponent implements OnInit {
  @Input() news: NewsCard;

  constructor() { }

  ngOnInit() {
  }

}
