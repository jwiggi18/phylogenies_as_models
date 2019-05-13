
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
        .size([800, 900])
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

// to responsively call quesitons
function getQuestions() {
  if group == "244265" {
    var mammal_q = ["Pan paniscus (Bonobo) more closely related to Homo sapiens (Human) or gorilla_gorilla (Western gorilla)?", "Ursus maritimus (Polar bear) more closely related to Balaenoptera musculus (Blue whale) or Acinonyx jubatus (Cheetah)?", "Canis lupus (Gray wolf) more closely related to Puma concolor (Cougar) or Felis catus (Domestic cat)?"];
    var mammal_a = ["Homo sapiens (Human)", "Acinonyx jubatus (Cheetah)", "Felis catus (Domestic cat)"];

    var random001 = Math.floor(Math.random() * mammal_q.length);

    function submit001() {
      var a = input001.value;
      if (random001 == 0 && b == mammal_a[0]) {
        document.getElementById(answer001).innerHTML = "Correct!"
      } else {
        document.getElementById(answer001).innerHTML = "incorrect (did you spell it correctly?)"
      }
    }

    document.getElementById("question01").innerHTML = mammal_q[random001]
  }
}
