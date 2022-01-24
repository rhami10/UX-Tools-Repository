// OK, I can't believe you actually came snooping around.

import { GetBookmarkText, GetBookmarkImageLink, HasParentClass } from './utilities.js';
import { url, params, hashedURL, defaultImage } from './globals.js';


// Remove Github history with commits related to URL

// Attach Passkey to URL from Globals


// Hash it
// Check it with hashedURL from Globals 
// If incorrect, do nothing

// If correct use constructed URL+Passkey and load in data
$('.wrapper').append('<div class="cards"></div>');

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

        // --------------------------------------------------------------

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

                // if ($cell.not($thisCell).hasClass('is-inactive')) {
                //     //do nothing
                // } else {
                //     $cell.not($thisCell).addClass('is-inactive');
                // }

            } else {
                $thisCell.removeClass('is-expanded').addClass('is-collapsed');
                $cell.not($thisCell).removeClass('is-inactive');
            }
        });

    }).catch((error) => {
        $('.cards').append(
            '<p style="margin: auto"> You are not authorised to view this information.</p>'
        )
    });

