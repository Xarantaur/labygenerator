function generateMaze(rows, cols) {
  // Initialize maze grid with all walls
  let maze = [];
  for (let i = 0; i < rows; i++) {
    maze.push([]);
    for (let j = 0; j < cols; j++) {
      maze[i].push({ row: i, col: j, north: true, east: true, west: true, south: true });
    }
  }

  // Helper function to shuffle an array
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Randomly select a cell and mark it as part of the maze
  let startRow = Math.floor(Math.random() * rows);
  let startCol = Math.floor(Math.random() * cols);
  maze[startRow][startCol].visited = true;

  // Add the walls of the starting cell to the wall list
  let walls = [];
  if (startRow > 0) walls.push({ row: startRow - 1, col: startCol, wall: "south" });
  if (startRow < rows - 1) walls.push({ row: startRow + 1, col: startCol, wall: "north" });
  if (startCol > 0) walls.push({ row: startRow, col: startCol - 1, wall: "east" });
  if (startCol < cols - 1) walls.push({ row: startRow, col: startCol + 1, wall: "west" });

  // While there are walls in the list
  while (walls.length > 0) {
    // Pick a random wall from the list
    let randomIndex = Math.floor(Math.random() * walls.length);
    let { row, col, wall } = walls[randomIndex];
    let cell = maze[row][col];

    // If only one of the cells that the wall divides is visited
    let newRow = row + (wall === "north" ? -1 : wall === "south" ? 1 : 0);
    let newCol = col + (wall === "west" ? -1 : wall === "east" ? 1 : 0);
    if (!cell.visited && maze[newRow][newCol].visited) {
      // Make the wall a passage and mark the unvisited cell as part of the maze
      cell[wall] = false;
      maze[newRow][newCol][
        wall === "north" ? "south" : wall === "south" ? "north" : wall === "east" ? "west" : "east"
      ] = false;
      cell.visited = true;

      // Add the neighboring walls of the cell to the wall list
      if (row > 0 && !maze[row - 1][col].visited) walls.push({ row: row - 1, col, wall: "south" });
      if (row < rows - 1 && !maze[row + 1][col].visited) walls.push({ row: row + 1, col, wall: "north" });
      if (col > 0 && !maze[row][col - 1].visited) walls.push({ row, col: col - 1, wall: "east" });
      if (col < cols - 1 && !maze[row][col + 1].visited) walls.push({ row, col: col + 1, wall: "west" });
    }
    // Remove the wall from the list
    walls.splice(randomIndex, 1);
  }

  // Define start and goal positions
  let start = { row: startRow, col: startCol };
  let goal = { row: rows - 1, col: cols - 1 };

  // Convert maze data to JSON format
  let mazeModel = maze.map((row) =>
    row.map((cell) => {
      return {
        row: cell.row,
        col: cell.col,
        north: cell.north,
        east: cell.east,
        west: cell.west,
        south: cell.south,
      };
    })
  );

  return { rows, cols, start, goal, maze: mazeModel };
}

function printMazeJSON(maze) {
  console.log(JSON.stringify(maze, null, 2));
}


function printMazeJSON(maze) {
  document.getElementById("mazeOutput").innerHTML = "<pre>" + JSON.stringify(maze, null, 2) + "</pre>";
}

document.getElementById("generateButton").addEventListener("click", function () {
  let rows = parseInt(prompt("Enter number of rows:"));
  let cols = parseInt(prompt("Enter number of columns:"));
  if (!isNaN(rows) && !isNaN(cols)) {
    let maze = generateMaze(rows, cols);
    printMazeJSON(maze);
  } else {
    alert("Invalid input. Please enter valid numbers.");
  }
});

document.getElementById("copyButton").addEventListener("click", function () {
  let jsonContent = document.getElementById("mazeOutput").innerText;
  navigator.clipboard
    .writeText(jsonContent)
    .then(() => alert("JSON content copied to clipboard!"))
    .catch((err) => console.error("Unable to copy JSON content: ", err));
});
