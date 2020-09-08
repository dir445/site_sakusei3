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
    
    console.log(url);

    $.ajax({
        url: url,
        dataType: 'jsonp'
    }).done(showVideos)
    .fail((data)=> {
        alert('通信に失敗しました');
    });    
    return false;
});

function showVideos(data){
    if(!data.items){
        alert('データを取得できませんでした');
        return;
    }
    let result = '';
    for(let item of data.items){
        let video = '<div class="video"><iframe src="https://www.youtube.com/embed/';
        video += item.id.videoId;
        video += '" allowfullscreen></iframe></div>';
        result += video;
    }
    console.log(result);
    $('#videoList').html(result);
}