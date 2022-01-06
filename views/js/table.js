/*This project coding was developed during the server side programing lectures
*given by the lecturer Mikhail
*
*This script runs when the page is opened
*Creates the AJAX requests asking the ending point for the information
*Takes the information and injects it into the results 
*/

function draw_table()
{
	$("#results").empty();
	$.getJSONuncached = function (url) /*Uncached to get new results every time the page is ran*/
	{
		//To return the results of th AJAX requests
		return $.ajax(
		{
			url: url, //This is the ending pointing for the AJAX requests 
			type: 'GET', //This is the HTTP type
			cache: false, //No cache for the browser level
			success: function (html) //This function is called if the request is succesful
			//trowing in the HTML result got from the server
			{
				$("#results").append(html); //Injecting the HTML into the div created earlier
				select_row();
			}
		});
	};
	$.getJSONuncached("/get/html") //Sending the request for the HTML ending point
};

function select_row()
{
	$("#menuTable tbody tr[id]").click(function ()
	{
		$(".selected").removeClass("selected");
		$(this).addClass("selected");
		var section = $(this).prevAll("tr").children("td[colspan='3']").length - 1;
		var entree = $(this).attr("id") - 1;
		delete_row(section, entree);
	})
};

function delete_row(sec, ent)
{
	$("#delete").click(function ()
	{
		$.ajax(
		{
			url: "/post/delete",
			type: "POST",
			data:
			{
				section: sec,
				entree: ent
			},
			cache: false,
			success: setTimeout(draw_table, 1000)
		})
	})
};

$(document).ready(function ()
{
	draw_table();
});