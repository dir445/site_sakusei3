console.log(APIKEY);

const maxQueryLength = 1000;

$(function() {
    showQueryLength(0);

    $('#query').on('keyup keydown keypress change',function() {
        const length = $(this).val().length;
        if(length > maxQueryLength) {
            $(this).val($(this).val().slice(0,maxQueryLength));
            showQueryLength(maxQueryLength);
            return;
        }
        showQueryLength(length);
    });    
    
    $('#search > input[type="submit"]').on('click', function(e) {
        e.preventDefault();
    
        let url = 'https://www.googleapis.com/youtube/v3/search?';    
        url += 'type=video';
        url += '&part=snippet';
        url += '&q=' + $('#query').val();
        url += '&videoEmbeddable=true';
        url += '&videoSyndicated=true';
        url += '&maxResults=6';
        url += '&key=' + APIKEY;
    
        $.ajax({
            url: url,
            dataType: 'jsonp'
        }).done(showVideos)
        .fail((data)=> {
            showMessage('通信に失敗しました');
        });    
        return false;
    });    
});

function showQueryLength(length) {
    $('#queryLength').text(length + '/' + maxQueryLength);
}

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