$('#search-button').on('click', function() {
    const KEY = 'AIzaSyB9K3_Z5CmKcyUzz0Rmp9UEbjqUewTprlw';
    let url = 'https://www.googleapis.com/youtube/v3/search?';
    
    url += 'type=video';
    url += '&part=snippet';
    url += '&q=' + $('#query').val();
    url += '&videoEmbeddable=true';
    url += '&videoSyndicated=true';
    url += '&maxResults=6';
    url += '&key=' + KEY;
    url += '&callback=MakeVideoList';
    
    console.log(url);
    
    return false;
});

function MakeVideoList(data){
    console.log(data);
}