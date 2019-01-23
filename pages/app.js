// import 'babel-polyfill'
import React, { Component } from 'react';
// import logo from './logo.svg';
import '../static/App.css';
// import '../static/css/bootstrap.min.css'
import { Pagination, Badge, Card } from 'react-bootstrap';
import axios from 'axios';
import Head from '../components/head'
// import { eventProxyTrigger, eventProxyOn } from './eventProxy.js';
// import { BrowserRouter as Router, Route } from "react-router-dom";

class NewsDiv extends Component {
  constructor(props) {
    super(props);
    this.playMovie = this.playMovie.bind(this);
    this.showImages = this.showImages.bind(this);
    this.state = {
      movieReady: false,
      mediaInfo: null
    }
  }

  componentDidMount() {
    // console.log('this.props.news:', this.props.news);
    // const mediaInfo = this.props.news.media_info;
    // if (mediaInfo !== '') {
    //   fetch('http://gae.piaoyu.org/get_page_info?weibo_id=' + this.props.news.weibo_id)
    //     .then(res => res.json())
    //     .then(data => {
    //       console.log(data);
    //       if (!(data.ok && data.ok === 'no')) {
    //         this.setState({
    //           movieReady: true
    //         });
    //         this.props.news.new_media_info = data;
    //       }
    //     })
    //     .catch(e => console.log(e))
    // }
  }

  playMovie() {
    const news = this.props.news;
    if (this.state.movieReady) {
      news.movieReady = true;
    }
    // eventProxyTrigger('play-movie', news);
  }

  showImages() {
    const news = this.props.news;
    // eventProxyTrigger('show-modal', JSON.parse(news.pics_json));
  }

  render() {
    const news = this.props.news;
    const date = new Date(news.created / 1000000);
    const localDateTimeString = date.toLocaleString();
    return (
      <>
        <Card style={{ width: '100%', marginBottom: '10px' }}>
          <Card.Body>
            <Card.Title><a target='_self' href={"/news/" + (parseInt(news.created) + 1000)}>{news.content.replace(/<.+?>/g, '').substring(0, 10) + '... ' + news.title}</a> <span style={{
              fontSize: '1rem',
              top: '-2px',
              position: 'relative'
            }}>
              <Badge variant="secondary">{localDateTimeString}</Badge>
            </span></Card.Title>
            <Card.Text dangerouslySetInnerHTML={
              { __html: news.content.replace(/href=(["|'])\//, 'target="_blank" href=$1https://m.weibo.cn/') }
            }>
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <a href={'https://m.weibo.cn/status/' + news.weibo_id} target="_blank" rel="nofollow">阅读原文</a>{'  '}
            {news.media_info !== '' ?
              <Badge pill variant={this.state.movieReady ? "info" : "warning"} style={{ position: 'relative', top: '-1px' }} onClick={this.playMovie}>Movie</Badge>
              : null}
            {news.pics_json !== '' ?
              <Badge pill variant="info" style={{ position: 'relative', top: '-1px' }} onClick={this.showImages}>Image</Badge>
              : null}
          </Card.Footer>
        </Card>
      </>
    );
  }
}

class App extends Component {
  static async getInitialProps({ req }) {
    console.log(req.params, req.query)
    // console.log('NewsList props:', this.props.location.search.substring(4));
    let created = req.params.created || 0;
    // this.props.location.search && (created = this.props.location.search.substring(4));
    if (parseInt(created) < 100000) {
      created = 0
    }
    let newsData = [];
    await axios.get('http://gae.piaoyu.org/get_news?offset=0&limit=10&weibo_id=0&created=' + created)
      .then(data => {
        newsData = data.data.data
      })
      .catch(e => {
        console.log(e)
      })
    return { newsData: newsData }
  }

  constructor(props) {
    super(props);
  }

  render() {
    const newsDivs = this.props.newsData.map((news, index) =>
      <NewsDiv key={news.weibo_id.toString() + index} news={news} />
    );
    const lastCreated = this.props.newsData[this.props.newsData.length - 1].created
    const thisNews = this.props.newsData[0]
    const headTitle = thisNews.content.replace(/<.+?>/g, '').substring(0, 30) + '...' + thisNews.title
    const headDesc = thisNews.content.replace(/<.+?>/g, '').substring(0, 100)
    // const newsDivs = <div>hello</div>
    return (
      <div className="App">
        <Head title={headTitle} description={headDesc} />
        <div style={{ margin: 'auto', maxWidth: '40rem' }}>
          <div style={{ marginBottom: '15px' }}>新闻</div>
          {newsDivs}
        </div>
        <div style={{ display: 'flex' }}>
          <Pagination style={{ margin: '0 auto 10px' }}>
            <Pagination.Item target="_self" href="/">首页</Pagination.Item>
            <Pagination.Item target="_self" href={'/news/' + lastCreated}>下一页</Pagination.Item>
          </Pagination>
        </div>
      </div>
    )
  }
}

export default App;