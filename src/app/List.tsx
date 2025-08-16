"use client";

import { useEffect, useState } from "react";
import { Tag, List as AntdList, Button } from "antd";

const newsIdsURL = "https://hacker-news.firebaseio.com/v0/jobstories.json";

type NewsItem = {
  by: string;
  id: number;
  score: number;
  time: number;
  title: string;
  type: string;
  url: string;
};

export const List = () => {
  const [news, setNews] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState(0);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);

  async function fetchNews(newsIds: number[]) {
    return await Promise.all(
      newsIds.map((id: number) => {
        return fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
          method: "GET",
          headers: {
            "Content-Type": "json",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            return data;
          });
      })
    );
  }

  const fetchMoreNews = () => {
    if (cursor < news.length) {
      fetchNews(news.slice(cursor, cursor + 6)).then((res: NewsItem[]) => {
        setNewsList((prev) => [...prev, ...res]);
      });
      setCursor((prev) => prev + 6);
    }
  };

  useEffect(() => {
    try {
      fetch(newsIdsURL, {
        method: "GET",
        headers: {
          "Content-Type": "json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("something is wrong");
          }
          return res.json();
        })
        .then((data) => {
          setNews(data);
        });
    } catch (error) {
      throw new Error("fetch news ids has an issue: " + error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMoreNews();
  }, [news]);

  if (loading) {
    return <div>Loading ...</div>;
  }

  return (
    <section>
      <AntdList
        itemLayout="vertical"
        size="large"
        dataSource={newsList}
        renderItem={(item: NewsItem) => (
          <AntdList.Item
            key={item.id}
            extra={
              <img
                width={100}
                alt="logo"
                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
              />
            }
          >
            <AntdList.Item.Meta
              title={
                <a target="_blank" href={item.url}>
                  {item.title}
                </a>
              }
            />
            <Tag color="red">{item.type}</Tag>
          </AntdList.Item>
        )}
      />
      {cursor < news.length && (
        <Button htmlType="button" type="primary" onClick={fetchMoreNews}>
          Load More
        </Button>
      )}
    </section>
  );
};
