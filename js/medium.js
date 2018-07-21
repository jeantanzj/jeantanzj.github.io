/* 
* Original code from FeedMirror
* I set up my own medium proxy on lambda, and adapted this script.
*/
var feedMirror = {
  initialize: function(fmSettings) {
    var request = new XMLHttpRequest();
    
    request.open('GET', fmSettings.feedURL, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
          var data = JSON.parse(request.responseText)
          fmBuild(data);
      } else {
        console.error('An error occurred')
      }
    };

    function fmBuild(data) {
        var fmMediumUser = '@' + data.payload.user.username;
        var fmPosts = data.payload.references.Post;
        var fmPostKeys = Object.keys(fmPosts);
        var mediumProfileURL = 'https://medium.com/' + fmMediumUser + '/';
        var fmPostsCount = 4;
        var fmLinkOutText = 'Read all articles';
        var fmTarget = '_parent';
        if(fmSettings.openNewTab == true) {
          fmTarget = '_blank';
        }

        if(fmSettings.linkOutText != undefined) {
          fmLinkOutText = fmSettings.linkOutText;
        }

        if (fmSettings.linkToMediumProfileText != undefined) {
          fmLinkToMediumProfileText = fmSettings.linkToMediumProfileText;
        }

        if(fmSettings.postsCount - 1 < 4) {
          fmPostsCount = fmSettings.postsCount - 1
        }

        var fmEmbed = document.getElementById(fmSettings.element);

        var fmLinkOut = document.createElement('div');
        fmLinkOut.className = 'fm-medium-profile';
        fmLinkOut.innerHTML = '<a href="' + mediumProfileURL + '" target="'+fmTarget+'" class="fm-medium-profile button">' + fmLinkToMediumProfileText+'</a>';

        fmPostKeys.forEach(function(element, index){
          var post = fmPosts[element];
          var postVirtuals = post.virtuals;

          var itemWrapper = document.createElement('div');
          itemWrapper.className = 'fm-post-wrapper';
          var item = document.createElement('div');
          var postTitle = post.title;
          var postSubTitle = post.content.subtitle;
          var postUniqueSlug = post.uniqueSlug;
          var postURL = mediumProfileURL + postUniqueSlug;
          
          var fmPostTitleHTML = '<h4 class="fm-post-title"><a href="'+postURL+'" target="'+fmTarget+'">'+postTitle+'</a></h4>';
          var fmPostSubTitleHTML = '<p class="fm-post-sub-title">'+postSubTitle+'</p>';
          var fmPostReadMoreHTML = '<a class="fm-post-read-more" target="'+fmTarget+'" href="' + postURL + '">' + fmLinkOutText +'</a>';

          item.innerHTML =  '<div class="fm-post">' + fmPostTitleHTML + fmPostSubTitleHTML + fmPostReadMoreHTML + '</div>';

          if(index <= fmPostsCount) {
            itemWrapper.appendChild(item);
            fmEmbed.appendChild(itemWrapper);
            fmEmbed.appendChild(fmLinkOut);
          }

        })
      

    }

    request.onerror = function() {
      console.error('Connection error')
    };
    request.send();
  }
}

var fmSettings = {
  feedURL: 'https://0x5csezvma.execute-api.ap-southeast-1.amazonaws.com/default/mediumproxy',
  linkOutText: 'Read more at medium.com >',
  linkToMediumProfileText: '',
  element: 'fm-embed',
  openNewTab: true,
};

feedMirror.initialize(fmSettings);