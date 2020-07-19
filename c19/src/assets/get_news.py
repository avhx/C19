from newsapi import NewsApiClient
import json

# Init
newsapi = NewsApiClient(api_key='a771bc0869344e9fab36301c8b5bba60')

# /v2/everything
everything = newsapi.get_everything(q='tennessee+covid+19',
                                          from_param='2020-07-01',
                                          sort_by='relevancy')

newsJSON = "news-everything.json"
with open(newsJSON, 'w', encoding='utf-8') as f:
  json.dump(everything, f, ensure_ascii=False, indent=4)

# /v2/top_headlines
top_headlines = newsapi.get_everything(q='covid+19',
                                       sort_by='relevancy')

newsJSON = "news-top-headlines.json"
with open(newsJSON, 'w', encoding='utf-8') as f:
  json.dump(top_headlines, f, ensure_ascii=False, indent=4)