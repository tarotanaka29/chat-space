$(function(){
  function buildHTML(message){
    var html =
	    `<div class="chat-main__body">
			  <div class="chat-main__body--messages-list">
			    <div class="chat-main__message clearfix" data-id="2096">
			      <div class="chat-main__message-name">
			        ${message.user_name}
			      </div>
			      <div class="chat-main__message-time">
			        ${message.created_at}
			      </div>
			      <div class="chat-main__message-body">
			        <p class="chat-main__message__content">
			          ${message.content}
			        </p>
			        <div class="chat-main__message__image">
			          ${message.img.url}
			        </div>
			      </div>
			    </div>
			  </div>
			</div>`
	  return html;
  }

//非同期通信
  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.messages').append(html);
      $('#message_content').val('');
      $('#mask__submit').prop("disabled", false);
      $('.messages').animate( {scrollTop: $('chat-main__body').offset().top}, 100 );
      $('#new_message')[0].reset();
    })
    .fail(function(){
      alert('エラーが発生しました');
    })
    .always(function(){
      $('.form__submit').prop('disabled', false);
    });

  //自動更新
    var interval = setInterval(function(){
    var messageId = $('.chat-main__body--messages-list').last().attr('data-id')
    var presentHTML = window.location.href
    if (presentHTML.match(/\/groups\/\d+\/messages/)){
      $.ajax({
      type: 'GET',
      url: presentHTML,
      data:{ id: messageId },
      dataType: 'json'
    })
  .done(function(json){
    var insertHTML = '';
    json.forEach(function(message){
      insertHTML += buildHTML(message);
    });
    $('.chat-main__message-body').append(insertHTML);
    $('.chat-main__message-body').animate( {'scrollTop': $('.chat-main__message-body')[0].scrollHeight}, 'fast' );
  })
  .fail(function(data){
    alert('自動更新に失敗しました');
  });
  } else {
    clearInterval(interval);
  }} , 5 * 1000 );
});
