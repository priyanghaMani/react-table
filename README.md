# React table Assessment 

# Prerequisites
 Execute the following commands after checkingout the code
   Command for Installing  the node packages
        npm install (or) npm install --legacy-peer-deps  to 
    Start the application  
        npm run dev
    Execute test cases
        npm test

# Implementation

   React Table component with the following features
      1. Column Resize
            All columns except Action is resizable. The column's left border size is increased to indicate it can be resized
      2. Infinite Scroll
            Load 7 records at first, on scrolling loads the rest of the records
            data is fetched from data.json file , has 44 records
            On scrolling , the header remains fixed and only the table body will be scrolled
      3. Actions Column
            On click of Popover icon, displays Edit and Delete options
      4. Column Filters
            On click of Filter icon, displays a container with List of valid values along with checkbox for selection , Search and Reset button
            Currently it supports single value search. On selecting a value, other values checkboxes will be disabled.
            On selecting a value and click on search , filters the table based on the selected value. Filter icon corresponding to column filtered will display with primary color to indicate, which on column filter is applied.
            The filter applied can be reset by clicking on the Reset button in Filter container.   
      5. Empty Table View
            On doing global search with value that doesnt match any column values, displays "No data available" message.
      6.Styles applied
            Table header height -40px  
            Row header height -60px
            Column value of type Number (Version) -- Right aligned
            Column value of type String , except Workflow stage --- left aligned
            Workflow stage - Center aligned
            On hover over each row, the row will be highlighted
            Border bottom is provided for each row , as infinite scroll is implemented.
      7. Jest Unit test is written for GlobalFilter, DefaultColumnFilter and App components.
      8. Add Ons
        Global filter search to filter across all columns
        Sorting functionality in each column
        
