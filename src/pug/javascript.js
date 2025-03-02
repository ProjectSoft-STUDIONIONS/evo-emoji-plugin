!(function(){
	let emoji_block = document.querySelector('#tabGeneralEmoji');
	let table = document.querySelector('#tabGeneral table tbody') || document.querySelector('#tabGeneral table');
	if(table) {
		let tr = document.createElement('tr');
		let td = document.createElement('td');
		td.setAttribute('colspan', "2");
		tr.append(td);
		table.append(tr);
		td.append(emoji_block);
	}
}());
