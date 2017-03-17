$(window).scrollTop(0);

var toc_links = document.getElementsByClassName('toc-link');
for (i in toc_links)
    toc_links[i].target = '_self';

var aTags = document.getElementsByTagName('a');   
for(i in aTags){
    if (aTags[i].target != '_self')
        aTags[i].target = '_blank';
}