import Promise from 'bluebird';
import axios from 'axios';
 
const fetchJsonSubreddit = (subreddit, count = 50) => axios.get(`https://www.reddit.com/r/${subreddit}/.json`, {
    params: {
        count
    }
});

const urlToYoutubeParser = (url) => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length == 11) ? match[2] : false;
};
const toRedditDataStructure = item => ({
    domain: item.domain,
    url: item.url,
    title: item.title,
    id: urlToYoutubeParser(item.url)
});
const getRedditItemsFromResponse = res => res.data.data.children
    .map(item => item.data)
    .map(toRedditDataStructure);
const outputTo = fileName => data => fs.writeFile(fileName, JSON.stringify(data));
const isHaiku = i => i.title.toLowerCase().indexOf('[haiku]') > -1;

export const getYoutubeHaiku = () => fetchJsonSubreddit('youtubehaiku')
    .then(getRedditItemsFromResponse)
    .then(item => item.filter(isHaiku))