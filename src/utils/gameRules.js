export function generateWinningCombinations(N) {
    const lines = [];

    // 1. Linhas Horizontais
    for (let r = 0; r < N; r++) {
        const row = [];
        for (let c = 0; c < N; c++) {
            row.push(r * N + c);
        }
        lines.push(row);
    }

    // 2. Colunas Verticais
    for (let c = 0; c < N; c++) {
        const col = [];
        for (let r = 0; r < N; r++) {
            col.push(r * N + c);
        }
        lines.push(col);
    }

    // 3. Diagonal Principal (↘️)
    const mainDiagonal = [];
    for (let i = 0; i < N; i++) {
        mainDiagonal.push(i * N + i);
    }
    lines.push(mainDiagonal);

    // 4. Diagonal Secundária (↙️)
    const secondaryDiagonal = [];
    for (let i = 0; i < N; i++) {
        secondaryDiagonal.push(i * N + (N - 1 - i));
    }
    lines.push(secondaryDiagonal);

    return lines;
}
