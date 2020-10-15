console.log(APIKEY);

$('#search-button').on('click', function() {
    let url = 'https://www.googleapis.com/youtube/v3/search?';    
    url += 'type=video';
    url += '&part=snippet';
    url += '&q=' + $('#query').val();
    url += '&videoEmbeddable=true';
    url += '&videoSyndicated=true';
    url += '&maxResults=6';
    url += '&key=' + APIKEY;
    
    console.log(url);

    $.ajax({
        url: url,
        dataType: 'jsonp'
    }).done(showVideos)
    .fail((data)=> {
        showMessage('通信に失敗しました');
    });    
    return false;
});

function showVideos(data){
    if(!data.items){
        showMessage('データを取得できませんでした');
        return;
    }
    let result = '';
    for(let item of data.items){
        let video = '<div class="video-wrapper"><div class="video"><iframe src="https://www.youtube.com/embed/';
        video += item.id.videoId;
        video += '" allowfullscreen></iframe></div></div>';
        result += video;
    }
    console.log(result);
    $('#videoList').html(result);
}

function showMessage(message) {
    const paragraph = '<p>' + message +'</p>';
    $('#videoList').html(paragraph);
}