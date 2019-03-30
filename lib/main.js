'use strict';

document.addEventListener('DOMContentLoaded', function () {

  //Close modals
  (document.querySelectorAll('.modal-close') || []).forEach(function ($close) {
    var $modal = $close.parentNode;
    $close.addEventListener('click', function () {
      $modal.classList.remove('is-active');
    });
  });

  //Open NDA modal
  (document.querySelectorAll('.item .nda-link') || []).forEach(function ($ndalink) {
    $ndalink.addEventListener('click', function () {
      var $ndaModal = document.querySelector('#nda-link-modal');
      $ndaModal.classList.add('is-active');
      setTimeout(function () {
        $ndaModal.classList.remove('is-active');
      }, 3000);
    });
  });

  var fmSettings = {
    feedURL: 'https://0x5csezvma.execute-api.ap-southeast-1.amazonaws.com/default/mediumproxy',
    element: 'fm-embed'
  };

  var request = new XMLHttpRequest();

  request.open('GET', fmSettings.feedURL, true);

  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      var data = JSON.parse(request.responseText);
      fmBuild(data);
    } else {
      console.error('An error occurred');
    }
  };

  function fmBuild(data) {
    var fmMediumUser = '@' + data.payload.user.username;
    var fmPosts = data.payload.references.Post;
    var fmPostKeys = Object.keys(fmPosts);
    var mediumProfileURL = 'https://medium.com/' + fmMediumUser + '/';
    var fmPostsCount = 4;

    var fmEmbed = document.getElementById(fmSettings.element);

    fmPostKeys.forEach(function (element, index) {
      var post = fmPosts[element];

      var itemWrapper = document.createElement('div');
      itemWrapper.className = 'item';
      var postTitle = post.title;
      var postSubTitle = post.content.subtitle;
      var postUniqueSlug = post.uniqueSlug;
      var postURL = mediumProfileURL + postUniqueSlug;

      var fmPostTitleHTML = '<div class="has-text-left title is-size-5">' + postTitle + '</div>';
      var fmPostSubTitleHTML = '<div class="has-text-left is-size-6 has-text-grey-dark"><div class="has-text-weight-normal">' + postSubTitle + '</div></div>';
      var fmPostReadMoreHTML = ' <div class="has-text-right"> <a aria-label="see-more" href="' + postURL + '" target="_blank" rel="noopener noreferrer"><span class="icon has-text-grey is-small"><i class="fas fa-ellipsis-h"></i></span></a></div>';

      itemWrapper.innerHTML = fmPostTitleHTML + fmPostSubTitleHTML + fmPostReadMoreHTML;

      if (index <= fmPostsCount) {
        fmEmbed.appendChild(itemWrapper);
      }
    });
  }

  request.onerror = function () {
    console.error('Connection error');
  };
  request.send();
});