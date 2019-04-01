library(shiny)
library(rphylotastic)
library(shinythemes)
library(ape)


# function to get tree
getTree <- function(taxa) {
  rphylotastic::taxa_get_otol_tree(taxa)
}

#figuring out how to replace the labels
#mam_common <- c("Hippopotamus (Hippopotamus amphibius)", "West Indian manatee (Trichechus manatus)", "Bottlenose dolphin (Tursiops truncatus)", "Horse (Equus caballus)", "Wolf (Canis lupus)", "Chimpanzee (Pan troglodytes)", "Lion (Panthera leo)")
#labels <- c("Hippopotamus_amphibius", "Trichechus_manatus", "Tursiops_truncatus", "Equus_caballus", "Canis_lupus", "Pan", "Panthera_leo")
#mams_tree <- getTree(Mammals)
#ape::plot.phylo(mams_tree)
#ape::nodelabels(text=mam_common:mams_tree$Nnode, node=labels:mams_tree$Nnode+Ntip(mams_tree))

ui <- fluidPage(theme = shinythemes::shinytheme("journal"),
  #app title
    titlePanel("Phylogenies as Models"),

    #input: Groups students can choose from
    fluidRow(
        column(4,
            selectInput("group", "Choose a group:",
              choices = c("Mammals", "Amphibians", "Echinoderms", "Mollusks"),
              multiple = FALSE)
        )
    ),

      #row to display output
    fluidRow(plotOutput("tree"))
)

server <- function(input, output) {

  Mammals <- c("Hippopotamus amphibius", "Trichechus manatus", "Tursiops truncatus", "Equus caballus", "Canis lupus", "Pan troglodytes", "Panthera leo")
  mams_tree <- getTree(Mammals)


  Amphibians <- c("Caecilia thompsoni", "Rhinella marina", "Hyloxalus abditaurantius", "Rhacophorus nigropalmatus", "Ambystoma tigrinum")
  amph_tree <- getTree(Amphibians)

  Echinoderms <- c("Pisaster ochraceus", "Mesocentrotus franciscanus", "Echinarachnius parma", "Cucumaria miniata")
  ech_tree <- getTree(Echinoderms)

  Mollusks <- c("Glaucus atlanticus", "Cornu aspersum", "Sepia officinalis", "Octopus vulgaris", "Bithynia tentaculata")
  mol_tree <- getTree(Mollusks)

  output$tree <- renderPlot({
    if (input$group == "Mammals") {
      ape::plot.phylo(mams_tree)
      ape::axisPhylo()
      mtext("Time (MYA)", side = 1, line = 2, cex = 0.75)
    }
    if (input$group == "Amphibians") {
      ape::plot.phylo(amph_tree)
      ape::axisPhylo()
      mtext("Time (MYA)", side = 1, line = 2, cex = 0.75)
    }
    if (input$group == "Echinoderms") {
      ape::plot.phylo(ech_tree)
      ape::axisPhylo()
      mtext("Time (MYA)", side = 1, line = 2, cex = 0.75)
    }
    if (input$group == "Mollusks") {
      ape::plot.phylo(mol_tree)
      ape::axisPhylo()
      mtext("Time (MYA)", side = 1, line = 2, cex = 0.75)
    }
  })
}

shinyApp(ui = ui, server = server)
