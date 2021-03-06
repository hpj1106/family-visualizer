angular.module('app')
.controller('familyZoomChartCtrl', function( $scope, $http ) {

$http.get('./dist/html/familyZoomChart/testFamily.json').then(function( response ) {

var family = response.data;

var ascendancy = [];
var orderedAscendancy = [];
//turn ascendancy number into a number instead of a string.
family.forEach(function( person ) {
	if (person.hasOwnProperty('ascendancyNumber')) {
		person.ascendancyNumber = parseFloat(person.ascendancyNumber);
		ascendancy.push(person);
	}
});
//puts array in order by ascendancy number.
orderedAscendancy = _.sortBy(ascendancy, 'ascendancyNumber');
// splits up the descendancy number, and makes it into an array with 2 or 3 values depending on if there is an S or not.
	
function splitDescNum( ascendancyArray ) {

 	ascendancyArray.forEach( function( person ) {
		if (person.hasOwnProperty('descendancyNumber') && !Array.isArray(person.descendancyNumber)) {
			console.log(person.descendancyNumber, person);
			var splitOnDot = person.descendancyNumber.split("."); // Case: "10.01" becomes ["10", "01"]
			var splitOnDash = [];
			if (splitOnDot.length > 1) {	// Cases: ["10", "01"], ["10", "01-S"]		
				if (splitOnDot[1].indexOf("S") === -1) { //If no S
					splitOnDot[0] = parseInt(splitOnDot[0]); //change to integer
					// splitOnDot[1] = parseInt(splitOnDot[1]); //change to integer
					person.descendancyNumber = splitOnDot; //assign the value back to it's original key.
				} else {
					splitOnDash = splitOnDot[1].split("-"); //Cases: ["10", "01-3"] becomes 
					splitOnDot[0] = parseInt(splitOnDot[0]); //change both to integers
					splitOnDot[1] = splitOnDash[0]; //assign the numbers right of the . back to the main array.
					// splitOnDot[1] = parseInt(splitOnDash[0]); //change to integer	
					splitOnDot[2] = splitOnDash[1]; //assign the S back as the third value in the array.
					person.descendancyNumber = splitOnDot; //assign the value back to it's original key.				
				}
			} else {
				// Case: ['1-S']	
				splitOnDash = person.descendancyNumber.split("-");
				splitOnDash[0] = parseInt(splitOnDash[0]);
				person.descendancyNumber = splitOnDash; // assign the value back to it's original key.
			}
		}

		// if (person.hasOwnProperty('children')) {
		// 	splitDescNum( person.children )
		// }
	});

};

splitDescNum( orderedAscendancy );

	console.log("ordered Ascendancy", orderedAscendancy);


function buildData( checkPerson, rootPersonArray ) {
	// add person to familyObject
	// var singleFamily = [];
	var parent1;
	var rootPersonSpouse;
	var rootPerson;

	// check to see if we are dealing with a husband wife combo as the starting points of the array.
	if ( checkPerson.ascendancyNumber == 2 ) {
		rootPerson = _.find(family, ( husband ) => husband.ascendancyNumber === 3)
	} else {
		rootPerson = checkPerson;
	}
	// console.log("rootperson", rootPerson);

	// create parents array.
	rootPerson.parents = [];

	// loop through all the json data, find dad.
	var rootsDad = _.find(family, ( dad ) => rootPerson.descendancyNumber && rootPerson.descendancyNumber[0] === dad.ascendancyNumber)
	// Need to write a check to see if the the rootPerson's Decendancy Number is the same as the same person in the flattened array.  
	//  If it is, that means that person has no DAD!!!
	// loops through rootPersons children. Find their spouse, and children, and create their nuclear family.
	if (rootPerson.hasOwnProperty('children')) {
		// splitDescNum( rootPerson.children );
		rootPerson.children.forEach( function( child ) {
			// if (child.descendancyNumber.length === 2 && child.descendancyNumber.indexOf('S') > -1) {
			// if (child.descendancyNumber.indexOf('S') > -1) {
			// 	var splitDash = child.descendancyNumber.split('-');
			// 	if (splitDash[0].indexOf('.') === -1) {
			// 		rootPersonSpouse = _.find(family, ( spouse ) => spouse.personId === child.personId);
			// 		rootPersonSpouse.spouse = true;
			// 		rootPersonArray.push( rootPersonSpouse);
			// 	}
			// } else {
				rootPersonArray.push( child );
			// }
		});
	}

	// rootPersonArray.push( rootPerson );

	if (rootsDad) {
		rootsDad.spouse = true;
		rootPerson.parents.push( rootsDad );
		buildData( rootsDad, rootPerson.parents );
	}
	if (rootPersonSpouse) {
		buildData( rootPersonSpouse , rootPersonArray );
	}

}

	// var rootPerson;

	// // check to see if we are dealing with a husband wife combo as the starting points of the array.
	// if ( orderedAscendancy[0].ascendancyNumber === 2 ) {
	// 	console.log('first test', orderedAscendancy[0]);
	// 	rootPerson = _.find(family, ( husband ) => husband.ascendancyNumber === 3)
	// 	console.log('second test', rootPerson);
	// } else {
	// 	rootPerson = orderedAscendancy[0];
	// }

	var nestedFamily = {
		name: 'flare'
		, parents: [
			orderedAscendancy[0]
		]
	}

	// nestedFamily.parents[0].parents = [];

buildData(nestedFamily.parents[0], nestedFamily.parents);
console.log("nested Fam", nestedFamily);


//LORAINE IS LISTED WITH A DESCENDANCY NUMBER OF 6.01-S AND THIS IS MESSING EVERYTING UP!
//LORRAINE HAS NO FATHER! THIS IS WHY SHE HAS NO DESCENDANCY NUMBER CONNECTING HER WITH HER PARENTS!!
//I WILL HAVE TO WRITE CODE TO CHECK TO SEE IF THE DECSENDANCY NUMBER IS A SPOUSE AND THEN IF THE 
//DESCENDENCY NUMBER IS THE SAME AS THEIRS IN THE FLATTENED ARRAY, THE RECURSION NEEDS TO END,
//I NEED TO WRITE CODE TO CHECK TO SEE IF THE FIRST PERSON IN THE ORDERED ASCENDANCY LIST IS FEMALE
//AND IF SHE IS A WIFE, THEN I NEED to SWITCH ASCENDANCY NUMBER WIHT HER HUSBAND.









	// var peoplePushedAlready = [];
	// var arrayOfFamilies = [];
	
	// orderedAscendancy.forEach( function( person ) {
		
	// 	var family = [];
	// 	peoplePushedAlready.push(person.ascendancyNumber);
	// 	family.push( person );

	// 	orderedAscendancy.forEach( function( familyPerson ) {
	// 		if ( person.ascendancyNumber === familyPerson.descendancyNumber[0]) {
	// 			if (peoplePushedAlready.familyPerson.ascendancyNumber)
	// 			family.push( familyPerson );
	// 		}
	// 	})
	// })

	// var arrayOfFamilies = [];
	// //pushes all children into a "family" array, and then that array into an array of families.
	// orderedAscendancy.forEach(function( person ) {
	// 	var family = [];
	// 	if (person.hasOwnProperty('children')) {
	// 			person.children.forEach(function( child ) {
	// 				family.push(child);
	// 			})
	// 	}
	// 	family.push(person);
	// 	arrayOfFamilies.push(family);
	// })

	// // console.log( "ascendancy Nums", orderedAscNums );
	// console.log("Arry of Fams", arrayOfFamilies);
})


});