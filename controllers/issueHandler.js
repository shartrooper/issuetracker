/*

	This is the 'handler' constructor
	to create and fetch issues


*/

function IssueHandler(){
	
	this.getTitle= function (title){
		return title;
	}
	
	this.getContent= function (content){
		return content;
	}
	
	this.getAuthor= function (author){
		return author;
	}
	
	this.getAssigned= function (assigned){
		return assigned || '';
	}
	
	this.getStatusText= function (content){
		return content || '';
	}
	
	this.dateFormat= function (curDate){
		return `${curDate.getFullYear()}-${curDate.getMonth()}-${curDate.getDate()}T${curDate.getHours()}:${curDate.getMinutes()}:${curDate.getSeconds()}.${curDate.getMilliseconds()}Z`;
	}
	
	this.changeStatus= open =>	!open;
	
	this.elemsToUpdate=  function (elems){
		let newElem={};
		for (const property in elems){
			if(property != '_id' && elems[property]) newElem[property]=elems[property];
		}
		return Object.keys(newElem).length? {...newElem, updated_on: new Date()}: 'No updated fields sent';
	}
}


module.exports = IssueHandler;