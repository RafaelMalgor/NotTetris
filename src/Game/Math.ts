export function transpose(matrix: number[][]) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (i <= j) {
        const temp = matrix[i][j];
        matrix[i][j] = matrix[j][i];
        matrix[j][i] = temp;
      }
    }
  }
}

export function reverse_column(matrix: number[][]) {
  for (let i = 0; i < matrix.length; i++) {
    matrix[i].reverse();
  }
}
