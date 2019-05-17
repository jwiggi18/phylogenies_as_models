
function getPopular() {
  var xmlhttp = new XMLHttpRequest();
  var taxa = "";
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var myObj = JSON.parse(this.responseText);
      var res = (myObj.result[0]).popular_species;
      var i = 0;
      var popular_species = [];
      for (i=0; i<res.length; i++){
          popular_species.push((res[i]).name);
      }
    //  document.getElementById("tree").innerHTML = species_name;
      var taxa = encodeURI(popular_species);
      taxa = taxa.replace(/,/g,"|" );
      getTree(taxa, "#tree_display");
    }
  }
  xmlhttp.open("GET", "https://phylo.cs.nmsu.edu/phylotastic_ws/ts/oz/popular_species?taxon=" + document.getElementById("group").value + "&num_species=20", true);
  xmlhttp.send();
}

// getOZPopular - pulls directly from the OneZoom API this allows for the use of ottids and the use of ranked popularity rather than raw
function getOZPopular() {
  var xmlhttpOZ = new XMLHttpRequest();
  var taxa = "";
  xmlhttpOZ.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var myObj = JSON.parse(this.responseText);
      var data = (myObj.data)
      var i = 0
      var popular_species = [];
      for (i=0; i<data.length; i++){
        popular_species.push((data[i])[3]);
      }
      var taxa = encodeURI(popular_species);
      taxa = taxa.replace(/,/g,"|" );
      getCommonTree(taxa, "#tree_display");
    //  getTree(taxa, "#tree_display");
    //invoke_service(taxa, "#tree_display");

    }
  }
  //group value must be ottids not names to use this fn
  xmlhttpOZ.open("GET", "https://beta.onezoom.org/popularity/list?expand_taxa=1&key=0&max=20&names=1&sort=rank&otts=" + document.getElementById("group").value, true);
  xmlhttpOZ.send();
}


function getTree(taxa, where) {
  document.getElementById("loading").innerHTML = "Now fetching tree";
  var xmlhttpTree = new XMLHttpRequest();
  xmlhttpTree.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("loading").innerHTML = "";
      var myObj = JSON.parse(this.responseText);
      //document.getElementById("newick").innerHTML = myObj.newick;
      var tree = d3.layout.phylotree()
        // create a tree layout object
        .svg(d3.select(where));
      // render to this SVG element
      tree(myObj.newick)
        // parse the Newick into a d3 hierarchy object with additional fields
        .layout();
      tree.size([200,400]);
      // layout and render the tree
      // for syntax highlighting
      hljs.initHighlightingOnLoad();
    }
  };
  xmlhttpTree.open("GET", "https://phylo.cs.nmsu.edu/phylotastic_ws/gt/ot/get_tree?ottid=false&taxa=" + taxa, true);
  xmlhttpTree.send();
}

// Modifying script sent by Abu Saleh Md Tayeen
function getCommonTree(taxa, where){
  document.getElementById("loading").innerHTML = "Now fetching tree";
  taxa = taxa.replace(/%20/g," ");
  taxa = taxa.split("|");
//  alert(taxa);

//  var lst = ["Panthera pardus", "Taxidea taxus","Lutra lutra","Canis lupus","Mustela altaica"];
  var xhr = new XMLHttpRequest(); xhr.open('POST', 'https://phylo.cs.nmsu.edu/phylotastic_ws/cp/gt/tree', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function() {
    if (xhr.status === 200) {
      var resp = JSON.parse(xhr.responseText);
      //alert(resp.newick);
      document.getElementById("loading").innerHTML = "";
    //  var myObj = JSON.parse(this.responseText);
      //document.getElementById("newick").innerHTML = myObj.newick;
      var tree = d3.layout.phylotree()
        // create a tree layout object
        .svg(d3.select(where))
        // render to this SVG element
      //.radial(true)
        .options({
          'left-right-spacing': 'fit-to-size',
          'top-bottom-spacing': 'fit-to-size',
        })
        .size([700, 900])
        .font_size([45]);

      var newick = resp.newick;

      tree(d3.layout.newick_parser(newick.replace(/_/g,"--->").replace(/ /g,"_")))
        // parse the Newick into a d3 hierarchy object with additional fields
        .layout();
      // layout and render the tree
      // for syntax highlighting
      hljs.initHighlightingOnLoad();

    //$("#layout").on("click", function(e) {
    //  tree.radial($(this).prop("unchecked")).placenodes().update();
  //});
  };
};
  xhr.send(JSON.stringify({ "list": taxa, "list_type": 'scientific' }));
}

// Function to call a newick string with common names rather than scientific
function getCommonTreeLessOld(taxa, where) {
  document.getElementById("loading").innerHTML = "Now fetching tree";
  var commonTree = new XMLHttpRequest();
  commonTree.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("loading").innerHTML = "";
      console.log(JSON.stringify(this.responseText)) ;
      var myObj = JSON.parse(this.responseText);
      //document.getElementById("newick").innerHTML = myObj.newick;
      var tree = d3.layout.phylotree()
        // create a tree layout object
        .svg(d3.select(where));
      // render to this SVG element
      tree(myObj.newick)
        // parse the Newick into a d3 hierarchy object with additional fields
        .layout();
      tree.size([200,400]);
      // layout and render the tree
      // for syntax highlighting
      hljs.initHighlightingOnLoad();
    }
  };
// Using example from https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe
// Which uses https://cors-anywhere.herokuapp.com to get around the cross domain issue
  commonTree.open("POST", 'https://phylo.cs.nmsu.edu/phylotastic_ws/cp/gt/tree', true);
  commonTree.setRequestHeader('Content-Type', 'application/json');
  commonTree.onload = function() {
    if (commonTree.status === 200) {
      var resp = JSON.parse(commonTree.responseText);
      alert(resp.newick);
    }
  };
  commonTree.send(JSON.stringify({ "list": taxa, "list_type": 'scientific' }));
}




// Function to call a newick string with common names rather than scientific
function getCommonTreeOld(taxa, where) {
  document.getElementById("loading").innerHTML = "Now fetching tree";
  var commonTree = $.post("https://phylo.cs.nmsu.edu/phylotastic_ws/cp/gt/tree",
  {list: taxa, list_type: "scientific"},
  commonTree.onreadystatechange = function() {
    alert("success")
      document.getElementById("loading").innerHTML = "";
      var myObj = JSON.parse(this.responseText);
      //document.getElementById("newick").innerHTML = myObj.newick;
      var tree = d3.layout.phylotree()
        // create a tree layout object
        .svg(d3.select(where));
      // render to this SVG element
      tree(myObj.newick)
        // parse the Newick into a d3 hierarchy object with additional fields
        .layout();
      tree.size([200,400]);
      // layout and render the tree
      // for syntax highlighting
      hljs.initHighlightingOnLoad();
    }
  );
}

// code for generateQuiz from: https://simplestepscode.com/javascript-quiz-tutorial/
function generateQuiz(questions, quizContainer, resultsContainer, submitButton){

    var quizContainer = document.getElementById('quiz');
    var resultsContainer = document.getElementById('results');
    var submitButton = document.getElementById('submit');

    function showQuestions(questions, quizContainer){
    	// we'll need a place to store the output and the answer choices
    	var output = [];
    	var answers;

    	// for each question...
    	for(var i=0; i<questions.length; i++){

    		// first reset the list of answers
    		answers = [];

    		// for each available answer to this question...
    		for(letter in questions[i].answers){

    			// ...add an html radio button
    			answers.push(
    				'<label>'
    					+ '<input type="radio" name="question'+i+'" value="'+letter+'">'
    					+ letter + ': '
    					+ questions[i].answers[letter]
    				+ '</label>'
    			);
    		}

    		// add this question and its answers to the output
    		output.push(
    			'<div class="question">' + questions[i].question + '</div>'
    			+ '<div class="answers">' + answers.join('') + '</div>'
    		);
    	}

    	// finally combine our output list into one string of html and put it on the page
    	quizContainer.innerHTML = output.join('');
    }
    // end showQuestions function

    showQuestions(questions, quizContainer);

    function showResults(questions, quizContainer, resultsContainer){

    	// gather answer containers from our quiz
    	var answerContainers = quizContainer.querySelectorAll('.answers');

    	// keep track of user's answers
    	var userAnswer = '';
    	var numCorrect = 0;

    	// for each question...
    	for(var i=0; i<questions.length; i++){

    		// find selected answer
    		userAnswer = (answerContainers[i].querySelector('input[name=question'+i+']:checked')||{}).value;

    		// if answer is correct
    		if(userAnswer===questions[i].correctAnswer){
    			// add to the number of correct answers
    			numCorrect++;

    			// color the answers green
    			answerContainers[i].style.color = 'lightgreen';
    		}
    		// if answer is wrong or blank
    		else{
    			// color the answers red
    			answerContainers[i].style.color = 'red';
    		}
    	}

    	// show number of correct answers out of total
    	resultsContainer.innerHTML = numCorrect + ' out of ' + questions.length;
    }
    // end showResults function

    // show the questions
    showQuestions(questions, quizContainer);

    //on submit, show results
    submitButton.onclick = function() {
      showResults(questions, quizContainer, resultsContainer);
    }


}


function taxonQuiz () {
  var group = document.getElementById("group").value;
  var mammals = [
      {
        question:"Pan paniscus (Bonobo) is more closely related to",
        answers: {
                  a: 'Homo sapiens (Human)',
                  b: 'Gorilla gorilla (Western gorilla)'
              },
              correctAnswer: 'a'
      },
      {
        question: "Ursus maritimus (Polar bear) is more closely related to",
        answers: {
                 a: 'Balaenoptera musculus (Blue whale)',
                 b: 'Acinonyx jubatus (Cheetah)'
               },
               correctAnswer: 'b'
      },
      {
        question: 'Canis lupus (Gray wolf) shares a more recent common ancestor with',
        answers: {
                  a: 'Orcinus orca (Grampus)',
                  b: 'Felis catus (Domestic cat)'
                },
                correctAnswer: 'b'
      }
  ];
  var amphibians = [
      {
        question:"Alytes cisternasii is more closely related to",
        answers: {
                  a: 'Latonia nigriventer',
                  b: 'Barbourula busuangensis'
              },
              correctAnswer: 'a'
      },
      {
        question: "Ascaphus montanus (Rocky mountain tailed frog) is more closely related to",
        answers: {
                 a: 'Leiopelma hochstetteri (Hochstetters frog)',
                 b: 'Alytes cisternasii'
               },
               correctAnswer: 'a'
      },
      {
        question: 'Is it possible to tell from this tree if Hymenochirus boettgeri (Zaire dwarf clawed frog) is more closely related to Hymenochirus curtipes (Western dwarf clawed frog) or Hymenochirus boulengeri (Eastern dwarf clawed frog)',
        answers: {
                  a: 'yes',
                  b: 'no'
                },
                correctAnswer: 'b'
      }
  ];
  var squamates = [
      {
        question:"Bradypodion pumilum (Cape dwarf chameleon) is more closely related to",
        answers: {
                  a: 'Bradypodion damaranum (Knysna dwarf chameleon)',
                  b: 'Bradypodion ngomeense (Ngome dwarf chameleon)'
              },
              correctAnswer: 'a'
      },
      {
        question: "Is it possible to tell from this tree if Palleon nasus (Elongate leave chameleon) is more closely related to Brookesia lambertoni (Fito leave chameleon) or Palleon lolontany",
        answers: {
                 a: 'yes',
                 b: 'no'
               },
               correctAnswer: 'a'
      },
      {
        question: 'Archaius tigris is more closely related to',
        answers: {
                  a: 'Varanus komodoensis (Komodo dragon)',
                  b: 'Brookesia ramanantsoai'
                },
                correctAnswer: 'b'
      }
  ];
  var echinoderms = [
      {
        question:"Is it possible to tell from this tree if Pythonaster atlantidis is more closely related to Pythonaster murrayi or Pythonaster pacificus?",
        answers: {
                  a: 'yes',
                  b: 'no'
              },
              correctAnswer: 'b'
      },
      {
        question: "Acanthaster planci (Crown of thorns) is more closely related to",
        answers: {
                 a: 'Sclerasterias mollis',
                 b: 'Myxaster perrieri'
               },
               correctAnswer: 'a'
      },
      {
        question: 'Sclerasterias mollis shares a more recent common ancestor with',
        answers: {
                  a: 'Orthasterias koehleri (Orthasterias)',
                  b: 'Sclerasterias mazophora'
                },
                correctAnswer: 'b'
      }
  ];
  var birds = [
      {
        question:"Struthio camelus (Ostrich) shares a more recent common ancestor with",
        answers: {
                  a: 'Dromaius novaehollandiae (Emu)',
                  b: 'Eutoxeres aquila (White tipped sicklebill)'
              },
              correctAnswer: 'a'
      },
      {
        question: "Ninox theomacha (Jungle boobook) is more closely related to",
        answers: {
                 a: 'Xenoglaux loweryi (Long-whiskered owlet)',
                 b: 'Strigops habroptilus'
               },
               correctAnswer: 'a'
      },
      {
        question: 'Nestor meridionalis (New Zealand kaka) shares a more recent common ancestor with',
        answers: {
                  a: 'Nymphicus hollandicus (Cockatiel)',
                  b: 'Strigops habroptilus'
                },
                correctAnswer: 'b'
      }
  ];
  var mollusks = [
      {
        question:"Hapalochlaena fasciata (Blue-lined octopus) is more closely related to",
        answers: {
                  a: 'Hapalochlaena maculosa (Lesser blue-ringed octopus)',
                  b: 'Octopus tetricus (Gloomy octopus)'
              },
              correctAnswer: 'a'
      },
      {
        question: "Argonauta nodosa (Knobby argonaut) is more closely related to",
        answers: {
                 a: 'Octopus briareus (Caribbean reef octopus)',
                 b: 'Argonauta nouryi (Nourys argonaut)'
               },
               correctAnswer: 'b'
      },
      {
        question: 'Octopus vulgaris (Common octopus) shares a more recent common ancestor with',
        answers: {
                  a: 'Enteroctopus dofleini (Giant pacific octopus)',
                  b: 'Octopus bimaculoides (California two-spot octopus)'
                },
                correctAnswer: 'b'
      }
  ];

  var insects = [
      {
        question:"Can you tell if Anopheles grassei is more closely related to Anopheles shannoni or Anopheles reidi?",
        answers: {
                  a: 'yes',
                  b: 'no'
              },
              correctAnswer: 'b'
      },
      {
        question: "Myrmecia pilosula (Jack jumper ant) is more closely related to",
        answers: {
                 a: 'Anopheles concolor',
                 b: 'Solenopsis invicta (Red imported fire ant)'
               },
               correctAnswer: 'b'
      },
      {
        question: 'Aedes aegypti (Yellowfever mosquito) is more closely related to',
        answers: {
                  a: 'Anopheles franciscanus',
                  b: 'Myrmecia pilosula (Jack jumper ant)'
                },
                correctAnswer: 'a'
      }
  ];

  var mosses = [
      {
        question:"Triquetrella tristicha is more closely related to",
        answers: {
                  a: 'Syntrichia papillosa',
                  b: 'Triquetrella mxinwana'
              },
              correctAnswer: 'b'
      },
      {
        question: "Can you tell if Tortella densa is more closely related to Tortella nitida or Tortella humilis (Small twisted moss)?",
        answers: {
                 a: 'no',
                 b: 'yes'
               },
               correctAnswer: 'a'
      },
      {
        question: 'Can you tell if Tortella densa is more closely related to Tortella nitida or Uleobryum naganoi?',
        answers: {
                  a: 'no',
                  b: 'yes'
                },
                correctAnswer: 'b'
      }
  ];

  if (group == "244265") {generateQuiz(questions=mammals)}
  else if (group =="544595"){generateQuiz(questions=amphibians)}
  else if (group =="35888"){generateQuiz(questions=squamates)}
  else if (group =="451020"){generateQuiz(questions=echinoderms)}
  else if (group =="81461"){generateQuiz(questions=birds)}
  else if (group =="802117"){generateQuiz(questions=mollusks)}
  else if (group =="1062253"){generateQuiz(questions=insects)}
  else if (group =="821346"){generateQuiz(questions=mosses)}
  else {document.getElementById("error").innerHTML = "oops, something went wrong";}
}


function getQuestionsOld() {
    var group = document.getElementById("group").value;
    if (group == "244265") {
      var random0 = Math.floor(Math.random() * data[0].question_text.length);
      document.getElementById("question01").innerHTML = data[0].question_text[random0];
      }
    else if (group =="544595"){
      var random1 = Math.floor(Math.random() * data[1].question_text.length);
      document.getElementById("question01").innerHTML = data[1].question_text[random1];
    }
    else if (group =="35888"){
      var random2 = Math.floor(Math.random() * data[2].question_text.length);
      document.getElementById("question01").innerHTML = data[2].question_text[random2];
    }
    else if (group =="451020"){
      var random3 = Math.floor(Math.random() * data[3].question_text.length);
      document.getElementById("question01").innerHTML = data[3].question_text[random3];
    }
    else if (group =="81461"){
      var random4 = Math.floor(Math.random() * data[4].question_text.length);
      document.getElementById("question01").innerHTML = data[4].question_text[random4];
    }
    else if (group =="802117"){
      var random5 = Math.floor(Math.random() * data[5].question_text.length);
      document.getElementById("question01").innerHTML = data[5].question_text[random5];
    }
    else if (group =="1062253"){
      var random6 = Math.floor(Math.random() * data[6].question_text.length);
      document.getElementById("question01").innerHTML = data[6].question_text[random6];
    }
    else if (group =="821346"){
      var random7 = Math.floor(Math.random() * data[7].question_text.length);
      document.getElementById("question01").innerHTML = data[7].question_text[random7];
    }
    else {document.getElementById("question01").innerHTML = "oops, something went wrong";
  }
}




    /*

    if (random001 == 0 && b == a[0]) {
    document.getElementById("answer001").innerHTML = "Correct!";

        } else if (random001 == 1 && b ==a[1]){

);
            }


// to responsively call fill in the blank quesitons
function getQuestionsOld() {
  var group = document.getElementById("group").value;
  if (group == "244265") {
    var mammal_q = ["Is Pan paniscus (Bonobo) more closely related to \n Homo sapiens (Human) or \n Gorilla gorilla (Western gorilla)?", "Is Ursus maritimus (Polar bear) more closely related to \n Balaenoptera musculus (Blue whale) or \n Acinonyx jubatus (Cheetah)?", "Is Canis lupus (Gray wolf) more closely related to \n Puma concolor (Cougar) or \n Felis catus (Domestic cat)?"];
    var mammal_a = ["Homo sapiens (Human)", "Acinonyx jubatus (Cheetah)", "Felis catus (Domestic cat)"];
    var random001 = Math.floor(Math.random() * mammal_q.length);

    function submit001() {
          var a = input001.value;
          if (random001 == 0 && b == a[0]) {
            document.getElementById("answer001").innerHTML = "Correct!";
          } else if (random001 == 1 && b ==a[1]){
            document.getElementById("answer001").innerHTML = "Correct!)";
          } else if (random001 == 2 && b ==a[2]){
            document.getElementById("answer001").innerHTML = "Correct!)";
          }
          else {
            document.getElementById("answer001").innerHTML = "incorrect)";
          }
        }
    document.getElementById("question01").innerHTML = mammal_q[random001]
  }
}
*/
