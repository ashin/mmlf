import { getYoutubeHaiku } from './lib';

const buildIFrame = videos => `
    <iframe class="video"
        type="text/html"
        width="560"
        height="315"
        src="https://www.youtube.com/embed/${videos[0]}?playlist=${videos.splice(1).join(',')}&version=3&&autoplay=1&rel=0"
        frameborder="0"
        allowfullscreen />
`;

getYoutubeHaiku().then(res => {
    const videoIds = res.map(i => i.id);
    document.getElementById('root').innerHTML = buildIFrame(videosIds);
});
