//var config = require("config");
function check(form)/*function to check userid & password*/
{
	/*the following code checkes whether the entered userid and password are matching*/
	if(form.userid.value == "admin" && form.pswrd.value == "eduka123")
	{
		window.open('index1.html');/*opens the target page while Id & password matches*/
	}
	else
	{
		alert('Error Password or Username');/*displays error message*/
	}
}