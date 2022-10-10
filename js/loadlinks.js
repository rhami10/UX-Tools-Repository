// OK, I can't believe you actually came snooping around.

import * as Utils from "./utilities.js";
import { url, params, hashedURL } from "./globals.js";
import { getCookie, setCookie } from "./cookieStorage.js";

var storedPasskey = getCookie("passkey");

if (storedPasskey == null) {
	do {
		var userInput = window.prompt("Passkey: ");
	} while (!GenerateCards(userInput));
} else {
	GenerateCards(storedPasskey);
}

// Attach Passkey to URL from Globals and hash the composite value.
function CheckCompositeURLHash(passkey) {
	if (passkey.length == url.length - 1) {
		var fileId = "";
		var passKeyChars = passkey.split("");

		for (let i = 0; i < passkey.length; i++) {
			fileId += passKeyChars[i];
			fileId += url[i + 1];
		}

		var compositeURL = url[0] + fileId;

		console.log(CryptoJS.SHA3(compositeURL) + "");
		console.log(hashedURL);

		return CryptoJS.SHA3(compositeURL) == hashedURL
			? { success: true, url: compositeURL, fileId: fileId }
			: { success: false };
	}

	return { success: false };
}

// If constructed hash of URL+Passkey matches values,  load in data
function GenerateCards(passKeyUserInput) {
	var checkHash = CheckCompositeURLHash(passKeyUserInput);

	if (checkHash.success) {
		// Setting Up Cookie
		if (getCookie("passkey") == null)
			setCookie("passkey", passKeyUserInput, 31);

		$(".wrapper").append('<div class="cards"></div>');

		import("/js/test/local_values.js")
			.then((data) => {
				console.log("[DEV] Using Local Test JSON.");
				LoadInCardsHTML(data.urlLocal);
			})
			.catch((error) => {
				// Fetching Live Version of Bookmarks
				console.log("[LIVE] Using online JSON.");
				var compositeURL = new URL(checkHash.url);
				Object.keys(params).forEach((key) =>
					compositeURL.searchParams.append(key, params[key])
				);

				LoadInCardsHTML(compositeURL);

				$(".extra-links").append(
					'<a class="extra-links_button" href="https://drive.google.com/file/d/' +
						checkHash.fileId +
						'" target="_blank">' +
						'<i class="fas fa-pen"></i>' +
						"<p>Edit JSON</p>" +
						"</a>"
				);
			});

		return true;
	} else {
		return false;
	}
}

function LoadInCardsHTML(jsonURL) {
	fetch(jsonURL)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			data.subcategories.forEach((subcategory) => {
				$(".cards").append(
					'<div class="card [ is-collapsed ]">' +
						'<div class="card__inner [ js-expander ]">' +
						'<div class="card__inner__iconcircle">' +
						'<span class="circle"></span>' +
						'<i class="' +
						subcategory.icon +
						'"></i>' +
						"</div>" +
						'<div class="card__inner__text">' +
						"<span>" +
						subcategory.name +
						"</span>" +
						"</div>" +
						"</div>" +
						'<div id="expander-' +
						Utils.CleanString(subcategory.name) +
						'" class="card__expander">' +
						'<div class="button-container"><button id="button-all-' +
						Utils.CleanString(subcategory.name) +
						'">Open All</button></div>' +
						"</div>" +
						"</div>"
				);

				document
					.getElementById(
						"button-all-" + Utils.CleanString(subcategory.name)
					)
					.addEventListener("click", () =>
						Utils.OpenAllLinks(data.bookmarks, subcategory.name)
					);
			});

			data.bookmarks.forEach((bookmark) => {
				$(
					"#expander-" + Utils.CleanString(bookmark.subcategory)
				).append(
					'<div class="bookmark">' +
						'<a href="' +
						bookmark.link +
						'" onclick="' +
						Utils.GetOnClickAlternates(bookmark) +
						'" target="_blank">' +
						'<div class="bookmark__inner" style="background-image: url(' +
						Utils.GetBookmarkImageLink(bookmark) +
						')">' +
						'<div class="overlay"><p>' +
						Utils.GetBookmarkText(bookmark) +
						"</p></div>" +
						"</div>" +
						"</a>" +
						"</div>"
				);
			});

			var $cell = $(".card");

			// Appending outer click event to close expanded elements
			$(document).on("click", "body", function (event) {
				if (
					!Utils.HasClassIncludeParents(event.target, "is-expanded")
				) {
					$(".is-expanded")
						.removeClass("is-expanded")
						.addClass("is-collapsed");
					$cell.not($("is-expanded")).removeClass("is-inactive");
				}
			});

			// Appending click event and expander elements for each card
			$cell.find(".js-expander").click(function () {
				var $thisCell = $(this).closest(".card");

				if ($thisCell.hasClass("is-collapsed")) {
					$cell
						.not($thisCell)
						.removeClass("is-expanded")
						.addClass("is-collapsed")
						.addClass("is-inactive");
					$thisCell
						.removeClass("is-collapsed")
						.addClass("is-expanded");
				} else {
					$thisCell
						.removeClass("is-expanded")
						.addClass("is-collapsed");
					$cell.not($thisCell).removeClass("is-inactive");
				}
			});
		})
		.catch((error) => {
			$(".cards").append(
				'<p style="margin: auto">An error has occured.</p>' +
					'<p style="margin: auto">Message: ' +
					error +
					"</p>"
			);
		});
}
