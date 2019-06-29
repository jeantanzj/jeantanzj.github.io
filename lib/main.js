'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

document.addEventListener('DOMContentLoaded', function () {

  //Close modals
  (document.querySelectorAll('.modal-close') || []).forEach(function ($close) {
    var $modal = $close.parentNode;
    $close.addEventListener('click', function () {
      $modal.classList.remove('is-active');
    });
  });

  //Open NDA modal
  var modalSelectors = {
    '.nda-link': '#nda-link-modal',
    '.navio-modal': '#navio-modal',
    '.formsg-modal': '#formsg-modal',
    '.gogovsg-modal': '#gogovsg-modal',
    '.digitalmc-modal': '#digitalmc-modal',
    '.jarvis-modal': '#jarvis-modal',
    '.xiohoo-modal': '#xiohoo-modal'
  };
  Object.entries(modalSelectors).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        modalSelector = _ref2[0],
        modalId = _ref2[1];

    (document.querySelectorAll('.item ' + modalSelector) || []).forEach(function ($link) {
      $link.addEventListener('click', function () {
        var $selected = document.querySelector(modalId);
        $selected.classList.add('is-active');
        if (modalSelector === '.nda-link') {
          setTimeout(function () {
            $selected.classList.remove('is-active');
          }, 3000);
        }
      });
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
    fmEmbed.innerHTML = '';
    fmPostKeys.forEach(function (element, index) {
      var post = fmPosts[element];

      var itemWrapper = document.createElement('div');
      itemWrapper.className = 'item';
      var postTitle = post.title;
      var postSubTitle = post.content.subtitle;
      var postUniqueSlug = post.uniqueSlug;
      var postURL = mediumProfileURL + postUniqueSlug;

      var fmPostTitleHTML = '<div class="has-text-left title is-size-5">' + postTitle + '</div>';
      var fmPostSubTitleHTML = '<div class="has-text-left is-size-6"><div class="has-text-weight-normal">' + postSubTitle + '</div></div>';
      var fmPostReadMoreHTML = '<a aria-label="see-more" href="' + postURL + '" target="_blank" rel="noopener noreferrer"><span class="icon has-text-grey is-small is-pulled-right"><i class="fas fa-ellipsis-h"></i></span></a>';

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