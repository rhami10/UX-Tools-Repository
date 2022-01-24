// OK, I can't believe you actually came snooping around.
import { GetBookmarkText, GetBookmarkImageLink, HasParentClass } from './utilities.js';
import { url, params, hashedURL } from './globals.js';
import { getCookie, setCookie } from './cookieStorage.js';

var storedPasskey = getCookie('passkey');

if (storedPasskey == null) {
    do {
        var userInput = window.prompt("Passkey: ");
    } while (!GenerateCards(userInput))
}
else { GenerateCards (storedPasskey) };


// Attach Passkey to URL from Globals and hash the composite value.
function CheckCompositeURLHash (passkey) {
    if (passkey.length == (url.length - 1)) {
        
        var compositeURL = url[0];
        var passKeyChars = passkey.split('');

        for(let i = 0; i < passkey.length; i++) {
            compositeURL += passKeyChars[i];
            compositeURL += url[i+1];
        }

        return CryptoJS.SHA3(compositeURL) == hashedURL ?  { success: true, url: compositeURL } : { success: false }
    }

    return { success: false }
}

// If constructed hash of URL+Passkey matches values,  load in data
function GenerateCards (passKeyUserInput) {

    var checkHash = CheckCompositeURLHash(passKeyUserInput);
    
    if(checkHash.success) {

        // Setting Up Cookie
        setCookie('passkey', passKeyUserInput, 31);

        $('.wrapper').append('<div class="cards"></div>');

        var compositeURL = new URL(checkHash.url);

        Object.keys(params).forEach(key => compositeURL.searchParams.append(key, params[key]))

        fetch(compositeURL)
            .then(response => {
                return response.json();
            })
            .then(data => {

                data.subcategories.forEach(subcategory => {
                    $('.cards').append(
                        '<div class="card [ is-collapsed ]">'
                        + '<div class="card__inner [ js-expander ]">'
                        + '<div class="card__inner__iconcircle">'
                        + '<span class="circle"></span>'
                        + '<i class="' + subcategory.icon + '"></i>'
                        + '</div>'
                        + '<div class="card__inner__text">'
                        + '<span>' + subcategory.name + '</span>'
                        + '</div>'
                        + '</div>'
                        + '<div id="expander-' + subcategory.name + '" class="card__expander">'
                        + '</div>'
                        + '</div>'
                    )
                });

                data.bookmarks.forEach(bookmark => {

                    $('#expander-' + bookmark.subcategory).append(
                        '<div class="bookmark">'
                        + '<div class="bookmark__inner" style="background-image: url(' + GetBookmarkImageLink(bookmark) + ')">'
                        + GetBookmarkText(bookmark)
                        + '</div>'
                        + '</div>'
                    )
                });

                var $cell = $('.card');

                // Appending outer click event to close expanded elements
                $(document).on("click", "body", function (event) {

                    if($(event.target).hasClass('js-expander') || HasParentClass(event.target, 'js-expander')) {
                        console.log("expander element clicked");
                    }
                    else {
                        $('.is-expanded').removeClass('is-expanded').addClass('is-collapsed');
                        $cell.not($('is-expanded')).removeClass('is-inactive');
                    }
                });


                // Appending click event and expander elements for each card
                $cell.find('.js-expander').click(function () {

                    var $thisCell = $(this).closest('.card');

                    if ($thisCell.hasClass('is-collapsed')) {
                        $cell.not($thisCell).removeClass('is-expanded').addClass('is-collapsed').addClass('is-inactive');
                        $thisCell.removeClass('is-collapsed').addClass('is-expanded');
                    } else {
                        $thisCell.removeClass('is-expanded').addClass('is-collapsed');
                        $cell.not($thisCell).removeClass('is-inactive');
                    }
                });

            }).catch((error) => {
                $('.cards').append(
                    '<p style="margin: auto">An error has occured.</p>' +
                    '<p style="margin: auto">Message: '+ error +'</p>'
                )
            });
        
        return true;
    }

    else { return false; }
}